import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import * as Sentry from '@sentry/node';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

import { mobileHeaders } from './middlewares/mobileHeaders.js';
import { logger } from './utils/logger.js';
import { registerMetrics } from './config/metrics.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import superAdminRoutes from './routes/superAdminRoutes.js';
import statusRoutes from './routes/statusRoutes.js';

const app = express();

// Initialize Sentry
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
    tracesSampleRate: 1.0,
  });
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

// Trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Compression
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mobile headers middleware
app.use(mobileHeaders);

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) }
  }));
}

// Metrics endpoint
registerMetrics(app);

// Rate limiting


// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/status', statusRoutes);

// Error handling
app.use(Sentry.Handlers.errorHandler());
app.use(notFound);
app.use(errorHandler);

export default app;

