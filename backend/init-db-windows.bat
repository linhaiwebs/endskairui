@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo JP Disclosure Platform - Database Init
echo ========================================
echo.

REM Check virtual environment
if not exist "venv" (
    echo ERROR: Virtual environment not found
    echo Please run install-windows.bat first
    pause
    exit /b 1
)

REM Activate virtual environment
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
) else (
    echo ERROR: Virtual environment activation script not found
    pause
    exit /b 1
)

REM Check .env file
if not exist ".env" (
    echo WARNING: .env configuration file not found
    echo Please copy .env.windows to .env first
    echo Then edit .env file with your database credentials
    pause
    exit /b 1
)

REM Run initialization script
echo Initializing database...
python scripts\init_db.py

if errorlevel 1 (
    echo.
    echo ERROR: Database initialization failed
    echo Please check:
    echo 1. PostgreSQL service is running
    echo 2. .env file has correct database connection
    echo 3. Database has been created
    pause
    exit /b 1
)

echo.
echo ========================================
echo Database Initialization Complete!
echo ========================================
echo.
echo Next step: Run start-windows.bat to start service
echo.
pause
