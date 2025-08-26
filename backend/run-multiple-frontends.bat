@echo off
REM Script to run multiple frontend instances for testing different user accounts

echo Starting multiple frontend instances...
echo.

REM Start first instance on port 5173
echo Starting Frontend Instance 1 on http://localhost:5173
start "Frontend 1" cmd /k "set PORT=5173 && npm run dev"

REM Wait a moment for the first instance to start
timeout /t 3 /nobreak >nul

REM Start second instance on port 5174
echo Starting Frontend Instance 2 on http://localhost:5174
start "Frontend 2" cmd /k "set PORT=5174 && npm run dev"

REM Wait a moment for the second instance to start
timeout /t 3 /nobreak >nul

echo.
echo ✅ Both frontend instances are running!
echo 📱 Frontend 1: http://localhost:5173
echo 📱 Frontend 2: http://localhost:5174
echo.
echo 💡 Tips:
echo    - Use different browsers or incognito windows
echo    - Sign in with different accounts on each instance
echo    - Test ordering simultaneously from both instances
echo.
echo Press any key to exit...
pause >nul 