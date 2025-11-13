import User from '../models/userModel.js';
import Property from '../models/propertyModel.js';
import Booking from '../models/bookingModel.js';
import Message from '../models/messageModel.js';
import Review from '../models/reviewModel.js';
import { logger } from '../utils/logger.js';
import { connectDB } from '../config/db.js';
import { getRedisClient } from '../config/redis.js';

export const getAppStatus = async (req, res) => {
  try {
    // Check database connection
    let dbStatus = 'OK';
    try {
      await connectDB();
    } catch (error) {
      dbStatus = 'ERROR';
      logger.error('Database connection check failed:', error);
    }

    // Check Redis connection
    let redisStatus = 'OK';
    try {
      const client = getRedisClient();
      if (client) {
        await client.ping();
      } else {
        redisStatus = 'ERROR';
      }
    } catch (error) {
      redisStatus = 'ERROR';
      logger.warn('Redis connection check failed:', error);
    }

    // Get counts
    const [users, properties, bookings, messages, reviews] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Booking.countDocuments(),
      Message.countDocuments(),
      Review.countDocuments(),
    ]);

    // Calculate uptime
    const uptime = process.uptime();
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);
    const uptimeSeconds = Math.floor(uptime % 60);
    const uptimeFormatted = `${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s`;

    // Calculate uptime percentage (assuming 24/7 operation)
    const uptimePercentage = ((uptime / (24 * 3600 * 30)) * 100).toFixed(2); // 30 days reference

    const status = dbStatus === 'OK' && redisStatus === 'OK' ? 'OK' : 'DEGRADED';

    res.json({
      status,
      time: new Date().toISOString(),
      uptime: uptimeFormatted,
      uptimePercentage: `${uptimePercentage}%`,
      services: {
        database: dbStatus,
        redis: redisStatus,
      },
      stats: {
        users,
        properties,
        bookings,
        messages,
        reviews,
      },
    });
  } catch (error) {
    logger.error('Get app status error:', error);
    res.status(500).json({
      status: 'ERROR',
      time: new Date().toISOString(),
      error: 'Failed to get app status',
    });
  }
};

export default {
  getAppStatus,
};

