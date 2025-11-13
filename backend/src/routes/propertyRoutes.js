import express from 'express';
import {
  addProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  filterProperties,
} from '../controllers/propertyController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { isSellerOrBroker, isOwner } from '../middlewares/roleMiddleware.js';
import Property from '../models/propertyModel.js';

const router = express.Router();

// Public routes
router.get('/', getAllProperties);
router.get('/filter', filterProperties);
router.get('/:id', getPropertyById);

// Protected routes
router.use(authenticate);

// Add property (seller/broker only)
router.post('/', isSellerOrBroker, addProperty);

// Update property (owner or admin)
router.put('/:id', isOwner(Property), updateProperty);

// Delete property (owner or admin)
router.delete('/:id', isOwner(Property), deleteProperty);

export default router;

