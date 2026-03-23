@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo JP Disclosure Platform - Windows Install
echo ========================================
echo.

REM Step 1: Check Python
echo [1/5] Checking Python installation...
where python >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found
    echo Please install Python 3.10-3.12
    echo Download: https://www.python.org/downloads/
    pause
    exit /b 1
)
python --version
echo Python found!
echo.

REM Step 2: Create virtual environment FIRST
echo [2/5] Creating virtual environment...
if not exist "venv" (
    echo Creating new virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
    echo Virtual environment created successfully
) else (
    echo Virtual environment already exists
)
echo.

REM Step 3: Activate virtual environment
echo [3/5] Activating virtual environment...
if not exist "venv\Scripts\activate.bat" (
    echo ERROR: Virtual environment files not found
    pause
    exit /b 1
)
call venv\Scripts\activate.bat
echo Virtual environment activated
echo.

REM Step 4: Upgrade pip in virtual environment
echo [4/5] Upgrading pip in virtual environment...
python -m pip install --upgrade pip
echo.

REM Step 5: Install all dependencies in virtual environment
echo [5/5] Installing dependencies in virtual environment...
echo.

echo Installing FastAPI core...
pip install fastapi uvicorn pydantic pydantic-settings
if errorlevel 1 echo WARNING: FastAPI installation had issues

echo Installing database tools...
pip install sqlalchemy alembic
if errorlevel 1 echo WARNING: Database tools installation had issues

echo Installing PostgreSQL driver...
pip install psycopg2-binary 2>nul
if errorlevel 1 (
    echo psycopg2-binary failed, trying psycopg v3...
    pip install "psycopg[binary,pool]"
)

echo Installing HTTP client...
pip install httpx

echo Installing utilities...
pip install python-dotenv python-dateutil

echo Installing EDINET tools (optional)...
pip install edinet-tools 2>nul
if errorlevel 1 echo edinet-tools not installed, will skip

echo Installing scheduler...
pip install apscheduler

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Ensure PostgreSQL is installed and running
echo 2. Copy config: copy .env.windows .env
echo 3. Edit .env file with your database credentials
echo 4. Initialize database: init-db-windows.bat
echo 5. Start service: start-windows.bat
echo.
pause
