#!/bin/bash
set -e

echo "=========================================="
echo "修复企业数据问题"
echo "=========================================="

cd /www/wwwroot/jstockp.jp

# 1. 拉取最新代码
echo ""
echo "1. 拉取最新代码..."
git pull

# 2. 检查披露数据
echo ""
echo "2. 检查披露数据..."
docker compose --env-file .env.production -f docker-compose.prod.yml exec -T db psql -U postgres -d jp_disclosure -c "SELECT COUNT(*) as total_disclosures FROM disclosures;"

# 3. 检查企业数据
echo ""
echo "3. 检查企业数据..."
docker compose --env-file .env.production -f docker-compose.prod.yml exec -T db psql -U postgres -d jp_disclosure -c "SELECT COUNT(*) as total_companies FROM companies;"

# 4. 同步企业信息
echo ""
echo "4. 从披露数据中同步企业信息..."
docker compose --env-file .env.production -f docker-compose.prod.yml exec -T backend python scripts/sync_companies.py

# 5. 再次检查企业数据
echo ""
echo "5. 再次检查企业数据..."
docker compose --env-file .env.production -f docker-compose.prod.yml exec -T db psql -U postgres -d jp_disclosure -c "SELECT COUNT(*) as total_companies FROM companies;"

# 6. 测试企业API
echo ""
echo "6. 测试企业列表API..."
curl -s "http://localhost:8000/api/v1/stocks?limit=5" | python3 -m json.tool || echo "API测试失败"

echo ""
echo "=========================================="
echo "修复完成！"
echo "=========================================="
echo ""
echo "测试访问:"
echo "1. 企业列表: https://jstockp.jp/stocks"
echo "2. 企业详情: https://jstockp.jp/stock/7203 (示例)"
echo "3. API测试: https://jstockp.jp/api/v1/stocks?limit=5"
echo ""
