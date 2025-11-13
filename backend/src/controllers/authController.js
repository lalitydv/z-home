import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { logger } from '../utils/logger.js';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '7d' }
  );
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Validate role
    const allowedRoles = ['buyer', 'seller', 'broker'];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        error: `Invalid role. Allowed roles: ${allowedRoles.join(', ')}`,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'buyer',
      isVerified: false, // Email verification can be added later
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profileImage: user.profileImage,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profileImage: user.profileImage,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

export default {
  register,
  login,
};

