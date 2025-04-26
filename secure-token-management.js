// secure-token-management.js

/**
 * Secure Token Management System for Schedulo Pro
 * 
 * This module provides secure token storage, encryption, and management
 * for social media API access tokens.
 */

const crypto = require('crypto');

class SecureTokenManager {
  constructor(options = {}) {
    this.encryptionKey = options.encryptionKey || process.env.TOKEN_ENCRYPTION_KEY;
    if (!this.encryptionKey) {
      throw new Error('Encryption key is required for secure token management');
    }
    
    // Validate encryption key length (32 bytes for AES-256)
    if (Buffer.from(this.encryptionKey, 'hex').length !== 32) {
      throw new Error('Encryption key must be 64 hex characters (32 bytes)');
    }
    
    this.algorithm = 'aes-256-gcm';
    this.tokenStore = options.tokenStore || null; // Interface to storage (Airtable, etc.)
  }

  /**
   * Encrypt a token for secure storage
   * @param {string} token - The plain text token to encrypt
   * @param {string} userId - The user ID associated with this token
   * @param {string} platform - The social media platform for this token
   * @returns {Object} Encrypted token data with metadata
   */
  encryptToken(token, userId, platform) {
    // Generate a random initialization vector
    const iv = crypto.randomBytes(16);
    
    // Create cipher with key, iv, and algorithm
    const cipher = crypto.createCipheriv(
      this.algorithm, 
      Buffer.from(this.encryptionKey, 'hex'), 
      iv
    );
    
    // Encrypt the token
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Get the authentication tag
    const authTag = cipher.getAuthTag();
    
    // Return encrypted token with metadata
    return {
      userId,
      platform,
      encryptedToken: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      createdAt: new Date().toISOString(),
      expiresAt: this._calculateExpiryDate(platform),
      tokenHealth: 'valid'
    };
  }

  /**
   * Decrypt a token for use
   * @param {Object} tokenData - The encrypted token data
   * @returns {string} The decrypted token
   */
  decryptToken(tokenData) {
    try {
      // Create decipher with key, iv, and algorithm
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        Buffer.from(this.encryptionKey, 'hex'),
        Buffer.from(tokenData.iv, 'hex')
      );
      
      // Set auth tag
      decipher.setAuthTag(Buffer.from(tokenData.authTag, 'hex'));
      
      // Decrypt the token
      let decrypted = decipher.update(tokenData.encryptedToken, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      throw new Error(`Token decryption failed: ${error.message}`);
    }
  }

  /**
   * Store a token securely
   * @param {string} token - The plain text token to store
   * @param {string} userId - The user ID associated with this token
   * @param {string} platform - The social media platform for this token
   * @param {Object} metadata - Additional metadata for the token
   * @returns {Promise<Object>} The stored token data (without plain text token)
   */
  async storeToken(token, userId, platform, metadata = {}) {
    // Encrypt the token
    const encryptedData = this.encryptToken(token, userId, platform);
    
    // Merge with additional metadata
    const tokenData = {
      ...encryptedData,
      ...metadata,
      lastVerified: new Date().toISOString()
    };
    
    // Store the token data
    if (this.tokenStore) {
      return await this.tokenStore.saveToken(tokenData);
    }
    
    return tokenData;
  }

  /**
   * Retrieve and decrypt a token
   * @param {string} userId - The user ID associated with the token
   * @param {string} platform - The social media platform for the token
   * @returns {Promise<string>} The decrypted token
   */
  async getToken(userId, platform) {
    if (!this.tokenStore) {
      throw new Error('Token store is required for token retrieval');
    }
    
    // Retrieve the encrypted token data
    const tokenData = await this.tokenStore.getToken(userId, platform);
    
    if (!tokenData) {
      throw new Error(`No token found for user ${userId} on platform ${platform}`);
    }
    
    // Check if token is expired
    if (new Date(tokenData.expiresAt) < new Date()) {
      // Update token health status
      await this.tokenStore.updateTokenHealth(userId, platform, 'expired');
      throw new Error(`Token for user ${userId} on platform ${platform} has expired`);
    }
    
    // Decrypt and return the token
    return this.decryptToken(tokenData);
  }

