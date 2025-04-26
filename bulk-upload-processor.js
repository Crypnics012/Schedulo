// bulk-upload-processor.js

/**
 * Bulk Upload Processor for Schedulo Pro
 * 
 * This module provides optimized handling for bulk media uploads,
 * supporting up to 90 simultaneous files with progress tracking,
 * chunked uploads, and background processing.
 */

class BulkUploadProcessor {
  /**
   * Create a new BulkUploadProcessor
   * @param {Object} options - Configuration options
   * @param {Object} options.storage - Storage provider (e.g., Cloudinary)
   * @param {Object} options.database - Database provider (e.g., Airtable)
   * @param {number} options.chunkSize - Size of upload chunks in bytes (default: 1MB)
   * @param {number} options.concurrentUploads - Maximum concurrent uploads (default: 3)
   * @param {number} options.maxRetries - Maximum retry attempts (default: 3)
   */
  constructor(options = {}) {
    this.storage = options.storage;
    if (!this.storage) {
      throw new Error('Storage provider is required');
    }
    
    this.database = options.database;
    if (!this.database) {
      throw new Error('Database provider is required');
    }
    
    this.chunkSize = options.chunkSize || 1024 * 1024; // 1MB default
    this.concurrentUploads = options.concurrentUploads || 3;
    this.maxRetries = options.maxRetries || 3;
    
    this.activeUploads = new Map();
    this.uploadQueue = [];
    this.processingQueue = false;
  }

  /**
   * Add files to the upload queue
   * @param {Array} files - Array of file objects to upload
   * @param {string} userId - User ID associated with the upload
   * @param {Object} metadata - Additional metadata for the uploads
   * @returns {Promise<Object>} Upload batch information
   */
  async addToQueue(files, userId, metadata = {}) {
    if (!Array.isArray(files) || files.length === 0) {
      throw new Error('Files array is required and must not be empty');
    }
    
    if (files.length > 90) {
      throw new Error('Maximum of 90 files can be uploaded at once');
    }
    
    // Generate batch ID
    const batchId = this._generateBatchId();
    
    // Create upload tasks for each file
    const uploadTasks = files.map((file, index) => ({
      id: `${batchId}-${index}`,
      batchId,
      userId,
      file,
      status: 'queued',
      progress: 0,
      metadata: {
        ...metadata,
        originalFilename: file.name,
        fileSize: file.size,
        fileType: file.type,
        queuePosition: index
      },
      createdAt: new Date().toISOString(),
      retryCount: 0
    }));
    
    // Store batch information in database
    await this.database.createBatch({
      id: batchId,
      userId,
      totalFiles: files.length,
      completedFiles: 0,
      status: 'queued',
      metadata,
      createdAt: new Date().toISOString()
    });
    
    // Add tasks to queue
    this.uploadQueue.push(...uploadTasks);
    
    // Start processing queue if not already processing
    if (!this.processingQueue) {
      this._processQueue();
    }
    
    return {
      batchId,
      totalFiles: files.length,
      status: 'queued'
    };
  }

  /**
   * Get status of a batch upload
   * @param {string} batchId - Batch ID to check
   * @returns {Promise<Object>} Batch status information
   */
  async getBatchStatus(batchId) {
    const batch = await this.database.getBatch(batchId);
    
    if (!batch) {
      throw new Error(`Batch ${batchId} not found`);
    }
    
    // Get all upload tasks for this batch
    const tasks = await this.database.getBatchTasks(batchId);
    
    // Calculate overall progress
    const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0);
    const averageProgress = tasks.length > 0 ? totalProgress / tasks.length : 0;
    
