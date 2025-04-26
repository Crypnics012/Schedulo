// token-store-airtable.js

/**
 * Airtable implementation of token storage for Schedulo Pro
 * 
 * This module provides an Airtable-based storage backend for the SecureTokenManager
 */

class AirtableTokenStore {
  /**
   * Create a new AirtableTokenStore
   * @param {Object} options - Configuration options
   * @param {Object} options.airtable - Airtable instance
   * @param {string} options.baseId - Airtable base ID
   * @param {string} options.tableName - Airtable table name for token storage
   */
  constructor(options) {
    if (!options.airtable) {
      throw new Error('Airtable instance is required');
    }
    
    this.airtable = options.airtable;
    this.baseId = options.baseId;
    this.tableName = options.tableName || 'TokenStorage';
    this.base = this.airtable.base(this.baseId);
    this.table = this.base(this.tableName);
  }

  /**
   * Save a token to Airtable
   * @param {Object} tokenData - The token data to save
   * @returns {Promise<Object>} The saved token data with Airtable record ID
   */
  async saveToken(tokenData) {
    try {
      // Check if token already exists for this user and platform
      const existingToken = await this.getToken(tokenData.userId, tokenData.platform);
      
      if (existingToken) {
        // Update existing token
        const record = await this.table.update(existingToken.recordId, {
          encryptedToken: tokenData.encryptedToken,
          iv: tokenData.iv,
          authTag: tokenData.authTag,
          expiresAt: tokenData.expiresAt,
          lastVerified: tokenData.lastVerified,
          tokenHealth: tokenData.tokenHealth,
          updatedAt: new Date().toISOString(),
          ...this._extractAdditionalMetadata(tokenData)
        });
        
        return {
          ...tokenData,
          recordId: record.id
        };
      } else {
        // Create new token record
        const record = await this.table.create({
          userId: tokenData.userId,
          platform: tokenData.platform,
          encryptedToken: tokenData.encryptedToken,
          iv: tokenData.iv,
          authTag: tokenData.authTag,
          createdAt: tokenData.createdAt,
          expiresAt: tokenData.expiresAt,
          lastVerified: tokenData.lastVerified,
          tokenHealth: tokenData.tokenHealth,
          ...this._extractAdditionalMetadata(tokenData)
        });
        
        return {
          ...tokenData,
          recordId: record.id
        };
      }
    } catch (error) {
      throw new Error(`Failed to save token to Airtable: ${error.message}`);
    }
  }

  /**
   * Get a token from Airtable
   * @param {string} userId - The user ID
   * @param {string} platform - The platform
   * @returns {Promise<Object|null>} The token data or null if not found
   */
  async getToken(userId, platform) {
    try {
      const records = await this.table.select({
        filterByFormula: `AND({userId} = '${userId}', {platform} = '${platform}')`,
        maxRecords: 1
      }).firstPage();
      
      if (records.length === 0) {
        return null;
      }
      
      const record = records[0];
      
      return {
        recordId: record.id,
        userId: record.get('userId'),
        platform: record.get('platform'),
        encryptedToken: record.get('encryptedToken'),
        iv: record.get('iv'),
        authTag: record.get('authTag'),
        createdAt: record.get('createdAt'),
        expiresAt: record.get('expiresAt'),
        lastVerified: record.get('lastVerified'),
        tokenHealth: record.get('tokenHealth'),
        ...this._extractRecordMetadata(record)
      };
    } catch (error) {
      throw new Error(`Failed to get token from Airtable: ${error.message}`);
    }
  }

  /**
   * Update token health status
   * @param {string} userId - The user ID
   * @param {string} platform - The platform
   * @param {string} health - The new health status
   * @param {Object} additionalData - Additional data to update
   * @returns {Promise<Object>} The updated token data
   */
  async updateTokenHealth(userId, platform, health, additionalData = {}) {
    try {
      const token = await this.getToken(userId, platform);
      
      if (!token) {
        throw new Error(`No token found for user ${userId} on platform ${platform}`);
      }
      
      const record = await this.table.update(token.recordId, {
        tokenHealth: health,
        updatedAt: new Date().toISOString(),
        ...additionalData
      });
      
      return {
        ...token,
        tokenHealth: health,
        updatedAt: new Date().toISOString(),
        ...additionalData
      };
    } catch (error) {
      throw new Error(`Failed to update token health in Airtable: ${error.message}`);
    }
  }

