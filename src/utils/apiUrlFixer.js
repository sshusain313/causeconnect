/**
 * API URL Fixer
 * 
 * This module fixes any hardcoded references to localhost:5000 in the application
 * by intercepting network requests and redirecting them to use config.apiUrl.
 * 
 * It's loaded before the application starts to ensure all API requests are properly handled.
 * 
 * NOTE: This is a fallback mechanism. All code should be updated to use config.apiUrl directly.
 */

// Self-executing function to avoid polluting the global scope
(function() {
  console.log('API URL Fixer: Initializing...');
  
  // Only run in production or on changebag.org
  const shouldFix = () => {
    return window.location.hostname === 'changebag.org' || 
           window.location.hostname === 'www.changebag.org' ||
           import.meta.env.PROD;
  };
  
  if (!shouldFix()) {
    console.log('API URL Fixer: Not running in production, skipping initialization');
    return;
  }
  
  console.log('API URL Fixer: Running in production, applying fixes');
  
  // Store the original fetch and XHR open methods
  const originalFetch = window.fetch;
  const originalXhrOpen = XMLHttpRequest.prototype.open;
  
  // Import config if it exists in window
  const getConfig = () => {
    if (window.config && window.config.apiUrl) {
      return window.config;
    }
    // Fallback values if config is not available
    return {
      apiUrl: window.location.origin + '/api',
      uploadsUrl: window.location.origin + '/uploads'
    };
  };

  // Function to replace localhost URLs with the correct domain from config
  const fixUrl = (url) => {
    if (typeof url === 'string' && url.includes('localhost:5000')) {
      const config = getConfig();
      // Handle API URLs
      if (url.includes('/api/')) {
        const baseApiUrl = config.apiUrl.endsWith('/api') 
          ? config.apiUrl 
          : config.apiUrl + '/api';
        const apiPath = url.split('/api/')[1];
        const newUrl = `${baseApiUrl}/${apiPath}`;
        console.log(`API URL Fixer: Redirecting API ${url} to ${newUrl}`);
        return newUrl;
      }
      // Handle uploads URLs
      else if (url.includes('/uploads/')) {
        const baseUploadsUrl = config.uploadsUrl.endsWith('/uploads') 
          ? config.uploadsUrl 
          : config.uploadsUrl + '/uploads';
        const uploadsPath = url.split('/uploads/')[1];
        const newUrl = `${baseUploadsUrl}/${uploadsPath}`;
        console.log(`API URL Fixer: Redirecting uploads ${url} to ${newUrl}`);
        return newUrl;
      }
      // Generic fallback
      else {
        const newUrl = url.replace('http://localhost:5000', window.location.origin);
        console.log(`API URL Fixer: Redirecting ${url} to ${newUrl}`);
        return newUrl;
      }
    }
    return url;
  };
  
  // Override the global fetch method
  window.fetch = function(resource, options) {
    // If resource is a string URL
    if (typeof resource === 'string') {
      resource = fixUrl(resource);
    } 
    // If resource is a Request object
    else if (resource instanceof Request) {
      const url = fixUrl(resource.url);
      if (url !== resource.url) {
        resource = new Request(url, resource);
      }
    }
    
    return originalFetch.call(this, resource, options);
  };
  
  // Override XMLHttpRequest.open
  XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    const newUrl = fixUrl(url);
    return originalXhrOpen.call(this, method, newUrl, async, user, password);
  };
  
  // Patch Axios if available
  if (window.axios) {
    console.log('API URL Fixer: Patching Axios');
    window.axios.interceptors.request.use(function(config) {
      if (config.url) {
        config.url = fixUrl(config.url);
      }
      return config;
    });
  }
  
  // Override any global config objects
  setTimeout(() => {
    if (window.config) {
      console.log('API URL Fixer: Patching global config object');
      if (window.config.apiUrl && window.config.apiUrl.includes('localhost:5000')) {
        window.config.apiUrl = window.config.apiUrl.replace('http://localhost:5000', window.location.origin);
        console.log(`API URL Fixer: Updated config.apiUrl to ${window.config.apiUrl}`);
      }
      
      if (window.config.uploadsUrl && window.config.uploadsUrl.includes('localhost:5000')) {
        window.config.uploadsUrl = window.config.uploadsUrl.replace('http://localhost:5000', window.location.origin);
        console.log(`API URL Fixer: Updated config.uploadsUrl to ${window.config.uploadsUrl}`);
      }
    }
  }, 0);
  
  console.log('API URL Fixer: Initialization complete');
})();

export default {}; // Export an empty object to make this a valid ES module
