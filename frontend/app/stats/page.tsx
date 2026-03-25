/**
 * 統計情報ページ
 */
import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { statsAPI } from '@/lib/api'

export const metadata: Metadata = {
  title: '統計情報 | 開示情報検索',
  description: '開示情報の統計データ',
}

export default async function StatsPage() {
  let overview: any = null
  let daily: any = null
  let hotCompanies: any[] = []
  
  try {
    [overview, daily, hotCompanies] = await Promise.all([
      statsAPI.getOverview(),
      statsAPI.getDaily(7),
      statsAPI.getHotCompanies(10),
    ])
  } catch (error) {
    console.error('Error fetching stats data:', error)
  }

  return (
    <>
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          📊 統計情報
        </h1>
        
        {/* 概要 */}
        {overview && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">概要</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card">
                <div className="text-3xl font-bold text-primary-600">
                  {overview.total_disclosures?.toLocaleString() || 0}
                </div>
                <div className="text-gray-500">総開示文書数</div>
              </div>
              <div className="card">
                <div className="text-3xl font-bold text-primary-600">
                  {overview.total_companies?.toLocaleString() || 0}
                </div>
                <div className="text-gray-500">上場企業数</div>
              </div>
              <div className="card">
                <div className="text-3xl font-bold text-primary-600">
                  {overview.today_disclosures?.toLocaleString() || 0}
                </div>
                <div className="text-gray-500">本日の開示</div>
              </div>
            </div>
          </section>
        )}
        
        {/* 日次統計 */}
        {daily && daily.daily_stats && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">日次開示数（過去7日間）</h2>
            <div className="card overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">日付</th>
                    <th className="text-right py-3 px-4">開示数</th>
                  </tr>
                </thead>
                <tbody>
                  {daily.daily_stats.map((stat: any, index: number) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 px-4">{stat.date}</td>
                      <td className="text-right py-3 px-4 font-medium">{stat.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        
        {/* 人気企業 */}
        {hotCompanies && hotCompanies.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">開示の多い企業（上位10社）</h2>
            <div className="card overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">証券コード</th>
                    <th className="text-left py-3 px-4">会社名</th>
                    <th className="text-right py-3 px-4">開示数</th>
                  </tr>
                </thead>
                <tbody>
                  {hotCompanies.map((company: any, index: number) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 px-4 font-mono">{company.stock_code}</td>
                      <td className="py-3 px-4">{company.company_name}</td>
                      <td className="text-right py-3 px-4 font-medium">{company.disclosure_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        
        {!overview && !daily && (!hotCompanies || hotCompanies.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            <p>統計データがありません</p>
            <p className="text-sm mt-2">データを取得してから再度アクセスしてください</p>
          </div>
        )}
      </main>
      
      <Footer />
    </>
  )
}
