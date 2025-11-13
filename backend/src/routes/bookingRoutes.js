import express from 'express';
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  getPropertyBookings,
  deleteBooking,
} from '../controllers/bookingController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { isSellerBrokerOrAdmin, isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create booking (buyer)
router.post('/', createBooking);

// Get all bookings (admin only)
router.get('/', isAdmin, getAllBookings);

// Get my bookings
router.get('/my', getMyBookings);

// Get booking by ID
router.get('/:id', getBookingById);

// Get bookings for a property (seller/broker/admin)
router.get('/property/:propertyId', isSellerBrokerOrAdmin, getPropertyBookings);

// Update booking status (seller/broker/admin)
router.put('/:id', isSellerBrokerOrAdmin, updateBookingStatus);

// Delete booking
router.delete('/:id', deleteBooking);

export default router;

