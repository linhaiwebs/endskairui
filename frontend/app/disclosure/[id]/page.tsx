/**
 * 披露详情页面
 */
import { Metadata } from 'next'
import Link from 'next/link'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { disclosureAPI } from '@/lib/api'

interface DisclosureDetailPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: DisclosureDetailPageProps): Promise<Metadata> {
  try {
    const disclosure = await disclosureAPI.getDetail(parseInt(params.id))
    return {
      title: `${disclosure.title.slice(0, 50)} - ${disclosure.company_name}`,
      description: `${disclosure.company_name}的${disclosure.doc_type || '披露'}信息，提交于${format(new Date(disclosure.submit_date), 'yyyy年MM月dd日')}。`,
    }
  } catch {
    return {
      title: '披露详情',
    }
  }
}

export default async function DisclosureDetailPage({ params }: DisclosureDetailPageProps) {
  let disclosure
  
  try {
    disclosure = await disclosureAPI.getDetail(parseInt(params.id))
  } catch {
    notFound()
  }
  
  const submitDate = new Date(disclosure.submit_date)
  const formattedDate = format(submitDate, 'yyyy年MM月dd日 HH:mm')
  
  return (
    <>
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 面包屑 */}
          <nav className="mb-6 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">首页</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/disclosures" className="text-gray-500 hover:text-gray-700">披露列表</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">披露详情</span>
          </nav>
          
          {/* 主要内容 */}
          <article className="card">
            {/* 标题 */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {disclosure.title}
            </h1>
            
            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-gray-200">
              {/* 公司 */}
              <Link
                href={`/stock/${disclosure.stock_code}`}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {disclosure.company_name} ({disclosure.stock_code})
              </Link>
              
              {/* 来源 */}
              <span className={`badge ${disclosure.source === 'EDINET' ? 'badge-edinet' : 'badge-tdnet'}`}>
                {disclosure.source}
              </span>
              
              {/* 文档类型 */}
              {disclosure.doc_type && (
                <span className="badge bg-gray-100 text-gray-700">
                  {disclosure.doc_type}
                </span>
              )}
            </div>
            
            {/* 详细信息 */}
            <div className="space-y-4">
              {/* 提交时间 */}
              <div className="flex items-start gap-3">
                <span className="text-gray-500 w-24 flex-shrink-0">提交时间</span>
                <span className="text-gray-900">{formattedDate}</span>
              </div>
              
              {/* 会计年度 */}
              {disclosure.fiscal_year && (
                <div className="flex items-start gap-3">
                  <span className="text-gray-500 w-24 flex-shrink-0">会计年度</span>
                  <span className="text-gray-900">{disclosure.fiscal_year}年度</span>
                </div>
              )}
              
              {/* 期间 */}
              {disclosure.period && (
                <div className="flex items-start gap-3">
                  <span className="text-gray-500 w-24 flex-shrink-0">期间</span>
                  <span className="text-gray-900">{disclosure.period}</span>
                </div>
              )}
              
              {/* 文档ID */}
              <div className="flex items-start gap-3">
                <span className="text-gray-500 w-24 flex-shrink-0">文档ID</span>
                <span className="text-gray-900 font-mono text-sm">{disclosure.doc_id}</span>
              </div>
              
              {/* 浏览次数 */}
              <div className="flex items-start gap-3">
                <span className="text-gray-500 w-24 flex-shrink-0">浏览次数</span>
                <span className="text-gray-900">{disclosure.view_count}</span>
              </div>
            </div>
            
            {/* 摘要 */}
            {disclosure.summary && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h2 className="font-medium text-gray-900 mb-2">内容摘要</h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {disclosure.summary}
                </p>
              </div>
            )}
            
            {/* 原文链接 */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="font-medium text-gray-900 mb-3">查看原文</h2>
              <div className="flex flex-wrap gap-3">
                {disclosure.pdf_url && (
                  <a
                    href={disclosure.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    PDF文档
                  </a>
                )}
                
                {disclosure.html_url && (
                  <a
                    href={disclosure.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    HTML文档
                  </a>
                )}
                
                {disclosure.xbrl_url && (
                  <a
                    href={disclosure.xbrl_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    XBRL数据
                  </a>
                )}
              </div>
              
              <p className="text-sm text-gray-500 mt-3">
                ⚠️ 点击上方链接将跳转至官方系统查看完整披露文档
              </p>
            </div>
          </article>
          
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
                  所有数据均来自{disclosure.source}官方系统。
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
