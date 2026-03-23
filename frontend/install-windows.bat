@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo JP Disclosure Platform - Frontend Install
echo ========================================
echo.

REM Check Node.js
echo [1/3] Checking Node.js version...
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found
    echo Please install Node.js 18+
    echo Download: https://nodejs.org/
    pause
    exit /b 1
)
node --version
npm --version
echo.

REM Install dependencies
echo [2/3] Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Dependency installation failed
    pause
    exit /b 1
)
echo.

REM Configure environment
echo [3/3] Configuring environment...
if not exist ".env.local" (
    if exist ".env.example" (
        copy .env.example .env.local
        echo Created .env.local file
    ) else (
        echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local
        echo Created default .env.local file
    )
) else (
    echo .env.local file already exists
)
echo.

echo ========================================
echo Frontend Installation Complete!
echo ========================================
echo.
echo Next step: Run start-windows.bat to start frontend service
echo.
pause
