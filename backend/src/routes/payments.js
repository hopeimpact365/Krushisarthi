import express from 'express';
import crypto from 'crypto';
import Order from '../models/Order.js';
import { createRazorpayClient, getRazorpayKeyId } from '../config/razorpay.js';

const router = express.Router();

const normalizeAmount = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  return Math.round(amount * 100);
};

// @route   POST /api/payments/order
// @desc    Create a Razorpay order for a saved checkout order
// @access  Public
router.post('/order', async (req, res) => {
  try {
    const { orderId, currency = 'INR' } = req.body;

    if (!orderId || typeof orderId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'orderId is required to initialize payment.'
      });
    }

    const order = await Order.findOne({ orderId: orderId.trim() });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${orderId} not found.`
      });
    }

    const amountInPaise = normalizeAmount(order.financials?.total);

    if (!amountInPaise) {
      return res.status(400).json({
        success: false,
        message: 'Order total is invalid and cannot be charged.'
      });
    }

    const razorpay = createRazorpayClient();
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt: order.orderId,
      notes: {
        orderId: order.orderId,
        customerName: order.customer.name,
        customerEmail: order.customer.email
      }
    });

    order.razorpayOrderId = razorpayOrder.id;
    order.paymentStatus = 'pending';
    await order.save();

    res.status(201).json({
      success: true,
      message: 'Razorpay order created successfully.',
      keyId: getRazorpayKeyId(),
      orderId: order.orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      order
    });
  } catch (error) {
    console.error(`❌ Error creating Razorpay order: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating payment order.',
      error: error.message
    });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify Razorpay payment signature and mark the order as paid
// @access  Public
router.post('/verify', async (req, res) => {
  try {
    const {
      orderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_order_id: razorpayOrderId,
      razorpay_signature: razorpaySignature
    } = req.body;

    if (!orderId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Missing Razorpay payment verification fields.'
      });
    }

    const order = await Order.findOne({
      $or: [
        { orderId: orderId.trim() },
        { razorpayOrderId: razorpayOrderId.trim() }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${orderId} not found.`
      });
    }

    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpaySecret) {
      return res.status(500).json({
        success: false,
        message: 'Razorpay secret is not configured.'
      });
    }

    const expectedSignature = crypto
      .createHmac('sha256', razorpaySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    const signatureBuffer = Buffer.from(razorpaySignature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Payment signature verification failed.'
      });
    }

    order.paymentStatus = 'paid';
    order.razorpayOrderId = razorpayOrderId;
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully.',
      paymentStatus: order.paymentStatus,
      order
    });
  } catch (error) {
    console.error(`❌ Error verifying Razorpay payment: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error verifying payment.',
      error: error.message
    });
  }
});

export default router;