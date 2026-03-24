/**
 * フッターコンポーネント
 */
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 免責事項 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800 font-medium mb-2">
                ⚠️ 免責事項
              </p>
              <div className="text-sm text-yellow-700 space-y-1">
                <p>
                  1. 本サイトは、金融庁EDINETおよび東京証券取引所TDnetで公開された情報を整理し、検索機能を提供する中立的な情報プラットフォームです。
                </p>
                <p>
                  2. 本サイトの情報は、投資勧誘または投資推奨を目的とするものではありません。投資に関する意思決定は、ご自身の判断と責任で行ってください。
                </p>
                <p>
                  3. 本サイトは公式の金融庁、東京証券取引所、または上場企業のウェブサイトではありません。
                </p>
                <p>
                  4. 本サイトの情報は、元の情報と完全に一致することを保証しません。最新の正確な情報は、必ず公式情報源でご確認ください。
                </p>
                <p>
                  5. 本サイトの情報を基にした投資判断により生じた損害について、一切の責任を負いかねます。
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* データソース */}
        <div className="mb-6">
          <p className="text-sm text-gray-400">
            <strong className="text-gray-300">データソース：</strong>
            <Link 
              href="https://disclosure.edinet-fsa.go.jp/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="link ml-1"
            >
              EDINET（金融庁）
            </Link>
            <span className="mx-2">および</span>
            <Link 
              href="https://www.tse.or.jp/listing/tdnet/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="link"
            >
              東京証券取引所 TDnet
            </Link>
          </p>
        </div>
        
        {/* リンクエリア */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-medium mb-3">機能</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/disclosures" className="hover:text-white transition-colors">開示一覧</Link></li>
              <li><Link href="/companies" className="hover:text-white transition-colors">企業一覧</Link></li>
              <li><Link href="/stats" className="hover:text-white transition-colors">統計情報</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-3">ヘルプ</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">このサイトについて</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">よくある質問</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-3">外部リンク</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="https://disclosure.edinet-fsa.go.jp/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  EDINET公式サイト
                </Link>
              </li>
              <li>
                <Link 
                  href="https://www.release.tdnet.info/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  TDnet公式サイト
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-3">法的情報</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">利用規約</Link></li>
            </ul>
          </div>
        </div>
        
        {/* 著作権情報 */}
        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} 開示情報検索 - 情報提供のみを目的とし、投資推奨ではありません
          </p>
          <p className="mt-2">
            本サイトは第三者中立的情報プラットフォームであり、金融庁、東京証券取引所、または上場企業との提携関係はありません
          </p>
        </div>
      </div>
    </footer>
  )
}
