// api-rate-limiter.js

/**
 * API Rate Limiter for Schedulo Pro
 * 
 * This module provides rate limiting functionality for social media API calls
 * to prevent exceeding platform-specific rate limits.
 */

class ApiRateLimiter {
  /**
   * Create a new ApiRateLimiter
   * @param {Object} options - Configuration options
   * @param {Object} options.storage - Storage interface for rate limit tracking
   */
  constructor(options = {}) {
    this.storage = options.storage || new InMemoryRateLimitStorage();
    this.platformLimits = this._initializePlatformLimits();
  }

  /**
   * Check if an API call can be made without exceeding rate limits
   * @param {string} userId - The user ID making the request
   * @param {string} platform - The social media platform
   * @param {string} endpoint - The specific API endpoint being called
   * @returns {Promise<boolean>} Whether the call can proceed
   */
  async canMakeRequest(userId, platform, endpoint) {
    const limits = this._getLimitsForEndpoint(platform, endpoint);
    
    if (!limits) {
      // If no specific limits are defined, allow the request
      return true;
    }
    
    // Check each limit window
    for (const window of limits) {
      const key = this._generateKey(userId, platform, endpoint, window.window);
      const count = await this.storage.getCount(key);
      
      if (count >= window.limit) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Record an API call for rate limiting
   * @param {string} userId - The user ID making the request
   * @param {string} platform - The social media platform
   * @param {string} endpoint - The specific API endpoint being called
   * @returns {Promise<Object>} Updated rate limit information
   */
  async recordRequest(userId, platform, endpoint) {
    const limits = this._getLimitsForEndpoint(platform, endpoint);
    
    if (!limits) {
      return { recorded: false };
    }
    
    const results = {};
    
    // Record the request for each limit window
    for (const window of limits) {
      const key = this._generateKey(userId, platform, endpoint, window.window);
      const ttl = this._windowToSeconds(window.window);
      const count = await this.storage.incrementCount(key, ttl);
      
      results[window.window] = {
        limit: window.limit,
        remaining: Math.max(0, window.limit - count),
        reset: new Date(Date.now() + ttl * 1000).toISOString()
      };
    }
    
    return {
      recorded: true,
      platform,
      endpoint,
      limits: results
    };
  }

  /**
   * Get current rate limit status
   * @param {string} userId - The user ID
   * @param {string} platform - The social media platform
   * @param {string} endpoint - The specific API endpoint
   * @returns {Promise<Object>} Current rate limit status
   */
  async getRateLimitStatus(userId, platform, endpoint) {
    const limits = this._getLimitsForEndpoint(platform, endpoint);
    
    if (!limits) {
      return { status: 'unknown' };
    }
    
    const results = {};
    
    // Get status for each limit window
    for (const window of limits) {
      const key = this._generateKey(userId, platform, endpoint, window.window);
      const count = await this.storage.getCount(key);
      const ttl = await this.storage.getTTL(key);
      
      results[window.window] = {
        limit: window.limit,
        remaining: Math.max(0, window.limit - count),
        reset: ttl ? new Date(Date.now() + ttl * 1000).toISOString() : null
      };
    }
    
    return {
      platform,
      endpoint,
      limits: results
    };
  }

  /**
   * Wait until a rate-limited request can be made
   * @param {string} userId - The user ID making the request
   * @param {string} platform - The social media platform
   * @param {string} endpoint - The specific API endpoint being called
   * @param {Object} options - Options for waiting
   * @param {number} options.maxWaitTime - Maximum time to wait in milliseconds
   * @param {number} options.checkInterval - Interval between checks in milliseconds
   * @returns {Promise<boolean>} Whether the wait was successful
   */
  async waitForRateLimit(userId, platform, endpoint, options = {}) {
    const maxWaitTime = options.maxWaitTime || 60000; // Default to 1 minute
    const checkInterval = options.checkInterval || 1000; // Default to 1 second
    
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      const canProceed = await this.canMakeRequest(userId, platform, endpoint);
      
      if (canProceed) {
        return true;
      }
      
      // Wait for the check interval
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }
    
    return false; // Timed out waiting
  }

  /**
   * Initialize platform-specific rate limits
   * @private
   * @returns {Object} Platform rate limits
   */
  _initializePlatformLimits() {
    return {
      instagram: {
        default: [
          { window: '1h', limit: 200 },
          { window: '24h', limit: 1000 }
        ],
        'media/publish': [
          { window: '1h', limit: 25 },
          { window: '24h', limit: 100 }
        ],
        'insights': [
          { window: '1h', limit: 30 }
        ]
      },
      facebook: {
        default: [
          { window: '1h', limit: 200 },
          { window: '24h', limit: 1000 }
        ],
        'feed': [
          { window: '1h', limit: 25 },
          { window: '24h', limit: 100 }
        ]
      },
      twitter: {
        default: [
          { window: '15m', limit: 100 }
        ],
        'tweets': [
          { window: '3h', limit: 300 }
        ],
        'users': [
          { window: '15m', limit: 100 }
        ]
      },
      tiktok: {
        default: [
          { window: '1m', limit: 60 },
          { window: '1h', limit: 3600 }
        ],
        'video/upload': [
          { window: '1h', limit: 10 }
        ],
        'video/list': [
          { window: '1m', limit: 30 }
        ]
      }
    };
  }

  /**
   * Get rate limits for a specific endpoint
   * @private
   * @param {string} platform - The social media platform
   * @param {string} endpoint - The API endpoint
   * @returns {Array|null} Array of rate limit objects or null
   */
  _getLimitsForEndpoint(platform, endpoint) {
    const platformLimits = this.platformLimits[platform.toLowerCase()];
    
    if (!platformLimits) {
      return null;
    }
    
    // Check for endpoint-specific limits
    for (const [key, limits] of Object.entries(platformLimits)) {
      if (key !== 'default' && endpoint.includes(key)) {
        return limits;
      }
    }
    
    // Fall back to default limits for the platform
    return platformLimits.default || null;
  }

  /**
   * Generate a storage key for rate limit tracking
   * @private
   * @param {string} userId - The user ID
   * @param {string} platform - The platform
   * @param {string} endpoint - The endpoint
   * @param {string} window - The time window
   * @returns {string} Storage key
   */
  _generateKey(userId, platform, endpoint, window) {
    return `ratelimit:${userId}:${platform}:${endpoint}:${window}`;
  }

  /**
   * Convert a time window string to seconds
   * @private
   * @param {string} window - Time window (e.g., '1h', '15m', '24h')
   * @returns {number} Time in seconds
   */
  _windowToSeconds(window) {
    const match = window.match(/^(\d+)([smhd])$/);
    
    if (!match) {
      throw new Error(`Invalid time window format: ${window}`);
    }
    
    const [, value, unit] = match;
    const numValue = parseInt(value, 10);
    
    switch (unit) {
      case 's': return numValue;
      case 'm': return numValue * 60;
      case 'h': return numValue * 60 * 60;
      case 'd': return numValue * 24 * 60 * 60;
      default: throw new Error(`Unknown time unit: ${unit}`);
    }
  }
}

/**
 * In-memory storage for rate limit tracking
 * For production, use a distributed storage like Redis
 */
class InMemoryRateLimitStorage {
  constructor() {
    this.counters = new Map();
    this.expiry = new Map();
  }
  
  async getCount(key) {
    this._cleanExpired();
    return this.counters.get(key) || 0;
  }
  
  async incrementCount(key, ttl) {
    this._cleanExpired();
    
    const currentCount = this.counters.get(key) || 0;
    const newCount = currentCount + 1;
    
    this.counters.set(key, newCount);
    
    // Set expiry if not already set
    if (!this.expiry.has(key)) {
      this.expiry.set(key, Date.now() + ttl * 1000);
    }
    
    return newCount;
  }
  
  async getTTL(key) {
    const expiryTime = this.expiry.get(key);
    
    if (!expiryTime) {
      return null;
    }
    
    const ttlMs = expiryTime - Date.now();
    return ttlMs > 0 ? Math.ceil(ttlMs / 1000) : 0;
  }
  
  _cleanExpired() {
    const now = Date.now();
    
    for (const [key, expiryTime] of this.expiry.entries()) {
      if (expiryTime <= now) {
        this.counters.delete(key);
        this.expiry.delete(key);
      }
    }
  }
}

module.exports = { ApiRateLimiter, InMemoryRateLimitStorage };
