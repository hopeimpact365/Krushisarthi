import express from 'express';
import Order from '../models/Order.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Helper: generate unique sequential order ID (looks like KS-0001, KS-0002)
const generateOrderId = async () => {
  const count = await Order.countDocuments();
  let nextNum = count + 1;
  let isUnique = false;
  let orderId = '';
  
  while (!isUnique) {
    orderId = `KS-${String(nextNum).padStart(4, '0')}`;
    
    // Check if ID already exists in DB
    const existingOrder = await Order.findOne({ orderId });
    if (!existingOrder) {
      isUnique = true;
    } else {
      nextNum++;
    }
  }
  
  return orderId;
};

// @route   POST /api/orders
// @desc    Create a new order
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      address,
      city,
      state,
      pincode,
      deliveryZone,
      items,
      subtotal,
      gst,
      deliveryFee,
      discount,
      total,
      couponCode,
      paymentMethod
    } = req.body;

    // Simple validation
    if (!name || !email || !mobile || !address || !city || !state || !pincode || !items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Missing required checkout information. Please fill in all fields.'
      });
    }

    // Filter out items with 0 quantity
    const activeItems = items.filter(item => item.quantity > 0);
    if (activeItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot place an order with an empty cart.'
      });
    }

    // Generate unique order ID
    const orderId = await generateOrderId();

    // Create new order instance
    const newOrder = new Order({
      orderId,
      customer: {
        name,
        email,
        mobile
      },
      shipping: {
        address,
        city,
        state,
        pincode,
        deliveryZone
      },
      items: activeItems,
      financials: {
        subtotal,
        gst,
        deliveryFee,
        discount,
        total
      },
      couponCode,
      paymentMethod,
      paymentStatus: 'pending'
    });

    // Save order to MongoDB Atlas
    const savedOrder = await newOrder.save();
    
    console.log(`📦 Order created successfully: ${orderId} by ${name}`);

    // Call Easebuzz Gateway if EASEBUZZ_API_KEY is set
    const easebuzzApiKey = process.env.EASEBUZZ_API_KEY;
    const easebuzzEnv = process.env.EASEBUZZ_ENV || 'development';
    const easebuzzBaseUrl = easebuzzEnv === 'production' ? 'https://apps.easebuzz.in' : 'https://devapps.easebuzz.in';
    let paymentUrl = '';

    if (easebuzzApiKey) {
      try {
        const payload = {
          api_key: easebuzzApiKey,
          invoice: {
            contact: {
              name: name,
              email: email,
              phone: mobile,
              mobile: mobile,
              address: address,
              city: city,
              state: state,
              pincode: pincode,
              country: 'India',
              address_type: 'billing'
            },
            items: activeItems.map(item => ({
              name: item.name,
              description: item.name,
              amount: Number(item.price),
              quantity: Number(item.quantity)
            })),
            notes: `Order ${orderId} from Krushisarthi`
          }
        };

        const gatewayRes = await fetch(`${easebuzzBaseUrl}/api/v1/invoices/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${easebuzzApiKey}`
          },
          body: JSON.stringify(payload)
        });

        const gatewayData = await gatewayRes.json();
        
        if (gatewayRes.ok && (gatewayData.status === 1 || gatewayData.success || gatewayData.status === 'success')) {
          const invoiceData = gatewayData.data || gatewayData.invoice || gatewayData;
          paymentUrl = invoiceData.payment_link || invoiceData.invoice_url || invoiceData.payment_url;
          const invoiceUid = invoiceData.uid || invoiceData.invoice_id || invoiceData.id;
          
          if (invoiceUid) {
            savedOrder.easebuzzInvoiceId = invoiceUid;
            await savedOrder.save();
          }
          console.log(`🔗 Easebuzz SmartBilling initialized successfully for ${orderId}: ${paymentUrl}`);
        } else {
          console.error(`⚠️ Easebuzz API error: ${JSON.stringify(gatewayData)}`);
        }
      } catch (err) {
        console.error(`❌ Easebuzz connection failed: ${err.message}`);
      }
    }

    // Fallback to mock gateway URL if no api key or API call failed
    if (!paymentUrl) {
      paymentUrl = `http://localhost:3000/payment/easebuzz?orderId=${orderId}`;
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      orderId: savedOrder.orderId,
      paymentUrl,
      order: savedOrder
    });
  } catch (error) {
    console.error(`❌ Error placing order: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error processing your order. Please try again.',
      error: error.message
    });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (for admin/monitoring)
// @access  Private
router.get('/', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error(`❌ Error fetching orders: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error fetching orders.',
      error: error.message
    });
  }
});

