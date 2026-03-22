/**
 * 首页 - 日本上市公司信息披露平台
 */
import Link from 'next/link'
import { Metadata } from 'next'
import { format } from 'date-fns'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DisclosureCard from '@/components/DisclosureCard'
import { disclosureAPI, companyAPI } from '@/lib/api'

export const metadata: Metadata = {
  title: '日本上市公司信息披露平台 | EDINET + TDnet',
  description: '日本上市公司公开披露信息查询平台，提供EDINET和TDnet财报、公告等披露信息的搜索和浏览服务。',
}

export default async function HomePage() {
  // 并行获取数据
  const [latestDisclosures, companies] = await Promise.all([
    disclosureAPI.getLatest(10).catch(() => ({ items: [], total: 0, page: 1, page_size: 10, total_pages: 0 })),
    companyAPI.getList({ limit: 5 }).catch(() => []),
  ])

  return (
    <>
      <Header />
      
      <main className="flex-1">
        {/* Hero区域 */}
        <section className="bg-gradient-to-b from-primary-50 to-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                日本上市公司信息披露平台
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                查询日本上市公司（东交所、JASDAQ等）的公开披露信息
              </p>
              
              {/* 搜索框 */}
              <div className="max-w-2xl mx-auto">
                <form action="/search" method="GET">
                  <div className="relative">
                    <input
                      type="text"
                      name="q"
                      placeholder="搜索公司名称或股票代码（如：Toyota, 7203, トヨタ）..."
                      className="w-full px-6 py-4 pl-12 text-lg border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <svg
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      搜索
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
        
        {/* 数据来源说明 */}
        <section className="py-6 border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="badge badge-edinet">EDINET</span>
                <span>日本金融厅电子披露系统</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-tdnet">TDnet</span>
                <span>东京证券交易所适时披露系统</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* 最新披露 */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                📄 最新披露
              </h2>
              <Link 
                href="/disclosures"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                查看全部 →
              </Link>
            </div>
            
            {latestDisclosures.items.length > 0 ? (
              <div className="space-y-4">
                {latestDisclosures.items.map((disclosure) => (
                  <DisclosureCard 
                    key={disclosure.id} 
                    disclosure={disclosure} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>暂无披露数据</p>
                <p className="text-sm mt-2">请先运行数据库初始化脚本</p>
              </div>
            )}
          </div>
        </section>
        
        {/* 热门公司 */}
        <section className="py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                🏢 热门公司
              </h2>
              <Link 
                href="/stocks"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                查看全部 →
              </Link>
            </div>
            
            {companies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companies.map((company) => (
                  <Link
                    key={company.id}
                    href={`/stock/${company.stock_code}`}
                    className="card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-600 font-bold text-sm">
                          {company.stock_code.slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {company.company_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {company.stock_code} • {company.market}
                        </p>
                        {company.industry && (
                          <p className="text-xs text-gray-400 mt-1">
                            {company.industry}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>暂无公司数据</p>
              </div>
            )}
          </div>
        </section>
        
        {/* 使用说明 */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              📖 如何使用本平台
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="font-medium text-gray-900 mb-2">搜索公司</h3>
                <p className="text-sm text-gray-600">
                  输入公司名称（日文/英文）或股票代码，快速找到目标公司的披露信息
                </p>
              </div>
              
              <div className="card">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-medium text-gray-900 mb-2">查看财报</h3>
                <p className="text-sm text-gray-600">
                  浏览公司的年报、季报、业绩预告等财务披露信息
                </p>
              </div>
              
              <div className="card">
                <div className="text-3xl mb-3">🔗</div>
                <h3 className="font-medium text-gray-900 mb-2">访问原文</h3>
                <p className="text-sm text-gray-600">
                  直接跳转到EDINET或TDnet官方系统查看完整的披露文档
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* 免责声明 */}
        <section className="py-6 bg-yellow-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ 重要提示：</strong>
                本网站仅提供公开披露信息的整理和查询服务，不构成任何投资建议。
                投资有风险，入市需谨慎。所有数据均来源于官方披露系统。
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}
