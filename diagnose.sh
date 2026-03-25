#!/bin/bash
echo "=========================================="
echo "项目诊断脚本"
echo "=========================================="
echo ""

cd /www/wwwroot/jstockp.jp

echo "1. 检查.env.production文件是否存在..."
if [ -f .env.production ]; then
    echo "✓ .env.production 存在"
    echo "内容:"
    cat .env.production | grep -E "^(DOMAIN|POSTGRES_|REDIS_|EDINET_)"
else
    echo "✗ .env.production 不存在！"
    exit 1
fi

echo ""
echo "2. 检查容器状态..."
docker compose -f docker-compose.prod.yml ps

echo ""
echo "3. 检查数据库容器日志..."
docker compose -f docker-compose.prod.yml logs --tail=20 db

echo ""
echo "4. 检查后端容器日志..."
docker compose -f docker-compose.prod.yml logs --tail=30 backend

echo ""
echo "5. 检查前端容器日志..."
docker compose -f docker-compose.prod.yml logs --tail=20 frontend

echo ""
echo "6. 检查Nginx容器日志..."
docker compose -f docker-compose.prod.yml logs --tail=20 nginx

echo ""
echo "7. 测试数据库连接..."
docker compose -f docker-compose.prod.yml exec -T db pg_isready && echo "✓ 数据库正常" || echo "✗ 数据库异常"

echo ""
echo "8. 测试后端健康检查..."
if curl -sf http://localhost:8000/api/v1/health > /dev/null 2>&1; then
    echo "✓ 后端健康检查正常"
    curl -s http://localhost:8000/api/v1/health | python3 -m json.tool
else
    echo "✗ 后端健康检查失败"
fi

echo ""
echo "9. 测试API文档访问..."
if curl -sf http://localhost:8000/docs > /dev/null 2>&1; then
    echo "✓ API文档可访问"
else
    echo "✗ API文档无法访问"
fi

echo ""
echo "10. 检查数据库中的数据..."
docker compose -f docker-compose.prod.yml exec -T db psql -U postgres -d jp_disclosure -c "SELECT COUNT(*) as total_disclosures FROM disclosures;" 2>/dev/null

echo ""
echo "11. 检查前端构建状态..."
docker compose -f docker-compose.prod.yml exec -T frontend ls -la /app/.next/ 2>/dev/null | head -10

echo ""
echo "=========================================="
echo "诊断完成"
echo "=========================================="
