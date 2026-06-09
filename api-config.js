// Smart API URL configuration
// Automatically uses localhost for development, Render URL for production

window.API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : 'https://resumewrite-builder.onrender.com/api';

console.log('API URL configured:', window.API_URL);
