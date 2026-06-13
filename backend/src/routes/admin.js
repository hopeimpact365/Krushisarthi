import express from 'express';
import jwt from 'jsonwebtoken';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    // Load admin configuration from environment variables
    const admin1Email = process.env.ADMIN1_EMAIL || 'admin1@krushisarthi.com';
    const admin1Password = process.env.ADMIN1_PASSWORD || 'admin123';
    const admin2Email = process.env.ADMIN2_EMAIL || 'admin2@krushisarthi.com';
    const admin2Password = process.env.ADMIN2_PASSWORD || 'admin456';

    let match = false;
    let loggedInUser = '';

    if (email === admin1Email && password === admin1Password) {
      match = true;
      loggedInUser = 'Admin 1';
    } else if (email === admin2Email && password === admin2Password) {
      match = true;
      loggedInUser = 'Admin 2';
    }

    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.'
      });
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'super_secret_krushisarthi_admin_jwt_key_2026';
    const token = jwt.sign(
      { email, role: 'admin', name: loggedInUser },
      secret,
      { expiresIn: '24h' }
    );

    console.log(`🔐 Admin login successful: ${loggedInUser} (${email})`);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      admin: {
        name: loggedInUser,
        email
      }
    });

  } catch (error) {
    console.error(`❌ Admin login error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication.',
      error: error.message
    });
  }
});

// @route   GET /api/admin/verify
// @desc    Verify admin token
// @access  Private
router.get('/verify', adminAuth, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Token is valid.',
    admin: req.admin
  });
});

export default router;
