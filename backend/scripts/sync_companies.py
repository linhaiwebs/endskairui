"""
从已有的披露数据中提取并同步企业信息
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import SessionLocal
from app.models.models import Company, Disclosure

def sync_companies_from_disclosures():
    """从披露数据中提取企业信息"""
    db: Session = SessionLocal()
    
    try:
        print("=" * 60)
        print("从披露数据中同步企业信息")
        print("=" * 60)
        print()
        
        # 获取所有唯一的企业代码和名称
        unique_companies = db.query(
            Disclosure.stock_code,
            Disclosure.company_name,
            func.Count(Disclosure.id).label('disclosure_count')
        ).group_by(
            Disclosure.stock_code,
            Disclosure.company_name
        ).all()
        
        print(f"发现 {len(unique_companies)} 家企业")
        print()
        
        added = 0
        updated = 0
        
        for stock_code, company_name, disclosure_count in unique_companies:
            if not stock_code:
                continue
                
            # 检查企业是否已存在
            existing = db.query(Company).filter(
                Company.stock_code == stock_code
            ).first()
            
            if existing:
                # 更新企业信息
                if existing.company_name != company_name:
                    existing.company_name = company_name
                    updated += 1
            else:
                # 创建新企业
                company = Company(
                    stock_code=stock_code,
                    company_name=company_name,
                    company_name_en=None,  # 暂无英文数据
                    industry=None,  # 需要后续补充
                    market=None,  # 需要后续补充
                    is_active=True
                )
                db.add(company)
                added += 1
                
                if added % 100 == 0:
                    print(f"已添加 {added} 家企业...")
        
        db.commit()
        
        print()
        print(f"✓ 新增企业: {added} 家")
        print(f"✓ 更新企业: {updated} 家")
        print(f"✓ 企业总数: {db.query(Company).count()} 家")
        print()
        print("=" * 60)
        print("企业信息同步完成")
        print("=" * 60)
        
    except Exception as e:
        print(f"❌ 错误: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    sync_companies_from_disclosures()
