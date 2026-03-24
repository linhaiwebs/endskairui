import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'よくある質問 | 開示情報検索',
}

export default function FAQPage() {
  const faqs = [
    {
      q: '本サイトは公式サイトですか？',
      a: 'いいえ、本サイトは第三者中立的情報プラットフォームです。金融庁、東京証券取引所、または上場企業との提携関係はありません。'
    },
    {
      q: 'データはどのくらいの頻度で更新されますか？',
      a: 'EDINETおよびTDnetの公式情報源から毎日自動的にデータを取得しています。'
    },
    {
      q: 'すべての上場企業の情報が含まれますか？',
      a: 'EDINETおよびTDnetで公開されている情報のみを提供しています。一部の情報は公開されない場合があります。'
    },
    {
      q: '投資アドバイスを受けることはできますか？',
      a: 'いいえ、本サイトは情報提供のみを目的としており、投資推奨やアドバイスは一切行いません。投資に関する意思決定は、ご自身の判断と責任で行ってください。'
    },
    {
      q: '情報の正確性は保証されますか？',
      a: '本サイトの情報は公式情報源から取得していますが、完全性や正確性を保証するものではありません。最新の正確な情報は、必ず公式情報源でご確認ください。'
    },
    {
      q: 'PDFやXBRLファイルをダウンロードできますか？',
      a: 'はい、各開示情報に含まれるリンクから、EDINETまたはTDnetの公式サイトで元の文書をダウンロードできます。'
    },
    {
      q: '検索方法を教えてください',
      a: '会社名（日本語・英語）、証券コード（4桁または5桁）、または開示内容のキーワードで検索できます。'
    },
    {
      q: '有料サービスですか？',
      a: 'いいえ、本サイトは完全無料でご利用いただけます。'
    },
  ]

  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">よくある質問</h1>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="card">
              <h3 className="font-semibold text-gray-900 mb-2">Q: {faq.q}</h3>
              <p className="text-gray-600">A: {faq.a}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ 重要：</strong>本サイトの情報は投資推奨ではありません。投資にはリスクがあります。
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
