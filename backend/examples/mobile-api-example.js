/**
 * Example API client for mobile applications
 * This can be adapted for React Native, Flutter, iOS, or Android
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

class MobileApiClient {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.baseURL = API_BASE_URL;
  }

  /**
   * Set authentication tokens
   */
  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    // Store securely in mobile app (Keychain/Keystore)
    // Example: await SecureStore.setItemAsync('accessToken', accessToken);
  }

  /**
   * Get stored tokens
   */
  async getStoredTokens() {
    // Retrieve from secure storage
    // Example: this.accessToken = await SecureStore.getItemAsync('accessToken');
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
    };
  }

  /**
   * Make API request with automatic token refresh
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const tokens = await this.getStoredTokens();
    
    const headers = {
      'Content-Type': 'application/json',
      'X-Mobile-App': 'true',
      'X-Platform': 'react-native', // or 'ios', 'android'
      'X-App-Version': '1.0.0',
      ...options.headers,
    };

    if (tokens.accessToken) {
      headers['Authorization'] = `Bearer ${tokens.accessToken}`;
    }

    try {
      let response = await fetch(url, {
        ...options,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      // Handle token expiration
      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry original request with new token
          const newTokens = await this.getStoredTokens();
          headers['Authorization'] = `Bearer ${newTokens.accessToken}`;
          response = await fetch(url, {
            ...options,
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined,
          });
        } else {
          // Refresh failed, redirect to login
          throw new Error('Authentication failed. Please login again.');
        }
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken() {
    try {
      const tokens = await this.getStoredTokens();
      if (!tokens.refreshToken) {
        return false;
      }

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: tokens.refreshToken,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        this.setTokens(
          data.data.accessToken,
          data.data.refreshToken
        );
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  // Authentication methods
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    
    if (data.success) {
      this.setTokens(data.data.accessToken, data.data.refreshToken);
    }
    
    return data;
  }

  async logout() {
    const result = await this.request('/auth/logout', {
      method: 'POST',
    });
    
    // Clear tokens
    this.accessToken = null;
    this.refreshToken = null;
    // Clear from secure storage
    
    return result;
  }

  // User methods
  async getProfile() {
    return this.request('/users/me');
  }

  async updateProfile(profileData) {
    return this.request('/users/me', {
      method: 'PUT',
      body: profileData,
    });
  }

  // Payment methods
  async createRazorpayOrder(amount, currency = 'INR') {
    return this.request('/payments/razorpay/create-order', {
      method: 'POST',
      body: { amount, currency },
    });
  }

  async verifyRazorpayPayment(orderId, paymentId, signature) {
    return this.request('/payments/razorpay/verify', {
      method: 'POST',
      body: { orderId, paymentId, signature },
    });
  }

  async createStripePayment(amount, currency = 'usd') {
    return this.request('/payments/stripe/create-payment', {
      method: 'POST',
      body: { amount, currency },
    });
  }

  // File upload
  async uploadFile(fileUri, fileType) {
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      type: fileType,
      name: 'file.jpg',
    });

    const tokens = await this.getStoredTokens();
    
    return fetch(`${this.baseURL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`,
        'Content-Type': 'multipart/form-data',
        'X-Mobile-App': 'true',
      },
      body: formData,
    }).then(res => res.json());
  }

  async getFileUrl(fileKey, expiresIn = 3600) {
    return this.request(`/upload/${fileKey}?expiresIn=${expiresIn}`);
  }
}

// Export singleton instance
export default new MobileApiClient();

// Usage example:
/*
import apiClient from './mobile-api-example';

// Login
const loginResult = await apiClient.login('user@example.com', 'password123');
console.log('Login successful:', loginResult);

// Get profile
const profile = await apiClient.getProfile();
console.log('User profile:', profile);

// Upload file
const uploadResult = await apiClient.uploadFile('/path/to/image.jpg', 'image/jpeg');
console.log('File uploaded:', uploadResult);
*/

