@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo JP Disclosure Platform - Frontend Install
echo ========================================
echo.

REM Step 1: Check Node.js
echo [1/3] Checking Node.js installation...
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found
    echo Please install Node.js 18 or higher
    echo Download: https://nodejs.org/
    echo Choose LTS version for stability
    pause
    exit /b 1
)
echo Node.js found:
node --version
echo.
echo NPM version:
npm --version
echo.

REM Step 2: Install dependencies
echo [2/3] Installing frontend dependencies...
echo This may take a few minutes...
echo.
call npm install
if errorlevel 1 (
    echo.
    echo ERROR: Dependency installation failed
    echo Please check:
    echo 1. Internet connection is available
    echo 2. npm registry is accessible
    echo 3. Try deleting node_modules and package-lock.json, then retry
    pause
    exit /b 1
)
echo.
echo Dependencies installed successfully!
echo.

REM Step 3: Configure environment
echo [3/3] Configuring environment...
if not exist ".env.local" (
    if exist ".env.example" (
        copy .env.example .env.local >nul
        echo Created .env.local from .env.example
    ) else (
        echo Creating default .env.local file...
        echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local
        echo Created .env.local with default settings
    )
) else (
    echo .env.local already exists, skipping
)
echo.

echo ========================================
echo Frontend Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Ensure backend is running at http://localhost:8000
echo 2. Run start-windows.bat to start frontend
echo 3. Access frontend at http://localhost:3000
echo.
pause
