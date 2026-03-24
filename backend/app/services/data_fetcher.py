"""
EDINET数据获取服务
使用edinet-tools库获取日本金融厅EDINET披露数据
"""
import httpx
from datetime import datetime, date, timedelta
from typing import List, Dict, Optional, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_
import logging

from app.models.models import Disclosure, Company
from app.core.config import settings

logger = logging.getLogger(__name__)


class EDINETService:
    """EDINET数据获取服务"""
    
    # EDINET文档类型映射
    DOC_TYPE_MAP = {
        "010": "有価証券報告書",
        "020": "四半期報告書",
        "030": "半期報告書",
        "040": "訂正有価証券報告書",
        "050": "訂正四半期報告書",
        "060": "訂正半期報告書",
        "070": "臨時報告書",
        "080": "自己株式取得",
        "090": "配当支払開始",
        "100": "株式分割",
        "110": "新株発行",
        "120": "新株予約権発行",
        "130": "業績予想の修正",
        "140": "配当予想の修正",
        "150": "経営方針等の変更",
        "160": "その他",
    }
    
    # EDINET API v2 基础URL（官方文档指定）
    BASE_URL = "https://api.edinet-fsa.go.jp/api/v2"
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.EDINET_API_KEY or "Demo"
    
    async def fetch_disclosure_list(
        self, 
        target_date: date,
        session: Session
    ) -> Dict[str, Any]:
        """
        获取指定日期的披露列表
        
        Args:
            target_date: 目标日期
            session: 数据库会话
            
        Returns:
            包含新增和更新数量的字典
        """
        url = f"{self.BASE_URL}/documents.json"
        params = {
            "date": target_date.strftime("%Y-%m-%d"),
            "type": 2,  # 2: 返回提出書類一覧及びメタデータ
            "Subscription-Key": self.api_key
        }
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                data = response.json()
            
            results = {
                "date": target_date.isoformat(),
                "total": 0,
                "new": 0,
                "skipped": 0,
                "errors": 0
            }
            
            # 官方API返回的是results数组
            documents = data.get("results", [])
            results["total"] = len(documents)
            
            for doc in documents:
                try:
                    # 只处理上市公司披露（有证券代码的）
                    if not doc.get("secCode"):
                        continue
                    
                    # 跳过已撤回或不公开的文档
                    if doc.get("withdrawalStatus") == "2":
                        continue
                    if doc.get("disclosureStatus") == "2":
                        continue
                    # 跳过阅览期间已满的文档
                    if doc.get("legalStatus") == "0":
                        continue
                    
                    # 检查是否已存在
                    existing = session.query(Disclosure).filter(
                        Disclosure.doc_id == doc["docID"]
                    ).first()
                    
                    if existing:
                        results["skipped"] += 1
                        continue
                    
                    # 创建新披露记录（按照官方API字段）
                    disclosure = Disclosure(
                        doc_id=doc["docID"],
                        stock_code=doc.get("secCode", ""),
                        company_name=doc.get("filerName", ""),
                        title=doc.get("docDescription", ""),
                        doc_type=self._get_doc_type(doc.get("docTypeCode")),
                        doc_type_code=doc.get("docTypeCode"),
                        submit_date=datetime.strptime(
                            doc.get("submitDateTime", ""), 
                            "%Y-%m-%d %H:%M"
                        ) if doc.get("submitDateTime") else datetime.now(),
                        fiscal_year=doc.get("fiscalYear"),
                        period=doc.get("period"),
                        source="EDINET",
                        # 官方API文档书類取得API的type参数：
                        # type=1: 提出本文書及び監査報告書（ZIP，包含XBRL）
                        # type=2: PDF
                        # type=3: 代替書面・添付文書
                        # type=4: 英文ファイル
                        # type=5: CSV
                        pdf_url=f"https://api.edinet-fsa.go.jp/api/v2/documents/{doc['docID']}?type=2" if doc.get("pdfFlag") == "1" else None,
                        html_url=None,  # EDINET不直接提供HTML，需要从ZIP中提取
                        xbrl_url=f"https://api.edinet-fsa.go.jp/api/v2/documents/{doc['docID']}?type=1" if doc.get("xbrlFlag") == "1" else None,
                    )
                    
                    session.add(disclosure)
                    # 每条记录立即提交，避免批量插入时的重复键问题
                    session.commit()
                    results["new"] += 1
                    
                except Exception as e:
                    # 回滚当前事务，继续处理下一条
                    session.rollback()
                    
                    # 检查是否是重复键错误
                    if "UniqueViolation" in str(e) or "duplicate key" in str(e).lower():
                        results["skipped"] += 1
                        logger.debug(f"Document {doc.get('docID')} already exists, skipped")
                    else:
                        logger.error(f"Error processing document {doc.get('docID')}: {e}")
                        results["errors"] += 1
                    continue
            return results
            
        except Exception as e:
            logger.error(f"Error fetching EDINET data for {target_date}: {e}")
            return {
                "date": target_date.isoformat(),
                "error": str(e)
            }
    
    def _get_doc_type(self, type_code: Optional[str]) -> Optional[str]:
        """获取文档类型名称"""
        if not type_code:
            return None
        return self.DOC_TYPE_MAP.get(type_code, type_code)
    
    async def fetch_disclosure_content(self, doc_id: str) -> Optional[Dict[str, Any]]:
        """
        获取披露文档详细内容
        
        Args:
            doc_id: 文档ID
            
        Returns:
            文档内容字典
        """
        # 注意：实际内容获取需要解析XBRL或PDF
        # 这里返回基本信息，使用官方API v2
        return {
            "doc_id": doc_id,
            "content_url": f"https://api.edinet-fsa.go.jp/api/v2/documents/{doc_id}?type=2",
            "pdf_url": f"https://api.edinet-fsa.go.jp/api/v2/documents/{doc_id}?type=2",
            "xbrl_url": f"https://api.edinet-fsa.go.jp/api/v2/documents/{doc_id}?type=1",
        }


class TDnetService:
    """TDnet（东京证券交易所）数据获取服务"""
    
    TDNET_RSS_URL = "https://www.release.tdnet.info/inbs/I_list_001_{page}.html"
    
    async def fetch_latest_disclosures(
        self, 
        session: Session,
        pages: int = 1
    ) -> Dict[str, Any]:
        """
        获取TDnet最新披露（通过网页爬取）
        
        注意：实际生产环境应该使用官方API或更可靠的数据源
        这里提供基础框架
        """
        results = {
            "total": 0,
            "new": 0,
            "skipped": 0
        }
        
        # 注意：实际爬取TDnet需要解析HTML
        # 建议使用官方数据源或第三方API
        
        return results


class DataSyncService:
    """数据同步服务"""
    
    def __init__(self, session: Session):
        self.session = session
        self.edinet = EDINETService()
        self.tdnet = TDnetService()
    
    async def sync_daily_disclosures(self, days_back: int = 7) -> Dict[str, Any]:
        """
        同步最近N天的披露数据
        
        Args:
            days_back: 向前同步的天数
            
        Returns:
            同步结果统计
        """
        results = {
            "edinet": [],
            "tdnet": {},
            "start_date": (date.today() - timedelta(days=days_back)).isoformat(),
            "end_date": date.today().isoformat()
        }
        
        # 同步EDINET数据
        for i in range(days_back):
            target_date = date.today() - timedelta(days=i)
            result = await self.edinet.fetch_disclosure_list(target_date, self.session)
            results["edinet"].append(result)
        
        # 同步TDnet数据
        results["tdnet"] = await self.tdnet.fetch_latest_disclosures(self.session)
        
        return results