    return {
      ...batch,
      tasks,
      overallProgress: Math.round(averageProgress)
    };
  }

  /**
   * Cancel a batch upload
   * @param {string} batchId - Batch ID to cancel
   * @returns {Promise<Object>} Cancellation result
   */
  async cancelBatch(batchId) {
    // Update batch status in database
    await this.database.updateBatch(batchId, {
      status: 'cancelled',
      updatedAt: new Date().toISOString()
    });
    
    // Remove pending tasks from queue
    this.uploadQueue = this.uploadQueue.filter(task => task.batchId !== batchId);
    
    // Cancel active uploads for this batch
    const activeTasks = Array.from(this.activeUploads.values())
      .filter(task => task.batchId === batchId);
    
    for (const task of activeTasks) {
      this.activeUploads.delete(task.id);
      
      // Update task status in database
      await this.database.updateTask(task.id, {
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      });
    }
    
    return {
      batchId,
      status: 'cancelled',
      cancelledTasks: activeTasks.length + this.uploadQueue.filter(task => task.batchId === batchId).length
    };
  }

  /**
   * Process the upload queue
   * @private
   */
  async _processQueue() {
    this.processingQueue = true;
    
    try {
      while (this.uploadQueue.length > 0 && this.activeUploads.size < this.concurrentUploads) {
        // Get next task from queue
        const task = this.uploadQueue.shift();
        
        // Store in active uploads
        this.activeUploads.set(task.id, task);
        
        // Update task status in database
        await this.database.updateTask(task.id, {
          status: 'processing',
          startedAt: new Date().toISOString()
        });
        
        // Start upload process (don't await to allow concurrent uploads)
        this._uploadFile(task).catch(error => {
          console.error(`Error uploading file ${task.id}:`, error);
        });
      }
      
      // If there are no active uploads and no queued tasks, we're done
      if (this.activeUploads.size === 0 && this.uploadQueue.length === 0) {
        this.processingQueue = false;
      } else if (this.activeUploads.size < this.concurrentUploads && this.uploadQueue.length > 0) {
        // If we can process more uploads, continue
        setImmediate(() => this._processQueue());
      }
    } catch (error) {
      console.error('Error processing upload queue:', error);
      this.processingQueue = false;
    }
  }

  /**
   * Upload a file using chunked upload
   * @private
   * @param {Object} task - Upload task
   */
  async _uploadFile(task) {
    try {
      // Update task status
      task.status = 'uploading';
      await this.database.updateTask(task.id, {
        status: 'uploading'
      });
      
      // Get file data
      const file = task.file;
      const fileSize = file.size;
      const totalChunks = Math.ceil(fileSize / this.chunkSize);
      
      // Initialize upload session with storage provider
      const uploadSession = await this.storage.initializeUpload({
        filename: file.name,
        fileSize,
        fileType: file.type,
        metadata: task.metadata
      });
      
      // Upload chunks
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * this.chunkSize;
        const end = Math.min(fileSize, start + this.chunkSize);
        const chunk = file.slice(start, end);
        
        // Try to upload chunk with retries
        let retries = 0;
        let success = false;
        
        while (!success && retries < this.maxRetries) {
          try {
            await this.storage.uploadChunk({
              sessionId: uploadSession.sessionId,
              chunk,
              chunkIndex,
              totalChunks
            });
            
            success = true;
          } catch (error) {
            retries++;
            
            if (retries >= this.maxRetries) {
              throw error;
            }
            
            // Exponential backoff
            const delay = Math.pow(2, retries) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
        
        // Update progress
        const progress = Math.round((chunkIndex + 1) / totalChunks * 100);
        task.progress = progress;
        
        // Update task progress in database
        await this.database.updateTask(task.id, {
          progress,
          updatedAt: new Date().toISOString()
        });
        
        // Update batch progress
        await this._updateBatchProgress(task.batchId);
      }
      
      // Finalize upload
      const result = await this.storage.finalizeUpload({
        sessionId: uploadSession.sessionId
      });
      
      // Update task status
      task.status = 'completed';
      task.result = result;
      
      await this.database.updateTask(task.id, {
        status: 'completed',
        progress: 100,
        result,
        completedAt: new Date().toISOString()
      });
      
      // Update batch progress and check if complete
      await this._updateBatchProgress(task.batchId);
      
      // Remove from active uploads
      this.activeUploads.delete(task.id);
      
      // Continue processing queue
      setImmediate(() => this._processQueue());
    } catch (error) {
      // Handle upload failure
      task.status = 'failed';
      task.error = error.message;
      task.retryCount++;
      
      await this.database.updateTask(task.id, {
        status: 'failed',
        error: error.message,
        retryCount: task.retryCount,
        updatedAt: new Date().toISOString()
      });
      
      // If we haven't exceeded max retries, add back to queue
      if (task.retryCount < this.maxRetries) {
        task.status = 'queued';
        this.uploadQueue.push(task);
        
        await this.database.updateTask(task.id, {
          status: 'queued',
          updatedAt: new Date().toISOString()
        });
      } else {
        // Update batch to reflect the failure
        await this._updateBatchProgress(task.batchId);
      }
      
      // Remove from active uploads
      this.activeUploads.delete(task.id);
      
      // Continue processing queue
      setImmediate(() => this._processQueue());
    }
  }

  /**
   * Update batch progress
   * @private
   * @param {string} batchId - Batch ID to update
   */
  async _updateBatchProgress(batchId) {
    // Get all tasks for this batch
    const tasks = await this.database.getBatchTasks(batchId);
    
    // Calculate completed files and overall progress
    const completedFiles = tasks.filter(task => task.status === 'completed').length;
    const failedFiles = tasks.filter(task => task.status === 'failed' && task.retryCount >= this.maxRetries).length;
    const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0);
    const averageProgress = tasks.length > 0 ? totalProgress / tasks.length : 0;
    
    // Determine batch status
    let status = 'processing';
    
    if (completedFiles === tasks.length) {
      status = 'completed';
    } else if (completedFiles + failedFiles === tasks.length) {
      status = 'completed_with_errors';
    }
    
    // Update batch in database
    await this.database.updateBatch(batchId, {
      completedFiles,
      failedFiles,
      progress: Math.round(averageProgress),
      status,
      updatedAt: new Date().toISOString(),
      completedAt: status === 'completed' || status === 'completed_with_errors' 
        ? new Date().toISOString() 
        : null
    });
  }

  /**
   * Generate a unique batch ID
   * @private
   * @returns {string} Unique batch ID
   */
  _generateBatchId() {
    return 'batch_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
  }
}

module.exports = BulkUploadProcessor;
