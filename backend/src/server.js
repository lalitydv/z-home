import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { connectRedis } from './config/redis.js';
import { initializeSocket } from './config/socket.js';
import { logger } from './utils/logger.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Initialize server
const server = app.listen(PORT, async () => {
  console.log(`🚀 Server starting on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode...`);
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  
  try {
    console.log('📦 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connected');
    
    console.log('📦 Connecting to Redis...');
    const redisResult = await connectRedis();
    if (redisResult) {
      console.log('✅ Redis connected');
    } else {
      console.log('⚠️  Redis not available (server will continue without Redis)');
    }
    
    logger.info('Database and Redis connections established');
    console.log(`\n✅ Server is running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📈 Metrics: http://localhost:${PORT}/metrics`);
    console.log(`🔌 API: http://localhost:${PORT}/api\n`);
  } catch (error) {
    console.error('❌ Failed to initialize services:', error.message);
    logger.error('Failed to initialize services:', error);
    console.error('\n💡 Make sure MongoDB is running:');
    console.error('   - MongoDB: mongod or docker-compose up -d mongo');
    console.error('   - Redis (optional): redis-server or docker-compose up -d redis\n');
    process.exit(1);
  }
});

// Initialize Socket.io
initializeSocket(server);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default app;
