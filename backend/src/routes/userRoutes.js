import express from 'express';
import {
  getProfile,
  getUserById,
  getAllUsers,
  updateProfile,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Profile routes
router.get('/me', getProfile);
router.get('/profile', getProfile); // Keep for backward compatibility
router.put('/me', updateProfile);
router.put('/profile', updateProfile); // Keep for backward compatibility

// User management routes (admin only for list)
router.get('/', isAdmin, getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', isAdmin, deleteUser);

export default router;

