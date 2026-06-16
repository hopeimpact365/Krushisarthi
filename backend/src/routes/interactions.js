import express from 'express';
import Enquiry from '../models/Enquiry.js';
import Subscriber from '../models/Subscriber.js';
import { sendContactUsEmail, sendNewsletterWelcomeEmail } from '../config/resend.js';

const router = express.Router();

// @route   POST /api/interactions/contact
// @desc    Submit a new contact us enquiry
// @access  Public
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all contact details (Name, Email, Subject, and Message).'
      });
    }

    // Save submission to MongoDB Atlas database
    const newEnquiry = new Enquiry({
      name,
      email,
      subject,
      message
    });
    const savedEnquiry = await newEnquiry.save();

    // Trigger email notification to admin via Resend
    // (This is non-blocking to ensure fast frontend response time)
    sendContactUsEmail({ name, email, subject, message }).catch(err => {
      console.error('⚠️ Background contact email failed to send:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully. Our team will contact you shortly.',
      enquiryId: savedEnquiry._id
    });
  } catch (error) {
    console.error(`❌ Error submitting enquiry: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error processing your enquiry. Please try again later.',
      error: error.message
    });
  }
});

// @route   POST /api/interactions/subscribe
// @desc    Join the newsletter circle
// @access  Public
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if the user is already subscribed
    const existing = await Subscriber.findOne({ email: cleanEmail });
    if (existing) {
      // Return success to avoid confusing/worrying the user, but don't re-welcome them
      return res.status(200).json({
        success: true,
        message: 'You are already a valued member of the Krushisarthi circle!'
      });
    }

    // Save new subscriber to MongoDB Atlas
    const newSubscriber = new Subscriber({
      email: cleanEmail
    });
    await newSubscriber.save();

    // Trigger newsletter welcome email via Resend
    // (Non-blocking)
    sendNewsletterWelcomeEmail(cleanEmail).catch(err => {
      console.error('⚠️ Background newsletter welcome email failed to send:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for joining the Krushisarthi community circle!'
    });
  } catch (error) {
    console.error(`❌ Error in newsletter subscription: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error processing your subscription. Please try again.',
      error: error.message
    });
  }
});

export default router;
