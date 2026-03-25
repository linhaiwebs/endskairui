#!/bin/bash
# 获取所有历史数据脚本
# 从EDINET获取所有历史披露和企业数据

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}EDINET历史数据全量获取${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检查是否在Docker环境中运行
if [ -f /.dockerenv ] || [ -f /www/wwwroot/jstockp.jp/docker-compose.prod.yml ]; then
    echo -e "${YELLOW}检测到Docker环境，在容器内执行...${NC}"
    
    cd /www/wwwroot/jstockp.jp
    
    # 运行脚本
    docker compose --env-file .env.production -f docker-compose.prod.yml exec backend python scripts/fetch_all_history.py "$@"
    
else
    echo -e "${YELLOW}在本地环境执行...${NC}"
    
    # 检查Python环境
    if ! command -v python &> /dev/null; then
        echo -e "${RED}错误: Python未安装${NC}"
        exit 1
    fi
    
    cd "$(dirname "$0")/.."
    
    # 运行Python脚本
    python scripts/fetch_all_history.py "$@"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}数据获取完成${NC}"
echo -e "${GREEN}========================================${NC}"