// @route   GET /api/orders/:orderId
// @desc    Get order details by orderId
// @access  Public
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${req.params.orderId} not found.`
      });
    }
    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error(`❌ Error fetching order details: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error fetching order details.',
      error: error.message
    });
  }
});

// @route   POST /api/orders/:orderId/pay
// @desc    Process simulated Easebuzz payment
// @access  Public
router.post('/:orderId/pay', async (req, res) => {
  try {
    const { status, paymentMethod } = req.body;
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${req.params.orderId} not found.`
      });
    }

    if (status === 'success') {
      order.paymentStatus = 'paid';
      if (paymentMethod) {
        order.paymentMethod = paymentMethod;
      }
    } else if (status === 'failed') {
      order.paymentStatus = 'failed';
    }

    const updatedOrder = await order.save();
    console.log(`💳 Payment processed for order ${order.orderId}: Status = ${order.paymentStatus}`);

    res.status(200).json({
      success: true,
      message: `Payment status updated to ${order.paymentStatus}`,
      orderId: updatedOrder.orderId,
      paymentStatus: updatedOrder.paymentStatus,
      order: updatedOrder
    });
  } catch (error) {
    console.error(`❌ Error processing payment: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error processing payment.',
      error: error.message
    });
  }
});

// @route   GET /api/orders/:orderId/verify-payment
// @desc    Verify payment status from EasyPay gateway
// @access  Public
router.get('/:orderId/verify-payment', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${req.params.orderId} not found.`
      });
    }

    const easebuzzApiKey = process.env.EASEBUZZ_API_KEY;

    // If no real token/key, fallback to returning current DB status
    if (!easebuzzApiKey || !order.easebuzzInvoiceId) {
      return res.status(200).json({
        success: true,
        message: "No active Easebuzz gateway API key or invoice ID configured. Returning current/mock payment status.",
        paymentStatus: order.paymentStatus,
        order
      });
    }

    // Call Easebuzz SmartBilling invoice status API
    try {
      const easebuzzEnv = process.env.EASEBUZZ_ENV || 'development';
      const easebuzzBaseUrl = easebuzzEnv === 'production' ? 'https://apps.easebuzz.in' : 'https://devapps.easebuzz.in';
      
      const gatewayRes = await fetch(`${easebuzzBaseUrl}/api/v1/invoices/${order.easebuzzInvoiceId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${easebuzzApiKey}`
        }
      });

      const gatewayData = await gatewayRes.json();
      console.log(`🔍 Easebuzz Status response for ${order.orderId}:`, gatewayData);

      if (gatewayRes.ok) {
        const invoiceData = gatewayData.data || gatewayData.invoice || gatewayData;
        if (invoiceData) {
          const statusVal = String(invoiceData.status || invoiceData.payment_status || '').toLowerCase();
          
          if (['paid', 'success', 'successful', 'completed', 'active', '1'].includes(statusVal)) {
            order.paymentStatus = 'paid';
          } else if (['failed', 'failure', 'cancelled', 'expired', '0'].includes(statusVal)) {
            order.paymentStatus = 'failed';
          }
          await order.save();
        }
      }
    } catch (err) {
      console.error(`❌ Easebuzz status check failed: ${err.message}`);
    }

    res.status(200).json({
      success: true,
      paymentStatus: order.paymentStatus,
      order
    });
  } catch (error) {
    console.error(`❌ Error verifying payment: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error verifying payment.',
      error: error.message
    });
  }
});

// @route   DELETE /api/orders
// @desc    Delete multiple orders
// @access  Private
router.delete('/', adminAuth, async (req, res) => {
  try {
    const { orderIds } = req.body;
    if (!orderIds || !Array.isArray(orderIds) || !orderIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of orderIds to delete.'
      });
    }

    const result = await Order.deleteMany({ orderId: { $in: orderIds } });
    console.log(`🗑️ Deleted ${result.deletedCount} orders: ${JSON.stringify(orderIds)}`);

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} orders.`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error(`❌ Error deleting orders: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error deleting orders.',
      error: error.message
    });
  }
});

export default router;
