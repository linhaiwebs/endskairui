#!/bin/bash
# 测试API和数据状态

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}API和数据状态测试${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检测环境
if [ -f /www/wwwroot/jstockp.jp/docker-compose.prod.yml ]; then
    cd /www/wwwroot/jstockp.jp
    DOCKER_CMD="docker compose --env-file .env.production -f docker-compose.prod.yml"
    API_BASE="http://localhost:8000"
else
    API_BASE="http://localhost:8000"
    DOCKER_CMD=""
fi

echo -e "${BLUE}测试API端点...${NC}\n"

# 测试健康检查
echo -e "${YELLOW}1. 健康检查 (/api/v1/health)${NC}"
if curl -sf ${API_BASE}/api/v1/health > /dev/null 2>&1; then
    echo -e "   ${GREEN}✓ 后端服务正常${NC}"
    curl -s ${API_BASE}/api/v1/health | python3 -m json.tool 2>/dev/null || curl -s ${API_BASE}/api/v1/health
else
    echo -e "   ${RED}✗ 后端服务异常${NC}"
fi
echo ""

# 测试统计概览
echo -e "${YELLOW}2. 统计概览 (/api/v1/stats/overview)${NC}"
if curl -sf ${API_BASE}/api/v1/stats/overview > /dev/null 2>&1; then
    STATS=$(curl -s ${API_BASE}/api/v1/stats/overview)
    echo -e "   ${GREEN}✓ 统计API正常${NC}"
    echo "$STATS" | python3 -m json.tool 2>/dev/null || echo "$STATS"
    
    # 检查是否有数据
    TOTAL_DISCLOSURES=$(echo "$STATS" | python3 -c "import sys, json; print(json.load(sys.stdin).get('total_disclosures', 0))" 2>/dev/null || echo "0")
    TOTAL_COMPANIES=$(echo "$STATS" | python3 -c "import sys, json; print(json.load(sys.stdin).get('total_companies', 0))" 2>/dev/null || echo "0")
    
    if [ "$TOTAL_DISCLOSURES" -gt 0 ]; then
        echo -e "\n   ${GREEN}✓ 数据库中有 ${TOTAL_DISCLOSURES} 条披露数据${NC}"
    else
        echo -e "\n   ${RED}✗ 数据库中没有披露数据${NC}"
        echo -e "   ${YELLOW}→ 请运行: ./fetch_all_history.sh${NC}"
    fi
    
    if [ "$TOTAL_COMPANIES" -gt 0 ]; then
        echo -e "   ${GREEN}✓ 数据库中有 ${TOTAL_COMPANIES} 家企业数据${NC}"
    else
        echo -e "   ${RED}✗ 数据库中没有企业数据${NC}"
    fi
else
    echo -e "   ${RED}✗ 统计API异常${NC}"
fi
echo ""

# 测试最新披露
echo -e "${YELLOW}3. 最新披露 (/api/v1/disclosures/latest?limit=5)${NC}"
if curl -sf "${API_BASE}/api/v1/disclosures/latest?limit=5" > /dev/null 2>&1; then
    echo -e "   ${GREEN}✓ 披露API正常${NC}"
    curl -s "${API_BASE}/api/v1/disclosures/latest?limit=5" | python3 -m json.tool 2>/dev/null | head -30
    echo -e "   ${BLUE}... (仅显示前30行)${NC}"
else
    echo -e "   ${RED}✗ 披露API异常${NC}"
fi
echo ""

# 测试企业列表
echo -e "${YELLOW}4. 企业列表 (/api/v1/stocks?limit=5)${NC}"
if curl -sf "${API_BASE}/api/v1/stocks?limit=5" > /dev/null 2>&1; then
    echo -e "   ${GREEN}✓ 企业API正常${NC}"
    curl -s "${API_BASE}/api/v1/stocks?limit=5" | python3 -m json.tool 2>/dev/null | head -30
    echo -e "   ${BLUE}... (仅显示前30行)${NC}"
else
    echo -e "   ${RED}✗ 企业API异常${NC}"
fi
echo ""

# 如果在Docker环境，检查数据库
if [ -n "$DOCKER_CMD" ]; then
    echo -e "${YELLOW}5. 数据库状态${NC}"
    $DOCKER_CMD exec -T db pg_isready && echo -e "   ${GREEN}✓ 数据库服务正常${NC}" || echo -e "   ${RED}✗ 数据库服务异常${NC}"
    
    DB_COUNT=$($DOCKER_CMD exec -T db psql -U postgres -d jp_disclosure -t -c "SELECT COUNT(*) FROM disclosures;" 2>/dev/null | tr -d ' ')
    COMPANY_COUNT=$($DOCKER_CMD exec -T db psql -U postgres -d jp_disclosure -t -c "SELECT COUNT(*) FROM companies;" 2>/dev/null | tr -d ' ')
    
    echo -e "   披露数据: ${GREEN}${DB_COUNT}${NC} 条"
    echo -e "   企业数据: ${GREEN}${COMPANY_COUNT}${NC} 家"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}测试完成${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 给出建议
if [ "${TOTAL_DISCLOSURES:-0}" -eq 0 ]; then
    echo -e "${YELLOW}💡 建议：${NC}"
    echo -e "   数据库中没有数据，请运行以下命令获取数据："
    echo -e ""
    echo -e "   ${BLUE}# 获取最近3个月数据（快速测试）${NC}"
    echo -e "   docker compose -f docker-compose.prod.yml exec backend python scripts/fetch_all_history.py --start-date 2023-10-01"
    echo -e ""
    echo -e "   ${BLUE}# 获取所有历史数据（完整数据）${NC}"
    echo -e "   ./fetch_all_history.sh"
    echo ""
fi
