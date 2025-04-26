// error-recovery-system.js

/**
 * Error Recovery System for Schedulo Pro
 * 
 * This module provides comprehensive error handling, recovery mechanisms,
 * and circuit breakers for external service calls.
 */

/**
 * Circuit Breaker implementation to prevent cascading failures
 * when external services are experiencing issues.
 */
class CircuitBreaker {
  /**
   * Create a new CircuitBreaker
   * @param {Function} fn - The function to protect with circuit breaking
   * @param {Object} options - Configuration options
   * @param {number} options.failureThreshold - Number of failures before opening circuit (default: 5)
   * @param {number} options.resetTimeout - Time in ms before attempting reset (default: 30000)
   * @param {number} options.halfOpenSuccessThreshold - Successes needed in half-open state (default: 2)
   * @param {Function} options.onStateChange - Callback for state changes
   */
  constructor(fn, options = {}) {
    this.fn = fn;
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 30000; // 30 seconds
    this.halfOpenSuccessThreshold = options.halfOpenSuccessThreshold || 2;
    this.onStateChange = options.onStateChange || (() => {});
    
    this.state = 'CLOSED';
    this.failures = 0;
    this.successes = 0;
    this.nextAttempt = Date.now();
    this.lastError = null;
    this.totalFailures = 0;
    this.consecutiveFailures = 0;
    this.totalSuccesses = 0;
    
    // Bind the exec method to preserve context
    this.exec = this.exec.bind(this);
  }

  /**
   * Execute the protected function with circuit breaking
   * @param {...any} args - Arguments to pass to the protected function
   * @returns {Promise<any>} Result of the protected function
   * @throws {Error} Circuit breaker errors or original function errors
   */
  async exec(...args) {
    if (this.state === 'OPEN') {
      if (Date.now() > this.nextAttempt) {
        this._transitionState('HALF-OPEN');
      } else {
        const err = new Error('Circuit breaker is open');
        err.code = 'CIRCUIT_OPEN';
        err.lastError = this.lastError;
        err.openUntil = new Date(this.nextAttempt);
        throw err;
      }
    }
    
    try {
      const result = await this.fn(...args);
      
      this._onSuccess();
      return result;
    } catch (error) {
      this._onFailure(error);
      throw error;
    }
  }

  /**
   * Force the circuit breaker to reset to closed state
   */
  reset() {
    this._transitionState('CLOSED');
  }

  /**
   * Get current circuit breaker status
   * @returns {Object} Current status
   */
  getStatus() {
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      totalFailures: this.totalFailures,
      totalSuccesses: this.totalSuccesses,
      consecutiveFailures: this.consecutiveFailures,
      nextAttempt: this.state === 'OPEN' ? new Date(this.nextAttempt) : null,
      lastError: this.lastError ? this.lastError.message : null
    };
  }

  /**
   * Handle successful execution
   * @private
   */
  _onSuccess() {
    this.totalSuccesses++;
    this.consecutiveFailures = 0;
    
    if (this.state === 'HALF-OPEN') {
      this.successes++;
      
      if (this.successes >= this.halfOpenSuccessThreshold) {
        this._transitionState('CLOSED');
      }
    }
  }

  /**
   * Handle execution failure
   * @private
   * @param {Error} error - The error that occurred
   */
  _onFailure(error) {
    this.failures++;
    this.totalFailures++;
    this.consecutiveFailures++;
    this.lastError = error;
    
    if ((this.state === 'CLOSED' && this.failures >= this.failureThreshold) ||
        this.state === 'HALF-OPEN') {
      this._transitionState('OPEN');
    }
  }

  /**
   * Transition circuit breaker state
   * @private
   * @param {string} newState - The new state to transition to
   */
  _transitionState(newState) {
    const previousState = this.state;
    this.state = newState;
    
    if (newState === 'HALF-OPEN') {
      this.successes = 0;
    } else if (newState === 'CLOSED') {
      this.failures = 0;
      this.successes = 0;
    } else if (newState === 'OPEN') {
      this.nextAttempt = Date.now() + this.resetTimeout;
    }
    
    this.onStateChange({
      previousState,
      newState,
      timestamp: new Date(),
      circuitBreaker: this
    });
  }
}

