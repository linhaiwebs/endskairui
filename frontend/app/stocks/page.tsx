/**
 * 公司列表页面
 */
import { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { companyAPI } from '@/lib/api'

export const metadata: Metadata = {
  title: '公司列表',
  description: '日本上市公司列表，按行业和市场分类浏览。',
}

interface StocksPageProps {
  searchParams: {
    keyword?: string
    industry?: string
  }
}

export default async function StocksPage({ searchParams }: StocksPageProps) {
  const keyword = searchParams.keyword || undefined
  const industry = searchParams.industry || undefined
  
  const companies = await companyAPI.getList({
    keyword,
    industry,
    limit: 500, // 增加到500个
  }).catch(() => [])
  
  // 获取行业列表
  const industries = await companyAPI.getIndustries().catch(() => [])

  return (
    <>
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">公司列表</h1>
            <p className="text-gray-600 mt-1">
              共 {companies.length} 家公司
            </p>
          </div>
          
          {/* 筛选器 */}
          <div className="card mb-6">
            <form className="flex flex-wrap gap-4">
              {/* 关键词搜索 */}
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  name="keyword"
                  placeholder="搜索公司名称或股票代码..."
                  defaultValue={keyword}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              {/* 行业筛选 */}
              <div>
                <select
                  name="industry"
                  defaultValue={industry}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">全部行业</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              
              {/* 提交按钮 */}
              <button
                type="submit"
                className="btn-primary"
              >
                搜索
              </button>
              
              {/* 重置 */}
              <Link
                href="/stocks"
                className="btn-secondary"
              >
                重置
              </Link>
            </form>
          </div>
          
          {/* 公司列表 */}
          {companies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.map((company) => (
                <Link
                  key={company.id}
                  href={`/stock/${company.stock_code}`}
                  className="card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-600 font-bold">
                        {company.stock_code.slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {company.company_name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {company.stock_code}
                        {company.market && ` • ${company.market}`}
                      </p>
                      {company.industry && (
                        <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {company.industry}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">未找到符合条件的公司</p>
              <p className="text-sm mt-2">尝试调整搜索条件</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  )
}
