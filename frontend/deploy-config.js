// Deployment configuration for Firebase hosting
// This file helps configure the correct API URL for production

const config = {
  development: {
    apiUrl: 'http://localhost:4000'
  },
  production: {
    // ✅ Your actual Render backend URL
    apiUrl: 'https://feasst-9pe1.onrender.com'
  }
};

export default config; 