  /**
   * Refresh a token using the platform's refresh mechanism
   * @param {string} userId - The user ID associated with the token
   * @param {string} platform - The social media platform for the token
   * @param {Function} refreshCallback - Function to call to refresh the token
   * @returns {Promise<Object>} The updated token data
   */
  async refreshToken(userId, platform, refreshCallback) {
    if (!this.tokenStore) {
      throw new Error('Token store is required for token refresh');
    }
    
    // Get the current token data
    const tokenData = await this.tokenStore.getToken(userId, platform);
    
    if (!tokenData) {
      throw new Error(`No token found for user ${userId} on platform ${platform}`);
    }
    
    try {
      // Decrypt the current token
      const currentToken = this.decryptToken(tokenData);
      
      // Call the platform-specific refresh callback
      const newToken = await refreshCallback(currentToken, tokenData);
      
      // Store the new token
      return await this.storeToken(newToken, userId, platform, {
        refreshedAt: new Date().toISOString(),
        previousExpiryDate: tokenData.expiresAt
      });
    } catch (error) {
      // Update token health status
      await this.tokenStore.updateTokenHealth(userId, platform, 'refresh_failed');
      throw new Error(`Token refresh failed for user ${userId} on platform ${platform}: ${error.message}`);
    }
  }

  /**
   * Revoke a token
   * @param {string} userId - The user ID associated with the token
   * @param {string} platform - The social media platform for the token
   * @param {Function} revokeCallback - Function to call to revoke the token on the platform
   * @returns {Promise<boolean>} Success status
   */
  async revokeToken(userId, platform, revokeCallback) {
    if (!this.tokenStore) {
      throw new Error('Token store is required for token revocation');
    }
    
    // Get the current token data
    const tokenData = await this.tokenStore.getToken(userId, platform);
    
    if (!tokenData) {
      return true; // No token to revoke
    }
    
    try {
      // Decrypt the token
      const token = this.decryptToken(tokenData);
      
      // Call the platform-specific revoke callback
      await revokeCallback(token, tokenData);
      
      // Delete the token from storage
      await this.tokenStore.deleteToken(userId, platform);
      
      return true;
    } catch (error) {
      // Update token health status
      await this.tokenStore.updateTokenHealth(userId, platform, 'revoke_failed');
      throw new Error(`Token revocation failed for user ${userId} on platform ${platform}: ${error.message}`);
    }
  }

  /**
   * Verify a token is still valid with the platform
   * @param {string} userId - The user ID associated with the token
   * @param {string} platform - The social media platform for the token
   * @param {Function} verifyCallback - Function to call to verify the token
   * @returns {Promise<Object>} Token health status
   */
  async verifyToken(userId, platform, verifyCallback) {
    if (!this.tokenStore) {
      throw new Error('Token store is required for token verification');
    }
    
    // Get the current token data
    const tokenData = await this.tokenStore.getToken(userId, platform);
    
    if (!tokenData) {
      throw new Error(`No token found for user ${userId} on platform ${platform}`);
    }
    
    try {
      // Decrypt the token
      const token = this.decryptToken(tokenData);
      
      // Call the platform-specific verify callback
      const verifyResult = await verifyCallback(token, tokenData);
      
      // Update token health status
      const health = verifyResult.valid ? 'valid' : 'invalid';
      await this.tokenStore.updateTokenHealth(userId, platform, health, {
        lastVerified: new Date().toISOString(),
        verificationDetails: verifyResult.details || null
      });
      
      return {
        userId,
        platform,
        health,
        expiresAt: tokenData.expiresAt,
        lastVerified: new Date().toISOString()
      };
    } catch (error) {
      // Update token health status
      await this.tokenStore.updateTokenHealth(userId, platform, 'verification_failed');
      throw new Error(`Token verification failed for user ${userId} on platform ${platform}: ${error.message}`);
    }
  }

  /**
   * Calculate expiry date based on platform-specific token lifetimes
   * @private
   * @param {string} platform - The social media platform
   * @returns {string} ISO date string for expiry
   */
  _calculateExpiryDate(platform) {
    const now = new Date();
    let expiryDate = new Date(now);
    
    // Set platform-specific expiry times
    switch (platform.toLowerCase()) {
      case 'instagram':
      case 'facebook':
        // Facebook/Instagram tokens typically last 60 days
        expiryDate.setDate(now.getDate() + 60);
        break;
      case 'twitter':
      case 'x':
        // Twitter/X tokens don't expire unless revoked
        expiryDate.setFullYear(now.getFullYear() + 10); // Set far future date
        break;
      case 'tiktok':
        // TikTok tokens typically last 90 days
        expiryDate.setDate(now.getDate() + 90);
        break;
      default:
        // Default to 30 days for unknown platforms
        expiryDate.setDate(now.getDate() + 30);
    }
    
    return expiryDate.toISOString();
  }
}

module.exports = SecureTokenManager;
