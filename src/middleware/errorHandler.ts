import { Request, Response, NextFunction } from 'express';

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  console.error(err);

  // Default error status and message
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Detailed error info in development
  const error = {
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err.details || null,
    }),
  };

  // Send error response
  res.status(status).json({ error });
};
