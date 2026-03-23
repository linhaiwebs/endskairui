@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo JP Disclosure Platform - Start Backend
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
    echo Using default configuration...
    echo Please copy .env.windows to .env and configure
    echo.
)

REM Check uvicorn
where uvicorn >nul 2>&1
if errorlevel 1 (
    echo ERROR: uvicorn not found
    echo Please confirm virtual environment is activated
    pause
    exit /b 1
)

REM Start service
echo Starting FastAPI service...
echo API Docs: http://localhost:8000/docs
echo Press Ctrl+C to stop
echo.
uvicorn app.main:app --reload --port 8000
