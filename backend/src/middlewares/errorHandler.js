import { logger } from '../utils/logger.js';

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  logger.error({
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
    ...(process.env.NODE_ENV === 'development' && {
      path: req.path,
      method: req.method,
    }),
  });
};

