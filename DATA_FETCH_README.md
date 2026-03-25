# 🚀 数据获取脚本使用说明

## 问题诊断

### 前端首页和统计页面没有内容的原因

经过检查，前端代码正常，API端点正常，问题在于**数据库中没有数据**。

前端页面调用以下API获取数据：
- 首页：`/api/v1/disclosures/latest` - 获取最新10条披露
- 首页：`/api/v1/stocks?limit=5` - 获取5家企业
- 首页和统计页：`/api/v1/stats/overview` - 获取统计概览
- 统计页：`/api/v1/stats/daily` - 获取每日统计
- 统计页：`/api/v1/stats/hot-companies` - 获取热门企业

这些API都需要数据库中有数据才能返回结果。

## 解决方案

已创建两个脚本来获取所有历史数据：

### 1. Python脚本：`backend/scripts/fetch_all_history.py`

功能完整的Python脚本，支持：
- ✅ 获取指定日期范围的所有EDINET披露数据
- ✅ 自动同步企业信息
- ✅ 分批处理，避免内存溢出
- ✅ 断点续传，支持中断恢复
- ✅ 实时进度显示

### 2. Shell脚本：`fetch_all_history.sh`

便捷的执行脚本，自动检测环境：
- Docker环境：在容器内执行
- 本地环境：直接执行Python脚本

## 快速使用

### 在已部署的Docker环境中

```bash
# 进入项目目录
cd /www/wwwroot/jstockp.jp

# 执行脚本（获取所有历史数据，约需2小时）
./fetch_all_history.sh

# 或获取最近1年数据（约需10分钟）
docker compose --env-file .env.production -f docker-compose.prod.yml exec backend python scripts/fetch_all_history.py --start-date 2023-01-01

# 或获取最近3个月数据（约需3分钟）
docker compose --env-file .env.production -f docker-compose.prod.yml exec backend python scripts/fetch_all_history.py --start-date 2023-10-01
```

### 命令行参数

```bash
python scripts/fetch_all_history.py [选项]

选项：
  --start-date DATE     开始日期，默认: 2015-01-01
  --end-date DATE       结束日期，默认: 今天
  --batch-days NUMBER   每批处理天数，默认: 30
  --skip-companies      跳过企业同步
```

## 预计时间和数据量

| 数据范围 | 预计时间 | 预计数据量 |
|---------|---------|-----------|
| 最近1个月 | ~1分钟 | ~5,000条披露 |
| 最近3个月 | ~3分钟 | ~15,000条披露 |
| 最近1年 | ~10分钟 | ~60,000条披露 |
| 最近3年 | ~30分钟 | ~180,000条披露 |
| 所有历史 | ~2小时 | ~2,000,000条披露 |

## 验证数据

### 方法1：通过API验证

```bash
# 检查统计信息
curl http://localhost:8000/api/v1/stats/overview

# 应该返回类似：
# {
#   "total_disclosures": 60000,
#   "total_companies": 3500,
#   "today_new": 0,
#   "week_new": 150
# }

# 检查最新披露
curl http://localhost:8000/api/v1/disclosures/latest?limit=5
```

### 方法2：通过前端验证

访问以下页面：
- 首页：http://jstockp.jp - 应显示最新披露和企业
- 统计页：http://jstockp.jp/stats - 应显示统计数据
- 披露列表：http://jstockp.jp/disclosures - 应显示所有披露

### 方法3：通过数据库验证

```bash
docker compose -f docker-compose.prod.yml exec db psql -U postgres -d jp_disclosure -c "SELECT COUNT(*) FROM disclosures;"

docker compose -f docker-compose.prod.yml exec db psql -U postgres -d jp_disclosure -c "SELECT COUNT(*) FROM companies;"
```

## 文件说明

1. **backend/scripts/fetch_all_history.py** - 主脚本
   - 获取历史披露数据
   - 同步企业信息
   - 显示进度和统计

2. **fetch_all_history.sh** - 便捷执行脚本
   - 自动检测Docker环境
   - 简化命令执行

3. **FETCH_DATA_GUIDE.md** - 详细使用指南
   - 完整参数说明
   - 故障排查
   - 定期更新配置

## 注意事项

1. **首次运行建议**
   - 先获取最近3个月数据测试：`--start-date 2023-10-01`
   - 确认正常后再获取全部历史数据

2. **API密钥**
   - 已在`.env.production`中配置
   - 如需更换，编辑文件中的`EDINET_API_KEY`

3. **网络要求**
   - 确保能访问：https://api.edinet-fsa.go.jp
   - 如遇超时，请检查网络或防火墙设置

4. **数据库空间**
   - 全量数据约需2-5GB空间
   - 确保数据库有足够存储空间

## 后续维护

系统已配置定时任务，每天自动更新：
- 时间：每天9:00和17:00
- 自动获取最近3天数据
- 位置：scheduler容器

手动更新：
```bash
docker compose -f docker-compose.prod.yml exec backend python scripts/fetch_edinet.py 7
```

## 问题排查

如遇到问题，请查看详细指南：`FETCH_DATA_GUIDE.md`

或查看日志：
```bash
# 后端日志
docker compose -f docker-compose.prod.yml logs backend

# 数据库日志  
docker compose -f docker-compose.prod.yml logs db
```
