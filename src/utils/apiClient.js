import axios from 'axios';
import config from '@/config';

/**
 * API Client for CauseConnect
 * 
 * This module creates a configured Axios instance that:
 * 1. Uses config.apiUrl for consistent API URLs across environments
 * 2. Includes proper error handling and logging
 * 3. Handles token authentication
 */

// Determine the base URL for API requests using config
const getBaseUrl = () => {
  // Use config.apiUrl for consistent API URLs
  return config.apiUrl;
};

// Create a configured Axios instance
const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for logging and dynamic URL adjustment
apiClient.interceptors.request.use(
  (config) => {
    // Log the request
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    // Always use config.apiUrl for the base URL
    config.baseURL = getBaseUrl();
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging and error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      
      // If there's a connection error, log it but don't try to modify URLs
      // as we're now using config.apiUrl which should be correct
      if (error.config && error.config.url) {
        console.log('Connection error with URL:', error.config.url);
        // Just return the original error
        return Promise.reject(error);
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper methods for common API operations
const api = {
  // GET request
  get: (endpoint, params = {}) => {
    console.log('API Client: Making GET request to', endpoint, 'with params:', params);
    return apiClient.get(endpoint, { params });
  },
  
  // POST request
  post: (endpoint, data = {}) => {
    return apiClient.post(endpoint, data);
  },
  
  // PUT request
  put: (endpoint, data = {}) => {
    return apiClient.put(endpoint, data);
  },
  
  // DELETE request
  delete: (endpoint) => {
    return apiClient.delete(endpoint);
  },
  
  // Upload file
  upload: (endpoint, formData) => {
    return apiClient.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Get the current base URL
  getBaseUrl,
};

export default api;
