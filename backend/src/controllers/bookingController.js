import Booking from '../models/bookingModel.js';
import Property from '../models/propertyModel.js';
import { logger } from '../utils/logger.js';

export const createBooking = async (req, res, next) => {
  try {
    const { property, message } = req.body;

    // Check if property exists
    const propertyDoc = await Property.findById(property);
    if (!propertyDoc) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    // Check if property is available
    if (propertyDoc.status !== 'available') {
      return res.status(400).json({
        success: false,
        error: 'Property is not available for booking',
      });
    }

    // Check if user already has a pending booking for this property
    const existingBooking = await Booking.findOne({
      property,
      buyer: req.userId,
      status: 'pending',
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        error: 'You already have a pending booking for this property',
      });
    }

    const booking = await Booking.create({
      property,
      buyer: req.userId,
      message: message || '',
      status: 'pending',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('property')
      .populate('buyer', 'name email phone profileImage');

    res.status(201).json({
      success: true,
      data: { booking: populatedBooking },
    });
  } catch (error) {
    logger.error('Create booking error:', error);
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { buyer: req.userId };

    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    const bookings = await Booking.find(query)
      .populate('property')
      .populate('buyer', 'name email phone profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Get my bookings error:', error);
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be "approved" or "rejected"',
      });
    }

    const booking = await Booking.findById(id)
      .populate('property');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Check if user is the property owner, broker, or admin
    const property = await Property.findById(booking.property._id);
    if (property.postedBy.toString() !== req.userId.toString() && 
        !['broker', 'admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to update this booking',
      });
    }

    booking.status = status;
    await booking.save();

    // If approved, update property status to booked
    if (status === 'approved') {
      property.status = 'booked';
      await property.save();
    }

    const updatedBooking = await Booking.findById(booking._id)
      .populate('property')
      .populate('buyer', 'name email phone profileImage');

    res.json({
      success: true,
      data: { booking: updatedBooking },
    });
  } catch (error) {
    logger.error('Update booking status error:', error);
    next(error);
  }
};

export const getPropertyBookings = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    // Check if user is the property owner, broker, or admin
    if (property.postedBy.toString() !== req.userId.toString() && 
        !['broker', 'admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to view these bookings',
      });
    }

    const bookings = await Booking.find({ property: propertyId })
      .populate('buyer', 'name email phone profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { bookings },
    });
  } catch (error) {
    logger.error('Get property bookings error:', error);
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    // Only admin can access all bookings
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
    
    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    const bookings = await Booking.find(query)
      .populate('property')
      .populate('buyer', 'name email phone profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Get all bookings error:', error);
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('property')
      .populate('buyer', 'name email phone profileImage');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Check if user has permission to view this booking
    const property = await Property.findById(booking.property._id);
    const isOwner = booking.buyer._id.toString() === req.userId.toString();
    const isPropertyOwner = property.postedBy.toString() === req.userId.toString();
    const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

    if (!isOwner && !isPropertyOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to view this booking',
      });
    }

    res.json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    logger.error('Get booking by ID error:', error);
    next(error);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Check permissions
    const property = await Property.findById(booking.property);
    const isBuyer = booking.buyer.toString() === req.userId.toString();
    const isPropertyOwner = property.postedBy.toString() === req.userId.toString();
    const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

    if (!isBuyer && !isPropertyOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this booking',
      });
    }

    await Booking.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    logger.error('Delete booking error:', error);
    next(error);
  }
};

export default {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  getPropertyBookings,
  deleteBooking,
};

