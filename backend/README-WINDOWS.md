# Windows用户快速指南

## 🚀 快速开始（3步启动）

### 方式一：使用Docker（推荐）

如果你已经安装了Docker Desktop，这是最简单的方式：

```powershell
# 在项目根目录执行
docker-compose up -d

# 初始化数据库
docker-compose exec backend python scripts/init_db.py

# 访问
# 前端：http://localhost:3000
# 后端：http://localhost:8000/docs
```

### 方式二：Windows原生环境

#### 步骤1：安装依赖

双击运行 `backend/install-windows.bat`，或在PowerShell中：

```powershell
cd backend
.\install-windows.bat
```

#### 步骤2：配置数据库

1. 确保已安装PostgreSQL（[下载地址](https://www.postgresql.org/download/windows/)）
2. 创建数据库：
   ```sql
   CREATE DATABASE jp_disclosure;
   ```
3. 复制配置文件：
   ```powershell
   copy .env.windows .env
   ```
4. 编辑 `.env` 文件，修改数据库连接信息

#### 步骤3：初始化并启动

```powershell
# 初始化数据库
python scripts\init_db.py

# 启动服务
.\start-windows.bat

# 或手动启动
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

访问 http://localhost:8000/docs 查看API文档

## 🔧 常见问题

### Q1: psycopg2安装失败

**解决方案**：
```powershell
# 方法1：使用pipwin（预编译包）
pip install pipwin
pipwin install psycopg2

# 方法2：使用psycopg v3（推荐）
pip install "psycopg[binary,pool]"
```

### Q2: edinet-tools安装失败

**解决方案**：跳过此依赖，项目可以正常运行，只是无法自动同步EDINET数据

### Q3: Redis连接失败

**解决方案**：已默认禁用Redis，使用内存缓存替代

### Q4: 定时任务不工作

**解决方案**：Windows不支持Celery，已替换为APScheduler
```powershell
# 启动定时任务调度器
python scripts\scheduler.py
```

## 📁 Windows特定文件

- `install-windows.bat` - 一键安装脚本
- `start-windows.bat` - 快速启动脚本
- `requirements-windows.txt` - Windows优化依赖
- `.env.windows` - Windows环境配置示例
- `WINDOWS_INSTALL.md` - 详细安装指南

## ⚙️ 项目结构调整

为兼容Windows环境，项目做了以下调整：

1. **移除Celery** → 使用APScheduler
2. **移除Redis依赖** → 使用内存缓存
3. **优化PostgreSQL驱动** → 支持psycopg v3
4. **可选edinet-tools** → 可以手动实现数据获取

## 📞 需要帮助？

详细安装指南请查看：[WINDOWS_INSTALL.md](./WINDOWS_INSTALL.md)

遇到问题请提交Issue，并附上：
- Windows版本
- Python版本（`python --version`）
- 错误信息完整输出

## 🎯 下一步

1. 启动后端服务后，访问 http://localhost:8000/docs
2. 测试API接口是否正常
3. 部署前端（参考前端README）
4. 配置定时任务同步数据

## 💡 性能提示

对于生产环境，强烈建议使用：
- Docker部署
- 或WSL2 + Docker

这样可以获得最佳性能和兼容性。
