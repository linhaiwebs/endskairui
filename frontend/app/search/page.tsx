/**
 * 検索ページ
 */
import { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DisclosureCard from '@/components/DisclosureCard'
import { disclosureAPI, companyAPI } from '@/lib/api'

export const metadata: Metadata = {
  title: '検索 | 開示情報検索',
  description: '日本上場企業の開示情報と企業データを検索',
}

interface SearchPageProps {
  searchParams: {
    q?: string
    type?: string
    page?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''
  const type = searchParams.type || 'all'
  const page = parseInt(searchParams.page || '1')
  
  // 执行検索
  let disclosures = { items: [] as any[], total: 0, page: 1, page_size: 20, total_pages: 0 }
  let companies: any[] = []
  
  if (query) {
    try {
      if (type === 'all' || type === 'disclosures') {
        disclosures = await disclosureAPI.getList({
          keyword: query,
          page,
          page_size: 20,
        })
      }
      
      if (type === 'all' || type === 'companies') {
        companies = await companyAPI.getList({
          keyword: query,
          limit: 10,
        })
      }
    } catch (error) {
      console.error('Search error:', error)
    }
  }
  
  const hasResults = disclosures.items.length > 0 || companies.length > 0

  return (
    <>
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 検索ボックス */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              検索結果
            </h1>
            
            <form action="/search" method="GET" className="max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="会社名、証券コード、または開示内容を検索..."
                  className="w-full px-6 py-4 pl-12 text-lg border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* 検索タイプ選択 */}
              <div className="mt-4 flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="all"
                    defaultChecked={type === 'all'}
                    className="mr-2"
                  />
                  すべて
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="disclosures"
                    defaultChecked={type === 'disclosures'}
                    className="mr-2"
                  />
                  開示情報
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="companies"
                    defaultChecked={type === 'companies'}
                    className="mr-2"
                  />
                  企業
                </label>
              </div>
              
              <button
                type="submit"
                className="mt-4 btn-primary"
              >
                検索
              </button>
            </form>
          </div>
          
          {/* 検索结果 */}
          {query && (
            <div className="space-y-8">
              {/* 统计信息 */}
              <div className="text-gray-600">
                見つかりました {disclosures.total} 件の開示情報 和 {companies.length} 社の企業
                {query && (
                  <span>，关键词: &ldquo;<span className="font-medium">{query}</span>&rdquo;</span>
                )}
              </div>
              
              {/* 企業结果 */}
              {(type === 'all' || type === 'companies') && companies.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    企業 ({companies.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {companies.map((company) => (
                      <Link
                        key={company.stock_code}
                        href={`/stock/${company.stock_code}`}
                        className="card hover:shadow-lg transition-shadow"
                      >
                        <h3 className="font-bold text-gray-900 mb-1">
                          {company.company_name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          証券コード: {company.stock_code}
                        </p>
                        {company.industry && (
                          <p className="text-gray-500 text-sm mt-1">
                            業種: {company.industry}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </section>
              )}
              
              {/* 披露结果 */}
              {(type === 'all' || type === 'disclosures') && disclosures.items.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    開示情報 ({disclosures.total})
                  </h2>
                  <div className="space-y-4">
                    {disclosures.items.map((disclosure) => (
                      <DisclosureCard
                        key={disclosure.id}
                        disclosure={disclosure}
                      />
                    ))}
                  </div>
                  
                  {/* 分页 */}
                  {disclosures.total_pages > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                      {Array.from({ length: disclosures.total_pages }, (_, i) => i + 1)
                        .slice(
                          Math.max(0, page - 3),
                          Math.min(disclosures.total_pages, page + 2)
                        )
                        .map((p) => (
                          <Link
                            key={p}
                            href={`/search?q=${encodeURIComponent(query)}&type=${type}&page=${p}`}
                            className={`px-4 py-2 rounded ${
                              p === page
                                ? 'bg-primary-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {p}
                          </Link>
                        ))
                      }
                    </div>
                  )}
                </section>
              )}
              
              {/* 无结果 */}
              {!hasResults && query && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <p className="text-gray-600 text-lg">
                    未見つかりました与 &ldquo;<span className="font-medium">{query}</span>&rdquo; 一致する結果
                  </p>
                  <p className="text-gray-500 mt-2">
                    ヒント：
                  </p>
                  <ul className="text-gray-500 mt-2 space-y-1">
                    <li>• キーワードが正しいか確認してください</li>
                    <li>• 別のキーワードを試してください</li>
                    <li>• 使用証券コード进行精确検索（例：7203, 6758）</li>
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {/* 検索キーワードなし */}
          {!query && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">💡</div>
              <p className="text-gray-600 text-lg">
                请输入検索キーワード开始検索
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  )
}
