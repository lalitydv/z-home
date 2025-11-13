import rateLimit from 'express-rate-limit';
import { getRedisClient } from '../config/redis.js';
import { logger } from '../utils/logger.js';

// Custom Store class for express-rate-limit v7
class CustomStore {
  constructor() {
    this.memoryStore = new Map();
  }

  async increment(key) {
    try {
      const client = getRedisClient();
      if (!client) {
        // Redis not available, use memory store
        const count = (this.memoryStore.get(key) || 0) + 1;
        this.memoryStore.set(key, count);
        setTimeout(() => this.memoryStore.delete(key), parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'));
        return { totalHits: count };
      }
      const count = await client.incr(key);
      if (count === 1) {
        await client.expire(key, Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000));
      }
      return { totalHits: count };
    } catch (error) {
      logger.error('Redis rate limit error, falling back to memory:', error);
      // Fallback to memory
      const count = (this.memoryStore.get(key) || 0) + 1;
      this.memoryStore.set(key, count);
      setTimeout(() => this.memoryStore.delete(key), parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'));
      return { totalHits: count };
    }
  }

  async decrement(key) {
    try {
      const client = getRedisClient();
      if (!client) {
        const count = (this.memoryStore.get(key) || 0) - 1;
        if (count <= 0) {
          this.memoryStore.delete(key);
        } else {
          this.memoryStore.set(key, count);
        }
        return;
      }
      await client.decr(key);
    } catch (error) {
      logger.error('Redis decrement error:', error);
    }
  }

  async resetKey(key) {
    try {
      const client = getRedisClient();
      if (!client) {
        this.memoryStore.delete(key);
        return;
      }
      await client.del(key);
    } catch (error) {
      logger.error('Redis reset key error:', error);
    }
  }

  async shutdown() {
    // Cleanup if needed
  }
}

export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  store: new CustomStore(),
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  },
});

// Stricter rate limiter for auth routes
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  store: new CustomStore(),
  keyGenerator: (req) => {
    return req.body?.email || req.ip || req.connection.remoteAddress;
  },
});

