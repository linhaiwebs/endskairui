# 日本上市公司信息披露平台 - 部署指南

## 目录
- [环境要求](#环境要求)
- [本地开发](#本地开发)
- [Docker部署](#docker部署)
- [生产部署](#生产部署)
- [Vercel部署（前端）](#vercel部署前端)
- [VPS部署](#vps部署)

---

## 环境要求

### 必需
- Docker 20.10+
- Docker Compose 2.0+

### 或本地开发
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis (可选)

---

## 本地开发

### 1. 后端设置

```bash
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑.env，设置DATABASE_URL等

# 初始化数据库
python scripts/init_db.py

# 启动开发服务器
uvicorn app.main:app --reload --port 8000
```

访问 http://localhost:8000/docs 查看API文档

### 2. 前端设置

```bash
cd frontend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑.env.local，设置NEXT_PUBLIC_API_URL

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

---

## Docker部署

### 快速启动

```bash
# 克隆项目
git clone <repository-url>
cd jp-disclosure-platform

# 启动所有服务
chmod +x start.sh
./start.sh

# 或手动启动
docker-compose up -d
```

### 手动步骤

```bash
# 1. 创建环境配置
cat > .env << EOF
EDINET_API_KEY=your_api_key_here
EOF

# 2. 启动服务
docker-compose up -d

# 3. 初始化数据库
docker-compose exec backend python scripts/init_db.py

# 4. 查看日志
docker-compose logs -f
```

### 访问地址

- 前端: http://localhost:3000
- 后端API: http://localhost:8000
- API文档: http://localhost:8000/docs

### 常用命令

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f backend
docker-compose logs -f frontend

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 清理数据（危险操作）
docker-compose down -v
```

---

## 生产部署

### 环境变量配置

创建生产环境配置文件 `.env.prod`:

```env
# 后端
DATABASE_URL=postgresql://user:password@host:5432/dbname
REDIS_URL=redis://host:6379/0
EDINET_API_KEY=your_production_api_key

# 前端
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 安全建议

1. **数据库安全**
   - 使用强密码
   - 限制数据库访问IP
   - 启用SSL连接

2. **API安全**
   - 配置CORS白名单
   - 启用Rate Limiting
   - 使用HTTPS

3. **前端安全**
   - 配置安全响应头
   - 启用HSTS
   - 配置CSP

---

## Vercel部署（前端）

### 1. 准备工作

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login
```

### 2. 部署前端

```bash
cd frontend

# 首次部署
vercel

# 生产部署
vercel --prod
```

### 3. 配置环境变量

在Vercel Dashboard中设置：
- `NEXT_PUBLIC_API_URL`: 后端API地址
- `NEXT_PUBLIC_BASE_URL`: 网站域名

### 4. 配置域名

1. 在Vercel Dashboard添加自定义域名
2. 配置DNS记录
3. 启用HTTPS（自动）

---

## VPS部署

### 1. 服务器准备

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Docker
curl -fsSL https://get.docker.com | bash
sudo usermod -aG docker $USER

# 安装Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. 部署应用

```bash
# 克隆项目
git clone <repository-url>
cd jp-disclosure-platform

# 配置环境变量
nano .env

# 启动服务
docker-compose up -d

# 配置自动启动
sudo systemctl enable docker
```

### 3. 配置Nginx反向代理

```nginx
# /etc/nginx/sites-available/jp-disclosure
server {
    listen 80;
    server_name yourdomain.com;

    # 前端
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 4. 配置HTTPS

```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com

# 自动续期
sudo systemctl enable certbot.timer
```

### 5. 配置定时任务

```bash
# 编辑crontab
crontab -e

# 添加定时任务（每天9:00和17:00运行）
0 9,17 * * * cd /path/to/project && docker-compose exec backend python scripts/fetch_edinet.py >> /var/log/edinet_sync.log 2>&1
```

---

## 数据备份

### PostgreSQL备份

```bash
# 手动备份
docker-compose exec db pg_dump -U postgres jp_disclosure > backup_$(date +%Y%m%d).sql

# 自动备份（crontab）
0 2 * * * cd /path/to/project && docker-compose exec -T db pg_dump -U postgres jp_disclosure > /backup/db_backup_$(date +\%Y\%m\%d).sql
```

### 恢复数据

```bash
# 恢复备份
cat backup.sql | docker-compose exec -T db psql -U postgres jp_disclosure
```

---

## 监控与日志

### 查看应用日志

```bash
# 所有服务日志
docker-compose logs -f

# 特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend

# 最近100行
docker-compose logs --tail=100 backend
```

### 配置日志轮转

Docker默认配置日志轮转，或自定义：

```yaml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

## 故障排查

### 常见问题

1. **数据库连接失败**
   ```bash
   # 检查数据库状态
   docker-compose exec db pg_isready -U postgres
   
   # 检查连接字符串
   echo $DATABASE_URL
   ```

2. **前端无法访问API**
   - 检查CORS配置
   - 确认后端服务运行
   - 检查NEXT_PUBLIC_API_URL

3. **EDINET数据获取失败**
   - 检查API密钥
   - 检查网络连接
   - 查看错误日志

### 重启服务

```bash
# 重启所有服务
docker-compose restart

# 重启特定服务
docker-compose restart backend
docker-compose restart frontend
```

---

## 性能优化

### 后端优化

1. 启用Redis缓存
2. 配置数据库连接池
3. 启用API响应缓存

### 前端优化

1. 启用静态生成（ISR）
2. 配置CDN加速
3. 优化图片加载

### 数据库优化

1. 创建必要的索引
2. 定期VACUUM
3. 配置连接池

---

## 更新部署

```bash
# 拉取最新代码
git pull origin main

# 重新构建并启动
docker-compose up -d --build

# 运行数据库迁移（如有）
docker-compose exec backend alembic upgrade head
```

---

## 安全检查清单

- [ ] 数据库使用强密码
- [ ] API配置CORS白名单
- [ ] 启用HTTPS
- [ ] 配置安全响应头
- [ ] 定期更新依赖
- [ ] 配置防火墙规则
- [ ] 启用日志审计
- [ ] 定期备份数据

---

## 联系支持

如遇到部署问题，请：
1. 查看日志文件
2. 检查环境配置
3. 提交GitHub Issue
