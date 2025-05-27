const config = {
  development: {
    apiUrl: 'http://localhost:5000/api',
    baseUrl: 'http://localhost:5000'
  },
  production: {
    apiUrl: 'https://causeconnect-mp9a.onrender.com/api',
    baseUrl: 'https://causeconnect-mp9a.onrender.com'
  }
};

// Determine environment based on the URL
const isProduction = 
  typeof window !== 'undefined' && 
  (window.location.hostname !== 'localhost' && 
   !window.location.hostname.includes('127.0.0.1'));

// Export the appropriate configuration
export default isProduction ? config.production : config.development;
