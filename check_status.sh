#!/bin/bash
echo "=== 检查容器状态 ==="
docker compose -f /www/wwwroot/jstockp.jp/docker-compose.prod.yml ps

echo ""
echo "=== 检查后端日志（最后50行）==="
docker compose -f /www/wwwroot/jstockp.jp/docker-compose.prod.yml logs --tail=50 backend

echo ""
echo "=== 检查前端日志（最后30行）==="
docker compose -f /www/wwwroot/jstockp.jp/docker-compose.prod.yml logs --tail=30 frontend

echo ""
echo "=== 检查Nginx日志（最后30行）==="
docker compose -f /www/wwwroot/jstockp.jp/docker-compose.prod.yml logs --tail=30 nginx

echo ""
echo "=== 测试后端健康检查 ==="
curl -v http://localhost:8000/api/v1/health

echo ""
echo "=== 测试API文档 ==="
curl -v http://localhost:8000/docs

echo ""
echo "=== 检查数据库数据 ==="
docker compose -f /www/wwwroot/jstockp.jp/docker-compose.prod.yml exec -T db psql -U postgres -d jp_disclosure -c "SELECT COUNT(*) FROM disclosures;"
