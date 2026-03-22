"""
数据库初始化脚本
创建示例数据用于测试
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime, timedelta
from decimal import Decimal
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, engine, Base
from app.models.models import Company, Disclosure, FinancialReport


def create_tables():
    """创建所有表"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created successfully")


def insert_sample_data():
    """插入示例数据"""
    db: Session = SessionLocal()
    
    try:
        # 检查是否已有数据
        if db.query(Company).count() > 0:
            print("Sample data already exists, skipping...")
            return
        
        print("Inserting sample data...")
        
        # 示例公司
        companies = [
            Company(
                stock_code="7203",
                company_name="トヨタ自動車株式会社",
                company_name_en="Toyota Motor Corporation",
                industry="輸送用機器",
                market="プライム",
                listing_date=datetime(1949, 5, 16)
            ),
            Company(
                stock_code="6758",
                company_name="ソニーグループ株式会社",
                company_name_en="Sony Group Corporation",
                industry="電気機器",
                market="プライム",
                listing_date=datetime(1958, 10, 15)
            ),
            Company(
                stock_code="9984",
                company_name="ソフトバンクグループ株式会社",
                company_name_en="SoftBank Group Corp.",
                industry="情報通信業",
                market="プライム",
                listing_date=datetime(1994, 7, 22)
            ),
            Company(
                stock_code="6861",
                company_name="キーエンス株式会社",
                company_name_en="Keyence Corporation",
                industry="電気機器",
                market="プライム",
                listing_date=datetime(1974, 7, 25)
            ),
            Company(
                stock_code="8306",
                company_name="三菱UFJフィナンシャル・グループ",
                company_name_en="Mitsubishi UFJ Financial Group, Inc.",
                industry="銀行業",
                market="プライム",
                listing_date=datetime(2001, 4, 2)
            ),
        ]
        
        db.add_all(companies)
        db.commit()
        print(f"✓ Inserted {len(companies)} companies")
        
        # 示例披露
        disclosures = [
            Disclosure(
                doc_id="EDINET2024031500001",
                stock_code="7203",
                company_name="トヨタ自動車株式会社",
                title="2024年3月期 第3四半期決算短信",
                doc_type="四半期報告書",
                doc_type_code="020",
                submit_date=datetime(2024, 2, 8, 15, 30),
                fiscal_year="2024",
                period="第3四半期",
                source="EDINET",
                pdf_url="https://example.com/doc1.pdf",
                html_url="https://example.com/doc1.html",
            ),
            Disclosure(
                doc_id="EDINET2024031500002",
                stock_code="6758",
                company_name="ソニーグループ株式会社",
                title="2024年3月期 第3四半期決算説明資料",
                doc_type="四半期報告書",
                doc_type_code="020",
                submit_date=datetime(2024, 2, 7, 16, 0),
                fiscal_year="2024",
                period="第3四半期",
                source="EDINET",
                pdf_url="https://example.com/doc2.pdf",
            ),
            Disclosure(
                doc_id="EDINET2024031500003",
                stock_code="9984",
                company_name="ソフトバンクグループ株式会社",
                title="2024年3月期 第3四半期決算短信（IFRS）",
                doc_type="四半期報告書",
                doc_type_code="020",
                submit_date=datetime(2024, 2, 6, 17, 0),
                fiscal_year="2024",
                period="第3四半期",
                source="EDINET",
            ),
            Disclosure(
                doc_id="EDINET2024031400001",
                stock_code="7203",
                company_name="トヨタ自動車株式会社",
                title="自己株式の取得結果に関するお知らせ",
                doc_type="自己株式取得",
                doc_type_code="080",
                submit_date=datetime(2024, 2, 5, 8, 30),
                source="TDnet",
            ),
            Disclosure(
                doc_id="EDINET2024031300001",
                stock_code="6861",
                company_name="キーエンス株式会社",
                title="2024年3月期 業績予想の修正に関するお知らせ",
                doc_type="業績予想の修正",
                doc_type_code="130",
                submit_date=datetime(2024, 2, 4, 15, 0),
                fiscal_year="2024",
                source="TDnet",
            ),
            Disclosure(
                doc_id="EDINET2024031200001",
                stock_code="8306",
                company_name="三菱UFJフィナンシャル・グループ",
                title="2024年3月期 第3四半期決算短信",
                doc_type="四半期報告書",
                doc_type_code="020",
                submit_date=datetime(2024, 2, 3, 15, 30),
                fiscal_year="2024",
                period="第3四半期",
                source="EDINET",
            ),
        ]
        
        db.add_all(disclosures)
        db.commit()
        print(f"✓ Inserted {len(disclosures)} disclosures")
        
        # 示例财报
        financials = [
            # 丰田汽车
            FinancialReport(
                stock_code="7203",
                fiscal_year="2023",
                period="通期",
                revenue=Decimal("37000000"),
                operating_income=Decimal("3500000"),
                net_income=Decimal("2800000"),
                total_assets=Decimal("72000000"),
                total_equity=Decimal("28000000"),
                eps=Decimal("202.5"),
                roe=Decimal("10.5"),
                report_date=datetime(2023, 5, 10)
            ),
            FinancialReport(
                stock_code="7203",
                fiscal_year="2023",
                period="第3四半期",
                revenue=Decimal("27500000"),
                operating_income=Decimal("2700000"),
                net_income=Decimal("2100000"),
                total_assets=Decimal("71000000"),
                total_equity=Decimal("27500000"),
                eps=Decimal("152.1"),
                report_date=datetime(2024, 2, 8)
            ),
            # 索尼
            FinancialReport(
                stock_code="6758",
                fiscal_year="2023",
                period="通期",
                revenue=Decimal("13000000"),
                operating_income=Decimal("1500000"),
                net_income=Decimal("1000000"),
                total_assets=Decimal("45000000"),
                total_equity=Decimal("8000000"),
                eps=Decimal("78.5"),
                roe=Decimal("12.5"),
                report_date=datetime(2023, 4, 28)
            ),
            FinancialReport(
                stock_code="6758",
                fiscal_year="2023",
                period="第3四半期",
                revenue=Decimal("9800000"),
                operating_income=Decimal("1200000"),
                net_income=Decimal("800000"),
                total_assets=Decimal("44000000"),
                total_equity=Decimal("8200000"),
                eps=Decimal("62.8"),
                report_date=datetime(2024, 2, 7)
            ),
            # 软银
            FinancialReport(
                stock_code="9984",
                fiscal_year="2023",
                period="通期",
                revenue=Decimal("6500000"),
                operating_income=Decimal("800000"),
                net_income=Decimal("-500000"),
                total_assets=Decimal("52000000"),
                total_equity=Decimal("5000000"),
                eps=Decimal("-35.2"),
                roe=Decimal("-8.5"),
                report_date=datetime(2023, 5, 11)
            ),
        ]
        
        db.add_all(financials)
        db.commit()
        print(f"✓ Inserted {len(financials)} financial reports")
        
        print("\n✅ Sample data insertion completed!")
        
    except Exception as e:
        print(f"❌ Error inserting sample data: {e}")
        db.rollback()
        raise
    finally:
        db.close()


def main():
    """主函数"""
    print("=" * 60)
    print("日本上市公司信息披露平台 - 数据库初始化")
    print("=" * 60)
    print()
    
    create_tables()
    print()
    insert_sample_data()
    print()
    print("=" * 60)
    print("Initialization completed!")
    print("=" * 60)


if __name__ == "__main__":
    main()