/**
 * Retry mechanism with exponential backoff
 */
class RetryWithBackoff {
  /**
   * Create a new RetryWithBackoff
   * @param {Object} options - Configuration options
   * @param {number} options.maxRetries - Maximum number of retry attempts (default: 3)
   * @param {number} options.initialDelay - Initial delay in ms (default: 1000)
   * @param {number} options.maxDelay - Maximum delay in ms (default: 30000)
   * @param {Function} options.shouldRetry - Function to determine if retry should be attempted
   */
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.initialDelay = options.initialDelay || 1000;
    this.maxDelay = options.maxDelay || 30000;
    this.shouldRetry = options.shouldRetry || (() => true);
    
    // Bind the execute method to preserve context
    this.execute = this.execute.bind(this);
  }

  /**
   * Execute a function with retry and backoff
   * @param {Function} fn - The function to execute
   * @param {...any} args - Arguments to pass to the function
   * @returns {Promise<any>} Result of the function
   * @throws {Error} Last error encountered after all retries
   */
  async execute(fn, ...args) {
    let lastError;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error;
        
        // Check if we should retry
        if (attempt >= this.maxRetries || !this.shouldRetry(error, attempt)) {
          break;
        }
        
        // Calculate delay with exponential backoff and jitter
        const delay = Math.min(
          this.maxDelay,
          this.initialDelay * Math.pow(2, attempt) * (0.8 + Math.random() * 0.4)
        );
        
        // Wait before next attempt
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // If we get here, all retries failed
    throw lastError;
  }
}

/**
 * Error recovery manager for Schedulo Pro
 */
class ErrorRecoverySystem {
  /**
   * Create a new ErrorRecoverySystem
   * @param {Object} options - Configuration options
   * @param {Object} options.logger - Logger instance
   * @param {Object} options.storage - Storage for error tracking
   */
  constructor(options = {}) {
    this.logger = options.logger || console;
    this.storage = options.storage;
    this.circuitBreakers = new Map();
    this.retriers = new Map();
    
    // Default error handlers by category
    this.errorHandlers = {
      network: this._handleNetworkError.bind(this),
      authentication: this._handleAuthError.bind(this),
      rate_limit: this._handleRateLimitError.bind(this),
      validation: this._handleValidationError.bind(this),
      server: this._handleServerError.bind(this),
      unknown: this._handleUnknownError.bind(this)
    };
  }

  /**
   * Create a circuit breaker for a specific service
   * @param {string} serviceName - Name of the service
   * @param {Function} fn - Function to protect
   * @param {Object} options - Circuit breaker options
   * @returns {CircuitBreaker} The created circuit breaker
   */
  createCircuitBreaker(serviceName, fn, options = {}) {
    const circuitBreaker = new CircuitBreaker(fn, {
      ...options,
      onStateChange: (event) => {
        this.logger.info(`Circuit breaker for ${serviceName} changed from ${event.previousState} to ${event.newState}`);
        
        if (options.onStateChange) {
          options.onStateChange(event);
        }
        
        // Log state change to storage if available
        if (this.storage) {
          this.storage.logCircuitBreakerStateChange({
            serviceName,
            previousState: event.previousState,
            newState: event.newState,
            timestamp: event.timestamp,
            lastError: event.circuitBreaker.lastError ? event.circuitBreaker.lastError.message : null
          }).catch(err => {
            this.logger.error(`Failed to log circuit breaker state change: ${err.message}`);
          });
        }
      }
    });
    
    this.circuitBreakers.set(serviceName, circuitBreaker);
    return circuitBreaker;
  }