  /**
   * Delete a token from Airtable
   * @param {string} userId - The user ID
   * @param {string} platform - The platform
   * @returns {Promise<boolean>} Success status
   */
  async deleteToken(userId, platform) {
    try {
      const token = await this.getToken(userId, platform);
      
      if (!token) {
        return true; // Already deleted
      }
      
      await this.table.destroy(token.recordId);
      
      return true;
    } catch (error) {
      throw new Error(`Failed to delete token from Airtable: ${error.message}`);
    }
  }

  /**
   * Get all tokens for a user
   * @param {string} userId - The user ID
   * @returns {Promise<Array>} Array of token data objects
   */
  async getUserTokens(userId) {
    try {
      const records = await this.table.select({
        filterByFormula: `{userId} = '${userId}'`
      }).firstPage();
      
      return records.map(record => ({
        recordId: record.id,
        userId: record.get('userId'),
        platform: record.get('platform'),
        encryptedToken: record.get('encryptedToken'),
        iv: record.get('iv'),
        authTag: record.get('authTag'),
        createdAt: record.get('createdAt'),
        expiresAt: record.get('expiresAt'),
        lastVerified: record.get('lastVerified'),
        tokenHealth: record.get('tokenHealth'),
        ...this._extractRecordMetadata(record)
      }));
    } catch (error) {
      throw new Error(`Failed to get user tokens from Airtable: ${error.message}`);
    }
  }

  /**
   * Get all tokens that need refresh (expiring soon)
   * @param {number} daysThreshold - Days before expiry to consider for refresh
   * @returns {Promise<Array>} Array of token data objects
   */
  async getTokensNeedingRefresh(daysThreshold = 7) {
    try {
      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
      
      const records = await this.table.select({
        filterByFormula: `AND({expiresAt} < '${thresholdDate.toISOString()}', {tokenHealth} = 'valid')`
      }).firstPage();
      
      return records.map(record => ({
        recordId: record.id,
        userId: record.get('userId'),
        platform: record.get('platform'),
        encryptedToken: record.get('encryptedToken'),
        iv: record.get('iv'),
        authTag: record.get('authTag'),
        createdAt: record.get('createdAt'),
        expiresAt: record.get('expiresAt'),
        lastVerified: record.get('lastVerified'),
        tokenHealth: record.get('tokenHealth'),
        ...this._extractRecordMetadata(record)
      }));
    } catch (error) {
      throw new Error(`Failed to get tokens needing refresh from Airtable: ${error.message}`);
    }
  }

  /**
   * Extract additional metadata from token data
   * @private
   * @param {Object} tokenData - The token data
   * @returns {Object} Additional metadata
   */
  _extractAdditionalMetadata(tokenData) {
    const metadata = {};
    const reservedFields = [
      'userId', 'platform', 'encryptedToken', 'iv', 'authTag',
      'createdAt', 'expiresAt', 'lastVerified', 'tokenHealth', 'recordId'
    ];
    
    Object.keys(tokenData).forEach(key => {
      if (!reservedFields.includes(key)) {
        metadata[key] = tokenData[key];
      }
    });
    
    return metadata;
  }

  /**
   * Extract additional metadata from Airtable record
   * @private
   * @param {Object} record - The Airtable record
   * @returns {Object} Additional metadata
   */
  _extractRecordMetadata(record) {
    const metadata = {};
    const reservedFields = [
      'userId', 'platform', 'encryptedToken', 'iv', 'authTag',
      'createdAt', 'expiresAt', 'lastVerified', 'tokenHealth'
    ];
    
    Object.keys(record.fields).forEach(key => {
      if (!reservedFields.includes(key)) {
        metadata[key] = record.get(key);
      }
    });
    
    return metadata;
  }
}

module.exports = AirtableTokenStore;
