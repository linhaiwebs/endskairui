#!/bin/bash
set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== 日本上場企業開示情報プラットフォーム 一键部署 ===${NC}"
echo ""

# 检查环境
check_requirements() {
    echo -e "${YELLOW}检查系统环境...${NC}"
    
    # 检查Docker
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}错误: Docker未安装${NC}"
        echo "请先安装Docker: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    # 检查Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        echo -e "${RED}错误: Docker Compose未安装${NC}"
        echo "请先安装Docker Compose: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Docker环境正常${NC}"
}

# 配置环境变量
configure_env() {
    echo -e "${YELLOW}配置环境变量...${NC}"
    
    if [ ! -f .env.production ]; then
        echo -e "${RED}错误: .env.production文件不存在${NC}"
        echo "请先复制.env.production.example并填写配置"
        exit 1
    fi
    
    # 加载环境变量
    export $(cat .env.production | grep -v '^#' | xargs)
    
    # 验证必要变量
    if [ -z "$DOMAIN" ] || [ -z "$EDINET_API_KEY" ]; then
        echo -e "${RED}错误: 请在.env.production中配置DOMAIN和EDINET_API_KEY${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ 环境变量配置完成${NC}"
}

# 创建SSL证书目录
setup_ssl() {
    echo -e "${YELLOW}检查SSL证书...${NC}"
    
    mkdir -p nginx/ssl
    
    # Cloudflare代理模式：不需要证书或使用Origin Certificate
    if [ ! -f nginx/ssl/fullchain.pem ] || [ ! -f nginx/ssl/privkey.pem ]; then
        echo -e "${YELLOW}未找到SSL证书${NC}"
        echo -e "${YELLOW}Cloudflare代理模式有两种选择：${NC}"
        echo ""
        echo "1. 使用Cloudflare Origin Certificate（推荐）："
        echo "   - 在Cloudflare控制台：SSL/TLS → Origin Server → Create Certificate"
        echo "   - 下载证书保存到 nginx/ssl/fullchain.pem 和 nginx/ssl/privkey.pem"
        echo ""
        echo "2. 不使用证书（Cloudflare Full模式）："
        echo "   - Cloudflare SSL/TLS模式设置为 'Full'"
        echo "   - 创建空证书文件继续部署"
        echo ""
        read -p "是否创建空证书文件继续部署？(y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # 创建空的占位符文件
            touch nginx/ssl/fullchain.pem
            touch nginx/ssl/privkey.pem
            chmod 644 nginx/ssl/*.pem
            echo -e "${GREEN}✓ 已创建占位符文件（Cloudflare将处理SSL）${NC}"
        else
            echo -e "${RED}请先配置SSL证书后再运行部署脚本${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}✓ SSL证书已存在${NC}"
    fi
}

# 构建镜像
build_images() {
    echo -e "${YELLOW}构建Docker镜像...${NC}"
    
    docker-compose -f docker-compose.prod.yml build --no-cache
    
    echo -e "${GREEN}✓ Docker镜像构建完成${NC}"
}

# 启动服务
start_services() {
    echo -e "${YELLOW}启动服务...${NC}"
    
    # 停止旧容器
    docker-compose -f docker-compose.prod.yml down
    
    # 启动新容器
    docker-compose -f docker-compose.prod.yml up -d
    
    echo -e "${GREEN}✓ 服务启动完成${NC}"
}

# 等待服务就绪
wait_for_services() {
    echo -e "${YELLOW}等待服务就绪...${NC}"
    
    sleep 10
    
    # 检查后端健康
    for i in {1..30}; do
        if curl -f http://localhost:8000/api/v1/health &> /dev/null; then
            echo -e "${GREEN}✓ 后端服务正常${NC}"
            break
        fi
        sleep 2
    done
    
    # 检查前端健康
    for i in {1..30}; do
        if curl -f http://localhost:3000 &> /dev/null; then
            echo -e "${GREEN}✓ 前端服务正常${NC}"
            break
        fi
        sleep 2
    done
}

# 初始化数据
init_data() {
    echo -e "${YELLOW}初始化数据库...${NC}"
    
    docker-compose -f docker-compose.prod.yml exec backend python scripts/init_db.py
    
    echo -e "${GREEN}✓ 数据库初始化完成${NC}"
    
    echo -e "${YELLOW}获取最新数据...${NC}"
    
    docker-compose -f docker-compose.prod.yml exec backend python scripts/fetch_edinet.py 7
    
    echo -e "${GREEN}✓ 数据获取完成${NC}"
}

# 显示结果
show_result() {
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}部署完成！${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "访问地址: ${GREEN}https://${DOMAIN}${NC}"
    echo -e "API文档: ${GREEN}https://${DOMAIN}/docs${NC}"
    echo ""
    echo -e "${YELLOW}Cloudflare配置提示：${NC}"
    echo -e "1. 确保Cloudflare已开启代理模式（橙色云朵）"
    echo -e "2. SSL/TLS模式设置为 'Full' 或 'Full (Strict)'"
    echo -e "3. 建议使用Cloudflare Origin Certificate"
    echo ""
    echo -e "查看日志: docker-compose -f docker-compose.prod.yml logs -f"
    echo -e "停止服务: docker-compose -f docker-compose.prod.yml down"
    echo -e "重启服务: docker-compose -f docker-compose.prod.yml restart"
    echo ""
}

# 主流程
main() {
    check_requirements
    configure_env
    setup_ssl
    build_images
    start_services
    wait_for_services
    init_data
    show_result
}

main

