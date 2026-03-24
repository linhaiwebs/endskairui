# 生产环境部署指南

## 📋 部署前准备

### 1. 服务器要求
- Ubuntu 20.04+ 或 CentOS 7+
- 内存: 4GB+
- 磁盘: 20GB+
- Docker & Docker Compose 已安装

### 2. 域名配置
- 主域名: `your-domain.com` (前端)
- API域名: `api.your-domain.com` (后端)
- 已解析到服务器IP

### 3. EDINET API密钥
从 https://api.edinet-fsa.go.jp/ 申请

## 🚀 快速部署

### 步骤1: 克隆代码
```bash
git clone https://github.com/your-username/endskairui.git
cd endskairui
git checkout fix/frontend-api-types-and-installation
```

### 步骤2: 配置环境变量
```bash
# 复制环境变量模板
cp .env.production.example .env.production

# 编辑配置文件
nano .env.production
```

**必须配置的变量:**
```env
DOMAIN=your-domain.com
BACKEND_DOMAIN=api.your-domain.com
EDINET_API_KEY=your-api-key-here
POSTGRES_PASSWORD=your-secure-password
SECRET_KEY=your-secret-key-here
```

### 步骤3: 一键部署
```bash
./deploy.sh
```

部署脚本会自动：
- ✅ 检查系统环境
- ✅ 申请SSL证书（Let's Encrypt）
- ✅ 构建Docker镜像
- ✅ 启动所有服务
- ✅ 初始化数据库
- ✅ 获取最新数据

## 📦 手动部署（高级）

### 1. 申请SSL证书
```bash
sudo certbot certonly --standalone \
  -d your-domain.com \
  -d www.your-domain.com \
  -d api.your-domain.com

sudo cp /etc/letsencrypt/live/your-domain.com/*.pem nginx/ssl/
```

### 2. 构建镜像
```bash
docker-compose -f docker-compose.prod.yml build
```

### 3. 启动服务
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 4. 初始化数据
```bash
docker-compose -f docker-compose.prod.yml exec backend python scripts/init_db.py
docker-compose -f docker-compose.prod.yml exec backend python scripts/fetch_edinet.py 30
```

## 🔧 日常运维

### 查看日志
```bash
# 所有服务日志
docker-compose -f docker-compose.prod.yml logs -f

# 特定服务日志
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### 重启服务
```bash
# 重启所有服务
docker-compose -f docker-compose.prod.yml restart

# 重启特定服务
docker-compose -f docker-compose.prod.yml restart backend
```

### 更新代码
```bash
git pull
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### 更新数据
```bash
# 手动获取最新数据
docker-compose -f docker-compose.prod.yml exec backend python scripts/fetch_edinet.py 1

# 查看定时任务日志
docker-compose -f docker-compose.prod.yml logs -f scheduler
```

### 备份数据库
```bash
# 创建备份
docker-compose -f docker-compose.prod.yml exec db pg_dump -U postgres jp_disclosure > backup_$(date +%Y%m%d).sql

# 恢复备份
cat backup_20240101.sql | docker-compose -f docker-compose.prod.yml exec -T db psql -U postgres jp_disclosure
```

## 🔐 安全配置

### 1. 防火墙设置
```bash
# Ubuntu
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable

# CentOS
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 2. 修改默认密码
在 `.env.production` 中修改：
- `POSTGRES_PASSWORD`
- `REDIS_PASSWORD`
- `SECRET_KEY`

### 3. SSL证书续期
```bash
# 自动续期（crontab）
0 12 * * * /usr/bin/certbot renew --quiet && docker-compose -f /path/to/docker-compose.prod.yml restart nginx
```

## 🐛 故障排查

### 后端无法连接数据库
```bash
# 检查数据库状态
docker-compose -f docker-compose.prod.yml exec db pg_isready

# 查看数据库日志
docker-compose -f docker-compose.prod.yml logs db
```

### 前端无法访问后端API
```bash
# 检查后端服务
curl http://localhost:8000/api/v1/health

# 检查nginx配置
docker-compose -f docker-compose.prod.yml exec nginx nginx -t
```

### SSL证书错误
```bash
# 检查证书文件
ls -la nginx/ssl/

# 重新申请证书
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com -d api.your-domain.com
```

## 📊 性能优化

### 1. Nginx缓存
已在 `nginx/nginx.conf` 中配置静态文件缓存

### 2. 数据库优化
```sql
-- 连接数据库
docker-compose -f docker-compose.prod.yml exec db psql -U postgres jp_disclosure

-- 创建索引
CREATE INDEX idx_disclosures_date ON disclosures(submit_date DESC);
CREATE INDEX idx_disclosures_stock_code ON disclosures(stock_code);
```

### 3. Redis缓存
已在后端代码中配置Redis缓存热点数据

## 🌐 域名配置示例

### DNS解析
```
A记录: your-domain.com -> 服务器IP
A记录: www.your-domain.com -> 服务器IP
A记录: api.your-domain.com -> 服务器IP
```

### Nginx配置
已配置在 `nginx/nginx.conf`:
- 前端: `https://your-domain.com`
- 后端API: `https://api.your-domain.com`
- 自动HTTP->HTTPS重定向
- SSL/TLS优化配置

## 📞 支持

遇到问题？请查看：
1. 项目README
2. GitHub Issues: https://github.com/your-username/endskairui/issues
