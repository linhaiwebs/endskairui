/**
 * 披露列表页面
 */
import { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DisclosureCard from '@/components/DisclosureCard'
import { disclosureAPI } from '@/lib/api'

export const metadata: Metadata = {
  title: '披露列表',
  description: '日本上市公司最新披露信息列表，包括年报、季报、临时报告等。',
}

interface DisclosurePageProps {
  searchParams: {
    page?: string
    doc_type?: string
    source?: string
    keyword?: string
  }
}

export default async function DisclosuresPage({ searchParams }: DisclosurePageProps) {
  const page = parseInt(searchParams.page || '1')
  const docType = searchParams.doc_type || undefined
  const source = searchParams.source || undefined
  const keyword = searchParams.keyword || undefined
  
  // 获取披露数据
  const data = await disclosureAPI.getList({
    page,
    page_size: 20,
    doc_type: docType,
    source: source,
    keyword: keyword,
  }).catch(() => ({
    items: [],
    total: 0,
    page: 1,
    page_size: 20,
    total_pages: 0,
  }))
  
  // 文档类型选项
  const docTypes = [
    { value: '', label: '全部类型' },
    { value: '有価証券報告書', label: '年报' },
    { value: '四半期報告書', label: '季报' },
    { value: '半期報告書', label: '半年报' },
    { value: '臨時報告書', label: '临时报告' },
    { value: '業績予想の修正', label: '业绩修正' },
  ]
  
  const sources = [
    { value: '', label: '全部来源' },
    { value: 'EDINET', label: 'EDINET' },
    { value: 'TDnet', label: 'TDnet' },
  ]

  return (
    <>
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">披露信息列表</h1>
            <p className="text-gray-600 mt-1">
              共 {data.total} 条披露记录
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
                  placeholder="搜索标题关键词..."
                  defaultValue={keyword}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              {/* 文档类型 */}
              <div>
                <select
                  name="doc_type"
                  defaultValue={docType}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {docTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* 数据来源 */}
              <div>
                <select
                  name="source"
                  defaultValue={source}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {sources.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* 提交按钮 */}
              <button
                type="submit"
                className="btn-primary"
              >
                筛选
              </button>
              
              {/* 重置按钮 */}
              <Link
                href="/disclosures"
                className="btn-secondary"
              >
                重置
              </Link>
            </form>
          </div>
          
          {/* 披露列表 */}
          {data.items.length > 0 ? (
            <>
              <div className="space-y-4 mb-6">
                {data.items.map((disclosure) => (
                  <DisclosureCard 
                    key={disclosure.id} 
                    disclosure={disclosure} 
                  />
                ))}
              </div>
              
              {/* 分页 */}
              {data.total_pages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  {/* 上一页 */}
                  {page > 1 && (
                    <Link
                      href={`/disclosures?${buildQuery({ ...searchParams, page: page - 1 })}`}
                      className="btn-secondary"
                    >
                      ← 上一页
                    </Link>
                  )}
                  
                  {/* 页码 */}
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, data.total_pages) }, (_, i) => {
                      let pageNum: number
                      if (data.total_pages <= 5) {
                        pageNum = i + 1
                      } else if (page <= 3) {
                        pageNum = i + 1
                      } else if (page >= data.total_pages - 2) {
                        pageNum = data.total_pages - 4 + i
                      } else {
                        pageNum = page - 2 + i
                      }
                      
                      return (
                        <Link
                          key={pageNum}
                          href={`/disclosures?${buildQuery({ ...searchParams, page: pageNum })}`}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                            pageNum === page
                              ? 'bg-primary-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </Link>
                      )
                    })}
                  </div>
                  
                  {/* 下一页 */}
                  {page < data.total_pages && (
                    <Link
                      href={`/disclosures?${buildQuery({ ...searchParams, page: page + 1 })}`}
                      className="btn-secondary"
                    >
                      下一页 →
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">暂无符合条件的披露数据</p>
              <p className="text-sm mt-2">尝试调整筛选条件</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  )
}

/**
 * 构建查询字符串
 */
function buildQuery(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 1) {
      searchParams.append(key, String(value))
    }
  })
  
  return searchParams.toString()
}
