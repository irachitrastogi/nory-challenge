import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../errors/AppError';
import { logger } from '../utils/logger';

/**
 * Global error handling middleware
 * Processes all errors thrown in the application and returns appropriate responses
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Standardize the error object
  const error = normalizeError(err);
  
  // Log the error with appropriate level and details
  logError(error, req);
  
  // Send appropriate response to client
  sendErrorResponse(error, req, res);
};

/**
 * Normalize different error types into a standard format
 */
const normalizeError = (err: any): AppError => {
  // Already an AppError instance
  if (err instanceof AppError) {
    return err;
  }
  
  // TypeORM errors
  if (err.name === 'QueryFailedError') {
    return new AppError(
      'Database operation failed',
      500,
      'DATABASE_ERROR',
      true
    );
  }
  
  // Express validation errors
  if (err.name === 'ValidationError' || (err.errors && Object.keys(err.errors).length > 0)) {
    return new ValidationError(
      'Validation failed',
      err.errors || {},
      'VALIDATION_ERROR'
    );
  }
  
  // SyntaxError (usually from JSON parsing)
  if (err instanceof SyntaxError && err.message.includes('JSON')) {
    return new AppError(
      'Invalid JSON in request body',
      400,
      'INVALID_JSON',
      true
    );
  }
  
  // Default to generic server error for unknown error types
  return new AppError(
    err.message || 'Internal Server Error',
    err.statusCode || 500,
    err.errorCode || 'INTERNAL_SERVER_ERROR',
    err.isOperational !== undefined ? err.isOperational : false
  );
};

/**
 * Log the error with appropriate level and details
 */
const logError = (error: AppError, req: Request): void => {
  const logMeta = {
    statusCode: error.statusCode,
    errorCode: error.errorCode,
    isOperational: error.isOperational,
    path: req.path,
    method: req.method,
    ip: req.ip,
    requestId: req.headers['x-request-id'] || 'unknown',
  };
  
  // Log operational errors as warnings, programming errors as errors
  if (error.isOperational) {
    if (error.statusCode >= 500) {
      logger.error(`Operational error: ${error.message}`, { ...logMeta, stack: error.stack });
    } else {
      logger.warn(`Client error: ${error.message}`, logMeta);
    }
  } else {
    // Non-operational errors are always serious and need immediate attention
    logger.error(`Programming error: ${error.message}`, { ...logMeta, stack: error.stack });
  }
};

/**
 * Send appropriate error response to client
 */
const sendErrorResponse = (error: AppError, req: Request, res: Response): void => {
  // Determine if we should show detailed error info
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Basic error response
  const errorResponse: any = {
    status: 'error',
    code: error.errorCode,
    message: error.message,
  };
  
  // Add validation errors if present
  if (error instanceof ValidationError && Object.keys(error.errors).length > 0) {
    errorResponse.errors = error.errors;
  }
  
  // Add stack trace in development
  if (!isProduction && error.stack) {
    errorResponse.stack = error.stack.split('\n');
  }
  
  // Add request details in development
  if (!isProduction) {
    errorResponse.request = {
      path: req.path,
      method: req.method,
      id: req.headers['x-request-id'] || 'unknown',
    };
  }
  
  res.status(error.statusCode).json({ error: errorResponse });
};
