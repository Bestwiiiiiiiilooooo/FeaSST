// Deployment configuration for Firebase hosting
// This file helps configure the correct API URL for production

const config = {
  development: {
    apiUrl: 'http://localhost:4000'
  },
  production: {
    // Update this URL to your actual backend deployment URL
    apiUrl: 'https://your-backend-url.onrender.com' // or your actual backend URL
  }
};

export default config; 