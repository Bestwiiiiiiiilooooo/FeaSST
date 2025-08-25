#!/bin/bash

# Script to help set up network access for multi-instance testing

echo "🌐 Network Access Setup for Multi-Instance Testing"
echo "=================================================="
echo ""

# Get the current IP address
CURRENT_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
echo "📱 Your current IP address: $CURRENT_IP"
echo ""

echo "🔧 Firebase Configuration Required:"
echo "==================================="
echo "1. Go to https://console.firebase.google.com/"
echo "2. Select your project 'proj-serve'"
echo "3. Go to Authentication → Settings → Authorized domains"
echo "4. Add these domains to the authorized list:"
echo "   - localhost"
echo "   - $CURRENT_IP"
echo "   - 192.168.68.64"
echo ""

echo "🚀 Alternative Solutions:"
echo "========================"
echo ""

echo "Option 1: Use localhost with port forwarding"
echo "--------------------------------------------"
echo "Instead of using 192.168.68.64, try:"
echo "  - http://localhost:5173"
echo "  - http://localhost:5174"
echo ""

echo "Option 2: Use different browsers/incognito"
echo "------------------------------------------"
echo "Open both instances in the same browser:"
echo "  - Chrome: http://localhost:5173"
echo "  - Chrome Incognito: http://localhost:5174"
echo "  - Firefox: http://localhost:5173"
echo "  - Safari: http://localhost:5174"
echo ""

echo "Option 3: Configure Firebase for your network"
echo "---------------------------------------------"
echo "Add these to Firebase authorized domains:"
echo "  - $CURRENT_IP"
echo "  - 192.168.68.64"
echo "  - *.local (for local network access)"
echo ""

echo "🔍 Current Network Status:"
echo "=========================="
echo "Checking if ports are accessible..."

# Check if ports are accessible
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Port 5173 is accessible"
else
    echo "❌ Port 5173 is not accessible"
fi

if curl -s http://localhost:5174 > /dev/null; then
    echo "✅ Port 5174 is accessible"
else
    echo "❌ Port 5174 is not accessible"
fi

if curl -s http://$CURRENT_IP:5173 > /dev/null; then
    echo "✅ $CURRENT_IP:5173 is accessible"
else
    echo "❌ $CURRENT_IP:5173 is not accessible"
fi

if curl -s http://$CURRENT_IP:5174 > /dev/null; then
    echo "✅ $CURRENT_IP:5174 is accessible"
else
    echo "❌ $CURRENT_IP:5174 is not accessible"
fi

echo ""
echo "💡 Quick Fix:"
echo "============="
echo "For immediate testing, use localhost instead of IP:"
echo "  - http://localhost:5173"
echo "  - http://localhost:5174"
echo ""
echo "This will work with Firebase authentication without any configuration changes." 