import Razorpay from 'razorpay';
import Stripe from 'stripe';
import crypto from 'crypto';
import { logger } from '../utils/logger.js';
import { addPaymentJob } from '../jobs/payment.job.js';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount',
      });
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    logger.error('Razorpay order creation error:', error);
    next(error);
  }
};

export const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required payment details',
      });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature',
      });
    }

    // Fetch payment details
    const payment = await razorpay.payments.fetch(paymentId);

    // Add job to process payment
    await addPaymentJob({
      userId: req.userId,
      paymentId,
      orderId,
      amount: payment.amount / 100,
      currency: payment.currency,
      method: 'razorpay',
      status: payment.status,
    });

    res.json({
      success: true,
      data: {
        paymentId: payment.id,
        status: payment.status,
        amount: payment.amount / 100,
        currency: payment.currency,
      },
    });
  } catch (error) {
    logger.error('Razorpay payment verification error:', error);
    next(error);
  }
};

export const createStripePayment = async (req, res, next) => {
  try {
    const { amount, currency = 'usd', description, metadata } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount',
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      description,
      metadata: {
        userId: req.userId.toString(),
        ...metadata,
      },
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (error) {
    logger.error('Stripe payment creation error:', error);
    next(error);
  }
};

export const verifyStripeWebhook = async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      logger.error('Stripe webhook signature verification failed:', err);
      return res.status(400).json({
        success: false,
        error: `Webhook Error: ${err.message}`,
      });
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await addPaymentJob({
          userId: paymentIntent.metadata.userId,
          paymentId: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          method: 'stripe',
          status: 'succeeded',
        });
        break;
      case 'payment_intent.payment_failed':
        logger.warn('Payment failed:', event.data.object);
        break;
      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Stripe webhook error:', error);
    next(error);
  }
};

