import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import crypto from 'crypto';
import logger from '../config/logger.js';

// Request ID injector
export const requestIdMiddleware = (req, res, next) => {
  req.requestId = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('X-Request-Id', req.requestId);
  
  // Log request arrival
  const startTime = Date.now();
  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    logger.info('http.request', `${req.method} ${req.originalUrl} - ${res.statusCode}`, {
      requestId: req.requestId,
      method: req.method,
      route: req.originalUrl,
      statusCode: res.statusCode,
      durationMs,
      ip: req.ip,
      userId: req.user?.id || null,
      role: req.user?.role || null
    });
  });
  next();
};

import { globalRateLimiter, authRateLimiter, refreshRateLimiter } from './rateLimiter.js';

export { globalRateLimiter, authRateLimiter, refreshRateLimiter };

// Wire up security headers and response compression
export const configureResilience = (app) => {
  app.use(helmet());
  app.use(compression());
  app.use(requestIdMiddleware);
};
