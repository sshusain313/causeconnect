// Configuration for API endpoints

// Get API URL from environment variables if available
const getApiUrl = () => {
  // First priority: Environment variable
  if (import.meta.env.VITE_API_URL) {
    console.log('Using API URL from environment variable:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  
  // Second priority: Production URL if in production mode
  if (import.meta.env.PROD) {
    return 'https://causeconnect-mp9a.onrender.com/api';
  }
  
  // Default: Local development
  console.log('Using default local API URL');
  return '/api'; // This will be proxied through Vite
};

const config = {
  apiUrl: getApiUrl(),
  defaultImagePath: '/totebag.png',
  // Add other configuration values here
};

console.log('Application config:', config);
export default config;
