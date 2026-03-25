/**
 * 类型定义
 */

export interface Disclosure {
  id: number
  stock_code: string
  company_name: string
  title: string
  doc_type: string | null
  doc_id: string | null
  doc_type_code?: string | null
  submit_date: string
  fiscal_year: string | null
  period: string | null
  source: 'EDINET' | 'TDnet'
  pdf_url: string | null
  html_url: string | null
  xbrl_url: string | null
  summary?: string | null
  is_important?: boolean
  view_count: number
  created_at: string
  updated_at: string
}

export interface Company {
  id: number
  stock_code: string
  company_name: string
  company_name_en: string | null
  market: string | null
  industry: string | null
  sector: string | null
  description: string | null
  founded_date: string | null
  employee_count: number | null
  website_url: string | null
  listing_date?: string | null
  created_at: string
  updated_at: string
}

export interface FinancialReport {
  id: number
  stock_code: string
  fiscal_year: string
  period: string
  revenue: number | null
  operating_income: number | null
  net_income: number | null
  total_assets: number | null
  total_equity: number | null
  eps: number | null
  roe: number | null
  ordinary_income?: number | null
  total_liabilities?: number | null
  operating_cf?: number | null
  investing_cf?: number | null
  financing_cf?: number | null
  bps?: number | null
  dividend?: number | null
  report_date?: string | null
  created_at: string
  updated_at: string
}

export interface DisclosureListResponse {
  items: Disclosure[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface CompanyListResponse {
  items: Company[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface CompanyDetail extends Company {
  latest_financials: FinancialReport[]
  latest_disclosures: Disclosure[]
  listing_date?: string
}
