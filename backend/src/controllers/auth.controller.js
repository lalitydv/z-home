import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { logger } from '../utils/logger.js';
import { cacheSet, cacheDelete } from '../config/redis.js';

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  );

  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );

  return { accessToken, refreshToken };
};

export const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

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
      email,
      password,
      firstName,
      lastName,
      phone,
    });

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');
    await user.save({ validateBeforeSave: false });

    // TODO: Send verification email via job queue

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Store refresh token in user document
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified,
        },
        accessToken,
        refreshToken,
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

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Account is deactivated',
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

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Store refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token is required',
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Find user and verify refresh token matches
    const user = await User.findById(decoded.userId).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token',
      });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

    // Update refresh token
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired refresh token',
      });
    }
    logger.error('Refresh token error:', error);
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user) {
      user.refreshToken = null;
      await user.save({ validateBeforeSave: false });
    }

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    logger.error('Logout error:', error);
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification token',
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    logger.error('Email verification error:', error);
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists
      return res.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    // TODO: Send password reset email via job queue

    res.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent',
    });
  } catch (error) {
    logger.error('Forgot password error:', error);
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token',
      });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    logger.error('Reset password error:', error);
    next(error);
  }
};

