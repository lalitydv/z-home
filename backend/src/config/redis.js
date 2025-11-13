import { createClient } from 'redis';
import { logger } from '../utils/logger.js';

let redisClient = null;

export const connectRedis = async () => {
  try {
    const config = {
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            logger.warn('Redis connection failed after 3 retries. Continuing without Redis...');
            return false; // Stop retrying
          }
          return Math.min(retries * 100, 3000);
        },
      },
    };

    if (process.env.REDIS_PASSWORD) {
      config.password = process.env.REDIS_PASSWORD;
    }

    if (process.env.REDIS_DB) {
      config.database = parseInt(process.env.REDIS_DB);
    }

    redisClient = createClient(config);

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
      // Don't throw error, allow server to continue without Redis
    });

    redisClient.on('connect', () => {
      logger.info('Redis Client connecting...');
    });

    redisClient.on('ready', () => {
      logger.info('Redis Client ready');
    });

    redisClient.on('end', () => {
      logger.warn('Redis Client connection ended');
    });

    await redisClient.connect();
    logger.info('Redis connected successfully');

    return redisClient;
  } catch (error) {
    logger.warn('Redis connection failed (server will continue without Redis):', error.message);
    // Don't throw error - allow server to run without Redis
    // Redis is optional for basic functionality
    redisClient = null;
    return null;
  }
};

export const getRedisClient = () => {
  if (!redisClient) {
    // Return null instead of throwing error - allows graceful degradation
    logger.warn('Redis client not available');
    return null;
  }
  return redisClient;
};

export const disconnectRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info('Redis disconnected');
  }
};

// Cache helper functions
export const cacheGet = async (key) => {
  try {
    const client = getRedisClient();
    if (!client) return null; // Redis not available
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.error(`Cache get error for key ${key}:`, error);
    return null;
  }
};

export const cacheSet = async (key, value, expirySeconds = 3600) => {
  try {
    const client = getRedisClient();
    if (!client) return; // Redis not available
    await client.setEx(key, expirySeconds, JSON.stringify(value));
  } catch (error) {
    logger.error(`Cache set error for key ${key}:`, error);
  }
};

export const cacheDelete = async (key) => {
  try {
    const client = getRedisClient();
    if (!client) return; // Redis not available
    await client.del(key);
  } catch (error) {
    logger.error(`Cache delete error for key ${key}:`, error);
  }
};

export default redisClient;

