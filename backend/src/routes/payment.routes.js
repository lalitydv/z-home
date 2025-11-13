import express from 'express';
import { createRazorpayOrder, verifyRazorpayPayment, createStripePayment, verifyStripeWebhook } from '../controllers/payment.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication except webhooks
router.post('/razorpay/create-order', authenticate, createRazorpayOrder);
router.post('/razorpay/verify', authenticate, verifyRazorpayPayment);
router.post('/stripe/create-payment', authenticate, createStripePayment);
router.post('/stripe/webhook', verifyStripeWebhook); // Webhook doesn't need auth

export default router;

