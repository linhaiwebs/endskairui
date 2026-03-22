"""
日本上市公司信息披露平台 - 核心配置
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """应用配置"""
    # 数据库配置
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/jp_disclosure"
    
    # Redis配置（可选）
    REDIS_URL: Optional[str] = "redis://localhost:6379/0"
    
    # API配置
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "日本上市公司信息披露平台"
    
    # 分页配置
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100
    
    # EDINET API配置
    EDINET_API_KEY: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
