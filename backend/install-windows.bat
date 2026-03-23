@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo JP Disclosure Platform - Windows Install
echo ========================================
echo.

REM Check Python version
echo [1/5] Checking Python version...
where python >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found
    echo Please install Python 3.10-3.12
    echo Download: https://www.python.org/downloads/
    pause
    exit /b 1
)
python --version
echo.

REM Create virtual environment
echo [2/5] Creating virtual environment...
if not exist "venv" (
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

REM Activate virtual environment
echo [3/5] Activating virtual environment...
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
) else (
    echo ERROR: Virtual environment activation script not found
    pause
    exit /b 1
)
echo.

REM Upgrade pip
echo [4/5] Upgrading pip...
python -m pip install --upgrade pip --quiet
echo.

REM Install core dependencies
echo [5/5] Installing dependencies...
echo Installing FastAPI core dependencies...
pip install fastapi uvicorn pydantic pydantic-settings --quiet
if errorlevel 1 (
    echo WARNING: Some dependencies failed to install
)

echo Installing database dependencies...
pip install sqlalchemy alembic --quiet
if errorlevel 1 (
    echo WARNING: Database dependencies installation failed
)

echo Installing PostgreSQL driver...
pip install psycopg2-binary --quiet 2>nul
if errorlevel 1 (
    echo psycopg2-binary failed, trying psycopg v3...
    pip install "psycopg[binary,pool]" --quiet
)

echo Installing HTTP client...
pip install httpx --quiet

echo Installing utility libraries...
pip install python-dotenv python-dateutil --quiet

echo Installing EDINET tools...
pip install edinet-tools --quiet 2>nul
if errorlevel 1 (
    echo edinet-tools installation failed, will skip
)

echo Installing scheduler...
pip install apscheduler --quiet

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Ensure PostgreSQL is installed and running
echo 2. Copy config: copy .env.windows .env
echo 3. Edit .env file with your database credentials
echo 4. Initialize database: python scripts\init_db.py
echo 5. Start service: start-windows.bat
echo.
pause
