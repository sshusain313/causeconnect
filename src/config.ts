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
const apiDomain = isProduction ? 'https://changebag.org' : 'http://localhost:5000';

const config: Config = {
  // Always use the full URL to ensure it works everywhere
  apiUrl: `${apiDomain}/api/causes`,
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
