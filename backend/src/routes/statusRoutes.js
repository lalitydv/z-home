import express from 'express';
import { getAppStatus } from '../controllers/statusController.js';

const router = express.Router();

// Public route - no authentication required
router.get('/', getAppStatus);

export default router;

