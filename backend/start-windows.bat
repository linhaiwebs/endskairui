@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo 日本上市公司信息披露平台 - 启动服务
echo ========================================
echo.

REM 检查虚拟环境
if not exist "venv" (
    echo 错误：未找到虚拟环境
    echo 请先运行 install-windows.bat 进行安装
    pause
    exit /b 1
)

REM 激活虚拟环境
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
) else (
    echo 错误：虚拟环境激活脚本不存在
    pause
    exit /b 1
)

REM 检查.env文件
if not exist ".env" (
    echo 警告：未找到.env配置文件
    echo 正在使用默认配置...
    echo 请复制 .env.windows 为 .env 并修改配置
    echo.
)

REM 检查uvicorn是否安装
where uvicorn >nul 2>&1
if errorlevel 1 (
    echo 错误：未找到uvicorn命令
    echo 请确认虚拟环境已正确激活
    pause
    exit /b 1
)

REM 启动服务
echo 启动FastAPI服务...
echo API文档：http://localhost:8000/docs
echo 按 Ctrl+C 停止服务
echo.
uvicorn app.main:app --reload --port 8000
