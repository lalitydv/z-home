import { Worker } from 'bullmq';
import { processPaymentJob } from '../jobs/payment.job.js';
import { logger } from '../utils/logger.js';

// Create payment worker
const paymentWorker = new Worker(
  'payment-processing',
  async (job) => {
    return await processPaymentJob(job);
  },
  {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
    },
    concurrency: 5,
    removeOnComplete: {
      count: 1000,
      age: 24 * 3600,
    },
    removeOnFail: {
      count: 5000,
      age: 7 * 24 * 3600,
    },
  }
);

paymentWorker.on('completed', (job) => {
  logger.info(`Payment job ${job.id} completed`);
});

paymentWorker.on('failed', (job, err) => {
  logger.error(`Payment job ${job.id} failed:`, err);
});

paymentWorker.on('error', (err) => {
  logger.error('Payment worker error:', err);
});

logger.info('Payment worker started');

export default paymentWorker;

