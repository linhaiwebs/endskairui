# 获取历史数据指南

## 📋 概述

本脚本用于从EDINET API获取所有历史披露数据和企业信息，解决前端首页和统计页面没有数据的问题。

## 🚀 快速使用

### 方式一：Docker环境（推荐）

部署完成后，直接运行：

```bash
cd /www/wwwroot/jstockp.jp
./fetch_all_history.sh
```

或者：

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml exec backend python scripts/fetch_all_history.py
```

### 方式二：本地环境

```bash
cd backend
python scripts/fetch_all_history.py
```

## ⚙️ 参数说明

```bash
python scripts/fetch_all_history.py [选项]

选项：
  --start-date DATE     开始日期 (YYYY-MM-DD)，默认: 2015-01-01
  --end-date DATE       结束日期 (YYYY-MM-DD)，默认: 今天
  --batch-days NUMBER   每批处理天数，默认: 30
  --skip-companies      跳过企业信息同步

示例：
  # 获取最近1年的数据
  python scripts/fetch_all_history.py --start-date 2023-01-01
  
  # 获取最近3个月的数据
  python scripts/fetch_all_history.py --start-date 2023-10-01
  
  # 获取所有历史数据（默认从2015年开始）
  python scripts/fetch_all_history.py
  
  # 只获取披露数据，不同步企业
  python scripts/fetch_all_history.py --skip-companies
```

## 📊 数据获取流程

脚本执行两个主要步骤：

### 1️⃣ 获取披露数据
- 从EDINET API获取所有历史披露数据
- 按批次处理，每批默认30天
- 自动跳过重复数据
- 显示实时进度和统计

### 2️⃣ 同步企业信息
- 从披露数据中提取企业信息
- 自动去重
- 创建或更新企业记录

## ⏱️ 预计时间

| 数据范围 | 天数 | 预计时间 |
|---------|------|---------|
| 最近1个月 | 30天 | ~1分钟 |
| 最近3个月 | 90天 | ~3分钟 |
| 最近1年 | 365天 | ~10分钟 |
| 最近3年 | 1095天 | ~30分钟 |
| 所有历史（2015年起） | ~3500天 | ~2小时 |

**注意**：实际时间取决于网络速度和API响应速度

## 📈 预期数据量

根据EDINET历史数据：

| 数据类型 | 预估数量 |
|---------|---------|
| 披露文档 | 200万+ 条 |
| 企业数量 | 4,000+ 家 |
| 数据库大小 | 2-5 GB |

## 🔍 检查数据

### 查看数据库统计

```bash
# 进入数据库容器
docker compose -f docker-compose.prod.yml exec db psql -U postgres -d jp_disclosure

# 查看披露数量
SELECT COUNT(*) FROM disclosures;

# 查看企业数量
SELECT COUNT(*) FROM companies;

# 查看最新披露
SELECT * FROM disclosures ORDER BY submit_date DESC LIMIT 10;

# 按来源统计
SELECT source, COUNT(*) FROM disclosures GROUP BY source;

# 按文档类型统计
SELECT doc_type, COUNT(*) FROM disclosures GROUP BY doc_type ORDER BY COUNT(*) DESC;
```

### 通过API检查

```bash
# 统计概览
curl http://localhost:8000/api/v1/stats/overview

# 最新披露
curl http://localhost:8000/api/v1/disclosures/latest?limit=10

# 企业列表
curl http://localhost:8000/api/v1/stocks?limit=10
```

## ⚠️ 注意事项

1. **API限制**
   - EDINET API有频率限制
   - 脚本已内置2秒延迟避免过度请求
   - 如遇到429错误，请等待后重试

2. **数据库空间**
   - 确保数据库有足够空间（建议10GB+）
   - 定期清理或归档旧数据

3. **网络连接**
   - 确保服务器能访问EDINET API
   - API地址: https://api.edinet-fsa.go.jp

4. **中断恢复**
   - 脚本支持断点续传
   - 中断后重新运行即可
   - 已存在的数据会自动跳过

## 🐛 故障排查

### 问题1：连接超时

```bash
# 检查网络连接
curl -I https://api.edinet-fsa.go.jp/api/v2/documents.json?date=2024-01-01&type=2&Subscription-Key=Demo

# 检查API密钥是否有效
echo $EDINET_API_KEY
```

### 问题2：数据库连接失败

```bash
# 检查数据库状态
docker compose -f docker-compose.prod.yml ps db

# 查看数据库日志
docker compose -f docker-compose.prod.yml logs db
```

### 问题3：内存不足

```bash
# 减小批次大小
python scripts/fetch_all_history.py --batch-days 7

# 或分批运行
python scripts/fetch_all_history.py --start-date 2023-01-01 --end-date 2023-12-31
python scripts/fetch_all_history.py --start-date 2022-01-01 --end-date 2022-12-31 --skip-companies
```

## 📅 定期更新

建议设置定时任务，每天自动更新：

```bash
# 已在docker-compose.prod.yml中配置scheduler容器
# 默认每天9:00和17:00自动运行

# 手动更新最近7天数据
docker compose -f docker-compose.prod.yml exec backend python scripts/fetch_edinet.py 7
```

## 🎯 验证前端显示

数据获取完成后，访问以下页面验证：

- **首页**: https://jstockp.jp
  - 应显示最新披露列表
  - 应显示热门企业
  
- **统计页面**: https://jstockp.jp/stats
  - 应显示总披露数量
  - 应显示企业数量
  - 应显示每日统计

- **披露列表**: https://jstockp.jp/disclosures
  - 应显示所有披露数据

- **企业列表**: https://jstockp.jp/companies
  - 应显示所有企业

## 📞 技术支持

如遇问题，请查看：

1. 后端日志: `docker compose -f docker-compose.prod.yml logs backend`
2. 数据库日志: `docker compose -f docker-compose.prod.yml logs db`
3. API文档: https://jstockp.jp/docs
