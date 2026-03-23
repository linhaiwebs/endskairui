# Windows环境安装指南

## ⚠️ Windows环境注意事项

本项目在Windows环境下可能会遇到以下问题：

1. **psycopg2-binary** - PostgreSQL驱动在Windows上可能有编译问题
2. **celery** - 不支持Windows的某些Unix信号机制
3. **redis** - Windows原生不支持Redis服务
4. **edinet-tools** - 可能依赖特定版本的库

## 🔧 推荐解决方案

### 方案一：使用Docker（强烈推荐）

Docker可以在Windows上提供完整的Linux环境，避免所有兼容性问题：

```powershell
# 安装Docker Desktop for Windows
# https://www.docker.com/products/docker-desktop

# 启动项目
docker-compose up -d

# 初始化数据库
docker-compose exec backend python scripts/init_db.py
```

### 方案二：使用WSL2（Windows Subsystem for Linux）

```powershell
# 启用WSL2
wsl --install

# 安装Ubuntu
wsl --install -d Ubuntu-22.04

# 在WSL2中运行项目（参考Linux安装步骤）
```

### 方案三：本地Python环境（需要调整）

如果必须在Windows原生Python环境运行，请按以下步骤操作：

#### 1. 安装PostgreSQL

```powershell
# 下载并安装PostgreSQL for Windows
# https://www.postgresql.org/download/windows/

# 或使用Chocolatey
choco install postgresql
```

#### 2. 创建虚拟环境

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
```

#### 3. 安装依赖（选择一种方式）

**方式A：使用Windows优化版本**
```powershell
pip install -r requirements-windows.txt
```

**方式B：手动安装（推荐）**
```powershell
# 核心依赖
pip install fastapi uvicorn pydantic pydantic-settings

# 数据库（使用psycopg v3）
pip install sqlalchemy alembic "psycopg[binary,pool]"

# HTTP客户端
pip install httpx

# 工具库
pip install python-dotenv python-dateutil

# EDINET工具（可选，如果失败可以跳过）
pip install edinet-tools
```

#### 4. 配置环境变量

创建 `.env` 文件：
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/jp_disclosure
```

#### 5. 初始化数据库

```powershell
python scripts\init_db.py
```

#### 6. 启动服务

```powershell
uvicorn app.main:app --reload --port 8000
```

## 🐛 常见问题解决

### 问题1: psycopg2安装失败

**解决方案**：
```powershell
# 方法1: 使用预编译wheel
pip install pipwin
pipwin install psycopg2

# 方法2: 使用psycopg v3（推荐）
pip install "psycopg[binary,pool]"

# 方法3: 使用ODBC驱动
pip install pyodbc
# 需要先安装PostgreSQL ODBC驱动
```

如果使用psycopg v3，需要修改代码：
```python
# app/core/database.py
# 将连接字符串改为：
# postgresql://user:pass@host/db -> postgresql://user:pass@host/db
# psycopg和psycopg2使用相同的连接字符串格式
```

### 问题2: edinet-tools安装失败

**解决方案**：
```powershell
# 跳过此依赖，使用备用数据获取方式
# 或者手动实现EDINET API调用

pip install requests
# 然后自己实现EDINET API调用逻辑
```

### 问题3: redis连接失败

**解决方案**：
```powershell
# 方案1: 使用Windows版Redis
# https://github.com/microsoftarchive/redis/releases

# 方案2: 使用Memurai（Windows原生Redis替代品）
# https://www.memurai.com/

# 方案3: 禁用Redis缓存（最简单）
# 修改代码，移除Redis依赖
```

### 问题4: celery不工作

**解决方案**：
```powershell
# Celery在Windows上有限制，建议：

# 方案1: 使用Windows兼容版本
pip install celery[redis]
# 使用 --pool=solo 参数启动
celery -A tasks worker --pool=solo -l info

# 方案2: 使用APScheduler（推荐）
pip install apscheduler
# 替换celery为APScheduler

# 方案3: 使用定时任务脚本
# 创建Windows计划任务运行数据同步脚本
```

## 📝 代码调整建议

### 移除Redis和Celery依赖

创建 `app/core/cache.py`：
```python
"""简单的内存缓存实现（替代Redis）"""
from functools import lru_cache
from typing import Optional
import time

class SimpleCache:
    def __init__(self):
        self._cache = {}
        self._expire = {}
    
    def get(self, key: str) -> Optional[str]:
        if key in self._cache:
            if time.time() < self._expire.get(key, 0):
                return self._cache[key]
            else:
                del self._cache[key]
                del self._expire[key]
        return None
    
    def set(self, key: str, value: str, expire: int = 3600):
        self._cache[key] = value
        self._expire[key] = time.time() + expire

# 全局缓存实例
cache = SimpleCache()
```

### 使用APScheduler替代Celery

创建 `scripts/scheduler.py`：
```python
"""定时任务调度器（替代Celery）"""
from apscheduler.schedulers.blocking import BlockingScheduler
from fetch_edinet import fetch_edinet_data

scheduler = BlockingScheduler()

# 每天上午9点和下午5点执行
scheduler.add_job(fetch_edinet_data, 'cron', hour='9,17')

if __name__ == '__main__':
    scheduler.start()
```

## 🚀 推荐的开发环境

对于Windows用户，我们强烈推荐：

1. **Docker Desktop** - 最佳选择，完全兼容
2. **WSL2 + Docker** - 性能最好
3. **WSL2 + 原生Python** - 次优选择

避免直接在Windows原生Python环境运行，除非你有丰富的Python开发经验。

## 📚 相关资源

- [PostgreSQL Windows下载](https://www.postgresql.org/download/windows/)
- [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
- [WSL2安装指南](https://docs.microsoft.com/zh-cn/windows/wsl/install)
- [psycopg v3文档](https://www.psycopg.org/psycopg3/docs/)

## 💡 需要帮助？

如果遇到其他问题，请：
1. 检查错误日志
2. 确认Python版本（推荐3.10-3.12）
3. 尝试使用Docker环境
4. 提交Issue并附上错误信息
