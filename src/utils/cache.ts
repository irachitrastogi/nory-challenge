import { logger } from './logger';

/**
 * Cache item interface
 */
interface CacheItem<T> {
  value: T;
  expiry: number | null; // Timestamp when the item expires, null for no expiry
}

/**
 * Cache options interface
 */
interface CacheOptions {
  ttl?: number; // Time to live in milliseconds, undefined means no expiry
  logHits?: boolean; // Whether to log cache hits
}

/**
 * Cache statistics
 */
interface CacheStats {
  hits: number;
  misses: number;
  size: number;
}

/**
 * In-memory cache implementation
 */
class Cache {
  private cache: Map<string, CacheItem<any>>;
  private stats: CacheStats;
  
  constructor() {
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0
    };
    
    // Set up periodic cleanup of expired items
    setInterval(() => this.removeExpiredItems(), 60000); // Run every minute
  }
  
  /**
   * Set a value in the cache
   * 
   * @param key The cache key
   * @param value The value to cache
   * @param options Cache options
   */
  set<T>(key: string, value: T, options: CacheOptions = {}): void {
    const expiry = options.ttl ? Date.now() + options.ttl : null;
    
    this.cache.set(key, { value, expiry });
    this.stats.size = this.cache.size;
    
    logger.debug(`Cache: Set item with key "${key}"`, { 
      ttl: options.ttl,
      cacheSize: this.cache.size
    });
  }
  
  /**
   * Get a value from the cache
   * 
   * @param key The cache key
   * @param options Cache options
   * @returns The cached value or undefined if not found
   */
  get<T>(key: string, options: CacheOptions = {}): T | undefined {
    const item = this.cache.get(key);
    
    // Item not in cache
    if (!item) {
      this.stats.misses++;
      logger.debug(`Cache: Miss for key "${key}"`);
      return undefined;
    }
    
    // Check if item has expired
    if (item.expiry && item.expiry < Date.now()) {
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.size = this.cache.size;
      logger.debug(`Cache: Expired item with key "${key}"`);
      return undefined;
    }
    
    // Cache hit
    this.stats.hits++;
    if (options.logHits) {
      logger.debug(`Cache: Hit for key "${key}"`);
    }
    
    return item.value as T;
  }
  
  /**
   * Check if a key exists in the cache and is not expired
   * 
   * @param key The cache key
   * @returns True if the key exists and is not expired
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }
    
    if (item.expiry && item.expiry < Date.now()) {
      this.cache.delete(key);
      this.stats.size = this.cache.size;
      return false;
    }
    
    return true;
  }
  
  /**
   * Delete a value from the cache
   * 
   * @param key The cache key
   * @returns True if the item was deleted
   */
  delete(key: string): boolean {
    const result = this.cache.delete(key);
    this.stats.size = this.cache.size;
    
    if (result) {
      logger.debug(`Cache: Deleted item with key "${key}"`);
    }
    
    return result;
  }
  
  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
    this.stats.size = 0;
    logger.debug('Cache: Cleared all items');
  }
  
  /**
   * Remove all expired items from the cache
   */
  removeExpiredItems(): void {
    const now = Date.now();
    let removedCount = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (item.expiry && item.expiry < now) {
        this.cache.delete(key);
        removedCount++;
      }
    }
    
    if (removedCount > 0) {
      this.stats.size = this.cache.size;
      logger.debug(`Cache: Removed ${removedCount} expired items`);
    }
  }
  
  /**
   * Get cache statistics
   * 
   * @returns Cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }
}

// Create and export a default cache instance
export const cache = new Cache();

// Export the Cache class for custom instances
export default Cache;
