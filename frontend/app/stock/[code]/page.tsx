/**
 * 公司详情页面
 */
import { Metadata } from 'next'
import Link from 'next/link'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DisclosureCard from '@/components/DisclosureCard'
import FinancialChart from '@/components/FinancialChart'
import { companyAPI } from '@/lib/api'

interface CompanyPageProps {
  params: {
    code: string
  }
}

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  try {
    const company = await companyAPI.getDetail(params.code)
    return {
      title: `${company.company_name} (${company.stock_code}) 财报披露`,
      description: `${company.company_name}的财务披露信息查询，包括年报、季报、业绩预告等。${company.industry ? `行业：${company.industry}` : ''}`,
    }
  } catch {
    return {
      title: '公司详情',
    }
  }
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  let company
  
  try {
    company = await companyAPI.getDetail(params.code)
  } catch {
    notFound()
  }
  
  return (
    <>
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 面包屑 */}
          <nav className="mb-6 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">首页</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/stocks" className="text-gray-500 hover:text-gray-700">公司列表</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">{company.company_name}</span>
          </nav>
          
          {/* 公司信息卡片 */}
          <div className="card mb-6">
            <div className="flex items-start gap-6">
              {/* Logo占位 */}
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold text-xl">
                  {company.stock_code.slice(0, 2)}
                </span>
              </div>
              
              {/* 公司信息 */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {company.company_name}
                </h1>
                {company.company_name_en && (
                  <p className="text-gray-500 mb-3">{company.company_name_en}</p>
                )}
                
                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="bg-gray-100 px-3 py-1 rounded-full">
                    <span className="text-gray-500">股票代码：</span>
                    <span className="font-medium text-gray-900">{company.stock_code}</span>
                  </div>
                  
                  {company.market && (
                    <div className="bg-gray-100 px-3 py-1 rounded-full">
                      <span className="text-gray-500">市场：</span>
                      <span className="font-medium text-gray-900">{company.market}</span>
                    </div>
                  )}
                  
                  {company.industry && (
                    <div className="bg-gray-100 px-3 py-1 rounded-full">
                      <span className="text-gray-500">行业：</span>
                      <span className="font-medium text-gray-900">{company.industry}</span>
                    </div>
                  )}
                  
                  {company.listing_date && (
                    <div className="bg-gray-100 px-3 py-1 rounded-full">
                      <span className="text-gray-500">上市日期：</span>
                      <span className="font-medium text-gray-900">
                        {format(new Date(company.listing_date), 'yyyy-MM-dd')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：财务数据 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 财务图表 */}
              <div className="card">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  📊 财务数据趋势
                </h2>
                
                {company.latest_financials.length > 0 ? (
                  <FinancialChart data={company.latest_financials} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>暂无财务数据</p>
                  </div>
                )}
              </div>
              
              {/* 财务指标表格 */}
              {company.latest_financials.length > 0 && (
                <div className="card overflow-x-auto">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    📈 财务指标
                  </h2>
                  
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-gray-500">报告期</th>
                        <th className="text-right py-2 text-gray-500">营业收入</th>
                        <th className="text-right py-2 text-gray-500">营业利润</th>
                        <th className="text-right py-2 text-gray-500">净利润</th>
                        <th className="text-right py-2 text-gray-500">EPS</th>
                        <th className="text-right py-2 text-gray-500">ROE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {company.latest_financials.slice(0, 8).map((financial) => (
                        <tr key={financial.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3">
                            {financial.fiscal_year} {financial.period}
                          </td>
                          <td className="text-right py-3">
                            {financial.revenue ? formatYen(financial.revenue) : '-'}
                          </td>
                          <td className="text-right py-3">
                            {financial.operating_income ? formatYen(financial.operating_income) : '-'}
                          </td>
                          <td className="text-right py-3">
                            {financial.net_income ? formatYen(financial.net_income) : '-'}
                          </td>
                          <td className="text-right py-3">
                            {financial.eps ? `¥${financial.eps.toFixed(2)}` : '-'}
                          </td>
                          <td className="text-right py-3">
                            {financial.roe ? `${financial.roe.toFixed(1)}%` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* 右侧：最新披露 */}
            <div className="space-y-6">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    📄 最新披露
                  </h2>
                  <Link 
                    href={`/disclosures?stock_code=${company.stock_code}`}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    查看全部 →
                  </Link>
                </div>
                
                {company.latest_disclosures.length > 0 ? (
                  <div className="space-y-3">
                    {company.latest_disclosures.slice(0, 5).map((disclosure) => (
                      <Link
                        key={disclosure.id}
                        href={`/disclosure/${disclosure.id}`}
                        className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start gap-2">
                          <span className={`badge text-xs ${disclosure.source === 'EDINET' ? 'badge-edinet' : 'badge-tdnet'}`}>
                            {disclosure.source}
                          </span>
                          {disclosure.doc_type && (
                            <span className="badge bg-gray-200 text-gray-700 text-xs">
                              {disclosure.doc_type}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mt-2 line-clamp-2">
                          {disclosure.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(disclosure.submit_date), 'yyyy-MM-dd')}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>暂无披露信息</p>
                  </div>
                )}
              </div>
              
              {/* 外部链接 */}
              <div className="card">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  🔗 官方信息
                </h2>
                <div className="space-y-3">
                  <a
                    href={`https://disclosure.edinet-fsa.go.jp/E01EW/BLMainController.jsp?uji.verb=W1E62071W1E6A0201DSPSch&uji.bean=ee.W1E62071.W1E6A020.EW1E6A020DSPSchBean&TIDYW1E6A020DSPSch=&secCode=${company.stock_code}&reqFlg=1&sessionID=1&seqNo=1&wrtngFlg=1&snwsid=1&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=&sp=`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full text-center block"
                  >
                    EDINET披露查询
                  </a>
                  
                  <a
                    href={`https://www.release.tdnet.info/index.html`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full text-center block"
                  >
                    TDnet适时披露
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* 免责声明 */}
          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>免责声明：</strong>本页面仅展示公开披露信息，不构成任何投资建议。
                  财务数据仅供参考，请以官方披露文档为准。
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}

/**
 * 格式化日元金额
 */
function formatYen(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}兆日元`
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}亿日元`
  } else {
    return `${amount.toFixed(0)}百万日元`
  }
}
