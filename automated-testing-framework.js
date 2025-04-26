// automated-testing-framework.js

/**
 * Automated Testing Framework for Schedulo Pro
 * 
 * This module provides comprehensive testing capabilities including
 * unit tests, integration tests, and end-to-end tests for the application.
 */

const { expect } = require('chai');
const sinon = require('sinon');

/**
 * Test Suite class for organizing and running tests
 */
class TestSuite {
  /**
   * Create a new TestSuite
   * @param {string} name - Name of the test suite
   * @param {Object} options - Configuration options
   */
  constructor(name, options = {}) {
    this.name = name;
    this.tests = [];
    this.beforeEachFns = [];
    this.afterEachFns = [];
    this.beforeAllFns = [];
    this.afterAllFns = [];
    this.options = {
      timeout: options.timeout || 5000,
      retries: options.retries || 0,
      parallel: options.parallel || false,
      ...options
    };
  }

  /**
   * Add a test to the suite
   * @param {string} description - Test description
   * @param {Function} testFn - Test function
   * @param {Object} options - Test-specific options
   */
  test(description, testFn, options = {}) {
    this.tests.push({
      description,
      fn: testFn,
      options: {
        ...this.options,
        ...options
      }
    });
    
    return this;
  }

  /**
   * Add a function to run before each test
   * @param {Function} fn - Function to run before each test
   */
  beforeEach(fn) {
    this.beforeEachFns.push(fn);
    return this;
  }

  /**
   * Add a function to run after each test
   * @param {Function} fn - Function to run after each test
   */
  afterEach(fn) {
    this.afterEachFns.push(fn);
    return this;
  }

  /**
   * Add a function to run before all tests
   * @param {Function} fn - Function to run before all tests
   */
  beforeAll(fn) {
    this.beforeAllFns.push(fn);
    return this;
  }

  /**
   * Add a function to run after all tests
   * @param {Function} fn - Function to run after all tests
   */
  afterAll(fn) {
    this.afterAllFns.push(fn);
    return this;
  }

  /**
   * Run all tests in the suite
   * @returns {Promise<Object>} Test results
   */
  async run() {
    console.log(`\n🧪 Running test suite: ${this.name}`);
    
    const results = {
      name: this.name,
      passed: 0,
      failed: 0,
      skipped: 0,
      total: this.tests.length,
      tests: [],
      startTime: new Date(),
      endTime: null,
      duration: 0
    };
    
    try {
      // Run beforeAll hooks
      for (const fn of this.beforeAllFns) {
        await fn();
      }
      
      // Run tests
      if (this.options.parallel) {
        // Run tests in parallel
        const testPromises = this.tests.map(test => this._runTest(test, results));
        await Promise.all(testPromises);
      } else {
        // Run tests sequentially
        for (const test of this.tests) {
          await this._runTest(test, results);
        }
      }
    } finally {
      // Run afterAll hooks
      for (const fn of this.afterAllFns) {
        await fn();
      }
    }
    
    results.endTime = new Date();
    results.duration = results.endTime - results.startTime;
    
    // Print summary
    console.log(`\n📊 Test suite summary: ${this.name}`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`⏭️ Skipped: ${results.skipped}`);
    console.log(`⏱️ Duration: ${results.duration}ms`);
    
    return results;
  }

