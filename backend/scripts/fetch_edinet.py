"""
定时任务：从EDINET获取披露数据
可以配置为每天运行2次（建议：上午9:00、下午17:00）
"""
import asyncio
import sys
import os
from datetime import date, timedelta

# 添加父目录到路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.services.data_fetcher import DataSyncService


async def fetch_edinet_data(days_back: int = 3):
    """
    从EDINET获取数据
    
    Args:
        days_back: 向前回溯天数（确保不遗漏）
    """
    print(f"\n{'=' * 60}")
    print(f"EDINET数据同步任务开始 - {date.today()}")
    print(f"{'=' * 60}\n")
    
    db = SessionLocal()
    
    try:
        sync_service = DataSyncService(db)
        
        # 同步最近N天的数据
        results = await sync_service.sync_daily_disclosures(days_back=days_back)
        
        # 统计结果
        total_new = sum([r.get("new", 0) for r in results["edinet"]])
        total_skipped = sum([r.get("skipped", 0) for r in results["edinet"]])
        
        print(f"\n📊 同步结果汇总:")
        print(f"   新增披露: {total_new} 条")
        print(f"   跳过重复: {total_skipped} 条")
        print(f"   同步日期范围: {results['start_date']} ~ {results['end_date']}")
        
        # 显示每日详情
        print(f"\n📅 每日详情:")
        for day_result in results["edinet"]:
            if "error" in day_result:
                print(f"   ❌ {day_result['date']}: {day_result['error']}")
            else:
                print(f"   ✓ {day_result['date']}: 新增 {day_result['new']} 条, 跳过 {day_result['skipped']} 条")
        
    except Exception as e:
        print(f"\n❌ 同步失败: {e}")
        raise
    finally:
        db.close()
    
    print(f"\n{'=' * 60}")
    print(f"数据同步任务完成")
    print(f"{'=' * 60}\n")


async def main():
    """主函数"""
    # 默认回溯3天，确保数据完整性
    days = int(sys.argv[1]) if len(sys.argv) > 1 else 3
    await fetch_edinet_data(days_back=days)


if __name__ == "__main__":
    asyncio.run(main())
