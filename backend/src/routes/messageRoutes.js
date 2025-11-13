import express from 'express';
import {
  sendMessage,
  getChatMessages,
  getConversations,
  getAllMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
} from '../controllers/messageController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/', sendMessage);
router.get('/conversations', getConversations);

// Get all messages (admin only)
router.get('/', isAdmin, getAllMessages);

// Get message by ID
router.get('/message/:id', getMessageById);

// Get chat with specific user
router.get('/:receiverId', getChatMessages);

// Update message (mark as read, edit)
router.put('/:id', updateMessage);

// Delete message
router.delete('/:id', deleteMessage);

export default router;

