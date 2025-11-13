import rateLimit from 'express-rate-limit';
import { getRedisClient } from '../config/redis.js';
import { logger } from '../utils/logger.js';

// In-memory store for rate limiting (fallback)
const memoryStore = new Map();

// Redis store for rate limiting
const createRedisStore = () => {
  return {
    async increment(key) {
      try {
        const client = getRedisClient();
        const count = await client.incr(key);
        if (count === 1) {
          await client.expire(key, Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000));
        }
        return { totalHits: count };
      } catch (error) {
        logger.error('Redis rate limit error, falling back to memory:', error);
        // Fallback to memory
        const count = (memoryStore.get(key) || 0) + 1;
        memoryStore.set(key, count);
        setTimeout(() => memoryStore.delete(key), parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'));
        return { totalHits: count };
      }
    },
  };
};



