@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo JP Disclosure Platform - Frontend Start
echo ========================================
echo.

REM Check node_modules
if not exist "node_modules" (
    echo ERROR: node_modules not found
    echo Please run install-windows.bat first
    pause
    exit /b 1
)

REM Check .env.local
if not exist ".env.local" (
    echo WARNING: .env.local not found
    echo Using default configuration...
    echo.
)

REM Check backend service
echo Checking backend API service...
curl -s http://localhost:8000/health >nul 2>&1
if errorlevel 1 (
    echo WARNING: Backend API service not running
    echo Please ensure backend is started at http://localhost:8000
    echo.
    choice /C YN /M "Continue starting frontend?"
    if errorlevel 2 exit /b 1
)

REM Start service
echo Starting Next.js development server...
echo Frontend: http://localhost:3000
echo Press Ctrl+C to stop
echo.
npm run dev
