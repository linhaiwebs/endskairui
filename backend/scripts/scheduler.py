"""
定时任务调度器（使用APScheduler替代Celery）
适用于Windows环境
"""
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
import logging
import sys
import os

# 添加父目录到路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scripts.fetch_edinet import main as fetch_edinet_data

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def scheduled_fetch():
    """定时获取EDINET数据"""
    logger.info("开始执行定时任务：获取EDINET数据")
    try:
        fetch_edinet_data()
        logger.info("EDINET数据获取完成")
    except Exception as e:
        logger.error(f"EDINET数据获取失败: {e}")


def main():
    """启动调度器"""
    scheduler = BlockingScheduler()
    
    # 每天上午9点执行
    scheduler.add_job(
        scheduled_fetch,
        CronTrigger(hour=9, minute=0),
        id='fetch_edinet_morning',
        name='获取EDINET数据（上午）'
    )
    
    # 每天下午5点执行
    scheduler.add_job(
        scheduled_fetch,
        CronTrigger(hour=17, minute=0),
        id='fetch_edinet_evening',
        name='获取EDINET数据（下午）'
    )
    
    logger.info("定时任务调度器已启动")
    logger.info("任务计划：每天上午9:00和下午17:00执行数据同步")
    
    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        logger.info("调度器已停止")
        scheduler.shutdown()


if __name__ == '__main__':
    main()
