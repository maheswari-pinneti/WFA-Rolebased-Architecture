import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.routes.js';
import { initDb } from './config/db.js';
import { configureResilience, globalRateLimiter } from './middleware/resilience.js';
import logger from './config/logger.js';
import { db } from './database/connection.js';

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001'
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'test') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Apply Helmet, compression, request ID tracking, and logging
configureResilience(app);

// Apply Global Rate Limiting
app.use(globalRateLimiter);

// Liveness Health Check (checks if Node process is running)
app.get('/live', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Readiness Health Check (checks if SQLite connection is usable)
app.get('/ready', (req, res) => {
  db.get('PRAGMA integrity_check;', (err, row) => {
    if (err || !row || row.integrity_check !== 'ok') {
      logger.error('health.readiness.failed', 'Database is not ready or integrity check failed', { error: err?.message || 'integrity check not ok' });
      return res.status(503).json({ status: 'DOWN', reason: 'Database connection failed' });
    }
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
  });
});

// Generic Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Register API v1 Router
app.use('/v1', apiRouter);

// Database initialization
let isDbInitialized = false;
initDb().then(() => {
  isDbInitialized = true;
  logger.info('database.initialization', 'Database initialized successfully.');
}).catch((err) => {
  logger.error('database.initialization.failed', 'Failed to initialize database', { error: err.message });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error('http.error', err.message || 'Internal Server Error', {
    requestId: req.requestId || 'unknown',
    method: req.method,
    route: req.originalUrl,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
  
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

export { app };
