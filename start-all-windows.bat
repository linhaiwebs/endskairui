@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo JP Disclosure Platform - Start All Services
echo ========================================
echo.

REM Check backend installation
if not exist "backend\venv" (
    echo ERROR: Backend not installed
    echo Please run backend\install-windows.bat first
    pause
    exit /b 1
)
echo Backend installation found

REM Check frontend installation
if not exist "frontend\node_modules" (
    echo ERROR: Frontend not installed
    echo Please run frontend\install-windows.bat first
    pause
    exit /b 1
)
echo Frontend installation found
echo.

echo Starting backend service...
start "Backend API - http://localhost:8000" cmd /k "cd backend && call venv\Scripts\activate.bat && uvicorn app.main:app --reload --port 8000"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo Starting frontend service...
start "Frontend - http://localhost:3000" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Services Started Successfully!
echo ========================================
echo.
echo Backend API: http://localhost:8000/docs
echo Frontend App: http://localhost:3000
echo.
echo Two new windows have been opened.
echo Keep them running to use the application.
echo Close the windows to stop the services.
echo.
pause
