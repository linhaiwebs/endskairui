/**
 * 企業一覧ページ
 */
import { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { companyAPI } from '@/lib/api'

export const metadata: Metadata = {
  title: '企業一覧 | 開示情報検索',
  description: '日本上場企業の一覧',
}

export default async function CompaniesPage() {
  const companies = await companyAPI.getList({ limit: 100 }).catch(() => [])

  return (
    <>
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🏢 企業一覧
        </h1>
        
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
                    <p className="text-sm text-gray-500">
                      {company.stock_code} • {company.market || '-'}
                    </p>
                    {company.industry && (
                      <p className="text-xs text-gray-400 mt-1 truncate">
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
            <p className="text-sm mt-2">データを取得してから再度アクセスしてください</p>
          </div>
        )}
      </main>
      
      <Footer />
    </>
  )
}
