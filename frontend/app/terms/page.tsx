import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: '利用規約 | 開示情報検索',
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">利用規約</h1>
        
        <section className="space-y-6 text-gray-700">
          <div>
            <h2 className="text-xl font-semibold mb-2">第1条（適用範囲）</h2>
            <p>本規約は、開示情報検索（以下「本サイト」）の利用に関する一切の関係に適用されます。</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">第2条（サービス内容）</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>EDINETおよびTDnetから公開されている開示情報の検索・閲覧サービス</li>
              <li>上場企業情報の提供</li>
              <li>開示情報の統計データの提供</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">第3条（禁止事項）</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>本サイトの情報を商業的に利用すること</li>
              <li>本サイトのシステムに不正にアクセスすること</li>
              <li>他のユーザーまたは第三者に不利益を与える行為</li>
              <li>本サイトの運営を妨害する行為</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">第4条（免責事項）</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>本サイトの情報は公式情報源から取得していますが、完全性を保証しません</li>
              <li>本サイトの情報を基にした投資判断により生じた損害について、一切の責任を負いません</li>
              <li>本サイトのサービスは予告なく変更・停止される場合があります</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">第5条（知的財産権）</h2>
            <p>本サイトのコンテンツ（デザイン、ロゴ、テキスト等）の知的財産権は、当サイトに帰属します。ただし、EDINETおよびTDnetからの情報は除きます。</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">第6条（規約の変更）</h2>
            <p>本規約は、予告なく変更される場合があります。変更後の規約は、本サイトに掲載した時点で効力を生じるものとします。</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">第7条（準拠法・管轄裁判所）</h2>
            <p>本規約は日本法に準拠します。本規約に関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
