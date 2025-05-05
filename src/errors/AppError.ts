/**
 * Base error class for application errors
 * Extends the built-in Error class with additional properties
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  errorCode: string;
  
  constructor(
    message: string,
    statusCode: number = 500,
    errorCode: string = 'INTERNAL_SERVER_ERROR',
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorCode = errorCode;
    
    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
    
    // Set the prototype explicitly
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Not Found Error (404)
 * Used when a requested resource doesn't exist
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', errorCode: string = 'RESOURCE_NOT_FOUND') {
    super(message, 404, errorCode, true);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Bad Request Error (400)
 * Used for validation errors or malformed requests
 */
export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request', errorCode: string = 'BAD_REQUEST') {
    super(message, 400, errorCode, true);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

/**
 * Unauthorized Error (401)
 * Used when authentication is required but not provided or invalid
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized', errorCode: string = 'UNAUTHORIZED') {
    super(message, 401, errorCode, true);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * Forbidden Error (403)
 * Used when a user doesn't have permission to access a resource
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden', errorCode: string = 'FORBIDDEN') {
    super(message, 403, errorCode, true);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * Conflict Error (409)
 * Used when a request conflicts with the current state of the server
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Conflict', errorCode: string = 'CONFLICT') {
    super(message, 409, errorCode, true);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Database Error (500)
 * Used for database-related errors
 */
export class DatabaseError extends AppError {
  constructor(message: string = 'Database error', errorCode: string = 'DATABASE_ERROR') {
    super(message, 500, errorCode, true);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

/**
 * Validation Error (422)
 * Used for validation errors
 */
export class ValidationError extends AppError {
  errors: Record<string, string[]>;
  
  constructor(
    message: string = 'Validation error',
    errors: Record<string, string[]> = {},
    errorCode: string = 'VALIDATION_ERROR'
  ) {
    super(message, 422, errorCode, true);
    this.errors = errors;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
