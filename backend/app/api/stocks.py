"""
API路由 - 公司相关
"""
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional, List

from app.core.database import get_db
from app.models.models import Company, Disclosure, FinancialReport
from app.schemas.schemas import (
    CompanyResponse,
    CompanyDetailResponse,
    DisclosureResponse,
    FinancialReportResponse
)

router = APIRouter(prefix="/stocks", tags=["公司信息"])


@router.get("", response_model=List[CompanyResponse], summary="获取公司列表")
async def get_companies(
    keyword: Optional[str] = Query(None, description="搜索关键词"),
    industry: Optional[str] = Query(None, description="行业筛选"),
    market: Optional[str] = Query(None, description="市场筛选"),
    limit: int = Query(50, ge=1, le=100, description="返回数量"),
    db: Session = Depends(get_db)
):
    """
    获取公司列表，支持搜索和筛选
    
    - **keyword**: 搜索关键词（公司名称或股票代码）
    - **industry**: 按行业筛选
    - **market**: 按市场筛选（东证一部、东证二部等）
    - **limit**: 返回数量限制
    """
    query = db.query(Company).filter(Company.is_active == True)
    
    if keyword:
        query = query.filter(
            (Company.company_name.ilike(f"%{keyword}%")) |
            (Company.company_name_en.ilike(f"%{keyword}%")) |
            (Company.stock_code.ilike(f"%{keyword}%"))
        )
    
    if industry:
        query = query.filter(Company.industry == industry)
    
    if market:
        query = query.filter(Company.market == market)
    
    return [CompanyResponse.model_validate(c) for c in query.limit(limit).all()]


@router.get("/{stock_code}", response_model=CompanyDetailResponse, summary="获取公司详情")
async def get_company_detail(
    stock_code: str,
    db: Session = Depends(get_db)
):
    """
    获取公司详细信息，包括最新披露和财报
    
    - **stock_code**: 股票代码（如：7203）
    """
    # 获取公司信息
    company = db.query(Company).filter(
        Company.stock_code == stock_code
    ).first()
    
    if not company:
        raise HTTPException(status_code=404, detail="公司不存在")
    
    # 获取最新披露（最近10条）
    latest_disclosures = db.query(Disclosure).filter(
        Disclosure.stock_code == stock_code
    ).order_by(desc(Disclosure.submit_date)).limit(10).all()
    
    # 获取最新财报（最近4个报告期）
    latest_financials = db.query(FinancialReport).filter(
        FinancialReport.stock_code == stock_code
    ).order_by(
        desc(FinancialReport.fiscal_year),
        desc(FinancialReport.period)
    ).limit(8).all()
    
    return CompanyDetailResponse(
        **CompanyResponse.model_validate(company).model_dump(),
        latest_disclosures=[DisclosureResponse.model_validate(d) for d in latest_disclosures],
        latest_financials=[FinancialReportResponse.model_validate(f) for f in latest_financials]
    )


@router.get("/{stock_code}/disclosures", response_model=List[DisclosureResponse], summary="获取公司披露列表")
async def get_company_disclosures(
    stock_code: str,
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """获取指定公司的披露列表"""
    disclosures = db.query(Disclosure).filter(
        Disclosure.stock_code == stock_code
    ).order_by(desc(Disclosure.submit_date)).limit(limit).all()
    
    return [DisclosureResponse.model_validate(d) for d in disclosures]


@router.get("/{stock_code}/financials", response_model=List[FinancialReportResponse], summary="获取公司财报数据")
async def get_company_financials(
    stock_code: str,
    years: int = Query(4, ge=1, le=10, description="返回年数"),
    db: Session = Depends(get_db)
):
    """获取指定公司的财报数据"""
    financials = db.query(FinancialReport).filter(
        FinancialReport.stock_code == stock_code
    ).order_by(
        desc(FinancialReport.fiscal_year),
        desc(FinancialReport.period)
    ).limit(years * 4).all()  # 每年最多4个报告期
    
    return [FinancialReportResponse.model_validate(f) for f in financials]


@router.get("/industries/list", response_model=List[str], summary="获取行业列表")
async def get_industries(db: Session = Depends(get_db)):
    """获取所有行业列表"""
    industries = db.query(Company.industry).filter(
        Company.industry.isnot(None)
    ).distinct().all()
    
    return sorted([i[0] for i in industries if i[0]])


@router.get("/markets/list", response_model=List[str], summary="获取市场列表")
async def get_markets(db: Session = Depends(get_db)):
    """获取所有市场列表"""
    markets = db.query(Company.market).filter(
        Company.market.isnot(None)
    ).distinct().all()
    
    return sorted([m[0] for m in markets if m[0]])
