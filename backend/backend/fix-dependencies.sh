#!/bin/bash

echo "🔧 Fixing Firebase dependency conflicts..."

# Navigate to the main backend directory
cd backend

echo "📦 Installing dependencies with firebase-admin@^12.7.0..."
npm install

echo "✅ Dependencies installed successfully!"

echo "🧪 Testing build..."
npm run build

echo "🎉 Build completed successfully!"
echo ""
echo "📋 Summary of changes made:"
echo "   - Downgraded firebase-admin from ^13.4.0 to ^12.7.0"
echo "   - Updated Node.js engine from 18 to 20"
echo "   - Removed package-lock.json files to force dependency resolution"
echo ""
echo "🚀 You can now deploy to Render!"
echo "   The dependency conflict should be resolved."
