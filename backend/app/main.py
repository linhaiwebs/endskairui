"""
FastAPI主应用
日本上市公司信息披露平台 API
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.core.database import engine, Base
from app.api import disclosures, stocks

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时
    logger.info(f"Starting {settings.PROJECT_NAME}...")
    
    # 创建数据库表（如果不存在）
    # 注意：生产环境建议使用Alembic迁移
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created/verified")
    
    yield
    
    # 关闭时
    logger.info("Shutting down...")


# 创建FastAPI应用
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="""
## 日本上市公司信息披露平台 API

本平台提供日本上市公司（东交所、JASDAQ等）的公开披露信息查询服务。

### 数据来源
- **EDINET**: 日本金融厅电子披露系统
- **TDnet**: 东京证券交易所适时披露系统

### 免责声明
**本网站仅提供公开披露信息整理，不构成任何投资建议。**

### 功能特性
- 🔍 公司搜索（名称/股票代码）
- 📄 披露信息查询（财报、公告等）
- 📊 财务数据展示
- 🔗 原始文档链接

### 文档类型
- 有価証券報告書（年报）
- 四半期報告書（季报）
- 半期報告書（半年报）
- 臨時報告書（临时报告）
- 业绩预告修正等
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应该限制具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(
    disclosures.router,
    prefix=settings.API_V1_STR
)

app.include_router(
    stocks.router,
    prefix=settings.API_V1_STR
)


@app.get("/", tags=["根目录"])
async def root():
    """API根路径"""
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health", tags=["健康检查"])
async def health_check():
    """健康检查端点"""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
