import jwt from 'jsonwebtoken';

export const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    
    const secret = process.env.JWT_SECRET || 'super_secret_krushisarthi_admin_jwt_key_2026';
    const decoded = jwt.verify(token, secret);
    
    // Retrieve the admin emails from env variables
    const admin1Email = process.env.ADMIN1_EMAIL || 'admin1@krushisarthi.com';
    const admin2Email = process.env.ADMIN2_EMAIL || 'admin2@krushisarthi.com';
    
    if (decoded.email !== admin1Email && decoded.email !== admin2Email) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Invalid admin token.'
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};
