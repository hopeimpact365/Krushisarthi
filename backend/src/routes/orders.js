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

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      orderId: savedOrder.orderId,
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
