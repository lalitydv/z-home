import express from 'express';
import {
  createNotification,
  getUserNotifications,
  updateNotification,
  deleteNotification,
} from '../controllers/notificationController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/', createNotification);
router.get('/:userId', getUserNotifications);
router.put('/:id', updateNotification);
router.delete('/:id', deleteNotification);

export default router;

