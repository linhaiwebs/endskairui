# 日本上市公司信息披露平台 - Windows部署指南

## 📋 项目简介

日本上市公司公开披露信息查询平台，整合EDINET和TDnet数据源，提供公司披露信息和财务数据查询服务。

## 🚀 Windows环境部署

### 方式一：Docker部署（推荐）

**前提条件**：安装 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)

```powershell
# 1. 启动所有服务
docker-compose up -d

# 2. 初始化数据库
docker-compose exec backend python scripts/init_db.py

# 3. 访问应用
# 前端：http://localhost:3000
# 后端API文档：http://localhost:8000/docs
```

### 方式二：Windows原生环境

#### 步骤1：安装依赖

**前提条件**：
- Python 3.10-3.12 ([下载](https://www.python.org/downloads/))
- PostgreSQL 13+ ([下载](https://www.postgresql.org/download/windows/))

```powershell
# 1. 进入backend目录
cd backend

# 2. 运行安装脚本（自动创建虚拟环境并安装依赖）
.\install-windows.bat
```

#### 步骤2：配置数据库

```powershell
# 1. 创建数据库（使用pgAdmin或psql）
CREATE DATABASE jp_disclosure;

# 2. 配置环境变量
copy .env.windows .env
notepad .env  # 修改DATABASE_URL为你的数据库连接信息
```

`.env` 文件示例：
```env
DATABASE_URL=postgresql://postgres:你的密码@localhost:5432/jp_disclosure
USE_REDIS=false
```

#### 步骤3：初始化数据库

```powershell
# 方式1：使用批处理脚本
.\init-db-windows.bat

# 方式2：手动执行
.\venv\Scripts\Activate.ps1
python scripts\init_db.py
```

#### 步骤4：启动后端服务

```powershell
# 方式1：使用批处理脚本
.\start-windows.bat

# 方式2：手动启动
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

访问：http://localhost:8000/docs 查看API文档

#### 步骤5：部署前端

```powershell
# 1. 进入frontend目录
cd ..\frontend

# 2. 安装前端依赖
.\install-windows.bat

# 3. 启动前端服务
.\start-windows.bat
```

访问：http://localhost:3000 查看前端应用

**注意**：前端和后端需要同时运行，请使用两个PowerShell窗口分别启动。

#### 快速启动（推荐）

```powershell
# 在项目根目录，一键启动前后端服务
.\start-all-windows.bat
```

这会自动打开两个窗口分别运行前后端服务。

## ⚠️ Windows环境常见问题

### 问题1：虚拟环境激活失败

**PowerShell执行策略限制**：
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 问题2：psycopg2安装失败

**解决方案**：安装脚本已自动处理，会尝试安装psycopg v3作为替代。

### 问题3：数据库连接失败

**检查清单**：
1. PostgreSQL服务是否已启动
2. 数据库是否已创建
3. `.env`文件中的DATABASE_URL是否正确
4. 防火墙是否允许连接

### 问题4：端口被占用

```powershell
# 查看端口占用
netstat -ano | findstr :8000

# 结束占用进程
taskkill /PID <进程ID> /F
```

## 🔧 配置说明

### 环境变量（.env文件）

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| DATABASE_URL | PostgreSQL连接字符串 | postgresql://postgres:postgres@localhost:5432/jp_disclosure |
| USE_REDIS | 是否使用Redis缓存 | false |
| EDINET_API_KEY | EDINET API密钥（可选） | 无 |

### 定时任务（数据同步）

Windows环境使用APScheduler替代Celery：

```powershell
# 启动定时任务调度器
python scripts\scheduler.py
```

默认每天上午9:00和下午17:00自动同步EDINET数据。

## 📦 项目结构

```
backend/
├── app/                    # 应用代码
│   ├── api/               # API路由
│   ├── models/            # 数据库模型
│   ├── core/              # 核心配置
│   └── main.py            # 应用入口
├── scripts/               # 工具脚本
│   ├── init_db.py        # 数据库初始化
│   ├── fetch_edinet.py   # 数据同步
│   └── scheduler.py      # 定时任务
├── install-windows.bat    # 一键安装脚本
├── start-windows.bat      # 启动脚本
└── init-db-windows.bat    # 数据库初始化脚本
```

## 🔄 数据同步

### 手动同步

```powershell
.\venv\Scripts\Activate.ps1
python scripts\fetch_edinet.py
```

### 自动同步（定时任务）

运行调度器后，系统会自动按计划同步数据。

## 📌 注意事项

1. **Redis缓存**：Windows环境默认使用内存缓存，重启服务后缓存清空
2. **Celery任务队列**：使用APScheduler替代，功能相同
3. **数据库编码**：确保PostgreSQL使用UTF-8编码
4. **管理员权限**：部分操作可能需要管理员权限

## 🆘 技术支持

遇到问题时：
1. 检查Python版本（推荐3.10-3.12）
2. 确认虚拟环境已激活（提示符显示`(venv)`）
3. 查看错误日志
4. 尝试使用Docker部署

## 📄 许可证

MIT License

---

**免责声明**：本平台仅提供公开披露信息查询服务，不构成任何投资建议。
