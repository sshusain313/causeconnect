// Configuration for API endpoints
const config = {
  // For local development
  development: {
    apiUrl: 'http://localhost:5000/api',
  },
  // For production deployment
  production: {
    apiUrl: 'https://causeconnect-api.onrender.com/api',
  }
};

// Use the appropriate configuration based on the environment
const env = process.env.NODE_ENV || 'development';
export default config[env];
