@echo off
echo Starting SEPS2 Backend System...
echo ===================================

:: Start Uvicorn in a new window (activating venv first)
start "SEPS2 Backend" cmd /k "cd backend && call venv\Scripts\activate.bat && uvicorn main:app --reload"

:: Wait for backend to initialize
timeout /t 5

:: Start Localtunnel in a new window
start "SEPS2 Tunnel" cmd /k "npx -y localtunnel --port 8000 --subdomain empty-toes-type"

echo ===================================
echo Services Started!
echo 1. Keep the two new windows OPEN.
echo 2. Go to: https://jeevesh-ai.github.io/SEPS2/
echo ===================================
pause
