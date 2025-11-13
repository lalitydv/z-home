import client from 'prom-client';
import { logger } from '../utils/logger.js';

// Create a Registry to register the metrics
const register = new client.Registry();

// Add default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(activeConnections);

export const registerMetrics = (app) => {
  // Metrics endpoint
  app.get('/metrics', async (req, res) => {
    try {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    } catch (error) {
      logger.error('Error generating metrics:', error);
      res.status(500).end();
    }
  });

  // Middleware to track metrics
  app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
      const duration = (Date.now() - start) / 1000;
      const route = req.route?.path || req.path;
      
      httpRequestDuration
        .labels(req.method, route, res.statusCode)
        .observe(duration);
      
      httpRequestTotal
        .labels(req.method, route, res.statusCode)
        .inc();
    });

    next();
  });
};

export { register, httpRequestDuration, httpRequestTotal, activeConnections };

