/**
 * ヘッダーコンポーネント
 */
'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">開</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 hidden sm:block">
              開示情報検索
            </span>
          </Link>
          
          {/* 検索ボックス */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="会社名または証券コードを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </form>
          
          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link 
              href="/disclosures" 
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              開示一覧
            </Link>
            <Link 
              href="/stocks" 
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              企業一覧
            </Link>
            <Link 
              href="/stats" 
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              統計情報
            </Link>
            <Link 
              href="/about" 
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              このサイトについて
            </Link>
          </nav>

          {/* モバイルメニューボタン */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* モバイルナビゲーション */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/disclosures" 
                className="text-gray-600 hover:text-gray-900 transition-colors px-2 py-1"
              >
                開示一覧
              </Link>
              <Link 
                href="/stocks" 
                className="text-gray-600 hover:text-gray-900 transition-colors px-2 py-1"
              >
                企業一覧
              </Link>
              <Link 
                href="/stats" 
                className="text-gray-600 hover:text-gray-900 transition-colors px-2 py-1"
              >
                統計情報
              </Link>
              <Link 
                href="/about" 
                className="text-gray-600 hover:text-gray-900 transition-colors px-2 py-1"
              >
                このサイトについて
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
