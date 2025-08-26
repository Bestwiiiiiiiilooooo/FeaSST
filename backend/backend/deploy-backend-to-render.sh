#!/bin/bash

echo "🚀 Preparing Backend for Render Deployment"
echo "=========================================="

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found!"
    exit 1
fi

echo "✅ Backend directory found"

# Check if package.json has correct start script
if grep -q '"start": "node server.js"' backend/package.json; then
    echo "✅ Start script configured correctly"
else
    echo "❌ Start script not configured correctly"
    echo "Please update backend/package.json"
    exit 1
fi

# Check if server.js exists
if [ -f "backend/server.js" ]; then
    echo "✅ server.js found"
else
    echo "❌ server.js not found!"
    exit 1
fi

echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Push your code to GitHub (if not already done)"
echo "2. Go to https://dashboard.render.com/"
echo "3. Click 'New +' → 'Web Service'"
echo "4. Connect your GitHub repository"
echo "5. Configure:"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "   - Root Directory: backend (if backend is in subfolder)"
echo "6. Add Environment Variables:"
echo "   - MONGODB_URI: your_mongodb_connection_string"
echo "   - JWT_SECRET: your_jwt_secret"
echo "7. Deploy!"
echo ""
echo "🌐 After deployment, your backend will be at:"
echo "   https://your-app-name.onrender.com"
echo ""
echo "📱 Then update frontend and admin .env.production files:"
echo "   VITE_API_URL=https://your-app-name.onrender.com"
echo ""
echo "✅ Ready for deployment!" 