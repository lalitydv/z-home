import express from 'express';
import {
  getAllBrokers,
  getAllUsers,
  updatePropertyStatus,
  updateUserStatus,
  getDashboardStats,
  getAllProperties,
  getPropertyById,
  approveProperty,
  rejectProperty,
  deleteProperty,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  updateUser,
  getUserById,
  activateUser,
  deactivateUser,
  deleteUser,
} from '../controllers/adminController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

// Dashboard Stats
router.get('/dashboard/stats', getDashboardStats);

// Broker routes
router.get('/brokers', getAllBrokers);

// User Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/activate', activateUser);
router.put('/users/:id/deactivate', deactivateUser);
router.put('/users/:id/status', updateUserStatus); // Keep for backward compatibility

// Property Management
router.get('/properties', getAllProperties);
router.get('/properties/:id', getPropertyById);
router.put('/properties/:id', updatePropertyStatus); // Keep for backward compatibility
router.put('/properties/:id/approve', approveProperty);
router.put('/properties/:id/reject', rejectProperty);
router.delete('/properties/:id', deleteProperty);
router.put('/property/:id/status', updatePropertyStatus); // Keep for backward compatibility

// Order Management (mapped to bookings)
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id/status', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);

export default router;

