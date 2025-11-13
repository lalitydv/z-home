import express from 'express';
import {
  getAllData,
  deleteUser,
  deleteProperty,
} from '../controllers/adminController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { isSuperAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// All routes require authentication and superadmin role
router.use(authenticate);
router.use(isSuperAdmin);

router.get('/all-data', getAllData);
router.delete('/delete-user/:id', deleteUser);
router.delete('/delete-property/:id', deleteProperty);

export default router;

