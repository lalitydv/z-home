import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import paymentRoutes from './payment.routes.js';
import uploadRoutes from './upload.routes.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'z-home-api' });
});

// Route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/payments', paymentRoutes);
router.use('/upload', uploadRoutes);

export default router;

