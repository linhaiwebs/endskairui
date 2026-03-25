"""
获取所有历史数据脚本
从EDINET API获取所有历史披露数据和企业信息
"""
import asyncio
import sys
import os
from datetime import date, timedelta
import time

# 添加父目录到路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.services.data_fetcher import DataSyncService
from app.models.models import Disclosure, Company
from sqlalchemy import func


async def fetch_all_historical_data(
    start_date: date = None,
    end_date: date = None,
    batch_days: int = 30
):
    """
    获取所有历史数据
    
    Args:
        start_date: 开始日期（默认为2015-01-01，EDINET开始有数据的时间）
        end_date: 结束日期（默认为今天）
        batch_days: 每批处理的天数
    """
    if start_date is None:
        # EDINET从2015年左右开始有数据
        start_date = date(2015, 1, 1)
    
    if end_date is None:
        end_date = date.today()
    
    print(f"\n{'=' * 80}")
    print(f"EDINET历史数据全量同步")
    print(f"{'=' * 80}")
    print(f"📅 数据范围: {start_date} ~ {end_date}")
    print(f"📦 批次大小: {batch_days} 天/批")
    print(f"{'=' * 80}\n")
    
    db = SessionLocal()
    
    try:
        sync_service = DataSyncService(db)
        
        # 计算总天数和批次数
        total_days = (end_date - start_date).days
        total_batches = (total_days + batch_days - 1) // batch_days
        
        print(f"📊 预计处理:")
        print(f"   总天数: {total_days} 天")
        print(f"   总批次: {total_batches} 批")
        print()
        
        # 统计数据
        total_new = 0
        total_skipped = 0
        total_errors = 0
        processed_batches = 0
        
        # 分批处理
        current_date = end_date
        
        while current_date > start_date:
            batch_end = current_date
            batch_start = max(current_date - timedelta(days=batch_days), start_date)
            
            # 计算这批要处理的天数
            days_to_process = (batch_end - batch_start).days
            processed_batches += 1
            
            print(f"\n{'─' * 80}")
            print(f"📦 批次 {processed_batches}/{total_batches}")
            print(f"   日期范围: {batch_start} ~ {batch_end} ({days_to_process} 天)")
            print(f"{'─' * 80}")
            
            try:
                # 同步这批数据
                results = await sync_service.sync_daily_disclosures(
                    days_back=days_to_process
                )
                
                # 统计结果
                batch_new = sum([r.get("new", 0) for r in results["edinet"]])
                batch_skipped = sum([r.get("skipped", 0) for r in results["edinet"]])
                batch_errors = sum([r.get("errors", 0) for r in results["edinet"]])
                
                total_new += batch_new
                total_skipped += batch_skipped
                total_errors += batch_errors
                
                print(f"\n✓ 批次完成:")
                print(f"   新增: {batch_new} 条")
                print(f"   跳过: {batch_skipped} 条")
                print(f"   错误: {batch_errors} 条")
                print(f"   累计新增: {total_new} 条")
                
                # 显示每日详情（如果有错误）
                for day_result in results["edinet"]:
                    if "error" in day_result:
                        print(f"   ⚠️  {day_result['date']}: {day_result['error']}")
                
                # 避免API请求过于频繁
                if processed_batches < total_batches:
                    print(f"\n⏳ 等待 2 秒后继续...")
                    time.sleep(2)
                
            except Exception as e:
                print(f"\n❌ 批次处理失败: {e}")
                total_errors += days_to_process
                # 继续下一批
            
            # 移动到下一批
            current_date = batch_start - timedelta(days=1)
        
        # 最终统计
        print(f"\n{'=' * 80}")
        print(f"✅ 历史数据同步完成！")
        print(f"{'=' * 80}")
        print(f"📊 最终统计:")
        print(f"   处理批次: {processed_batches}/{total_batches}")
        print(f"   新增披露: {total_new:,} 条")
        print(f"   跳过重复: {total_skipped:,} 条")
        print(f"   处理错误: {total_errors:,} 条")
        
        # 数据库统计
        db_count = db.query(Disclosure).count()
        print(f"\n💾 数据库状态:")
        print(f"   披露总数: {db_count:,} 条")
        
    except Exception as e:
        print(f"\n❌ 同步失败: {e}")
        raise
    finally:
        db.close()


async def sync_companies():
    """从披露数据中同步企业信息"""
    print(f"\n{'=' * 80}")
    print(f"从披露数据中同步企业信息")
    print(f"{'=' * 80}\n")
    
    db = SessionLocal()
    
    try:
        # 获取所有唯一的企业代码和名称
        unique_companies = db.query(
            Disclosure.stock_code,
            Disclosure.company_name,
            func.count(Disclosure.id).label('disclosure_count')
        ).filter(
            Disclosure.stock_code != None,
            Disclosure.stock_code != ''
        ).group_by(
            Disclosure.stock_code,
            Disclosure.company_name
        ).all()
        
        print(f"发现 {len(unique_companies):,} 家企业\n")
        
        added = 0
        updated = 0
        skipped = 0
        
        for stock_code, company_name, disclosure_count in unique_companies:
            if not stock_code or not stock_code.strip():
                continue
                
            stock_code = stock_code.strip()
            
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
                    skipped += 1
            else:
                # 创建新企业
                company = Company(
                    stock_code=stock_code,
                    company_name=company_name,
                    company_name_en=None,
                    industry=None,
                    market=None,
                    is_active=True
                )
                db.add(company)
                added += 1
                
                if added % 100 == 0:
                    print(f"已添加 {added} 家企业...")
                    db.commit()
        
        db.commit()
        
        print(f"\n✅ 企业同步完成:")
        print(f"   新增企业: {added:,} 家")
        print(f"   更新企业: {updated:,} 家")
        print(f"   跳过重复: {skipped:,} 家")
        print(f"   企业总数: {db.query(Company).count():,} 家")
        
    except Exception as e:
        print(f"\n❌ 错误: {e}")
        db.rollback()
        raise
    finally:
        db.close()


async def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(description='获取EDINET历史数据')
    parser.add_argument('--start-date', type=str, help='开始日期 (YYYY-MM-DD)', default='2015-01-01')
    parser.add_argument('--end-date', type=str, help='结束日期 (YYYY-MM-DD)', default=None)
    parser.add_argument('--batch-days', type=int, help='每批处理天数', default=30)
    parser.add_argument('--skip-companies', action='store_true', help='跳过企业同步')
    
    args = parser.parse_args()
    
    # 解析日期
    start_date = date.fromisoformat(args.start_date) if args.start_date else date(2015, 1, 1)
    end_date = date.fromisoformat(args.end_date) if args.end_date else date.today()
    
    print(f"\n🚀 开始获取历史数据...")
    print(f"   起始日期: {start_date}")
    print(f"   结束日期: {end_date}")
    print(f"   批次大小: {args.batch_days} 天")
    print(f"   同步企业: {'否' if args.skip_companies else '是'}")
    
    # 第一步：获取所有披露数据
    await fetch_all_historical_data(
        start_date=start_date,
        end_date=end_date,
        batch_days=args.batch_days
    )
    
    # 第二步：同步企业信息
    if not args.skip_companies:
        await sync_companies()
    
    print(f"\n{'=' * 80}")
    print(f"🎉 所有任务完成！")
    print(f"{'=' * 80}\n")


if __name__ == "__main__":
    asyncio.run(main())
