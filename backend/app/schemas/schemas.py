"""
Pydantic Schemas for API
"""
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from decimal import Decimal
from typing import Optional, List


# ============ 公司相关 ============
class CompanyBase(BaseModel):
    stock_code: str
    company_name: str
    company_name_en: Optional[str] = None
    industry: Optional[str] = None
    market: Optional[str] = None


class CompanyResponse(CompanyBase):
    id: int
    listing_date: Optional[datetime] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ============ 披露相关 ============
class DisclosureBase(BaseModel):
    doc_id: str
    stock_code: str
    company_name: str
    title: str
    doc_type: Optional[str] = None
    submit_date: datetime
    source: str


class DisclosureResponse(DisclosureBase):
    id: int
    doc_type_code: Optional[str] = None
    fiscal_year: Optional[str] = None
    period: Optional[str] = None
    pdf_url: Optional[str] = None
    html_url: Optional[str] = None
    xbrl_url: Optional[str] = None
    summary: Optional[str] = None
    is_important: bool = False
    view_count: int = 0
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class DisclosureListResponse(BaseModel):
    """披露列表响应（带分页）"""
    items: List[DisclosureResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


# ============ 财报相关 ============
class FinancialReportBase(BaseModel):
    stock_code: str
    fiscal_year: str
    period: str
    revenue: Optional[Decimal] = None
    operating_income: Optional[Decimal] = None
    net_income: Optional[Decimal] = None
    total_assets: Optional[Decimal] = None
    total_equity: Optional[Decimal] = None
    eps: Optional[Decimal] = None


class FinancialReportResponse(FinancialReportBase):
    id: int
    ordinary_income: Optional[Decimal] = None
    total_liabilities: Optional[Decimal] = None
    operating_cf: Optional[Decimal] = None
    investing_cf: Optional[Decimal] = None
    financing_cf: Optional[Decimal] = None
    bps: Optional[Decimal] = None
    dividend: Optional[Decimal] = None
    roe: Optional[Decimal] = None
    report_date: Optional[datetime] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class FinancialReportListResponse(BaseModel):
    """财报列表响应"""
    items: List[FinancialReportResponse]
    total: int


# ============ 公司详情 ============
class CompanyDetailResponse(CompanyResponse):
    """公司详情（包含披露列表和财报）"""
    latest_disclosures: List[DisclosureResponse] = []
    latest_financials: List[FinancialReportResponse] = []


# ============ 通用响应 ============
class MessageResponse(BaseModel):
    """通用消息响应"""
    message: str
    detail: Optional[str] = None
