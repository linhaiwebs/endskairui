# 日本上市公司信息披露平台 - 项目记忆

## 项目概述

这是一个生产级的日本上市公司公开披露信息查询平台，整合EDINET和TDnet数据源。

## 技术栈

- **前端**: Next.js 14 (App Router) + TypeScript + TailwindCSS + Chart.js
- **后端**: FastAPI (Python 3.11) + SQLAlchemy
- **数据库**: PostgreSQL 15
- **部署**: Docker + Docker Compose

## 核心合规要求

1. ⚠️ 不提供任何投资建议、股票推荐
2. 每个页面必须包含免责声明
3. 数据来源必须明确标注（EDINET、TDnet）
4. 页面风格为数据查询/信息展示，不类似交易平台

## 关键文件

### 后端
- `backend/app/main.py` - FastAPI应用入口
- `backend/app/models/models.py` - 数据库模型（Company, Disclosure, FinancialReport）
- `backend/app/api/disclosures.py` - 披露API路由
- `backend/app/api/stocks.py` - 公司API路由
- `backend/app/services/data_fetcher.py` - EDINET数据获取服务
- `backend/scripts/init_db.py` - 数据库初始化脚本

### 前端
- `frontend/app/page.tsx` - 首页
- `frontend/app/disclosures/page.tsx` - 披露列表
- `frontend/app/disclosure/[id]/page.tsx` - 披露详情
- `frontend/app/stock/[code]/page.tsx` - 公司详情
- `frontend/app/sitemap.ts` - 动态sitemap生成

## 数据库模型

### Company (公司)
- stock_code: 股票代码（主键）
- company_name: 公司名称
- industry: 行业
- market: 市场（プライム等）

### Disclosure (披露)
- doc_id: 文档ID（唯一）
- stock_code: 股票代码
- title: 标题
- doc_type: 文档类型
- submit_date: 提交日期
- source: 来源（EDINET/TDnet）

### FinancialReport (财报)
- stock_code: 股票代码
- fiscal_year: 会计年度
- period: 期间
- revenue, operating_income, net_income等财务指标

## API端点

- `GET /api/v1/disclosures` - 获取披露列表（支持筛选、分页）
- `GET /api/v1/disclosures/latest` - 获取最新披露
- `GET /api/v1/disclosures/{id}` - 获取披露详情
- `GET /api/v1/stocks` - 获取公司列表
- `GET /api/v1/stocks/{code}` - 获取公司详情
- `GET /api/v1/stocks/{code}/financials` - 获取公司财报

## 开发命令

### 本地开发

```bash
# 后端
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python scripts/init_db.py  # 初始化数据库
uvicorn app.main:app --reload

# 前端
cd frontend
npm install
npm run dev
```

### Docker部署

```bash
# 启动所有服务
docker-compose up -d

# 初始化数据库
docker-compose exec backend python scripts/init_db.py

# 查看日志
docker-compose logs -f
```

## 数据同步

定时任务从EDINET获取数据：
```bash
python scripts/fetch_edinet.py [days]
```

建议配置crontab每天运行2次（上午9:00、下午17:00）

## SEO优化

- 所有页面使用SSR
- 动态生成meta标签
- 自动生成sitemap.xml
- 配置robots.txt

## 环境变量

### 后端
- `DATABASE_URL` - PostgreSQL连接字符串
- `REDIS_URL` - Redis连接（可选）
- `EDINET_API_KEY` - EDINET API密钥（可选）

### 前端
- `NEXT_PUBLIC_API_URL` - API后端地址
- `NEXT_PUBLIC_BASE_URL` - 网站基础URL

## 注意事项

1. EDINET API有请求限制，Demo模式每天有限次数
2. 数据同步脚本应避免重复插入（doc_id唯一）
3. 所有财务数据单位为百万日元
4. 前端使用App Router，不支持getServerSideProps
5. Docker启动顺序：db -> backend -> frontend

## 常见问题

1. **数据库连接失败**: 检查DATABASE_URL配置，确保PostgreSQL运行
2. **EDINET数据获取失败**: 检查API密钥和网络连接
3. **前端API请求失败**: 检查NEXT_PUBLIC_API_URL配置，确保后端运行

## 更新记录

- 2026-03-22: 初始版本完成，包含核心功能
