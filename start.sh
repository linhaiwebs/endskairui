#!/bin/bash

# 日本上市公司信息披露平台 - 快速启动脚本

set -e

echo "=========================================="
echo "日本上市公司信息披露平台 - 快速启动"
echo "=========================================="
echo ""

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: Docker未安装，请先安装Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ 错误: Docker Compose未安装，请先安装Docker Compose"
    exit 1
fi

# 检查.env文件
if [ ! -f .env ]; then
    echo "📝 创建环境配置文件..."
    cat > .env << EOF
# EDINET API密钥（可选，不提供则使用Demo模式）
EDINET_API_KEY=Demo
EOF
    echo "✅ 已创建.env文件"
fi

echo ""
echo "🚀 启动服务..."
echo ""

# 启动服务
docker-compose up -d

echo ""
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo ""
echo "📊 服务状态:"
docker-compose ps

echo ""
echo "=========================================="
echo "✅ 服务启动成功！"
echo "=========================================="
echo ""
echo "访问地址:"
echo "  🌐 前端: http://localhost:3000"
echo "  📚 API文档: http://localhost:8000/docs"
echo ""
echo "初始化数据库:"
echo "  docker-compose exec backend python scripts/init_db.py"
echo ""
echo "查看日志:"
echo "  docker-compose logs -f"
echo ""
echo "停止服务:"
echo "  docker-compose down"
echo ""
