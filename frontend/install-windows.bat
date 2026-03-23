@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo JP Disclosure Platform - Frontend Install
echo ========================================
echo.

REM Step 1: Check Node.js
echo [1/4] Checking Node.js installation...
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found
    echo Please install Node.js 18 or higher
    echo Download: https://nodejs.org/
    echo Choose LTS version for stability
    pause
    exit /b 1
)

REM Get Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Node.js version: %NODE_VERSION%

REM Check Node.js version is 18 or higher
for /f "tokens=1 delims=v" %%i in ("%NODE_VERSION%") do (
    for /f "tokens=1 delims=." %%j in ("%%i") do set NODE_MAJOR=%%j
)

if %NODE_MAJOR% LSS 18 (
    echo ERROR: Node.js version must be 18 or higher
    echo Current version: %NODE_VERSION%
    echo Please upgrade Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version check passed!
echo.
echo NPM version:
npm --version
echo.

REM Step 2: Clean previous installation if exists
echo [2/4] Cleaning previous installation...
if exist "node_modules" (
    echo Removing old node_modules...
    rmdir /s /q node_modules
)
if exist "package-lock.json" (
    echo Removing old package-lock.json...
    del /f /q package-lock.json
)
echo Cleanup complete!
echo.

REM Step 3: Install dependencies
echo [3/4] Installing frontend dependencies...
echo This may take a few minutes...
echo.
call npm install
if errorlevel 1 (
    echo.
    echo ERROR: Dependency installation failed
    echo Please check:
    echo 1. Internet connection is available
    echo 2. npm registry is accessible
    echo 3. Try running: npm cache clean --force
    echo 4. Then retry this script
    pause
    exit /b 1
)
echo.
echo Dependencies installed successfully!
echo.

REM Step 4: Configure environment
echo [4/4] Configuring environment...
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
