"""
API路由 - 披露相关
"""
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_, or_
from datetime import datetime, date, timedelta
from typing import Optional

from app.core.database import get_db
from app.core.config import settings
from app.models.models import Disclosure
from app.schemas.schemas import (
    DisclosureResponse,
    DisclosureListResponse,
    MessageResponse
)

router = APIRouter(prefix="/disclosures", tags=["披露信息"])


@router.get("", response_model=DisclosureListResponse, summary="获取披露列表")
async def get_disclosures(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    stock_code: Optional[str] = Query(None, description="股票代码筛选"),
    doc_type: Optional[str] = Query(None, description="文档类型筛选"),
    source: Optional[str] = Query(None, description="数据来源（EDINET/TDnet）"),
    start_date: Optional[date] = Query(None, description="开始日期"),
    end_date: Optional[date] = Query(None, description="结束日期"),
    keyword: Optional[str] = Query(None, description="关键词搜索"),
    db: Session = Depends(get_db)
):
    """
    获取披露列表，支持多种筛选条件
    
    - **page**: 页码（从1开始）
    - **page_size**: 每页数量（1-100）
    - **stock_code**: 按股票代码筛选
    - **doc_type**: 按文档类型筛选（有価証券報告書、四半期報告書等）
    - **source**: 按数据来源筛选（EDINET/TDnet）
    - **start_date**: 开始日期
    - **end_date**: 结束日期
    - **keyword**: 关键词搜索（标题中包含）
    """
    # 构建查询
    query = db.query(Disclosure)
    
    # 应用筛选条件
    if stock_code:
        query = query.filter(Disclosure.stock_code == stock_code)
    
    if doc_type:
        query = query.filter(Disclosure.doc_type == doc_type)
    
    if source:
        query = query.filter(Disclosure.source == source.upper())
    
    if start_date:
        query = query.filter(Disclosure.submit_date >= start_date)
    
    if end_date:
        query = query.filter(Disclosure.submit_date < end_date + timedelta(days=1))
    
    if keyword:
        query = query.filter(Disclosure.title.ilike(f"%{keyword}%"))
    
    # 按提交日期降序排序
    query = query.order_by(desc(Disclosure.submit_date))
    
    # 计算总数
    total = query.count()
    
    # 分页
    offset = (page - 1) * page_size
    total_pages = (total + page_size - 1) // page_size
    
    items = query.offset(offset).limit(page_size).all()
    
    return DisclosureListResponse(
        items=[DisclosureResponse.model_validate(item) for item in items],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


@router.get("/latest", response_model=DisclosureListResponse, summary="获取最新披露")
async def get_latest_disclosures(
    limit: int = Query(20, ge=1, le=50, description="返回数量"),
    db: Session = Depends(get_db)
):
    """获取最新的披露信息（按提交时间降序）"""
    items = db.query(Disclosure).order_by(
        desc(Disclosure.submit_date)
    ).limit(limit).all()
    
    return DisclosureListResponse(
        items=[DisclosureResponse.model_validate(item) for item in items],
        total=len(items),
        page=1,
        page_size=limit,
        total_pages=1
    )


@router.get("/{disclosure_id}", response_model=DisclosureResponse, summary="获取披露详情")
async def get_disclosure(
    disclosure_id: int,
    db: Session = Depends(get_db)
):
    """
    获取单条披露详情
    
    - **disclosure_id**: 披露ID
    """
    disclosure = db.query(Disclosure).filter(Disclosure.id == disclosure_id).first()
    
    if not disclosure:
        raise HTTPException(status_code=404, detail="披露信息不存在")
    
    # 增加浏览计数
    disclosure.view_count += 1
    db.commit()
    
    return DisclosureResponse.model_validate(disclosure)


@router.get("/by-doc-id/{doc_id}", response_model=DisclosureResponse, summary="按文档ID获取披露")
async def get_disclosure_by_doc_id(
    doc_id: str,
    db: Session = Depends(get_db)
):
    """按EDINET文档ID获取披露"""
    disclosure = db.query(Disclosure).filter(Disclosure.doc_id == doc_id).first()
    
    if not disclosure:
        raise HTTPException(status_code=404, detail="披露信息不存在")
    
    # 增加浏览计数
    disclosure.view_count += 1
    db.commit()
    
    return DisclosureResponse.model_validate(disclosure)
