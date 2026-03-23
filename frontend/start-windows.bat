@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo JP Disclosure Platform - Frontend Start
echo ========================================
echo.

REM Check node_modules
if not exist "node_modules" (
    echo ERROR: node_modules directory not found
    echo Please run install-windows.bat first
    pause
    exit /b 1
)
echo node_modules found
echo.

REM Check .env.local
if not exist ".env.local" (
    echo WARNING: .env.local not found
    echo Creating default configuration...
    echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local
    echo Created .env.local with default settings
    echo.
)

REM Check backend service
echo Checking backend API service...
echo.
curl -s http://localhost:8000/health >nul 2>&1
if errorlevel 1 (
    echo WARNING: Backend API service is not running
    echo Please start backend service first at http://localhost:8000
    echo.
    echo Run: backend\start-windows.bat
    echo.
    choice /C YN /M "Do you want to continue starting frontend?"
    if errorlevel 2 (
        echo Frontend startup cancelled
        exit /b 1
    )
    echo.
) else (
    echo Backend API service is running
    echo.
)

REM Start service
echo Starting Next.js development server...
echo.
echo Frontend will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
npm run dev
