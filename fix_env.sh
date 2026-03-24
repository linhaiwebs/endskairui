#!/bin/bash
set -e

echo "=========================================="
echo "修复环境变量问题"
echo "=========================================="

cd /www/wwwroot/jstockp.jp

# 1. 检查.env.production文件
echo ""
echo "1. 检查.env.production文件..."
if [ -f .env.production ]; then
    echo "✓ .env.production 文件存在"
    cat .env.production
else
    echo "✗ .env.production 文件不存在！正在创建..."
    cat > .env.production << 'ENVEOF'
# 域名配置
DOMAIN=jstockp.jp
HTTP_PORT=80

# EDINET API密钥
EDINET_API_KEY=b8c7f7ede3eb4729ab65dc99b3396743

# 数据库配置
POSTGRES_USER=postgres
POSTGRES_PASSWORD=jstockp2024secure
POSTGRES_DB=jp_disclosure

# Redis配置
REDIS_PASSWORD=jstockp2024redis

# 安全配置
SECRET_KEY=jstockp2024secretkey123456789
ENVEOF
    echo "✓ .env.production 文件已创建"
fi

# 2. 停止所有容器
echo ""
echo "2. 停止所有容器..."
docker compose --env-file .env.production -f docker-compose.prod.yml down

# 3. 重新启动容器（使用环境变量）
echo ""
echo "3. 重新启动容器..."
docker compose --env-file .env.production -f docker-compose.prod.yml up -d

# 4. 等待服务启动
echo ""
echo "4. 等待服务启动..."
sleep 15

# 5. 检查容器状态
echo ""
echo "5. 检查容器状态..."
docker compose --env-file .env.production -f docker-compose.prod.yml ps

# 6. 查看后端日志
echo ""
echo "6. 查看后端日志（最后30行）..."
docker compose --env-file .env.production -f docker-compose.prod.yml logs --tail=30 backend

# 7. 测试后端健康检查
echo ""
echo "7. 测试后端健康检查..."
for i in {1..10}; do
    if curl -sf http://localhost:8000/health > /dev/null 2>&1; then
        echo "✓ 后端健康检查成功！"
        curl -s http://localhost:8000/health | python3 -m json.tool
        break
    fi
    echo "等待后端启动... ($i/10)"
    sleep 3
done

# 8. 测试API
echo ""
echo "8. 测试API..."
curl -s "http://localhost:8000/api/v1/disclosures?page=1&page_size=3" | python3 -m json.tool || echo "API测试失败"

echo ""
echo "=========================================="
echo "修复完成！"
echo "=========================================="
echo ""
echo "测试访问:"
echo "1. https://jstockp.jp/health"
echo "2. https://jstockp.jp/docs"
echo "3. https://jstockp.jp/api/v1/disclosures"
echo ""
