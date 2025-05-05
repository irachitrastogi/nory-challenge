import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Middleware to add a unique request ID to each request
 * This helps with tracing requests through logs and error reports
 */
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Use existing request ID from headers if available, otherwise generate a new one
  const requestId = req.headers['x-request-id'] || uuidv4();
  
  // Set the request ID in the request object for use in other middleware and routes
  req.headers['x-request-id'] = requestId as string;
  
  // Add the request ID to the response headers
  res.setHeader('X-Request-ID', requestId);
  
  next();
};
