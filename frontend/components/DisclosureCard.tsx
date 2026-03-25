/**
 * 開示情報カードコンポーネント
 */
import Link from 'next/link'
import { format } from 'date-fns'
import type { Disclosure } from '@/lib/types'

interface DisclosureCardProps {
  disclosure: Disclosure
  showCompany?: boolean
}

export default function DisclosureCard({ disclosure, showCompany = true }: DisclosureCardProps) {
  // 日付をフォーマット
  const submitDate = new Date(disclosure.submit_date)
  const formattedDate = format(submitDate, 'yyyy-MM-dd HH:mm')
  const relativeTime = getRelativeTime(submitDate)
  
  // ソースバッジの色
  const sourceBadge = disclosure.source === 'EDINET' 
    ? 'badge-edinet' 
    : 'badge-tdnet'
  
  return (
    <article className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* 企業情報 */}
          {showCompany && (
            <div className="flex items-center gap-2 mb-2">
              <Link 
                href={`/stock/${disclosure.stock_code}`}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                {disclosure.stock_code}
              </Link>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600 text-sm">
                {disclosure.company_name}
              </span>
            </div>
          )}
          
          {/* タイトル */}
          <Link 
            href={`/disclosure/${disclosure.id}`}
            className="text-gray-900 font-medium hover:text-primary-600 transition-colors line-clamp-2"
          >
            {disclosure.title}
          </Link>
          
          {/* メタデータ */}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
            {/* ソース */}
            <span className={`badge ${sourceBadge}`}>
              {disclosure.source}
            </span>
            
            {/* 文書タイプ */}
            {disclosure.doc_type && (
              <span className="badge bg-gray-100 text-gray-700">
                {disclosure.doc_type}
              </span>
            )}
            
            {/* 会計年度 */}
            {disclosure.fiscal_year && (
              <span>{disclosure.fiscal_year}年度</span>
            )}
            
            {/* 期間 */}
            {disclosure.period && (
              <span>{disclosure.period}</span>
            )}
          </div>
          
          {/* 時刻 */}
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span title={formattedDate}>
              {relativeTime} ({formattedDate})
            </span>
            
            {/* 閲覧数 */}
            <span className="ml-2">
              👁 {disclosure.view_count}
            </span>
          </div>
        </div>
        
        {/* 原文リンク */}
        <div className="flex flex-col gap-2">
          {disclosure.pdf_url && (
            <a
              href={disclosure.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm whitespace-nowrap"
            >
              📄 PDF
            </a>
          )}
          {disclosure.html_url && (
            <a
              href={disclosure.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm whitespace-nowrap"
            >
              🌐 HTML
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

/**
 * 相対時間を取得
 */
function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMins < 60) {
    return `${diffMins}分前`
  } else if (diffHours < 24) {
    return `${diffHours}時間前`
  } else if (diffDays < 7) {
    return `${diffDays}日前`
  } else {
    return format(date, 'MM-dd')
  }
}
