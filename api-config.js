// Smart API URL configuration
// Automatically uses localhost for development, Render URL for production

// Use localhost in development and when opening from file:// for local testing.
window.API_URL = (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:3000/api'
  : window.location.origin + '/api';

console.log('API URL configured:', window.API_URL);
