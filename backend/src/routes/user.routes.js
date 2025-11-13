import express from 'express';
import { getProfile, updateProfile, deleteAccount, getUsers } from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// User routes
router.get('/me', getProfile);
router.put('/me', updateProfile);
router.delete('/me', deleteAccount);

// Admin routes
router.get('/', authorize('admin', 'moderator'), getUsers);

export default router;

