#!/bin/bash
set -e

echo "=========================================="
echo "快速诊断和修复脚本"
echo "=========================================="

cd /www/wwwroot/jstockp.jp

# 1. 拉取最新代码
echo ""
echo "1. 拉取最新代码..."
git pull

# 2. 检查容器状态
echo ""
echo "2. 检查容器状态..."
docker compose -f docker-compose.prod.yml ps

# 3. 测试后端直接访问
echo ""
echo "3. 测试后端直接访问..."
echo "测试 /health:"
curl -s http://localhost:8000/health || echo "后端无法访问"

echo ""
echo "测试 /docs:"
curl -sI http://localhost:8000/docs | head -5 || echo "API文档无法访问"

# 4. 检查数据库数据
echo ""
echo "4. 检查数据库数据..."
docker compose -f docker-compose.prod.yml exec -T db psql -U postgres -d jp_disclosure -c "SELECT COUNT(*) as total FROM disclosures;"

# 5. 如果数据库为空，初始化数据
echo ""
echo "5. 检查是否需要初始化数据..."
COUNT=$(docker compose -f docker-compose.prod.yml exec -T db psql -U postgres -d jp_disclosure -t -c "SELECT COUNT(*) FROM disclosures;" | tr -d ' ')

if [ "$COUNT" -eq 0 ]; then
    echo "数据库为空，开始初始化数据..."
    docker compose -f docker-compose.prod.yml exec -T backend python scripts/init_db.py
    echo "获取最近7天的数据..."
    docker compose -f docker-compose.prod.yml exec -T backend python scripts/fetch_edinet.py 7
else
    echo "数据库已有 $COUNT 条记录"
fi

# 6. 重启后端服务
echo ""
echo "6. 重启后端服务..."
docker compose -f docker-compose.prod.yml restart backend

# 7. 等待服务启动
echo ""
echo "7. 等待服务启动..."
sleep 10

# 8. 再次测试
echo ""
echo "8. 再次测试服务..."
echo "测试健康检查:"
curl -s http://localhost:8000/health | python3 -m json.tool || echo "健康检查失败"

echo ""
echo "测试API列表:"
curl -s http://localhost:8000/api/v1/disclosures?page=1\&page_size=5 | python3 -m json.tool || echo "API调用失败"

echo ""
echo "=========================================="
echo "修复完成！"
echo "=========================================="
echo ""
echo "请访问以下地址测试："
echo "1. API文档: https://jstockp.jp/docs"
echo "2. 健康检查: https://jstockp.jp/health"
echo "3. 披露列表: https://jstockp.jp/api/v1/disclosures"
echo ""
