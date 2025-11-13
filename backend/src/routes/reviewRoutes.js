import express from 'express';
import {
  addReview,
  getPropertyReviews,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllReviews);
router.get('/property/:propertyId', getPropertyReviews);
router.get('/:id', getReviewById);

// Protected routes
router.use(authenticate);

router.post('/', addReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;

