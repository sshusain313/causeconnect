/**
 * Application configuration
 * Handles environment-specific settings
 */

interface Config {
  apiUrl: string;
  uploadsUrl: string;
  isProduction: boolean;
}

// Determine if we're in production or development
// Check if we're running on changebag.org or localhost
const isProduction = import.meta.env.PROD || window.location.hostname === 'changebag.org' || window.location.hostname === 'www.changebag.org';

// Base domain for API requests
// In production, use api.changebag.org if that's where the API is hosted
const apiDomain = isProduction ? 'https://api.changebag.org' : 'http://localhost:5000';

const config: Config = {
  // Always use the base API URL without specific endpoints
  apiUrl: `${apiDomain}/api`,
  uploadsUrl: `${apiDomain}/uploads`,
  isProduction
};

console.log('App config:', { 
  isProduction, 
  apiUrl: config.apiUrl, 
  uploadsUrl: config.uploadsUrl,
  hostname: window.location.hostname,
  apiDomain
});

export default config;
