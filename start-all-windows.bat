@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo 日本上市公司信息披露平台 - 完整启动
echo ========================================
echo.

REM 检查backend目录
if not exist "backend\venv" (
    echo 错误：后端未安装
    echo 请先运行 backend\install-windows.bat
    pause
    exit /b 1
)

REM 检查frontend目录
if not exist "frontend\node_modules" (
    echo 错误：前端未安装
    echo 请先运行 frontend\install-windows.bat
    pause
    exit /b 1
)

echo 启动后端服务...
start "后端API服务 - http://localhost:8000" cmd /k "cd backend && call venv\Scripts\activate.bat && uvicorn app.main:app --reload --port 8000"

timeout /t 3 /nobreak >nul

echo 启动前端服务...
start "前端服务 - http://localhost:3000" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo 服务启动完成！
echo ========================================
echo.
echo 后端API: http://localhost:8000/docs
echo 前端应用: http://localhost:3000
echo.
echo 两个新窗口已打开，请保持它们运行
echo 关闭窗口即可停止服务
echo.
pause
