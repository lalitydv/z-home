import User from '../models/userModel.js';
import Property from '../models/propertyModel.js';
import Booking from '../models/bookingModel.js';
import Review from '../models/reviewModel.js';
import { logger } from '../utils/logger.js';

export const getAllBrokers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const brokers = await User.find({ role: 'broker' })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ role: 'broker' });

    res.json({
      success: true,
      data: {
        brokers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Get all brokers error:', error);
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
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

    // Search by name or email
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
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

export const updatePropertyStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, isApproved } = req.body;

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    if (status && !['available', 'booked', 'sold', 'rented'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be "available", "booked", "sold", or "rented"',
      });
    }

    if (status) property.status = status;
    if (isApproved !== undefined) property.isApproved = isApproved;

    await property.save();

    const updatedProperty = await Property.findById(property._id)
      .populate('postedBy', 'name email phone profileImage');

    res.json({
      success: true,
      data: { property: updatedProperty },
    });
  } catch (error) {
    logger.error('Update property status error:', error);
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, isVerified } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    if (status && !['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be "active", "inactive", or "suspended"',
      });
    }

    if (status) user.status = status;
    if (isVerified !== undefined) user.isVerified = isVerified;

    await user.save();

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    logger.error('Update user status error:', error);
    next(error);
  }
};

export const getAllData = async (req, res, next) => {
  try {
    // Only superadmin can access this
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        error: 'Only superadmin can access this endpoint',
      });
    }

    const [
      totalUsers,
      totalBrokers,
      totalSellers,
      totalBuyers,
      totalProperties,
      availableProperties,
      bookedProperties,
      totalBookings,
      totalReviews,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'broker' }),
      User.countDocuments({ role: 'seller' }),
      User.countDocuments({ role: 'buyer' }),
      Property.countDocuments(),
      Property.countDocuments({ status: 'available' }),
      Property.countDocuments({ status: 'booked' }),
      Booking.countDocuments(),
      Review.countDocuments(),
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          users: {
            total: totalUsers,
            brokers: totalBrokers,
            sellers: totalSellers,
            buyers: totalBuyers,
          },
          properties: {
            total: totalProperties,
            available: availableProperties,
            booked: bookedProperties,
            sold: totalProperties - availableProperties - bookedProperties,
          },
          bookings: {
            total: totalBookings,
          },
          reviews: {
            total: totalReviews,
          },
        },
      },
    });
  } catch (error) {
    logger.error('Get all data error:', error);
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

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

export const deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    await Property.findByIdAndDelete(id);

    // Also delete related bookings and reviews
    await Booking.deleteMany({ property: id });
    await Review.deleteMany({ property: id });

    res.json({
      success: true,
      message: 'Property and related data deleted successfully',
    });
  } catch (error) {
    logger.error('Delete property error:', error);
    next(error);
  }
};

// Dashboard Stats
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalBrokers,
      totalSellers,
      totalBuyers,
      totalProperties,
      pendingProperties,
      approvedProperties,
      rejectedProperties,
      availableProperties,
      bookedProperties,
      totalBookings,
      pendingBookings,
      approvedBookings,
      rejectedBookings,
      totalReviews,
      activeUsers,
      inactiveUsers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'broker' }),
      User.countDocuments({ role: 'seller' }),
      User.countDocuments({ role: 'buyer' }),
      Property.countDocuments(),
      Property.countDocuments({ isApproved: false, status: { $ne: 'rejected' } }),
      Property.countDocuments({ isApproved: true }),
      Property.countDocuments({ status: 'rejected' }),
      Property.countDocuments({ status: 'available' }),
      Property.countDocuments({ status: 'booked' }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'approved' }),
      Booking.countDocuments({ status: 'rejected' }),
      Review.countDocuments(),
      User.countDocuments({ status: 'active' }),
      User.countDocuments({ status: 'inactive' }),
    ]);

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          brokers: totalBrokers,
          sellers: totalSellers,
          buyers: totalBuyers,
          active: activeUsers,
          inactive: inactiveUsers,
        },
        properties: {
          total: totalProperties,
          pending: pendingProperties,
          approved: approvedProperties,
          rejected: rejectedProperties,
          available: availableProperties,
          booked: bookedProperties,
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          approved: approvedBookings,
          rejected: rejectedBookings,
        },
        reviews: {
          total: totalReviews,
        },
      },
    });
  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    next(error);
  }
};

// Get all properties with filtering
export const getAllProperties = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by approval status if provided
    if (req.query.isApproved !== undefined) {
      query.isApproved = req.query.isApproved === 'true';
    }

    // Search by title or location
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { location: { $regex: req.query.search, $options: 'i' } },
        { address: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const properties = await Property.find(query)
      .populate('postedBy', 'name email phone profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Property.countDocuments(query);

    res.json({
      success: true,
      data: {
        properties,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Get all properties error:', error);
    next(error);
  }
};

// Get property by ID
export const getPropertyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id)
      .populate('postedBy', 'name email phone profileImage');

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    res.json({
      success: true,
      data: { property },
    });
  } catch (error) {
    logger.error('Get property by ID error:', error);
    next(error);
  }
};

