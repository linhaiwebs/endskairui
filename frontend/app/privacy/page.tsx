import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'プライバシーポリシー | 開示情報検索',
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">プライバシーポリシー</h1>
        
        <section className="space-y-6 text-gray-700">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. 情報の収集</h2>
            <p>本サイトは、EDINET（金融庁）およびTDnet（東京証券取引所）から公開されている開示情報を提供する中立的な情報プラットフォームです。</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>アクセスログ（IPアドレス、ブラウザ情報）を自動的に収集する場合があります</li>
              <li>個人を特定できる情報は収集しません</li>
              <li>Cookieを使用する場合があります（アクセス解析のため）</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">2. 情報の利用目的</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>サービスの品質向上</li>
              <li>アクセス統計の分析</li>
              <li>ユーザーサポートの向上</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">3. 情報の第三者提供</h2>
            <p>法令に基づく場合を除き、ユーザーの同意なく第三者に情報を提供することはありません。</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">4. アクセス解析ツール</h2>
            <p>本サイトでは、Google Analyticsを使用する場合があります。Google Analyticsは、トラフィックデータの収集のためにCookieを使用します。</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">5. 免責事項</h2>
            <p>本サイトの情報を基にした投資判断により生じた損害について、一切の責任を負いかねます。</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">6. プライバシーポリシーの変更</h2>
            <p>本ポリシーは、予告なく変更される場合があります。</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">7. お問い合わせ</h2>
            <p>プライバシーに関するお問い合わせは、お問い合わせフォームよりご連絡ください。</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
