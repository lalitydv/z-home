import { Queue } from 'bullmq';
import { getRedisClient } from '../config/redis.js';
import { logger } from '../utils/logger.js';

// Create payment queue
const paymentQueue = new Queue('payment-processing', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
  },
});

// Add payment job
export const addPaymentJob = async (paymentData) => {
  try {
    const job = await paymentQueue.add('process-payment', paymentData, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: {
        age: 24 * 3600, // Keep completed jobs for 24 hours
        count: 1000,
      },
      removeOnFail: {
        age: 7 * 24 * 3600, // Keep failed jobs for 7 days
      },
    });

    logger.info(`Payment job added: ${job.id}`);
    return job;
  } catch (error) {
    logger.error('Error adding payment job:', error);
    throw error;
  }
};

// Payment worker (should be in a separate worker file)
export const processPaymentJob = async (job) => {
  try {
    const { userId, paymentId, amount, currency, method, status } = job.data;

    logger.info(`Processing payment: ${paymentId} for user: ${userId}`);

    // TODO: Update database with payment information
    // TODO: Send confirmation email
    // TODO: Update user subscription/credits if applicable

    return { success: true, paymentId };
  } catch (error) {
    logger.error(`Payment job ${job.id} failed:`, error);
    throw error;
  }
};

export default paymentQueue;

