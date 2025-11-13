import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';
import User from '../models/userModel.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please provide a valid token.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found. Token may be invalid.',
      });
    }

    if (!user.isVerified && user.role !== 'admin' && user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        error: 'Please verify your email to continue.',
      });
    }

    req.user = user;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token.',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired. Please login again.',
      });
    }
    
    logger.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed.',
    });
  }
};

export default authenticate;

