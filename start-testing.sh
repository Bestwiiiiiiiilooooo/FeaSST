#!/bin/bash

echo "🧪 Multi-Instance Testing Setup"
echo "==============================="
echo ""

# Start the frontend instances
echo "🚀 Starting frontend instances..."
cd frontend

# Start first instance
echo "Starting Instance 1 on port 5173..."
PORT=5173 npm run dev &
INSTANCE1_PID=$!

# Wait a moment
sleep 3

# Start second instance
echo "Starting Instance 2 on port 5174..."
PORT=5174 npm run dev &
INSTANCE2_PID=$!

# Wait for both to start
sleep 5

echo ""
echo "✅ Both instances are running!"
echo ""
echo "🌐 Access URLs:"
echo "==============="
echo "Instance 1: http://localhost:5173"
echo "Instance 2: http://localhost:5174"
echo ""
echo "🧪 Testing Scenarios:"
echo "===================="
echo ""
echo "Scenario 1: Different Browsers"
echo "-----------------------------"
echo "1. Open Chrome and go to: http://localhost:5173"
echo "2. Open Firefox and go to: http://localhost:5174"
echo "3. Sign in with different Google accounts on each"
echo "4. Add items to cart and place orders"
echo ""
echo "Scenario 2: Same Browser, Incognito"
echo "-----------------------------------"
echo "1. Open Chrome and go to: http://localhost:5173"
echo "2. Open Chrome Incognito and go to: http://localhost:5174"
echo "3. Sign in with different accounts"
echo ""
echo "Scenario 3: Admin + User Testing"
echo "-------------------------------"
echo "1. Open admin panel in one tab: http://localhost:5173"
echo "2. Open user frontend in another tab: http://localhost:5174"
echo "3. Make changes in admin, watch them appear in user frontend"
echo ""
echo "💡 Tips:"
echo "========"
echo "- Use localhost instead of IP address to avoid Firebase issues"
echo "- Each instance refreshes every 10 seconds automatically"
echo "- Changes in admin panel appear on both instances within 10 seconds"
echo "- Test the promo code feature we added to the admin panel"
echo ""
echo "Press Ctrl+C to stop all instances"

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Stopping all instances..."
    kill $INSTANCE1_PID 2>/dev/null
    kill $INSTANCE2_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep script running
wait 