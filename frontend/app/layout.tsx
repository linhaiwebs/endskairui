import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: '日本上市公司信息披露平台 | EDINET + TDnet',
    template: '%s | 日本股票披露平台',
  },
  description: '日本上市公司公开披露信息查询平台，提供EDINET和TDnet财报、公告等披露信息的搜索和浏览服务。',
  keywords: ['日本股票', 'EDINET', 'TDnet', '财报', '披露信息', '有価証券報告書', '日本上市公司'],
  authors: [{ name: 'JP Disclosure Platform' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: '日本上市公司信息披露平台',
    title: '日本上市公司信息披露平台 | EDINET + TDnet',
    description: '日本上市公司公开披露信息查询平台',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  )
}
