# Firebase Deployment Guide

This guide will help you deploy your food delivery application (frontend, admin, and backend) to Firebase Hosting and Functions.

## 🏗️ Architecture Overview

- **Frontend**: React app hosted at `https://proj-serve.web.app`
- **Admin Panel**: React app hosted at `https://proj-serve-admin.web.app`
- **Backend API**: Express.js app converted to Firebase Functions at `https://us-central1-proj-serve.cloudfunctions.net/api`

## 📋 Prerequisites

1. Firebase CLI installed: `npm install -g firebase-tools`
2. Firebase project created: `proj-serve`
3. All dependencies installed in frontend, admin, and backend directories

## 🚀 Quick Deployment

### Option 1: Automated Deployment (Recommended)

```bash
# Make the script executable (if not already done)
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

### Option 2: Manual Deployment

```bash
# 1. Build frontend
cd frontend
npm run build
cd ..

# 2. Build admin
cd admin
npm run build
cd ..

# 3. Deploy to Firebase
npx firebase-tools deploy
```

## 🔧 Configuration Details

### Firebase Configuration (`firebase.json`)

```json
{
  "hosting": [
    {
      "target": "frontend",
      "public": "frontend/dist",
      "ignore": [
        "firebase.json",
        "**/.*",
        "**/node_modules/**"
      ],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    },
    {
      "target": "admin",
      "public": "admin/dist",
      "ignore": [
        "firebase.json",
        "**/.*",
        "**/node_modules/**"
      ],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    }
  ],
  "functions": {
    "source": "backend",
    "runtime": "nodejs18"
  }
}
```

### Environment Variables

#### Frontend (`.env.production`)
```
VITE_API_URL=https://us-central1-proj-serve.cloudfunctions.net/api
```

#### Admin (`.env.production`)
```
VITE_API_URL=https://us-central1-proj-serve.cloudfunctions.net/api
```

## 🌐 Access URLs

After deployment, your applications will be available at:

- **Frontend**: https://proj-serve.web.app
- **Admin Panel**: https://proj-serve-admin.web.app
- **API**: https://us-central1-proj-serve.cloudfunctions.net/api

## 🔄 Development vs Production

### Development
- Frontend runs on `http://localhost:5173`
- Admin runs on `http://localhost:5173` (different port)
- Backend runs on `http://localhost:4000`

### Production
- All applications use the Firebase Functions API URL
- Environment variables automatically switch between dev and prod

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check if all dependencies are installed
   cd frontend && npm install
   cd ../admin && npm install
   cd ../backend && npm install
   ```

2. **Firebase Functions Timeout**
   - Increase timeout in `backend/index.js`
   - Check MongoDB connection string

3. **CORS Issues**
   - Verify CORS origins in `backend/index.js`
   - Add your domain to the allowed origins

4. **Environment Variables Not Loading**
   ```bash
   # Rebuild with production mode
   npm run build --mode production
   ```

### Useful Commands

```bash
# View Firebase Functions logs
npx firebase-tools functions:log

# Test Firebase Functions locally
npx firebase-tools emulators:start

# Deploy only functions
npx firebase-tools deploy --only functions

# Deploy only hosting
npx firebase-tools deploy --only hosting

# View project status
npx firebase-tools projects:list
```

## 📝 Environment Setup

### MongoDB Atlas
1. Create a MongoDB Atlas cluster
2. Get your connection string
3. Add it to Firebase Functions environment variables:
   ```bash
   npx firebase-tools functions:config:set mongodb.uri="your_mongodb_connection_string"
   ```

### Firebase Authentication
1. Enable Google Authentication in Firebase Console
2. Add your domains to authorized domains
3. Update Firebase config in frontend

## 🔒 Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **CORS**: Configure CORS properly for production domains
3. **Authentication**: Use Firebase Authentication for user management
4. **Database**: Use environment variables for database connections

## 📊 Monitoring

- **Firebase Console**: Monitor functions, hosting, and authentication
- **MongoDB Atlas**: Monitor database performance and connections
- **Firebase Analytics**: Track user behavior (optional)

## 🔄 Continuous Deployment

The project is configured with GitHub Actions for automatic deployment:

1. Push to `main` branch triggers deployment
2. Pull requests create preview deployments
3. All builds and tests run automatically

## 📞 Support

If you encounter issues:

1. Check Firebase Console for error logs
2. Verify all environment variables are set
3. Ensure MongoDB connection is working
4. Check CORS configuration for your domains 