  /**
   * Get a circuit breaker by service name
   * @param {string} serviceName - Name of the service
   * @returns {CircuitBreaker|null} The circuit breaker or null if not found
   */
  getCircuitBreaker(serviceName) {
    return this.circuitBreakers.get(serviceName) || null;
  }

  /**
   * Create a retry mechanism for a specific operation
   * @param {string} operationName - Name of the operation
   * @param {Object} options - Retry options
   * @returns {RetryWithBackoff} The created retry mechanism
   */
  createRetrier(operationName, options = {}) {
    const retrier = new RetryWithBackoff({
      ...options,
      shouldRetry: (error, attempt) => {
        // Log retry attempt
        this.logger.info(`Retry attempt ${attempt + 1}/${options.maxRetries || 3} for ${operationName}: ${error.message}`);
        
        // Use custom shouldRetry if provided
        if (options.shouldRetry) {
          return options.shouldRetry(error, attempt);
        }
        
        // Default retry logic - retry on network errors and server errors
        return this._categorizeError(error).category === 'network' || 
               this._categorizeError(error).category === 'server' ||
               this._categorizeError(error).category === 'rate_limit';
      }
    });
    
    this.retriers.set(operationName, retrier);
    return retrier;
  }

  /**
   * Get a retrier by operation name
   * @param {string} operationName - Name of the operation
   * @returns {RetryWithBackoff|null} The retrier or null if not found
   */
  getRetrier(operationName) {
    return this.retriers.get(operationName) || null;
  }

  /**
   * Handle an error with appropriate recovery strategy
   * @param {Error} error - The error to handle
   * @param {Object} context - Error context
   * @returns {Promise<Object>} Recovery result
   */
  async handleError(error, context = {}) {
    // Categorize the error
    const { category, details } = this._categorizeError(error);
    
    // Log the error
    this.logger.error(`Error in ${context.operation || 'unknown operation'}: ${error.message}`, {
      category,
      details,
      context,
      stack: error.stack
    });
    
    // Store error if storage is available
    if (this.storage) {
      await this.storage.logError({
        message: error.message,
        category,
        details,
        context,
        stack: error.stack,
        timestamp: new Date()
      }).catch(err => {
        this.logger.error(`Failed to log error to storage: ${err.message}`);
      });
    }
    
    // Get appropriate handler for this error category
    const handler = this.errorHandlers[category] || this.errorHandlers.unknown;
    
    // Handle the error
    return handler(error, context, details);
  }

  /**
   * Register a custom error handler for a category
   * @param {string} category - Error category
   * @param {Function} handler - Error handler function
   */
  registerErrorHandler(category, handler) {
    if (typeof handler !== 'function') {
      throw new Error('Error handler must be a function');
    }
    
    this.errorHandlers[category] = handler;
  }

  /**
   * Categorize an error
   * @private
   * @param {Error} error - The error to categorize
   * @returns {Object} Error category and details
   */
  _categorizeError(error) {
    // Network errors
    if (error.code === 'ECONNREFUSED' || 
        error.code === 'ECONNRESET' || 
        error.code === 'ETIMEDOUT' ||
        error.message.includes('network') ||
        error.message.includes('connection')) {
      return {
        category: 'network',
        details: { code: error.code, retriable: true }
      };
    }
    
    // Authentication errors
    if (error.status === 401 || 
        error.status === 403 ||
        error.message.includes('auth') ||
        error.message.includes('token') ||
        error.message.includes('permission')) {
      return {
        category: 'authentication',
        details: { status: error.status, retriable: false }
      };
    }
    
    // Rate limit errors
    if (error.status === 429 ||
        error.message.includes('rate limit') ||
        error.message.includes('too many requests')) {
      return {
        category: 'rate_limit',
        details: { 
          status: error.status, 
          retriable: true,
          retryAfter: error.headers?.['retry-after'] || null
        }
      };
    }
    
    // Validation errors
    if (error.status === 400 ||
        error.status === 422 ||
        error.message.includes('validation') ||
        error.message.includes('invalid')) {
      return {
        category: 'validation',
        details: { status: error.status, retriable: false }
      };
    }
    
    // Server errors
    if (error.status >= 500 ||
        error.message.includes('server error')) {
      return {
        category: 'server',
        details: { status: error.status, retriable: true }
      };
    }
    
    // Unknown errors
    return {
      category: 'unknown',
      details: { retriable: false }
    };
  }

