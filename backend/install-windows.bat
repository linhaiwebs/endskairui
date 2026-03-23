@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo 日本上市公司信息披露平台 - Windows安装
echo ========================================
echo.

REM 检查Python版本
echo [1/5] 检查Python版本...
where python >nul 2>&1
if errorlevel 1 (
    echo 错误：未找到Python，请先安装Python 3.10-3.12
    echo 下载地址：https://www.python.org/downloads/
    pause
    exit /b 1
)
python --version
echo.

REM 创建虚拟环境
echo [2/5] 创建虚拟环境...
if not exist "venv" (
    python -m venv venv
    if errorlevel 1 (
        echo 错误：虚拟环境创建失败
        pause
        exit /b 1
    )
    echo 虚拟环境创建成功
) else (
    echo 虚拟环境已存在
)
echo.

REM 激活虚拟环境
echo [3/5] 激活虚拟环境...
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
) else (
    echo 错误：虚拟环境激活脚本不存在
    pause
    exit /b 1
)
echo.

REM 升级pip
echo [4/5] 升级pip...
python -m pip install --upgrade pip --quiet
echo.

REM 安装核心依赖
echo [5/5] 安装依赖...
echo 安装FastAPI核心依赖...
pip install fastapi uvicorn pydantic pydantic-settings --quiet
if errorlevel 1 (
    echo 警告：部分依赖安装失败，继续尝试...
)

echo 安装数据库依赖...
pip install sqlalchemy alembic --quiet
if errorlevel 1 (
    echo 警告：数据库依赖安装失败
)

echo 安装PostgreSQL驱动...
pip install psycopg2-binary --quiet 2>nul
if errorlevel 1 (
    echo psycopg2-binary安装失败，尝试安装psycopg v3...
    pip install "psycopg[binary,pool]" --quiet
)

echo 安装HTTP客户端...
pip install httpx --quiet

echo 安装工具库...
pip install python-dotenv python-dateutil --quiet

echo 安装EDINET工具...
pip install edinet-tools --quiet 2>nul
if errorlevel 1 (
    echo edinet-tools安装失败，将使用备用方案
)

echo 安装定时任务调度器...
pip install apscheduler --quiet

echo.
echo ========================================
echo 安装完成！
echo ========================================
echo.
echo 接下来的步骤：
echo 1. 确保PostgreSQL数据库已安装并运行
echo 2. 复制配置文件：copy .env.windows .env
echo 3. 编辑.env文件，修改数据库连接
echo    DATABASE_URL=postgresql://postgres:password@localhost:5432/jp_disclosure
echo 4. 初始化数据库：python scripts\init_db.py
echo 5. 启动服务：run start-windows.bat 或 uvicorn app.main:app --reload
echo.
echo 详细说明请查看：README.md
echo.
pause
