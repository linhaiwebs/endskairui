"""
API路由 - 统计相关
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import date, timedelta

from app.core.database import get_db
from app.models.models import Disclosure, Company

router = APIRouter(tags=["统计信息"])


@router.get("/stats/overview", summary="获取平台统计概览")
async def get_overview_stats(db: Session = Depends(get_db)):
    """
    获取平台整体统计数据
    
    返回：
    - 总披露数量
    - 上市公司数量
    - 今日新增披露
    - 本周新增披露
    """
    today = date.today()
    week_ago = today - timedelta(days=7)
    
    # 总数统计
    total_disclosures = db.query(Disclosure).count()
    total_companies = db.query(Company).filter(Company.is_active == True).count()
    
    # 今日新增
    today_count = db.query(Disclosure).filter(
        Disclosure.submit_date >= today
    ).count()
    
    # 本周新增
    week_count = db.query(Disclosure).filter(
        Disclosure.submit_date >= week_ago
    ).count()
    
    # 按来源统计
    source_stats = db.query(
        Disclosure.source,
        func.count(Disclosure.id).label('count')
    ).group_by(Disclosure.source).all()
    
    # 按文档类型统计（Top 10）
    doc_type_stats = db.query(
        Disclosure.doc_type,
        func.count(Disclosure.id).label('count')
    ).group_by(Disclosure.doc_type).order_by(desc('count')).limit(10).all()
    
    return {
        "total_disclosures": total_disclosures,
        "total_companies": total_companies,
        "today_new": today_count,
        "week_new": week_count,
        "by_source": {stat[0]: stat[1] for stat in source_stats if stat[0]},
        "by_doc_type": {stat[0]: stat[1] for stat in doc_type_stats if stat[0]}
    }


@router.get("/stats/daily", summary="获取每日披露统计")
async def get_daily_stats(
    days: int = 7,
    db: Session = Depends(get_db)
):
    """
    获取最近N天的每日披露数量统计
    
    - **days**: 统计天数（默认7天）
    """
    end_date = date.today()
    start_date = end_date - timedelta(days=days)
    
    daily_stats = db.query(
        func.date(Disclosure.submit_date).label('date'),
        func.count(Disclosure.id).label('count')
    ).filter(
        Disclosure.submit_date >= start_date
    ).group_by(
        func.date(Disclosure.submit_date)
    ).order_by(
        func.date(Disclosure.submit_date).desc()
    ).all()
    
    return {
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "daily_stats": [
            {"date": str(stat[0]), "count": stat[1]}
            for stat in daily_stats
        ]
    }


@router.get("/stats/hot-companies", summary="获取热门公司")
async def get_hot_companies(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    获取披露数量最多的公司（热门公司）
    
    - **limit**: 返回数量
    """
    hot_companies = db.query(
        Company.stock_code,
        Company.company_name,
        func.count(Disclosure.id).label('disclosure_count')
    ).join(
        Disclosure, Company.stock_code == Disclosure.stock_code
    ).filter(
        Company.is_active == True
    ).group_by(
        Company.stock_code,
        Company.company_name
    ).order_by(
        func.count(Disclosure.id).desc()
    ).limit(limit).all()
    
    return [
        {
            "stock_code": company[0],
            "company_name": company[1],
            "disclosure_count": company[2]
        }
        for company in hot_companies
    ]