  /**
   * Run a single test
   * @private
   * @param {Object} test - Test to run
   * @param {Object} results - Results object to update
   */
  async _runTest(test, results) {
    const testResult = {
      description: test.description,
      status: 'pending',
      error: null,
      duration: 0,
      retries: 0
    };
    
    // Skip test if marked as skip
    if (test.options.skip) {
      testResult.status = 'skipped';
      results.skipped++;
      results.tests.push(testResult);
      console.log(`  ⏭️ SKIPPED: ${test.description}`);
      return;
    }
    
    let success = false;
    let attempt = 0;
    const maxAttempts = test.options.retries + 1;
    
    while (!success && attempt < maxAttempts) {
      if (attempt > 0) {
        console.log(`  🔄 Retry ${attempt}/${test.options.retries}: ${test.description}`);
      }
      
      attempt++;
      testResult.retries = attempt - 1;
      
      const startTime = new Date();
      
      try {
        // Set up test timeout
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error(`Test timed out after ${test.options.timeout}ms`));
          }, test.options.timeout);
        });
        
        // Run beforeEach hooks
        for (const fn of this.beforeEachFns) {
          await fn();
        }
        
        try {
          // Run the test with timeout
          await Promise.race([
            test.fn(),
            timeoutPromise
          ]);
          
          success = true;
          testResult.status = 'passed';
          results.passed++;
          console.log(`  ✅ PASSED: ${test.description}`);
        } finally {
          // Run afterEach hooks
          for (const fn of this.afterEachFns) {
            await fn();
          }
        }
      } catch (error) {
        testResult.error = {
          message: error.message,
          stack: error.stack
        };
        
        if (attempt >= maxAttempts) {
          testResult.status = 'failed';
          results.failed++;
          console.log(`  ❌ FAILED: ${test.description}`);
          console.log(`    Error: ${error.message}`);
        }
      }
      
      const endTime = new Date();
      testResult.duration = endTime - startTime;
    }
    
    results.tests.push(testResult);
  }
}

/**
 * API Testing utilities for testing API integrations
 */
