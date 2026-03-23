@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo 日本上市公司信息披露平台 - 前端服务
echo ========================================
echo.

REM 检查node_modules
if not exist "node_modules" (
    echo 错误：未找到node_modules目录
    echo 请先运行 install-windows.bat 进行安装
    pause
    exit /b 1
)

REM 检查.env.local
if not exist ".env.local" (
    echo 警告：未找到.env.local配置文件
    echo 正在使用默认配置...
    echo 请复制 .env.example 为 .env.local 并修改配置
    echo.
)

REM 检查后端服务
echo 检查后端API服务...
curl -s http://localhost:8000/health >nul 2>&1
if errorlevel 1 (
    echo 警告：后端API服务未运行
    echo 请确保后端服务已启动（http://localhost:8000）
    echo.
    choice /C YN /M "是否继续启动前端？"
    if errorlevel 2 exit /b 1
)

REM 启动服务
echo 启动Next.js开发服务器...
echo 前端地址：http://localhost:3000
echo 按 Ctrl+C 停止服务
echo.
npm run dev
