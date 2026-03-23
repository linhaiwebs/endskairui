@echo off
REM Windows环境一键安装脚本
REM 自动检测并安装适合Windows的依赖

echo ========================================
echo 日本上市公司信息披露平台 - Windows安装
echo ========================================
echo.

REM 检查Python版本
echo [1/5] 检查Python版本...
python --version
if errorlevel 1 (
    echo 错误：未找到Python，请先安装Python 3.10-3.12
    pause
    exit /b 1
)
echo.

REM 创建虚拟环境
echo [2/5] 创建虚拟环境...
if not exist "venv" (
    python -m venv venv
    echo 虚拟环境创建成功
) else (
    echo 虚拟环境已存在
)
echo.

REM 激活虚拟环境
echo [3/5] 激活虚拟环境...
call venv\Scripts\activate.bat
echo.

REM 升级pip
echo [4/5] 升级pip...
python -m pip install --upgrade pip
echo.

REM 安装核心依赖
echo [5/5] 安装依赖...
echo 安装FastAPI核心依赖...
pip install fastapi uvicorn pydantic pydantic-settings

echo 安装数据库依赖...
pip install sqlalchemy alembic

REM 尝试安装psycopg2-binary，失败则尝试psycopg
echo 安装PostgreSQL驱动...
pip install psycopg2-binary 2>nul
if errorlevel 1 (
    echo psycopg2-binary安装失败，尝试安装psycopg v3...
    pip install "psycopg[binary,pool]"
)

echo 安装HTTP客户端...
pip install httpx

echo 安装工具库...
pip install python-dotenv python-dateutil

REM 尝试安装edinet-tools（可选）
echo 安装EDINET工具...
pip install edinet-tools 2>nul
if errorlevel 1 (
    echo edinet-tools安装失败，将使用备用方案
)

REM 安装APScheduler（替代Celery）
echo 安装定时任务调度器...
pip install apscheduler

echo.
echo ========================================
echo 安装完成！
echo ========================================
echo.
echo 接下来的步骤：
echo 1. 确保PostgreSQL数据库已安装并运行
echo 2. 创建.env文件配置数据库连接
echo    DATABASE_URL=postgresql://postgres:password@localhost:5432/jp_disclosure
echo 3. 运行：python scripts\init_db.py
echo 4. 启动服务：uvicorn app.main:app --reload
echo.
echo 详细说明请查看：WINDOWS_INSTALL.md
echo.
pause
