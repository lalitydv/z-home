import { Server } from 'socket.io';
import { logger } from '../utils/logger.js';
import { authenticateSocket } from '../middlewares/socketAuth.js';

let io = null;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Authentication middleware
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);
    logger.info(`User authenticated: ${socket.user?.id || 'Anonymous'}`);

    // Join user to their personal room
    if (socket.user?.id) {
      socket.join(`user:${socket.user.id}`);
    }

    // Handle chat events
    socket.on('chat:join', (roomId) => {
      socket.join(`chat:${roomId}`);
      logger.info(`Socket ${socket.id} joined chat room: ${roomId}`);
    });

    socket.on('chat:leave', (roomId) => {
      socket.leave(`chat:${roomId}`);
      logger.info(`Socket ${socket.id} left chat room: ${roomId}`);
    });

    socket.on('chat:message', (data) => {
      const { roomId, message } = data;
      io.to(`chat:${roomId}`).emit('chat:message', {
        ...message,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: ${socket.id}, reason: ${reason}`);
    });

    socket.on('error', (error) => {
      logger.error(`Socket error for ${socket.id}:`, error);
    });
  });

  logger.info('Socket.io initialized');
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initializeSocket() first.');
  }
  return io;
};

export default io;