  /**
   * Handle network errors
   * @private
   * @param {Error} error - The error
   * @param {Object} context - Error context
   * @param {Object} details - Error details
   * @returns {Promise<Object>} Recovery result
   */
  async _handleNetworkError(error, context, details) {
    return {
      handled: true,
      recovery: 'retry',
      message: 'Network error detected, will retry with backoff',
      retriable: true
    };
  }

  /**
   * Handle authentication errors
   * @private
   * @param {Error} error - The error
   * @param {Object} context - Error context
   * @param {Object} details - Error details
   * @returns {Promise<Object>} Recovery result
   */
  async _handleAuthError(error, context, details) {
    // If token refresh is available and this is a token error
    if (context.tokenManager && context.userId && context.platform) {
      try {
        // Attempt token refresh
        await context.tokenManager.refreshToken(
          context.userId,
          context.platform,
          context.refreshCallback
        );
        
        return {
          handled: true,
          recovery: 'token_refreshed',
          message: 'Authentication token refreshed, operation can be retried',
          retriable: true
        };
      } catch (refreshError) {
        return {
          handled: true,
          recovery: 'token_refresh_failed',
          message: 'Authentication token refresh failed, user action required',
          retriable: false,
          error: refreshError.message
        };
      }
    }
    
    return {
      handled: true,
      recovery: 'auth_failed',
      message: 'Authentication error, user action required',
      retriable: false
    };
  }

  /**
   * Handle rate limit errors
   * @private
   * @param {Error} error - The error
   * @param {Object} context - Error context
   * @param {Object} details - Error details
   * @returns {Promise<Object>} Recovery result
   */
  async _handleRateLimitError(error, context, details) {
    // Calculate retry delay
    let retryDelay = 60000; // Default 1 minute
    
    if (details.retryAfter) {
      // If server provided retry-after header, use it
      retryDelay = parseInt(details.retryAfter, 10) * 1000;
    }
    
    return {
      handled: true,
      recovery: 'rate_limited',
      message: 'Rate limit exceeded, will retry after delay',
      retriable: true,
      retryDelay
    };
  }

  /**
   * Handle validation errors
   * @private
   * @param {Error} error - The error
   * @param {Object} context - Error context
   * @param {Object} details - Error details
   * @returns {Promise<Object>} Recovery result
   */
  async _handleValidationError(error, context, details) {
    return {
      handled: true,
      recovery: 'validation_failed',
      message: 'Validation error, user action required',
      retriable: false
    };
  }

  /**
   * Handle server errors
   * @private
   * @param {Error} error - The error
   * @param {Object} context - Error context
   * @param {Object} details - Error details
   * @returns {Promise<Object>} Recovery result
   */
  async _handleServerError(error, context, details) {
    return {
      handled: true,
      recovery: 'server_error',
      message: 'Server error detected, will retry with backoff',
      retriable: true
    };
  }

  /**
   * Handle unknown errors
   * @private
   * @param {Error} error - The error
   * @param {Object} context - Error context
   * @param {Object} details - Error details
   * @returns {Promise<Object>} Recovery result
   */
  async _handleUnknownError(error, context, details) {
    return {
      handled: true,
      recovery: 'unknown_error',
      message: 'Unknown error, cannot recover automatically',
      retriable: false
    };
  }
}

module.exports = {
  ErrorRecoverySystem,
  CircuitBreaker,
  RetryWithBackoff
};
