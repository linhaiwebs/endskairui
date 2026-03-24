import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'このサイトについて | 開示情報検索',
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">このサイトについて</h1>
        
        <section className="space-y-6 text-gray-700">
          <div className="card">
            <h2 className="text-xl font-semibold mb-3">🔍 本サイトの目的</h2>
            <p>本サイトは、日本上場企業の開示情報を検索・閲覧できる中立的な情報プラットフォームです。金融庁EDINETおよび東京証券取引所TDnetから公開されている情報を整理し、使いやすい形で提供しています。</p>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-3">📊 提供する情報</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>有価証券報告書（年次報告書）</li>
              <li>四半期報告書</li>
              <li>臨時報告書</li>
              <li>自己株券買付状況報告書</li>
              <li>大量保有報告書</li>
              <li>その他適時開示資料</li>
            </ul>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-3">🔗 データソース</h2>
            <div className="space-y-2">
              <p><strong>EDINET（金融庁電子開示システム）</strong></p>
              <p className="text-sm text-gray-600">金融商品取引法に基づく開示書類の電子開示システム</p>
              <p className="mt-3"><strong>TDnet（適時開示情報伝達システム）</strong></p>
              <p className="text-sm text-gray-600">東京証券取引所の上場企業からの適時開示情報</p>
            </div>
          </div>
          
          <div className="card bg-yellow-50 border border-yellow-200">
            <h2 className="text-xl font-semibold mb-3">⚠️ 免責事項</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>本サイトは公式の金融庁、東京証券取引所、または上場企業のウェブサイトではありません</li>
              <li>本サイトの情報は投資勧誘または投資推奨を目的とするものではありません</li>
              <li>本サイトの情報は、元の情報と完全に一致することを保証しません</li>
              <li>本サイトの情報を基にした投資判断により生じた損害について、一切の責任を負いかねます</li>
            </ul>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-3">🛠️ 機能</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>企業名・証券コードでの検索</li>
              <li>開示情報の一覧表示・詳細閲覧</li>
              <li>PDF・XBRLファイルへのリンク</li>
              <li>統計情報の表示</li>
              <li>モバイル対応</li>
            </ul>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-3">📧 お問い合わせ</h2>
            <p>お問い合わせは、お問い合わせフォームよりご連絡ください。</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
