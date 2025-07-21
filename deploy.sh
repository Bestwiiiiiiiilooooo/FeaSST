#!/bin/bash

echo "🚀 Starting deployment to Firebase..."
echo "====================================="

# Build frontend
echo "📱 Building frontend..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi
cd ..

# Build admin
echo "⚙️  Building admin panel..."
cd admin
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Admin build failed"
    exit 1
fi
cd ..

# Deploy to Firebase
echo "🔥 Deploying to Firebase..."
npx firebase-tools deploy

echo "✅ Deployment complete!"
echo ""
echo "🌐 Your applications are now live at:"
echo "   Frontend: https://proj-serve.web.app"
echo "   Admin: https://proj-serve-admin.web.app"
echo "   API: https://us-central1-proj-serve.cloudfunctions.net/api"
echo ""
echo "📝 Note: It may take a few minutes for the changes to propagate." 