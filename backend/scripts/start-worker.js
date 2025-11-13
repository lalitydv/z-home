#!/usr/bin/env node

/**
 * Start BullMQ workers
 * Run this script separately to process background jobs
 */

import dotenv from 'dotenv';
import { logger } from '../src/utils/logger.js';

// Load environment variables
dotenv.config();

// Import workers
import paymentWorker from '../src/workers/payment.worker.js';

logger.info('Starting background workers...');

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing workers');
  await paymentWorker.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing workers');
  await paymentWorker.close();
  process.exit(0);
});

