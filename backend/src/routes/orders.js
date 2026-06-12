import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// Helper: generate unique order ID (looks like JGY123456)
const generateOrderId = async () => {
  let isUnique = false;
  let orderId = '';
  
  while (!isUnique) {
    const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit number
    orderId = `JGY${randomNum}`;
    
    // Check if ID already exists in DB
    const existingOrder = await Order.findOne({ orderId });
    if (!existingOrder) {
      isUnique = true;
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

    // Call EasyPay Gateway if user_token is set
    const userToken = process.env.EASYPAY_USER_TOKEN;
    let paymentUrl = '';

    if (userToken) {
      try {
        const redirectUrl = `http://localhost:3000/payment/easypay/callback?orderId=${orderId}`;
        const gatewayRes = await fetch('https://merchant.easypaygateway.in/api/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            customer_mobile: mobile,
            user_token: userToken,
            amount: total.toString(),
            order_id: orderId,
            redirect_url: redirectUrl,
            route: '1'
          })
        });

        const gatewayData = await gatewayRes.json();
        
        if (gatewayRes.ok && gatewayData.status) {
          if (gatewayData.result && gatewayData.result.payment_url) {
            paymentUrl = gatewayData.result.payment_url;
          } else if (gatewayData.data && gatewayData.data.payment_url) {
            paymentUrl = gatewayData.data.payment_url;
          }
          console.log(`🔗 EasyPay Gateway initialized successfully for ${orderId}: ${paymentUrl}`);
        } else {
          console.error(`⚠️ EasyPay Gateway API error: ${gatewayData.message || 'Unknown error'}`);
        }
      } catch (err) {
        console.error(`❌ EasyPay Gateway connection failed: ${err.message}`);
      }
    }

    // Fallback to mock gateway URL if no token or API call failed
    if (!paymentUrl) {
      paymentUrl = `http://localhost:3000/payment/easypay?orderId=${orderId}`;
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
// @access  Public (should be protected in production)
router.get('/', async (req, res) => {
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
// @desc    Process simulated Easy Pay payment
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

    const userToken = process.env.EASYPAY_USER_TOKEN;

    // If no real token, fallback to returning current DB status
    if (!userToken) {
      return res.status(200).json({
        success: true,
        message: "No user token configured. Returning current/mock payment status.",
        paymentStatus: order.paymentStatus,
        order
      });
    }

    // Call check-order-status API
    try {
      const gatewayRes = await fetch('https://merchant.easypaygateway.in/api/check-order-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          user_token: userToken,
          order_id: order.orderId
        })
      });

      const gatewayData = await gatewayRes.json();
      console.log(`🔍 EasyPay Status response for ${order.orderId}:`, gatewayData);

      if (gatewayRes.ok && gatewayData.status) {
        const result = gatewayData.result;
        if (result) {
          const statusVal = String(result.status || result.transaction_status || result.payment_status).toLowerCase();
          
          if (statusVal === 'success' || statusVal === 'successful' || statusVal === 'paid' || statusVal === '1') {
            order.paymentStatus = 'paid';
          } else if (statusVal === 'failed' || statusVal === 'failure' || statusVal === '0') {
            order.paymentStatus = 'failed';
          }
          await order.save();
        }
      }
    } catch (err) {
      console.error(`❌ EasyPay status check failed: ${err.message}`);
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

export default router;