class ApiTester {
  /**
   * Create a new ApiTester
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || '';
    this.headers = options.headers || {};
    this.timeout = options.timeout || 10000;
  }

  /**
   * Set authorization header
   * @param {string} token - Authorization token
   * @param {string} type - Authorization type (default: Bearer)
   * @returns {ApiTester} This ApiTester instance for chaining
   */
  setAuth(token, type = 'Bearer') {
    this.headers.Authorization = `${type} ${token}`;
    return this;
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Response data
   */
  async get(endpoint, params = {}) {
    const url = this._buildUrl(endpoint, params);
    
    const response = await this._fetch(url, {
      method: 'GET',
      headers: this.headers
    });
    
    return this._handleResponse(response);
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise<Object>} Response data
   */
  async post(endpoint, data = {}) {
    const url = this._buildUrl(endpoint);
    
    const response = await this._fetch(url, {
      method: 'POST',
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    return this._handleResponse(response);
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise<Object>} Response data
   */
  async put(endpoint, data = {}) {
    const url = this._buildUrl(endpoint);
    
    const response = await this._fetch(url, {
      method: 'PUT',
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    return this._handleResponse(response);
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise<Object>} Response data
   */
  async delete(endpoint) {
    const url = this._buildUrl(endpoint);
    
    const response = await this._fetch(url, {
      method: 'DELETE',
      headers: this.headers
    });
    
    return this._handleResponse(response);
  }

  /**
   * Build URL with query parameters
   * @private
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {string} Complete URL
   */
  _buildUrl(endpoint, params = {}) {
    const url = new URL(endpoint, this.baseUrl);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    return url.toString();
  }

  /**
   * Fetch with timeout
   * @private
   * @param {string} url - URL to fetch
   * @param {Object} options - Fetch options
   * @returns {Promise<Response>} Fetch response
   */
  async _fetch(url, options) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Handle API response
   * @private
   * @param {Response} response - Fetch response
   * @returns {Promise<Object>} Response data
   */
  async _handleResponse(response) {
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    if (!response.ok) {
      const error = new Error(`API Error: ${response.status} ${response.statusText}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    
    return data;
  }
}

/**
 * Mock API for testing without real API calls
 */
class MockApi {
  /**
   * Create a new MockApi
   */
  constructor() {
    this.routes = new Map();
    this.requestHistory = [];
  }

  /**
   * Add a mock route
   * @param {string} method - HTTP method
   * @param {string} path - URL path pattern
   * @param {Function|Object} handler - Response handler or static response
   * @returns {MockApi} This MockApi instance for chaining
   */
  addRoute(method, path, handler) {
    const key = `${method.toUpperCase()}:${path}`;
    this.routes.set(key, handler);
    return this;
  }

  /**
   * Add a GET route
   * @param {string} path - URL path pattern
   * @param {Function|Object} handler - Response handler or static response
   * @returns {MockApi} This MockApi instance for chaining
   */
  get(path, handler) {
    return this.addRoute('GET', path, handler);
  }

  /**
   * Add a POST route
   * @param {string} path - URL path pattern
   * @param {Function|Object} handler - Response handler or static response
   * @returns {MockApi} This MockApi instance for chaining
   */
  post(path, handler) {
    return this.addRoute('POST', path, handler);
  }

  /**
   * Add a PUT route
   * @param {string} path - URL path pattern
   * @param {Function|Object} handler - Response handler or static response
   * @returns {MockApi} This MockApi instance for chaining
   */
  put(path, handler) {
    return this.addRoute('PUT', path, handler);
  }

  /**
   * Add a DELETE route
   * @param {string} path - URL path pattern
   * @param {Function|Object} handler - Response handler or static response
   * @returns {MockApi} This MockApi instance for chaining
   */
  delete(path, handler) {
    return this.addRoute('DELETE', path, handler);
  }

  /**
   * Handle a request
   * @param {string} method - HTTP method
   * @param {string} path - URL path
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  async handleRequest(method, path, options = {}) {
    const request = {
      method: method.toUpperCase(),
      path,
      options,
      timestamp: new Date()
    };
    
    this.requestHistory.push(request);
    
    // Find matching route
    const key = `${method.toUpperCase()}:${path}`;
    const handler = this.routes.get(key);
    
    if (!handler) {
      throw new Error(`No mock handler for ${method} ${path}`);
    }
    
    // Handle the request
    if (typeof handler === 'function') {
      return handler(options);
    } else {
      return handler;
    }
  }

  /**
   * Clear request history
   */
  clearHistory() {
    this.requestHistory = [];
  }

  /**
   * Get request history
   * @returns {Array} Request history
   */
  getHistory() {
    return [...this.requestHistory];
  }

  /**
   * Create an API tester that uses this mock API
   * @returns {ApiTester} API tester with mock implementation
   */
  createTester() {
    const mockApi = this;
    
    return {
      setAuth: () => this,
      get: (endpoint, params = {}) => mockApi.handleRequest('GET', endpoint, { params }),
      post: (endpoint, data = {}) => mockApi.handleRequest('POST', endpoint, { data }),
      put: (endpoint, data = {}) => mockApi.handleRequest('PUT', endpoint, { data }),
      delete: (endpoint) => mockApi.handleRequest('DELETE', endpoint, {})
    };
  }
}

/**
 * Test runner for executing test suites
 */
class TestRunner {
  /**
   * Create a new TestRunner
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.suites = [];
    this.options = {
      reporter: options.reporter || 'console',
      parallel: options.parallel || false,
      ...options
    };
  }

  /**
   * Add a test suite
   * @param {TestSuite} suite - Test suite to add
   * @returns {TestRunner} This TestRunner instance for chaining
   */
  addSuite(suite) {
    this.suites.push(suite);
    return this;
  }

  /**
   * Create and add a new test suite
   * @param {string} name - Suite name
   * @param {Object} options - Suite options
   * @returns {TestSuite} The created test suite
   */
  createSuite(name, options = {}) {
    const suite = new TestSuite(name, options);
    this.addSuite(suite);
    return suite;
  }

  /**
   * Run all test suites
   * @returns {Promise<Object>} Test results
   */
  async run() {
    console.log(`\n🚀 Starting test run with ${this.suites.length} suites`);
    
    const results = {
      suites: [],
      passed: 0,
      failed: 0,
      skipped: 0,
      total: 0,
      startTime: new Date(),
      endTime: null,
      duration: 0
    };
    
    if (this.options.parallel) {
      // Run suites in parallel
      const suitePromises = this.suites.map(suite => suite.run());
      const suiteResults = await Promise.all(suitePromises);
      results.suites = suiteResults;
    } else {
      // Run suites sequentially
      for (const suite of this.suites) {
        const suiteResult = await suite.run();
        results.suites.push(suiteResult);
      }
    }
    
    // Aggregate results
    results.suites.forEach(suite => {
      results.passed += suite.passed;
      results.failed += suite.failed;
      results.skipped += suite.skipped;
      results.total += suite.total;
    });
    
    results.endTime = new Date();
    results.duration = results.endTime - results.startTime;
    
    // Report results
    this._report(results);
    
    return results;
  }

  /**
   * Report test results
   * @private
   * @param {Object} results - Test results
   */
  _report(results) {
    console.log(`\n📋 Test Run Summary`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`⏭️ Skipped: ${results.skipped}`);
    console.log(`🧪 Total: ${results.total}`);
    console.log(`⏱️ Duration: ${results.duration}ms`);
    
    if (results.failed > 0) {
      console.log(`\n❌ Failed Tests:`);
      
      results.suites.forEach(suite => {
        const failedTests = suite.tests.filter(test => test.status === 'failed');
        
        if (failedTests.length > 0) {
          console.log(`\n  Suite: ${suite.name}`);
          
          failedTests.forEach(test => {
            console.log(`    ❌ ${test.description}`);
            console.log(`      Error: ${test.error.message}`);
          });
        }
      });
    }
  }
}

// Example test suite for SecureTokenManager
const createSecureTokenManagerTests = () => {
  const suite = new TestSuite('SecureTokenManager');
  
  // Mock dependencies
  let tokenManager;
  let mockTokenStore;
  
  suite.beforeEach(() => {
    // Create mock token store
    mockTokenStore = {
      saveToken: sinon.stub().resolves({ id: 'token1' }),
      getToken: sinon.stub().resolves({
        userId: 'user1',
        platform: 'instagram',
        encryptedToken: 'encrypted',
        iv: 'iv',
        authTag: 'authTag',
        expiresAt: new Date(Date.now() + 86400000).toISOString()
      }),
      updateTokenHealth: sinon.stub().resolves({}),
      deleteToken: sinon.stub().resolves(true)
    };
    
    // Create token manager with mock store
    const SecureTokenManager = require('../security/secure-token-management');
    tokenManager = new SecureTokenManager({
      encryptionKey: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      tokenStore: mockTokenStore
    });
  });
  
  suite.test('should encrypt and decrypt tokens correctly', async () => {
    const token = 'test-token';
    const userId = 'user1';
    const platform = 'instagram';
    
    const encrypted = tokenManager.encryptToken(token, userId, platform);
    
    expect(encrypted).to.have.property('encryptedToken');
    expect(encrypted).to.have.property('iv');
    expect(encrypted).to.have.property('authTag');
    
    const decrypted = tokenManager.decryptToken(encrypted);
    
    expect(decrypted).to.equal(token);
  });
  
  suite.test('should store tokens securely', async () => {
    const token = 'test-token';
    const userId = 'user1';
    const platform = 'instagram';
    
    await tokenManager.storeToken(token, userId, platform);
    
    expect(mockTokenStore.saveToken.calledOnce).to.be.true;
    
    const savedToken = mockTokenStore.saveToken.firstCall.args[0];
    expect(savedToken).to.have.property('userId', userId);
    expect(savedToken).to.have.property('platform', platform);
    expect(savedToken).to.have.property('encryptedToken');
  });
  
  suite.test('should retrieve and decrypt tokens', async () => {
    const userId = 'user1';
    const platform = 'instagram';
    
    // Mock the decryptToken method
    sinon.stub(tokenManager, 'decryptToken').returns('decrypted-token');
    
    const token = await tokenManager.getToken(userId, platform);
    
    expect(mockTokenStore.getToken.calledWith(userId, platform)).to.be.true;
    expect(token).to.equal('decrypted-token');
  });
  
  suite.test('should throw error for expired tokens', async () => {
    const userId = 'user1';
    const platform = 'instagram';
    
    // Mock expired token
    mockTokenStore.getToken.resolves({
      userId,
      platform,
      encryptedToken: 'encrypted',
      iv: 'iv',
      authTag: 'authTag',
      expiresAt: new Date(Date.now() - 86400000).toISOString() // Expired yesterday
    });
    
    try {
      await tokenManager.getToken(userId, platform);
      // Should not reach here
      expect.fail('Should throw error for expired token');
    } catch (error) {
      expect(error.message).to.include('expired');
      expect(mockTokenStore.updateTokenHealth.calledWith(userId, platform, 'expired')).to.be.true;
    }
  });
  
  return suite;
};

// Example test suite for ApiRateLimiter
const createApiRateLimiterTests = () => {
  const suite = new TestSuite('ApiRateLimiter');
  
  let rateLimiter;
  let mockStorage;
  
  suite.beforeEach(() => {
    // Create mock storage
    mockStorage = {
      getCount: sinon.stub().resolves(0),
      incrementCount: sinon.stub().resolves(1),
      getTTL: sinon.stub().resolves(3600)
    };
    
    // Create rate limiter with mock storage
    const { ApiRateLimiter } = require('../security/api-rate-limiter');
    rateLimiter = new ApiRateLimiter({
      storage: mockStorage
    });
  });
  
  suite.test('should allow requests within rate limits', async () => {
    const userId = 'user1';
    const platform = 'instagram';
    const endpoint = 'media/publish';
    
    const canMakeRequest = await rateLimiter.canMakeRequest(userId, platform, endpoint);
    
    expect(canMakeRequest).to.be.true;
    expect(mockStorage.getCount.called).to.be.true;
  });
  
  suite.test('should block requests exceeding rate limits', async () => {
    const userId = 'user1';
    const platform = 'instagram';
    const endpoint = 'media/publish';
    
    // Mock storage to return count exceeding limit
    mockStorage.getCount.resolves(30); // Exceeds the 25/hour limit
    
    const canMakeRequest = await rateLimiter.canMakeRequest(userId, platform, endpoint);
    
    expect(canMakeRequest).to.be.false;
  });
  
  suite.test('should record requests and update limits', async () => {
    const userId = 'user1';
    const platform = 'instagram';
    const endpoint = 'media/publish';
    
    const result = await rateLimiter.recordRequest(userId, platform, endpoint);
    
    expect(result.recorded).to.be.true;
    expect(result.platform).to.equal(platform);
    expect(result.endpoint).to.equal(endpoint);
    expect(result.limits).to.have.property('1h');
    expect(mockStorage.incrementCount.called).to.be.true;
  });
  
  return suite;
};

// Example test suite for BulkUploadProcessor
const createBulkUploadProcessorTests = () => {
  const suite = new TestSuite('BulkUploadProcessor');
  
  let uploadProcessor;
  let mockStorage;
  let mockDatabase;
  
  suite.beforeEach(() => {
    // Create mock storage
    mockStorage = {
      initializeUpload: sinon.stub().resolves({ sessionId: 'session1' }),
      uploadChunk: sinon.stub().resolves({}),
      finalizeUpload: sinon.stub().resolves({ url: 'https://example.com/file.jpg' })
    };
    
    // Create mock database
    mockDatabase = {
      createBatch: sinon.stub().resolves({ id: 'batch1' }),
      getBatch: sinon.stub().resolves({
        id: 'batch1',
        userId: 'user1',
        totalFiles: 2,
        completedFiles: 0,
        status: 'queued'
      }),
      updateBatch: sinon.stub().resolves({}),
      getBatchTasks: sinon.stub().resolves([
        { id: 'task1', status: 'queued', progress: 0 },
        { id: 'task2', status: 'queued', progress: 0 }
      ]),
      updateTask: sinon.stub().resolves({})
    };
    
    // Create upload processor with mocks
    const BulkUploadProcessor = require('../performance/bulk-upload-processor');
    uploadProcessor = new BulkUploadProcessor({
      storage: mockStorage,
      database: mockDatabase,
      chunkSize: 1024, // Small chunk size for testing
      concurrentUploads: 2
    });
  });
  
  suite.test('should add files to upload queue', async () => {
    const files = [
      { name: 'file1.jpg', size: 1024, type: 'image/jpeg' },
      { name: 'file2.jpg', size: 2048, type: 'image/jpeg' }
    ];
    const userId = 'user1';
    
    const result = await uploadProcessor.addToQueue(files, userId);
    
    expect(result).to.have.property('batchId');
    expect(result).to.have.property('totalFiles', 2);
    expect(mockDatabase.createBatch.calledOnce).to.be.true;
  });
  
  suite.test('should get batch status', async () => {
    const batchId = 'batch1';
    
    const status = await uploadProcessor.getBatchStatus(batchId);
    
    expect(status).to.have.property('id', batchId);
    expect(status).to.have.property('tasks').with.lengthOf(2);
    expect(mockDatabase.getBatch.calledWith(batchId)).to.be.true;
    expect(mockDatabase.getBatchTasks.calledWith(batchId)).to.be.true;
  });
  
  suite.test('should cancel batch upload', async () => {
    const batchId = 'batch1';
    
    const result = await uploadProcessor.cancelBatch(batchId);
    
    expect(result).to.have.property('batchId', batchId);
    expect(result).to.have.property('status', 'cancelled');
    expect(mockDatabase.updateBatch.calledWith(batchId, sinon.match({ status: 'cancelled' }))).to.be.true;
  });
  
  return suite;
};

// Example test suite for ErrorRecoverySystem
const createErrorRecoverySystemTests = () => {
  const suite = new TestSuite('ErrorRecoverySystem');
  
  let errorRecovery;
  let mockLogger;
  let mockStorage;
  
  suite.beforeEach(() => {
    // Create mock logger
    mockLogger = {
      info: sinon.stub(),
      error: sinon.stub(),
      warn: sinon.stub()
    };
    
    // Create mock storage
    mockStorage = {
      logError: sinon.stub().resolves({}),
      logCircuitBreakerStateChange: sinon.stub().resolves({})
    };
    
    // Create error recovery system with mocks
    const { ErrorRecoverySystem } = require('../error_handling/error-recovery-system');
    errorRecovery = new ErrorRecoverySystem({
      logger: mockLogger,
      storage: mockStorage
    });
  });
  
  suite.test('should create circuit breaker', () => {
    const serviceName = 'testService';
    const fn = async () => 'result';
    
    const circuitBreaker = errorRecovery.createCircuitBreaker(serviceName, fn);
    
    expect(circuitBreaker).to.have.property('exec');
    expect(circuitBreaker).to.have.property('reset');
    expect(circuitBreaker).to.have.property('getStatus');
  });
  
  suite.test('should handle network errors', async () => {
    const error = new Error('Connection refused');
    error.code = 'ECONNREFUSED';
    
    const context = { operation: 'testOperation' };
    
    const result = await errorRecovery.handleError(error, context);
    
    expect(result).to.have.property('handled', true);
    expect(result).to.have.property('recovery', 'retry');
    expect(result).to.have.property('retriable', true);
    expect(mockLogger.error.calledOnce).to.be.true;
    expect(mockStorage.logError.calledOnce).to.be.true;
  });
  
  suite.test('should handle authentication errors', async () => {
    const error = new Error('Unauthorized');
    error.status = 401;
    
    const context = { operation: 'testOperation' };
    
    const result = await errorRecovery.handleError(error, context);
    
    expect(result).to.have.property('handled', true);
    expect(result).to.have.property('recovery', 'auth_failed');
    expect(result).to.have.property('retriable', false);
  });
  
  suite.test('should handle rate limit errors', async () => {
    const error = new Error('Rate limit exceeded');
    error.status = 429;
    error.headers = { 'retry-after': '60' };
    
    const context = { operation: 'testOperation' };
    
    const result = await errorRecovery.handleError(error, context);
    
    expect(result).to.have.property('handled', true);
    expect(result).to.have.property('recovery', 'rate_limited');
    expect(result).to.have.property('retriable', true);
    expect(result).to.have.property('retryDelay').that.is.a('number');
  });
  
  return suite;
};

// Create and run test suites
const runTests = async () => {
  const runner = new TestRunner();
  
  // Add test suites
  runner.addSuite(createSecureTokenManagerTests());
  runner.addSuite(createApiRateLimiterTests());
  runner.addSuite(createBulkUploadProcessorTests());
  runner.addSuite(createErrorRecoverySystemTests());
  
  // Run tests
  const results = await runner.run();
  
  return results;
};

module.exports = {
  TestSuite,
  ApiTester,
  MockApi,
  TestRunner,
  runTests
};
