#!/bin/bash

# Deploy to Firebase Hosting Script
echo "🚀 Starting Firebase deployment..."

# Build the project
echo "📦 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Firebase
    echo "🌐 Deploying to Firebase..."
    firebase deploy --only hosting:feasst-food
    
    if [ $? -eq 0 ]; then
        echo "✅ Deployment successful!"
        echo "🌍 Your app is now live at: https://feasst-food.web.app"
        echo ""
        echo "📋 IMPORTANT: Don't forget to:"
        echo "1. Add 'feasst-food.web.app' to Firebase Authorized Domains"
        echo "2. Update the backend URL in src/Context/StoreContext.jsx"
        echo "3. Deploy your backend to a hosting service (like Render)"
    else
        echo "❌ Deployment failed!"
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi 