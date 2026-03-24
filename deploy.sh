#!/bin/bash
set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}日本上場企業開示情報プラットフォーム${NC}"
echo -e "${GREEN}一键部署脚本（Ubuntu + Docker）${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检测操作系统
check_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
        VER=$VERSION_ID
    else
        echo -e "${RED}无法检测操作系统${NC}"
        exit 1
    fi
    echo -e "${GREEN}检测到操作系统: $OS $VER${NC}"
}

# 安装Docker
install_docker() {
    echo -e "${YELLOW}检查Docker环境...${NC}"
    
    if command -v docker &> /dev/null; then
        echo -e "${GREEN}✓ Docker已安装${NC}"
        docker --version
        return 0
    fi
    
    echo -e "${YELLOW}开始安装Docker...${NC}"
    
    # 更新包索引
    apt-get update
    
    # 安装依赖
    apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release \
        git
    
    # 添加Docker官方GPG密钥
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # 设置Docker仓库
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # 安装Docker
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # 启动Docker
    systemctl start docker
    systemctl enable docker
    
    # 添加当前用户到docker组（可选）
    if [ "$SUDO_USER" ]; then
        usermod -aG docker $SUDO_USER
        echo -e "${GREEN}✓ 已将用户 $SUDO_USER 添加到docker组${NC}"
    fi
    
    echo -e "${GREEN}✓ Docker安装完成${NC}"
    docker --version
}

# 克隆代码
clone_code() {
    echo -e "${YELLOW}检查代码仓库...${NC}"
    
    PROJECT_DIR="/www/wwwroot/jstockp.jp"
    
    if [ -d "$PROJECT_DIR" ]; then
        echo -e "${YELLOW}目录已存在，更新代码...${NC}"
        cd $PROJECT_DIR
        git pull
    else
        echo -e "${YELLOW}克隆代码仓库...${NC}"
        mkdir -p /www/wwwroot
        cd /www/wwwroot
        git clone https://github.com/linhaiwebs/endskairui.git jstockp.jp
        cd jstockp.jp
        git checkout fix/frontend-api-types-and-installation
    fi
    
    echo -e "${GREEN}✓ 代码准备完成${NC}"
}

# 配置环境变量
configure_env() {
    echo -e "${YELLOW}配置环境变量...${NC}"
    
    cd /www/wwwroot/jstockp.jp
    
    # 创建.env.production文件
    cat > .env.production << 'EOF'
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
EOF
    
    echo -e "${GREEN}✓ 环境变量配置完成${NC}"
    echo -e "${BLUE}域名: jstockp.jp${NC}"
    echo -e "${BLUE}HTTP端口: 80${NC}"
}

# 创建必要目录
create_directories() {
    echo -e "${YELLOW}创建必要目录...${NC}"
    
    cd /www/wwwroot/jstockp.jp
    
    mkdir -p nginx/logs
    mkdir -p database
    
    echo -e "${GREEN}✓ 目录创建完成${NC}"
}

# 构建镜像
build_images() {
    echo -e "${YELLOW}构建Docker镜像...${NC}"
    
    cd /www/wwwroot/jstockp.jp
    
    docker compose -f docker-compose.prod.yml build
    
    echo -e "${GREEN}✓ Docker镜像构建完成${NC}"
}

# 启动服务
start_services() {
    echo -e "${YELLOW}启动服务...${NC}"
    
    cd /www/wwwroot/jstockp.jp
    
    # 停止旧容器
    docker compose -f docker-compose.prod.yml down
    
    # 启动新容器
    docker compose -f docker-compose.prod.yml up -d
    
    echo -e "${GREEN}✓ 服务启动完成${NC}"
}

# 等待服务就绪
wait_for_services() {
    echo -e "${YELLOW}等待服务就绪...${NC}"
    
    sleep 15
    
    # 检查容器状态
    echo -e "${YELLOW}容器状态：${NC}"
    docker compose -f /www/wwwroot/jstockp.jp/docker-compose.prod.yml ps
    
    echo ""
    
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
    
    cd /www/wwwroot/jstockp.jp
    
    docker compose -f docker-compose.prod.yml exec -T backend python scripts/init_db.py
    
    echo -e "${GREEN}✓ 数据库初始化完成${NC}"
    
    echo -e "${YELLOW}获取最新数据（最近7天）...${NC}"
    
    docker compose -f docker-compose.prod.yml exec -T backend python scripts/fetch_edinet.py 7
    
    echo -e "${GREEN}✓ 数据获取完成${NC}"
}

# 显示结果
show_result() {
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}部署完成！${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "访问地址: ${GREEN}https://jstockp.jp${NC}"
    echo -e "API文档: ${GREEN}https://jstockp.jp/docs${NC}"
    echo ""
    echo -e "${YELLOW}Cloudflare配置提示：${NC}"
    echo -e "1. DNS解析：A记录 jstockp.jp → 服务器IP（开启代理）"
    echo -e "2. SSL/TLS模式：选择 Flexible 或 Full"
    echo -e "3. 确保80端口可访问"
    echo ""
    echo -e "${BLUE}常用命令：${NC}"
    echo -e "查看日志: docker compose -f /www/wwwroot/jstockp.jp/docker-compose.prod.yml logs -f"
    echo -e "停止服务: docker compose -f /www/wwwroot/jstockp.jp/docker-compose.prod.yml down"
    echo -e "重启服务: docker compose -f /www/wwwroot/jstockp.jp/docker-compose.prod.yml restart"
    echo -e "更新数据: docker compose -f /www/wwwroot/jstockp.jp/docker-compose.prod.yml exec backend python scripts/fetch_edinet.py 1"
    echo ""
}

# 主流程
main() {
    echo -e "${BLUE}开始部署流程...${NC}"
    echo ""
    
    check_os
    install_docker
    clone_code
    configure_env
    create_directories
    build_images
    start_services
    wait_for_services
    init_data
    show_result
}

main

