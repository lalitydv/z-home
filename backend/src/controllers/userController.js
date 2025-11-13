import User from '../models/userModel.js';
import { logger } from '../utils/logger.js';
import { isAdmin, isSuperAdmin } from '../middlewares/roleMiddleware.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    logger.error('Get user by ID error:', error);
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    // Only admin/superadmin can access
    if (!['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.',
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    
    // Filter by role if provided
    if (req.query.role) {
      query.role = req.query.role;
    }
    
    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Get all users error:', error);
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, profileImage, bio, socialLinks } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (profileImage) user.profileImage = profileImage;
    if (bio !== undefined) user.bio = bio;
    if (socialLinks) user.socialLinks = { ...user.socialLinks, ...socialLinks };

    await user.save();

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, role, status, isVerified, profileImage, bio, socialLinks } = req.body;

    // Only admin/superadmin can update other users
    if (id !== req.userId.toString() && !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.',
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Only superadmin can change role to admin/superadmin
    if (role && ['admin', 'superadmin'].includes(role) && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        error: 'Only superadmin can assign admin/superadmin roles',
      });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (role && ['admin', 'superadmin'].includes(req.user.role)) user.role = role;
    if (status !== undefined && ['admin', 'superadmin'].includes(req.user.role)) user.status = status;
    if (isVerified !== undefined && ['admin', 'superadmin'].includes(req.user.role)) user.isVerified = isVerified;
    if (profileImage) user.profileImage = profileImage;
    if (bio !== undefined) user.bio = bio;
    if (socialLinks) user.socialLinks = { ...user.socialLinks, ...socialLinks };

    await user.save();

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    logger.error('Update user error:', error);
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Only admin/superadmin can delete users
    if (!['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.',
      });
    }

    // Prevent deleting superadmin
    const user = await User.findById(id);
    if (user && user.role === 'superadmin') {
      return res.status(403).json({
        success: false,
        error: 'Cannot delete superadmin user',
      });
    }

    // Prevent deleting yourself
    if (id === req.userId.toString()) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete your own account',
      });
    }

    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    logger.error('Delete user error:', error);
    next(error);
  }
};

export default {
  getProfile,
  getUserById,
  getAllUsers,
  updateProfile,
  updateUser,
  deleteUser,
};

