import express from 'express';
import crypto from 'crypto';
import Order from '../models/Order.js';
import { getEasebuzzCredentials, generateEasebuzzHash, verifyEasebuzzResponseHash } from '../config/easebuzz.js';
import { sendOrderConfirmationEmail } from '../config/resend.js';

const router = express.Router();

// @route   POST /api/payments/order
// @desc    Initiate an Easebuzz payment for a saved checkout order
// @access  Public
router.post('/order', async (req, res) => {
  try {
    const { orderId } = req.body;

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

    const totalAmount = order.financials?.total;
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Order total is invalid and cannot be charged.'
      });
    }

    const { key, salt, env } = getEasebuzzCredentials();

    // Format amount to 2 decimal places as required by Easebuzz
    const amountStr = totalAmount.toFixed(2);

    const firstname = order.customer.name.split(' ')[0] || 'Customer';
    const productinfo = `Order ${order.orderId}`;

    const hashParams = {
      key,
      txnid: order.orderId,
      amount: amountStr,
      productinfo,
      firstname,
      email: order.customer.email,
      phone: order.customer.mobile,
      udf1: order.orderId
    };

    const hash = generateEasebuzzHash(hashParams, salt);

    // Call Easebuzz Initiate Payment API using URLSearchParams
    const initiateUrl = env === 'prod'
      ? 'https://pay.easebuzz.in/payment/initiateLink'
      : 'https://testpay.easebuzz.in/payment/initiateLink';

    const details = {
      key,
      txnid: order.orderId,
      amount: amountStr,
      productinfo,
      firstname,
      email: order.customer.email,
      phone: order.customer.mobile,
      surl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/confirmation?orderId=${order.orderId}`,
      furl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout`,
      hash,
      udf1: order.orderId
    };

    const formBody = Object.keys(details)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(details[k]))
      .join('&');

    console.log(`📡 Initiating Easebuzz payment for Order ${order.orderId} (Env: ${env})...`);

    const response = await fetch(initiateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody
    });

    if (!response.ok) {
      throw new Error(`Easebuzz API returned status code ${response.status}`);
    }

    const result = await response.json();

    if (!result || result.status !== 1) {
      throw new Error(result?.data || 'Failed to initiate Easebuzz checkout.');
    }

    const accessKey = result.data;

    order.easebuzzOrderId = accessKey;
    order.paymentStatus = 'pending';
    await order.save();

    res.status(201).json({
      success: true,
      message: 'Easebuzz payment initiated successfully.',
      keyId: key,
      orderId: order.orderId,
      easebuzzOrderId: accessKey,
      amount: totalAmount,
      currency: 'INR',
      env,
      order
    });
  } catch (error) {
    console.error(`❌ Error creating Easebuzz order: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating payment order.',
      error: error.message
    });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify Easebuzz payment response and mark the order as paid
// @access  Public
router.post('/verify', async (req, res) => {
  try {
    const {
      orderId,
      easebuzz_payment_id: easepayid,
      easebuzz_order_id: txnid,
      easebuzz_signature: clientHash,
      easebuzz_response: responsePayload
    } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Missing orderId for verification.'
      });
    }

    const order = await Order.findOne({ orderId: orderId.trim() });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${orderId} not found.`
      });
    }

    const { key, salt, env } = getEasebuzzCredentials();

    let isVerified = false;

    // Method 1: Verify the hash from the payload if provided
    if (responsePayload && responsePayload.hash) {
      isVerified = verifyEasebuzzResponseHash(responsePayload, salt);
    } else if (req.body && req.body.hash) {
      isVerified = verifyEasebuzzResponseHash(req.body, salt);
    }

    // Method 2: Fallback to Retrieve API if signature verification failed/not possible
    if (!isVerified) {
      console.log(`⚠️ Hash verification failed or missing payload. Calling retrieve API for Order ${order.orderId}...`);
      
      const retrieveUrl = env === 'prod'
        ? 'https://pay.easebuzz.in/transaction/v1/retrieve'
        : 'https://testpay.easebuzz.in/transaction/v1/retrieve';

      const amountStr = order.financials.total.toFixed(2);
      const retrieveHash = crypto
        .createHash('sha512')
        .update(`${key}|${order.orderId}|${amountStr}|${order.customer.email}|${order.customer.mobile}|${salt}`)
        .digest('hex');

      const retrieveDetails = {
        key,
        txnid: order.orderId,
        amount: amountStr,
        email: order.customer.email,
        phone: order.customer.mobile,
        hash: retrieveHash
      };

      const retrieveFormBody = Object.keys(retrieveDetails)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(retrieveDetails[k]))
        .join('&');

      const retrieveResponse = await fetch(retrieveUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: retrieveFormBody
      });

      if (retrieveResponse.ok) {
        const retrieveResult = await retrieveResponse.json();
        if (retrieveResult && retrieveResult.status === 1 && retrieveResult.data) {
          const txStatus = retrieveResult.data.status;
          if (txStatus === 'success') {
            isVerified = true;
            console.log(`✅ Retrieve API confirmed success for Order ${order.orderId}`);
          }
        }
      }
    }

    if (!isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed.'
      });
    }

    // Mark as paid
    order.paymentStatus = 'paid';
    order.easebuzzOrderId = txnid || order.easebuzzOrderId;
    order.easebuzzPaymentId = easepayid || (responsePayload && responsePayload.easepayid) || '';
    order.easebuzzSignature = clientHash || (responsePayload && responsePayload.hash) || '';
    await order.save();

    // Send order confirmation email using Resend
    try {
      await sendOrderConfirmationEmail(order);
    } catch (emailError) {
      console.error(`❌ Non-blocking error sending order confirmation email: ${emailError.message}`);
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully.',
      paymentStatus: order.paymentStatus,
      order
    });
  } catch (error) {
    console.error(`❌ Error verifying Easebuzz payment: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error verifying payment.',
      error: error.message
    });
  }
});

export default router;