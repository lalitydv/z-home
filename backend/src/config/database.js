import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    logger.info('MongoDB already connected');
    return;
  }

  try {
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(process.env.MONGODB_URI, options);

    isConnected = true;
    logger.info('MongoDB connected successfully');

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
      isConnected = true;
    });

  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    throw error;
  }
};

export const disconnectDB = async () => {
  if (!isConnected) return;
  
  try {
    await mongoose.disconnect();
    isConnected = false;
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error('Error disconnecting MongoDB:', error);
    throw error;
  }
};

export default mongoose;

