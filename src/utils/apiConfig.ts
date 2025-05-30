/**
 * API Configuration Utility
 * 
 * This file centralizes all API URL configuration to avoid hardcoded localhost URLs
 * throughout the codebase. It uses environment variables to determine the correct
 * base URL for API requests in different environments.
 */

// Get the API base URL from environment variables or use a fallback
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get the uploads URL from environment variables or construct it from API base
export const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000/uploads';

// Get the site URL for absolute links
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:8083';

/**
 * Creates a full API endpoint URL
 * @param endpoint - The API endpoint path (without leading slash)
 * @returns The complete API URL
 */
export const apiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

/**
 * Creates a full URL for uploaded files
 * @param filePath - The file path (without leading slash)
 * @returns The complete uploads URL
 */
export const uploadsUrl = (filePath: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
  return `${UPLOADS_BASE_URL}/${cleanPath}`;
};

/**
 * Environment detection helpers
 */
export const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';
export const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production';

export default {
  API_BASE_URL,
  UPLOADS_BASE_URL,
  SITE_URL,
  apiUrl,
  uploadsUrl,
  isDevelopment,
  isProduction
};
