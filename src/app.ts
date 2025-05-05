import express from 'express';
import { setupRoutes } from './api/routes';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import { requestIdMiddleware } from './middleware/requestId';
import path from 'path';
import fs from 'fs';
import { logger } from './utils/logger';

// Create Express app
const app = express();

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  logger.info('Created logs directory');
}

// Add request ID to all requests
app.use(requestIdMiddleware);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    requestId: req.headers['x-request-id']
  });
  next();
});

// Parse JSON request body
app.use(express.json());

// Set up API routes
setupRoutes(app);

// Global error handler - must be after all routes
app.use(errorHandler);

// 404 handler for undefined routes
app.use((req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.path}`, {
    ip: req.ip,
    requestId: req.headers['x-request-id']
  });
  
  res.status(404).json({
    error: {
      status: 'error',
      code: 'ROUTE_NOT_FOUND',
      message: `Route not found: ${req.method} ${req.path}`
    }
  });
});

export { app };
