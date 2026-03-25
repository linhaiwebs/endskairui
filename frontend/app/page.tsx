/**
 * ホームページ - 日本上場企業開示情報プラットフォーム
 */
import Link from 'next/link'
import { Metadata } from 'next'
import { format } from 'date-fns'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DisclosureCard from '@/components/DisclosureCard'
import { disclosureAPI, companyAPI, statsAPI } from '@/lib/api'

export const metadata: Metadata = {
  title: '開示情報検索 - EDINET・TDnet開示情報プラットフォーム',
  description: '日本上場企業の開示情報を検索・閲覧できるプラットフォーム。EDINET（金融庁）とTDnet（東証）の有価証券報告書、四半期報告書、適時開示情報を提供。',
  keywords: 'EDINET, TDnet, 開示情報, 有価証券報告書, 四半期報告書, 適時開示, 日本株, 上場企業',
  openGraph: {
    title: '開示情報検索 - EDINET・TDnet開示情報プラットフォーム',
    description: '日本上場企業の開示情報を検索・閲覧できるプラットフォーム',
    type: 'website',
    locale: 'ja_JP',
  },
  other: {
    'application-name': '開示情報検索',
    'format-detection': 'telephone=no',
  },
}

export default async function HomePage() {
  // 並行してデータを取得
  let latestDisclosures = { items: [], total: 0, page: 1, page_size: 10, total_pages: 0 }
  let companies: any[] = []
  let stats: any = null
  
  try {
    [latestDisclosures, companies, stats] = await Promise.all([
      disclosureAPI.getLatest(10),
      companyAPI.getList({ limit: 5 }),
      statsAPI.getOverview(),
    ])
  } catch (error) {
    console.error('Error fetching homepage data:', error)
  }

  return (
    <>
      <Header />
      
      {/* JSON-LD構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: '開示情報検索',
            description: '日本上場企業の開示情報を検索・閲覧できるプラットフォーム',
            url: process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com'}/search?q={search_term_string}`,
              },
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
      
      <main className="flex-1">
        {/* ヒーローエリア */}
        <section className="bg-gradient-to-b from-primary-50 to-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                日本上場企業開示情報プラットフォーム
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                EDINET・TDnetの公開開示情報を検索・閲覧
              </p>
              
              {/* 統計情報 */}
              {stats && (
                <div className="flex justify-center gap-8 mb-6 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">{stats.total_disclosures?.toLocaleString() || 0}</div>
                    <div className="text-gray-500">開示文書</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">{stats.total_companies?.toLocaleString() || 0}</div>
                    <div className="text-gray-500">上場企業</div>
                  </div>
                </div>
              )}
              
              {/* 検索ボックス */}
              <div className="max-w-2xl mx-auto">
                <form action="/search" method="GET">
                  <div className="relative">
                    <input
                      type="text"
                      name="q"
                      placeholder="会社名または証券コードを検索（例：トヨタ, 7203, Toyota）..."
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
                      検索
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
        
        {/* データソース説明 */}
        <section className="py-6 border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="badge badge-edinet">EDINET</span>
                <span>金融庁電子開示システム</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-tdnet">TDnet</span>
                <span>東京証券取引所適時開示システム</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* 最新開示 */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                📄 最新開示
              </h2>
              <Link 
                href="/disclosures"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                すべて見る →
              </Link>
            </div>
            
            {latestDisclosures.items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {latestDisclosures.items.map((disclosure) => (
                  <DisclosureCard 
                    key={disclosure.id} 
                    disclosure={disclosure} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>開示データがありません</p>
                <p className="text-sm mt-2">データベース初期化スクリプトを実行してください</p>
              </div>
            )}
          </div>
        </section>
        
        {/* 人気企業 */}
        <section className="py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                🏢 人気企業
              </h2>
              <Link 
                href="/companies"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                すべて見る →
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
                <p>企業データがありません</p>
              </div>
            )}
          </div>
        </section>
        
        {/* 利用ガイド */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              📖 ご利用ガイド
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="font-medium text-gray-900 mb-2">企業検索</h3>
                <p className="text-sm text-gray-600">
                  会社名（日本語/英語）または証券コードで、目的の企業の開示情報を素早く検索
                </p>
              </div>
              
              <div className="card">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-medium text-gray-900 mb-2">開示資料閲覧</h3>
                <p className="text-sm text-gray-600">
                  有価証券報告書、四半期報告書、業績予想など、各種開示資料を閲覧
                </p>
              </div>
              
              <div className="card">
                <div className="text-3xl mb-3">🔗</div>
                <h3 className="font-medium text-gray-900 mb-2">公式情報へアクセス</h3>
                <p className="text-sm text-gray-600">
                  EDINETまたはTDnetの公式サイトで、完全な開示文書を直接閲覧可能
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* 重要な注意事項 */}
        <section className="py-6 bg-yellow-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ 重要：</strong>
                本サイトは公開開示情報の整理と検索機能のみを提供し、投資推奨ではありません。
                投資にはリスクがあります。すべてのデータは公式開示システムから取得しています。
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}
