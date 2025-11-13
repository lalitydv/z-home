#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests the database connection and shows connection status
 */

import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { connectRedis, disconnectRedis } from '../src/config/redis.js';
import User from '../src/models/userModel.js';
import Property from '../src/models/propertyModel.js';
import { logger } from '../src/utils/logger.js';

// Load environment variables
dotenv.config();

const testConnection = async () => {
  try {
    logger.info('Testing database connections...\n');

    // Test MongoDB connection
    logger.info('Connecting to MongoDB...');
    await connectDB();
    logger.info('✅ MongoDB connected successfully\n');

    // Test Redis connection
    logger.info('Connecting to Redis...');
    await connectRedis();
    logger.info('✅ Redis connected successfully\n');

    // Test database operations
    logger.info('Testing database operations...');
    
    const userCount = await User.countDocuments();
    const propertyCount = await Property.countDocuments();
    
    logger.info(`📊 Current database stats:`);
    logger.info(`   Users: ${userCount}`);
    logger.info(`   Properties: ${propertyCount}`);
    logger.info(`   Bookings: ${await (await import('../src/models/bookingModel.js')).default.countDocuments()}`);
    logger.info(`   Reviews: ${await (await import('../src/models/reviewModel.js')).default.countDocuments()}`);
    logger.info(`   Messages: ${await (await import('../src/models/messageModel.js')).default.countDocuments()}`);
    logger.info(`   Notifications: ${await (await import('../src/models/notificationModel.js')).default.countDocuments()}`);

    logger.info('\n✅ All connections successful!');
    logger.info('\n💡 To seed the database, run: npm run seed');

  } catch (error) {
    logger.error('❌ Connection failed:', error);
    process.exit(1);
  } finally {
    await disconnectDB();
    await disconnectRedis();
    process.exit(0);
  }
};

// Run connection test
testConnection();

