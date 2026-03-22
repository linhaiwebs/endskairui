# 日本上市公司信息披露浏览平台

> 📊 日本上市公司公开披露信息查询平台（EDINET + TDnet）

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 项目简介

这是一个完全中立的第三方信息平台，提供日本上市公司（东交所、JASDAQ等）的公开披露信息查询服务。所有数据来源于官方系统，不提供任何投资建议。

### 数据来源

- **EDINET**: 日本金融厅电子披露系统
- **TDnet**: 东京证券交易所适时披露系统

## ⚠️ 免责声明

**本网站仅提供公开披露信息整理，不构成任何投资建议。投资有风险，入市需谨慎。**

## 🏗️ 技术架构

- **前端**: Next.js 14 + TypeScript + TailwindCSS
- **后端**: FastAPI (Python 3.11)
- **数据库**: PostgreSQL 15
- **缓存**: Redis (可选)
- **图表**: Chart.js
- **部署**: Docker + Docker Compose

## 📦 项目结构

```
.
├── backend/                # FastAPI后端
│   ├── app/
│   │   ├── api/           # API路由
│   │   ├── core/          # 核心配置
│   │   ├── models/        # 数据库模型
│   │   ├── schemas/       # Pydantic模型
│   │   ├── services/      # 业务逻辑
│   │   └── main.py        # 应用入口
│   ├── scripts/           # 工具脚本
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/              # Next.js前端
│   ├── app/              # 页面组件
│   ├── components/       # 通用组件
│   ├── lib/              # 工具库
│   ├── package.json
│   └── Dockerfile
├── database/             # 数据库脚本
│   └── init.sql
└── docker-compose.yml    # Docker编排配置
```

## 🚀 快速开始

### 方式一：Docker Compose（推荐）

```bash
# 克隆项目
git clone <repository-url>
cd jp-disclosure-platform

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 初始化数据库（首次运行）
docker-compose exec backend python scripts/init_db.py
```

访问：
- 前端: http://localhost:3000
- 后端API文档: http://localhost:8000/docs

### 方式二：本地开发

#### 后端

```bash
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑.env文件

# 初始化数据库
python scripts/init_db.py

# 启动服务
uvicorn app.main:app --reload --port 8000
```

#### 前端

```bash
cd frontend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑.env.local文件

# 启动开发服务器
npm run dev
```

## 📊 核心功能

### 1. 首页
- 最新披露信息展示
- 热门公司列表
- 搜索功能

### 2. 披露列表 `/disclosures`
- 分页展示所有披露
- 筛选（类型、日期、来源）
- 关键词搜索

### 3. 公司详情 `/stock/[code]`
- 公司基本信息
- 最新披露列表
- 财务数据图表
- 财务指标表格

### 4. 披露详情 `/disclosure/[id]`
- 完整披露信息
- 原文链接（PDF/HTML/XBRL）

## 🔌 API文档

### 披露相关

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/v1/disclosures` | GET | 获取披露列表 |
| `/api/v1/disclosures/latest` | GET | 获取最新披露 |
| `/api/v1/disclosures/{id}` | GET | 获取披露详情 |

### 公司相关

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/v1/stocks` | GET | 获取公司列表 |
| `/api/v1/stocks/{code}` | GET | 获取公司详情 |
| `/api/v1/stocks/{code}/financials` | GET | 获取财务数据 |

## 📥 数据同步

### 定时任务

系统提供定时脚本自动从EDINET获取数据：

```bash
# 手动运行数据同步
python scripts/fetch_edinet.py

# 同步最近7天的数据
python scripts/fetch_edinet.py 7
```

### 配置定时任务

在Docker环境中，scheduler容器已配置每天运行2次（上午9:00和下午17:00）。

手动配置crontab：

```cron
# 每天上午9点和下午5点运行
0 9,17 * * * cd /path/to/backend && python scripts/fetch_edinet.py
```

## 🔒 合规说明

### 严格执行的合规要求

1. ✅ 不提供任何"推荐股票"、"买入/卖出建议"、"预测涨跌"等内容
2. ✅ 每个页面都包含免责声明
3. ✅ 明确标注数据来源
4. ✅ 页面风格为"数据查询/信息展示"
5. ✅ 所有数据均为公开披露信息

### Google Ads合规

本平台设计完全符合Google Ads政策：
- 内容为信息查询服务
- 无投资建议
- 无误导性内容
- 数据来源清晰

## 🐳 生产部署

### 环境变量配置

创建 `.env` 文件：

```env
# 后端
DATABASE_URL=postgresql://user:password@host:5432/dbname
EDINET_API_KEY=your_api_key_here

# 前端
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 部署选项

#### Vercel (前端)

```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
cd frontend
vercel --prod
```

#### VPS/云服务器

```bash
# 使用Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

## 📈 SEO优化

- ✅ 所有页面独立URL
- ✅ 自动生成meta标签
- ✅ 动态sitemap
- ✅ SSR渲染
- ✅ 移动端适配

## 📝 开发说明

### 数据库迁移

使用Alembic进行数据库版本管理：

```bash
# 创建迁移
alembic revision --autogenerate -m "description"

# 应用迁移
alembic upgrade head
```

### 添加新功能

1. 后端：在 `app/api/` 添加路由，在 `app/services/` 添加业务逻辑
2. 前端：在 `app/` 添加页面，在 `components/` 添加组件

## 📄 License

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📧 联系方式

如有问题，请提交Issue。

---

**⚠️ 重要提示：本平台仅提供信息查询服务，不构成任何投资建议。投资有风险，决策需谨慎。**
