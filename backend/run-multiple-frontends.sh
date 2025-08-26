#!/bin/bash

# Script to run multiple frontend instances for testing different user accounts

echo "Starting multiple frontend instances..."
echo ""

# Start first instance on port 5173
echo "Starting Frontend Instance 1 on http://localhost:5173"
PORT=5173 npm run dev &
FRONTEND1_PID=$!

# Wait a moment for the first instance to start
sleep 3

# Start second instance on port 5174
echo "Starting Frontend Instance 2 on http://localhost:5174"
PORT=5174 npm run dev &
FRONTEND2_PID=$!

# Wait a moment for the second instance to start
sleep 3

echo ""
echo "✅ Both frontend instances are running!"
echo "📱 Frontend 1: http://localhost:5173"
echo "📱 Frontend 2: http://localhost:5174"
echo ""
echo "💡 Tips:"
echo "   - Use different browsers or incognito windows"
echo "   - Sign in with different accounts on each instance"
echo "   - Test ordering simultaneously from both instances"
echo ""
echo "Press Ctrl+C to stop all instances"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all frontend instances..."
    kill $FRONTEND1_PID 2>/dev/null
    kill $FRONTEND2_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep script running
wait 