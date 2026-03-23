/**
 * 网站页脚组件
 */
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 免责声明 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 font-medium">
                ⚠️ 免责声明
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                本网站仅提供公开披露信息整理，不构成任何投资建议。投资有风险，决策需谨慎。
              </p>
            </div>
          </div>
        </div>
        
        {/* 数据来源 */}
        <div className="mb-6">
          <p className="text-sm text-gray-400">
            <strong className="text-gray-300">数据来源：</strong>
            <Link 
              href="https://disclosure.edinet-fsa.go.jp/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="link ml-1"
            >
              EDINET（日本金融厅）
            </Link>
            <span className="mx-2">和</span>
            <Link 
              href="https://www.tse.or.jp/listing/tdnet/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="link"
            >
              东京证券交易所 TDnet
            </Link>
          </p>
        </div>
        
        {/* 链接区域 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-medium mb-3">功能</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/disclosures" className="hover:text-white transition-colors">披露列表</Link></li>
              <li><Link href="/stocks" className="hover:text-white transition-colors">公司列表</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-3">帮助</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">关于本站</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">常见问题</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-3">外部链接</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="https://disclosure.edinet-fsa.go.jp/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  EDINET官网
                </Link>
              </li>
              <li>
                <Link 
                  href="https://www.release.tdnet.info/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  TDnet官网
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-3">法律</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">隐私政策</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">使用条款</Link></li>
            </ul>
          </div>
        </div>
        
        {/* 版权信息 */}
        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} 日本上市公司信息披露平台 - 仅供信息查询，不提供投资建议
          </p>
          <p className="mt-2">
            本站为第三方中立信息平台，与日本金融厅、东京证券交易所以及任何上市公司无关联
          </p>
        </div>
      </div>
    </footer>
  )
}
