@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo 数据库初始化脚本
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
    echo 请先复制配置文件：copy .env.windows .env
    echo 然后编辑.env文件，修改数据库连接信息
    pause
    exit /b 1
)

REM 运行初始化脚本
echo 正在初始化数据库...
python scripts\init_db.py

if errorlevel 1 (
    echo.
    echo 错误：数据库初始化失败
    echo 请检查：
    echo 1. PostgreSQL服务是否已启动
    echo 2. .env文件中的数据库连接信息是否正确
    echo 3. 数据库是否已创建
    pause
    exit /b 1
)

echo.
echo ========================================
echo 数据库初始化完成！
echo ========================================
echo.
echo 下一步：运行 start-windows.bat 启动服务
echo.
pause
