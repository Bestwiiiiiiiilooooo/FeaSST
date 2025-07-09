# Multi-Instance Frontend Setup

This guide shows you how to run multiple instances of the frontend on different ports to simulate different user accounts ordering simultaneously.

## 🚀 Quick Start

### Method 1: Using the Scripts (Recommended)

#### For macOS/Linux:
```bash
# Make the script executable (if not already done)
chmod +x run-multiple-frontends.sh

# Run the script
./run-multiple-frontends.sh
```

#### For Windows:
```cmd
# Run the batch file
run-multiple-frontends.bat
```

### Method 2: Using npm Scripts

First, install the required dependency:
```bash
cd frontend
npm install
```

Then run multiple instances:
```bash
# Run both instances simultaneously
npm run dev:multi

# Or run individual instances in separate terminals
npm run dev:5173  # Instance 1
npm run dev:5174  # Instance 2
```

### Method 3: Manual Setup

Open multiple terminal windows and run:

**Terminal 1:**
```bash
cd frontend
PORT=5173 npm run dev
```

**Terminal 2:**
```bash
cd frontend
PORT=5174 npm run dev
```

## 🌐 Access Points

After running the setup, you'll have access to:

- **Frontend Instance 1**: http://localhost:5173
- **Frontend Instance 2**: http://localhost:5174
- **Admin Panel**: http://localhost:5173 (if running admin separately)
- **Backend API**: http://localhost:4000

## 🧪 Testing Scenarios

### Scenario 1: Different User Accounts
1. Open http://localhost:5173 in Chrome
2. Open http://localhost:5174 in Firefox (or incognito mode)
3. Sign up/login with different accounts on each instance
4. Add items to cart on both instances
5. Place orders simultaneously

### Scenario 2: Same User, Different Sessions
1. Open both instances in different browsers
2. Sign in with the same account on both
3. Test cart synchronization
4. Test order placement from both instances

### Scenario 3: Admin + User Testing
1. Run admin panel on a different port
2. Add/remove items from admin panel
3. Watch changes reflect in real-time on both frontend instances
4. Test order management from admin panel

## 🔧 Configuration

### Adding More Instances

To add a third instance, modify the scripts:

**For shell script:**
```bash
# Add this after the second instance
echo "Starting Frontend Instance 3 on http://localhost:5175"
PORT=5175 npm run dev &
FRONTEND3_PID=$!
```

**For package.json:**
```json
"dev:multi": "concurrently \"npm run dev:5173\" \"npm run dev:5174\" \"npm run dev:5175\""
```

### Custom Ports

You can use any available ports by changing the PORT environment variable:

```bash
PORT=3000 npm run dev  # Custom port 3000
PORT=8080 npm run dev  # Custom port 8080
```

## 🛠️ Troubleshooting

### Port Already in Use
If you get a "port already in use" error:
```bash
# Find processes using the port
lsof -i :5173
lsof -i :5174

# Kill the process
kill -9 <PID>
```

### Concurrently Not Found
If you get a "concurrently not found" error:
```bash
cd frontend
npm install concurrently
```

### Windows Port Issues
On Windows, you might need to use:
```cmd
set PORT=5173 && npm run dev
```

## 📊 Monitoring

### Check Running Instances
```bash
# Check what's running on the ports
netstat -tulpn | grep :5173
netstat -tulpn | grep :5174
```

### View Logs
Each instance will show its own logs in the terminal where it's running. Look for:
- Vite dev server startup messages
- React compilation status
- API request logs

## 🎯 Best Practices

1. **Use Different Browsers**: Chrome, Firefox, Safari, Edge
2. **Use Incognito/Private Mode**: For completely isolated sessions
3. **Clear Local Storage**: Between tests if needed
4. **Monitor Network Tab**: To see API requests from different instances
5. **Test Real-time Features**: Like the auto-refresh we implemented

## 🔄 Auto-Refresh Testing

With the auto-refresh feature we implemented:
- Changes in admin panel will appear on both frontend instances within 10 seconds
- Menu categories refresh every 5 seconds
- Orders refresh every 10 seconds

This makes it perfect for testing real-time updates across multiple user sessions! 