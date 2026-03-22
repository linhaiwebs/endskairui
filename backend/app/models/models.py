"""
数据库模型定义
"""
from sqlalchemy import Column, Integer, String, DateTime, Numeric, Text, Index, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime

Base = declarative_base()


class Company(Base):
    """上市公司基本信息"""
    __tablename__ = "companies"
    
    id = Column(Integer, primary_key=True, index=True)
    stock_code = Column(String(10), unique=True, nullable=False, index=True, comment="股票代码")
    company_name = Column(String(200), nullable=False, comment="公司名称")
    company_name_en = Column(String(200), comment="公司英文名称")
    industry = Column(String(100), comment="行业")
    market = Column(String(50), comment="市场（东证一部等）")
    sector_code = Column(String(20), comment="行业代码")
    listing_date = Column(DateTime, comment="上市日期")
    is_active = Column(Boolean, default=True, comment="是否活跃")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<Company {self.stock_code}: {self.company_name}>"


class Disclosure(Base):
    """披露信息表"""
    __tablename__ = "disclosures"
    
    id = Column(Integer, primary_key=True, index=True)
    doc_id = Column(String(100), unique=True, nullable=False, index=True, comment="文档唯一ID")
    stock_code = Column(String(10), nullable=False, index=True, comment="股票代码")
    company_name = Column(String(200), nullable=False, comment="公司名称")
    title = Column(String(500), nullable=False, comment="披露标题")
    doc_type = Column(String(50), index=True, comment="文档类型（有价报告、业绩预告等）")
    doc_type_code = Column(String(20), comment="文档类型代码")
    submit_date = Column(DateTime, nullable=False, index=True, comment="提交日期")
    fiscal_year = Column(String(10), comment="会计年度")
    period = Column(String(20), comment="期间（第一季度等）")
    source = Column(String(20), nullable=False, comment="来源（EDINET/TDnet）")
    pdf_url = Column(Text, comment="PDF链接")
    html_url = Column(Text, comment="HTML链接")
    xbrl_url = Column(Text, comment="XBRL链接")
    summary = Column(Text, comment="内容摘要")
    is_important = Column(Boolean, default=False, comment="是否重要披露")
    view_count = Column(Integer, default=0, comment="浏览次数")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    __table_args__ = (
        Index('idx_submit_date_desc', submit_date.desc()),
        Index('idx_stock_submit', stock_code, submit_date.desc()),
    )
    
    def __repr__(self):
        return f"<Disclosure {self.doc_id}: {self.title[:30]}>"


class FinancialReport(Base):
    """财报数据表"""
    __tablename__ = "financial_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    stock_code = Column(String(10), nullable=False, index=True, comment="股票代码")
    fiscal_year = Column(String(10), nullable=False, comment="会计年度")
    period = Column(String(20), nullable=False, comment="期间")
    
    # 主要财务指标（单位：百万日元）
    revenue = Column(Numeric(15, 2), comment="营业收入")
    operating_income = Column(Numeric(15, 2), comment="营业利润")
    ordinary_income = Column(Numeric(15, 2), comment="经常利润")
    net_income = Column(Numeric(15, 2), comment="净利润")
    
    # 资产负债
    total_assets = Column(Numeric(15, 2), comment="总资产")
    total_liabilities = Column(Numeric(15, 2), comment="总负债")
    total_equity = Column(Numeric(15, 2), comment="股东权益")
    
    # 现金流
    operating_cf = Column(Numeric(15, 2), comment="经营活动现金流")
    investing_cf = Column(Numeric(15, 2), comment="投资活动现金流")
    financing_cf = Column(Numeric(15, 2), comment="筹资活动现金流")
    
    # 每股数据
    eps = Column(Numeric(10, 2), comment="每股收益")
    bps = Column(Numeric(10, 2), comment="每股净资产")
    
    # 其他指标
    dividend = Column(Numeric(10, 2), comment="股息")
    roe = Column(Numeric(5, 2), comment="净资产收益率")
    
    # 元数据
    doc_id = Column(String(100), comment="关联的披露文档ID")
    report_date = Column(DateTime, comment="报告日期")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    __table_args__ = (
        Index('idx_stock_fiscal', stock_code, fiscal_year),
        Index('idx_unique_report', stock_code, fiscal_year, period, unique=True),
    )
    
    def __repr__(self):
        return f"<FinancialReport {self.stock_code} {self.fiscal_year} {self.period}>"
