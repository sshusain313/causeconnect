// Configuration for API endpoints and assets

// Get API URL based on environment
const getApiUrl = () => {
  // First priority: Environment variable
  if (import.meta.env.VITE_API_URL) {
    console.log('Using API URL from environment variable:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  
  // Second priority: Production URL if in production mode
  if (import.meta.env.PROD) {
    // Use the current domain for API requests
    const currentDomain = window.location.origin;
    console.log('Using current domain for API URL:', `${currentDomain}/api`);
    return `${currentDomain}/api`;
  }
  
  // Default: Local development
  console.log('Using default local API URL');
  return 'http://localhost:5000/api'; // This will be proxied through Vite
};

// Get uploads URL based on environment
const getUploadsUrl = () => {
  // First priority: Environment variable
  if (import.meta.env.VITE_UPLOADS_URL) {
    console.log('Using uploads URL from environment variable:', import.meta.env.VITE_UPLOADS_URL);
    return import.meta.env.VITE_UPLOADS_URL;
  }
  
  // Second priority: Production URL if in production mode
  if (import.meta.env.PROD) {
    return 'https://changebag.org/uploads';
  }
  
  // Default: Local development
  console.log('Using default local uploads URL');
  return 'http://localhost:5000/uploads'; // Use absolute URL for consistency
};

const config = {
  apiUrl: getApiUrl(),
  uploadsUrl: getUploadsUrl(),
  defaultImagePath: '/totebag.png',
  // Add other configuration values here
};

console.log('Application config:', config);
export default config;
