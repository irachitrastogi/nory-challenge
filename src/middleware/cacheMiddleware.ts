import { Request, Response, NextFunction } from 'express';
import { cache } from '../utils/cache';
import { logger } from '../utils/logger';

/**
 * Cache middleware options
 */
interface CacheMiddlewareOptions {
  ttl?: number; // Time to live in milliseconds
  keyPrefix?: string; // Prefix for cache keys
  keyGenerator?: (req: Request) => string; // Custom key generator
}

/**
 * Default cache key generator
 * Creates a key based on the request method, path, and query parameters
 */
const defaultKeyGenerator = (req: Request): string => {
  const path = req.originalUrl || req.url;
  return `api:${req.method}:${path}`;
};

/**
 * Middleware to cache API responses
 * 
 * @param options Cache middleware options
 * @returns Express middleware function
 */
export const cacheMiddleware = (options: CacheMiddlewareOptions = {}) => {
  const ttl = options.ttl || 5 * 60 * 1000; // Default: 5 minutes
  const keyPrefix = options.keyPrefix || '';
  const keyGenerator = options.keyGenerator || defaultKeyGenerator;
  
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // Generate cache key
    const key = keyPrefix ? `${keyPrefix}:${keyGenerator(req)}` : keyGenerator(req);
    
    // Check if we have a cached response
    const cachedResponse = cache.get<any>(key);
    
    if (cachedResponse) {
      // Add cache header to indicate the response was served from cache
      res.set('X-Cache', 'HIT');
      
      logger.debug(`Cache middleware: Hit for key "${key}"`);
      
      // Send the cached response
      return res.status(cachedResponse.status)
        .set(cachedResponse.headers)
        .send(cachedResponse.body);
    }
    
    // Cache miss, continue with the request
    res.set('X-Cache', 'MISS');
    
    // Store the original res.send method
    const originalSend = res.send;
    
    // Override res.send to cache the response before sending it
    res.send = function(body: any): Response {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const responseToCache = {
          status: res.statusCode,
          headers: res.getHeaders(),
          body
        };
        
        // Don't cache the X-Cache header
        delete responseToCache.headers['x-cache'];
        
        // Store in cache
        cache.set(key, responseToCache, { ttl });
        
        logger.debug(`Cache middleware: Cached response for key "${key}"`);
      }
      
      // Call the original send method
      return originalSend.call(this, body);
    };
    
    next();
  };
};
