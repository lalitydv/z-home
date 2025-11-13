import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

export const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    
    if (!token) {
      logger.warn('Socket connection attempted without token');
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    logger.error('Socket authentication error:', error);
    next(new Error('Authentication error: Invalid token'));
  }
};

