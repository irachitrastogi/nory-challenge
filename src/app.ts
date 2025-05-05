import express from 'express';
import { setupRoutes } from './api/routes';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Create Express app
const app = express();

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

// Parse JSON request body
app.use(express.json());

// Set up API routes
setupRoutes(app);

export { app };
