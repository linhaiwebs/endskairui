"""
完整的EDINET数据获取测试
测试从API获取数据并存储到数据库的完整流程
"""
import asyncio
import sys
import os
from datetime import date, timedelta

# 添加父目录到路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.core.config import settings
from app.services.data_fetcher import EDINETService
from app.models.models import Disclosure


async def test_data_fetch():
    """测试数据获取"""
    print("\n" + "="*60)
    print("EDINET数据获取测试")
    print("="*60)
    
    # 显示配置
    print(f"\n📋 配置信息:")
    print(f"   API Key: {settings.EDINET_API_KEY[:8]}..." if settings.EDINET_API_KEY else "   API Key: 未配置")
    print(f"   数据库: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else settings.DATABASE_URL}")
    
    # 创建服务实例
    service = EDINETService(api_key=settings.EDINET_API_KEY)
    
    # 测试1: 直接从API获取数据（不存数据库）
    print(f"\n🔍 测试1: 直接获取API数据")
    test_date = date.today() - timedelta(days=1)
    
    try:
        import httpx
        url = f"{service.BASE_URL}/documents.json"
        params = {
            "date": test_date.strftime("%Y-%m-%d"),
            "type": 2,  # 获取完整数据
            "Subscription-Key": service.api_key
        }
        
        print(f"   请求URL: {url}")
        print(f"   请求参数: date={params['date']}, type={params['type']}")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, params=params)
            print(f"   HTTP状态: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                metadata = data.get("metadata", {})
                results = data.get("results", [])
                
                print(f"   ✅ API响应正常")
                print(f"   状态: {metadata.get('status')} - {metadata.get('message')}")
                print(f"   结果数量: {metadata.get('resultset', {}).get('count', 0)} 条")
                
                if results:
                    print(f"\n   📄 前3条数据预览:")
                    for i, doc in enumerate(results[:3], 1):
                        print(f"      {i}. {doc.get('docID')} - {doc.get('filerName', 'N/A')}")
                        print(f"         类型: {doc.get('docDescription', 'N/A')}")
                        print(f"         证券代码: {doc.get('secCode', 'N/A')}")
                else:
                    print(f"   ⚠️  该日期没有披露数据")
            else:
                print(f"   ❌ API请求失败: {response.status_code}")
                print(f"   响应: {response.text[:200]}")
                return False
                
    except Exception as e:
        print(f"   ❌ 测试失败: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # 测试2: 获取数据并存入数据库
    print(f"\n💾 测试2: 获取数据并存入数据库")
    
    db = SessionLocal()
    try:
        # 获取测试前的记录数
        before_count = db.query(Disclosure).count()
        print(f"   数据库现有记录: {before_count} 条")
        
        # 获取最近3天的数据
        for days_ago in range(3):
            target_date = date.today() - timedelta(days=days_ago)
            print(f"\n   📅 获取 {target_date} 的数据...")
            
            result = await service.fetch_disclosure_list(target_date, db)
            
            if "error" in result:
                print(f"      ❌ 失败: {result['error']}")
            else:
                print(f"      ✅ 成功: 新增 {result['new']} 条, 跳过 {result['skipped']} 条")
        
        # 获取测试后的记录数
        after_count = db.query(Disclosure).count()
        print(f"\n   📊 数据库记录变化: {before_count} → {after_count} (新增 {after_count - before_count} 条)")
        
        # 显示最新的5条记录
        latest = db.query(Disclosure).order_by(Disclosure.submit_date.desc()).limit(5).all()
        if latest:
            print(f"\n   📋 最新5条记录:")
            for i, d in enumerate(latest, 1):
                print(f"      {i}. [{d.doc_id}] {d.company_name}")
                print(f"         {d.title}")
                print(f"         提交时间: {d.submit_date}")
        
        return True
        
    except Exception as e:
        print(f"   ❌ 数据库操作失败: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()
    
    print("\n" + "="*60)


async def main():
    """主函数"""
    success = await test_data_fetch()
    
    if success:
        print("\n✅ 所有测试通过！数据获取和存储功能正常。")
        print("\n💡 提示:")
        print("   - 运行 'python scripts/fetch_edinet.py' 定期获取数据")
        print("   - 建议每天运行2次（上午9:00、下午17:00）")
    else:
        print("\n❌ 测试失败，请检查配置和网络连接。")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
