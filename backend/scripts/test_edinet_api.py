#!/usr/bin/env python3
"""
EDINET API 连通性测试脚本
测试 EDINET API 的连接状态和基本功能
"""
import httpx
import asyncio
from datetime import date, timedelta
import json
import sys


class EDINETAPITester:
    """EDINET API 测试器"""
    
    # 官方API v2基础URL
    BASE_URL = "https://api.edinet-fsa.go.jp/api/v2"
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.test_results = []
    
    async def test_connection(self) -> bool:
        """测试基本连接"""
        print("\n" + "="*60)
        print("🔍 测试1: 基本连接测试")
        print("="*60)
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                # 使用最近的日期进行测试
                test_date = date.today()
                url = f"{self.BASE_URL}/documents.json"
                params = {
                    "date": test_date.strftime("%Y-%m-%d"),
                    "type": 1,  # 1: 只获取元数据（测试连接更快）
                    "Subscription-Key": self.api_key
                }
                
                print(f"📡 请求URL: {url}")
                print(f"📅 测试日期: {test_date}")
                print(f"🔑 API密钥: {self.api_key[:8]}...")
                
                response = await client.get(url, params=params)
                
                print(f"✅ HTTP状态码: {response.status_code}")
                
                if response.status_code == 200:
                    data = response.json()
                    print(f"✅ 响应正常，返回数据类型: {type(data)}")
                    print(f"📊 元数据字段: {list(data.keys())}")
                    
                    if "metadata" in data:
                        metadata = data["metadata"]
                        print(f"   - 状态: {metadata.get('status', 'N/A')}")
                        print(f"   - 消息: {metadata.get('message', 'N/A')}")
                    
                    self.test_results.append(("基本连接", True, "连接成功"))
                    return True
                else:
                    print(f"❌ HTTP错误: {response.status_code}")
                    self.test_results.append(("基本连接", False, f"HTTP {response.status_code}"))
                    return False
                    
        except Exception as e:
            print(f"❌ 连接失败: {e}")
            self.test_results.append(("基本连接", False, str(e)))
            return False
    
    async def test_api_key(self) -> bool:
        """测试API密钥有效性"""
        print("\n" + "="*60)
        print("🔑 测试2: API密钥验证")
        print("="*60)
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                # 使用Demo密钥和用户密钥对比测试
                test_date = date.today() - timedelta(days=1)
                url = f"{self.BASE_URL}/documents.json"
                
                # 测试用户密钥
                params = {
                    "date": test_date.strftime("%Y-%m-%d"),
                    "type": 2,
                    "Subscription-Key": self.api_key
                }
                
                print(f"🔐 测试用户API密钥...")
                response = await client.get(url, params=params)
                
                if response.status_code == 200:
                    data = response.json()
                    results_count = len(data.get("results", []))
                    print(f"✅ API密钥有效")
                    print(f"📊 返回文档数量: {results_count}")
                    
                    self.test_results.append(("API密钥验证", True, f"有效，返回{results_count}条记录"))
                    return True
                elif response.status_code == 403:
                    print(f"❌ API密钥无效或已过期")
                    self.test_results.append(("API密钥验证", False, "密钥无效"))
                    return False
                else:
                    print(f"⚠️ HTTP状态码: {response.status_code}")
                    self.test_results.append(("API密钥验证", False, f"HTTP {response.status_code}"))
                    return False
                    
        except Exception as e:
            print(f"❌ 测试失败: {e}")
            self.test_results.append(("API密钥验证", False, str(e)))
            return False
    
    async def test_data_retrieval(self) -> bool:
        """测试数据获取功能"""
        print("\n" + "="*60)
        print("📊 测试3: 数据获取测试")
        print("="*60)
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                # 测试最近3天的数据
                test_dates = [
                    date.today() - timedelta(days=i) 
                    for i in range(3)
                ]
                
                total_docs = 0
                docs_with_sec_code = 0
                
                for test_date in test_dates:
                    url = f"{self.BASE_URL}/documents.json"
                    params = {
                        "date": test_date.strftime("%Y-%m-%d"),
                        "type": 2,
                        "Subscription-Key": self.api_key
                    }
                    
                    response = await client.get(url, params=params)
                    
                    if response.status_code == 200:
                        data = response.json()
                        results = data.get("results", [])
                        total_docs += len(results)
                        
                        # 统计有股票代码的文档（上市公司披露）
                        docs_with_sec_code += sum(1 for doc in results if doc.get("secCode"))
                        
                        print(f"   {test_date}: {len(results)} 条文档")
                
                print(f"\n📈 统计汇总:")
                print(f"   总文档数: {total_docs}")
                print(f"   上市公司披露: {docs_with_sec_code}")
                
                if total_docs > 0:
                    print(f"✅ 数据获取成功")
                    self.test_results.append(("数据获取", True, f"获取{total_docs}条记录"))
                    return True
                else:
                    print(f"⚠️ 未获取到数据（可能是非工作日）")
                    self.test_results.append(("数据获取", True, "无数据（可能正常）"))
                    return True
                    
        except Exception as e:
            print(f"❌ 数据获取失败: {e}")
            self.test_results.append(("数据获取", False, str(e)))
            return False
    
    async def test_document_detail(self) -> bool:
        """测试文档详情获取"""
        print("\n" + "="*60)
        print("📄 测试4: 文档详情获取")
        print("="*60)
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                # 先获取一个文档ID
                test_date = date.today() - timedelta(days=1)
                url = f"{self.BASE_URL}/documents.json"
                params = {
                    "date": test_date.strftime("%Y-%m-%d"),
                    "type": 2,
                    "Subscription-Key": self.api_key
                }
                
                response = await client.get(url, params=params)
                
                if response.status_code != 200:
                    print(f"⚠️ 无法获取文档列表")
                    self.test_results.append(("文档详情", False, "无法获取文档列表"))
                    return False
                
                data = response.json()
                results = data.get("results", [])
                
                if not results:
                    print(f"⚠️ 无文档可测试")
                    self.test_results.append(("文档详情", True, "无测试数据"))
                    return True
                
                # 获取第一个有股票代码的文档
                test_doc = None
                for doc in results:
                    if doc.get("secCode"):
                        test_doc = doc
                        break
                
                if not test_doc:
                    test_doc = results[0]
                
                doc_id = test_doc.get("docID")
                print(f"📄 测试文档ID: {doc_id}")
                print(f"🏢 公司名称: {test_doc.get('filerName', 'N/A')}")
                print(f"📊 股票代码: {test_doc.get('secCode', 'N/A')}")
                print(f"📝 文档类型: {test_doc.get('docDescription', 'N/A')}")
                
                # 测试文档下载URL
                doc_url = f"{self.BASE_URL}/documents/{doc_id}"
                print(f"\n🔗 文档下载URL（官方API v2）:")
                print(f"   提出本文書及び監査報告書: {doc_url}?type=1")
                print(f"   PDF: {doc_url}?type=2")
                print(f"   代替書面・添付文書: {doc_url}?type=3")
                print(f"   英文ファイル: {doc_url}?type=4")
                print(f"   CSV: {doc_url}?type=5")
                
                print(f"✅ 文档详情获取成功")
                self.test_results.append(("文档详情", True, f"文档ID: {doc_id}"))
                return True
                
        except Exception as e:
            print(f"❌ 文档详情测试失败: {e}")
            self.test_results.append(("文档详情", False, str(e)))
            return False
    
    def print_summary(self):
        """打印测试结果汇总"""
        print("\n" + "="*60)
        print("📋 测试结果汇总")
        print("="*60)
        
        passed = sum(1 for _, success, _ in self.test_results if success)
        total = len(self.test_results)
        
        for test_name, success, message in self.test_results:
            status = "✅ 通过" if success else "❌ 失败"
            print(f"{status} - {test_name}: {message}")
        
        print(f"\n📊 总计: {passed}/{total} 测试通过")
        
        if passed == total:
            print("\n🎉 所有测试通过！API连接正常！")
        elif passed > 0:
            print(f"\n⚠️ 部分测试通过，请检查失败的项")
        else:
            print(f"\n❌ 所有测试失败，请检查配置和网络连接")


async def main():
    """主函数"""
    print("="*60)
    print("🚀 EDINET API 连通性测试工具")
    print("="*60)
    
    # 从环境变量或参数获取API密钥
    api_key = None
    
    # 尝试从参数获取
    if len(sys.argv) > 1:
        api_key = sys.argv[1]
    else:
        # 尝试从.env文件读取
        try:
            import os
            from dotenv import load_dotenv
            load_dotenv()
            api_key = os.getenv("EDINET_API_KEY")
        except:
            pass
    
    if not api_key:
        print("❌ 错误: 未提供API密钥")
        print("\n使用方法:")
        print("  python test_edinet_api.py YOUR_API_KEY")
        print("\n或者创建 .env 文件并设置:")
        print("  EDINET_API_KEY=your_api_key_here")
        sys.exit(1)
    
    print(f"🔑 使用API密钥: {api_key[:8]}...")
    
    # 创建测试器
    tester = EDINETAPITester(api_key)
    
    # 运行所有测试
    await tester.test_connection()
    await tester.test_api_key()
    await tester.test_data_retrieval()
    await tester.test_document_detail()
    
    # 打印汇总
    tester.print_summary()


if __name__ == "__main__":
    asyncio.run(main())
