@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo 日本上市公司信息披露平台 - 前端安装
echo ========================================
echo.

REM 检查Node.js
echo [1/3] 检查Node.js版本...
where node >nul 2>&1
if errorlevel 1 (
    echo 错误：未找到Node.js，请先安装Node.js 18+
    echo 下载地址：https://nodejs.org/
    pause
    exit /b 1
)
node --version
npm --version
echo.

REM 安装依赖
echo [2/3] 安装前端依赖...
call npm install
if errorlevel 1 (
    echo 错误：依赖安装失败
    pause
    exit /b 1
)
echo.

REM 配置环境变量
echo [3/3] 配置环境变量...
if not exist ".env.local" (
    if exist ".env.example" (
        copy .env.example .env.local
        echo 已创建.env.local文件，请根据需要修改配置
    ) else (
        echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local
        echo 已创建默认.env.local文件
    )
) else (
    echo .env.local文件已存在
)
echo.

echo ========================================
echo 前端安装完成！
echo ========================================
echo.
echo 下一步：运行 start-windows.bat 启动前端服务
echo.
pause