// Approve property
export const approveProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    property.isApproved = true;
    property.status = 'available';
    await property.save();

    const updatedProperty = await Property.findById(property._id)
      .populate('postedBy', 'name email phone profileImage');

    res.json({
      success: true,
      data: { property: updatedProperty },
      message: 'Property approved successfully',
    });
  } catch (error) {
    logger.error('Approve property error:', error);
    next(error);
  }
};

// Reject property
export const rejectProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    property.isApproved = false;
    property.status = 'rejected';
    if (reason) {
      property.rejectionReason = reason;
    }
    await property.save();

    const updatedProperty = await Property.findById(property._id)
      .populate('postedBy', 'name email phone profileImage');

    res.json({
      success: true,
      data: { property: updatedProperty },
      message: 'Property rejected successfully',
    });
  } catch (error) {
    logger.error('Reject property error:', error);
    next(error);
  }
};

// Get all orders (bookings)
export const getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Search by buyer name or property title
    if (req.query.search) {
      const properties = await Property.find({
        $or: [
          { title: { $regex: req.query.search, $options: 'i' } },
          { location: { $regex: req.query.search, $options: 'i' } },
        ],
      }).select('_id');
      const propertyIds = properties.map(p => p._id);
      if (propertyIds.length > 0) {
        query.$or = [
          { property: { $in: propertyIds } },
        ];
      } else {
        // If no properties match, return empty result
        query.property = { $in: [] };
      }
    }

    const bookings = await Booking.find(query)
      .populate('property', 'title location price images')
      .populate('buyer', 'name email phone profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders: bookings, // Map bookings to orders for frontend
        bookings, // Keep for backward compatibility
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Get all orders error:', error);
    next(error);
  }
};

// Get order by ID
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('property')
      .populate('buyer', 'name email phone profileImage');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: {
        order: booking, // Map booking to order for frontend
        booking, // Keep for backward compatibility
      },
    });
  } catch (error) {
    logger.error('Get order by ID error:', error);
    next(error);
  }
};

// Update order status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be "pending", "approved", "rejected", "completed", or "cancelled"',
      });
    }

    const booking = await Booking.findById(id)
      .populate('property');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    booking.status = status;
    await booking.save();

    // If approved, update property status to booked
    if (status === 'approved' && booking.property) {
      const property = await Property.findById(booking.property._id);
      if (property) {
        property.status = 'booked';
        await property.save();
      }
    }

    // If rejected or cancelled, update property status back to available
    if ((status === 'rejected' || status === 'cancelled') && booking.property) {
      const property = await Property.findById(booking.property._id);
      if (property) {
        property.status = 'available';
        await property.save();
      }
    }

    const updatedBooking = await Booking.findById(booking._id)
      .populate('property')
      .populate('buyer', 'name email phone profileImage');

    res.json({
      success: true,
      data: {
        order: updatedBooking, // Map booking to order for frontend
        booking: updatedBooking, // Keep for backward compatibility
      },
      message: 'Order status updated successfully',
    });
  } catch (error) {
    logger.error('Update order status error:', error);
    next(error);
  }
};

// Delete order
export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    await Booking.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    logger.error('Delete order error:', error);
    next(error);
  }
};

// Update user (for admin)
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, status, isActive, isVerified } = req.body;

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

    // Prevent changing your own role
    if (id === req.userId.toString() && role && role !== user.role) {
      return res.status(400).json({
        success: false,
        error: 'Cannot change your own role',
      });
    }

    // Prevent deactivating yourself
    if (id === req.userId.toString() && (status === 'inactive' || status === 'suspended' || isActive === false)) {
      return res.status(400).json({
        success: false,
        error: 'Cannot deactivate your own account',
      });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role && ['admin', 'superadmin'].includes(req.user.role)) user.role = role;
    if (status && ['active', 'inactive', 'suspended'].includes(status)) user.status = status;
    // Support isActive for backward compatibility
    if (isActive !== undefined) {
      user.status = isActive ? 'active' : 'inactive';
    }
    if (isVerified !== undefined) user.isVerified = isVerified;

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

// Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');

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

// Activate user
export const activateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    user.status = 'active';
    await user.save();

    res.json({
      success: true,
      data: { user },
      message: 'User activated successfully',
    });
  } catch (error) {
    logger.error('Activate user error:', error);
    next(error);
  }
};

// Deactivate user
export const deactivateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent deactivating yourself
    if (id === req.userId.toString()) {
      return res.status(400).json({
        success: false,
        error: 'Cannot deactivate your own account',
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Prevent deactivating superadmin
    if (user.role === 'superadmin') {
      return res.status(403).json({
        success: false,
        error: 'Cannot deactivate superadmin account',
      });
    }

    user.status = 'inactive';
    await user.save();

    res.json({
      success: true,
      data: { user },
      message: 'User deactivated successfully',
    });
  } catch (error) {
    logger.error('Deactivate user error:', error);
    next(error);
  }
};

export default {
  getAllBrokers,
  getAllUsers,
  updatePropertyStatus,
  updateUserStatus,
  getAllData,
  deleteUser,
  deleteProperty,
  getDashboardStats,
  getAllProperties,
  getPropertyById,
  approveProperty,
  rejectProperty,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  updateUser,
  getUserById,
  activateUser,
  deactivateUser,
};

