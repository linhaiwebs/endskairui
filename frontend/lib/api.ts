/**
 * API 客户端
 */

import type { Disclosure, DisclosureListResponse, Company, CompanyDetail, FinancialReport } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class APIClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async fetch<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${path}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // 披露相关
  disclosures = {
    list: async (params?: {
      page?: number
      page_size?: number
      stock_code?: string
      doc_type?: string
      source?: string
      keyword?: string
    }): Promise<DisclosureListResponse> => {
      const searchParams = new URLSearchParams()
      if (params?.page) searchParams.set('page', params.page.toString())
      if (params?.page_size) searchParams.set('page_size', params.page_size.toString())
      if (params?.stock_code) searchParams.set('stock_code', params.stock_code)
      if (params?.doc_type) searchParams.set('doc_type', params.doc_type)
      if (params?.source) searchParams.set('source', params.source)
      if (params?.keyword) searchParams.set('keyword', params.keyword)
      
      const query = searchParams.toString()
      return this.fetch<DisclosureListResponse>(`/api/v1/disclosures${query ? `?${query}` : ''}`)
    },

    getLatest: async (limit: number = 10): Promise<DisclosureListResponse> => {
      return this.fetch<DisclosureListResponse>(`/api/v1/disclosures/latest?limit=${limit}`)
    },

    getById: async (id: number): Promise<Disclosure> => {
      return this.fetch<Disclosure>(`/api/v1/disclosures/${id}`)
    },
  }

  // 公司相关
  companies = {
    list: async (params?: {
      keyword?: string
      industry?: string
      market?: string
      limit?: number
    }): Promise<Company[]> => {
      const searchParams = new URLSearchParams()
      if (params?.keyword) searchParams.set('keyword', params.keyword)
      if (params?.industry) searchParams.set('industry', params.industry)
      if (params?.market) searchParams.set('market', params.market)
      if (params?.limit) searchParams.set('limit', params.limit.toString())
      
      const query = searchParams.toString()
      return this.fetch<Company[]>(`/api/v1/stocks${query ? `?${query}` : ''}`)
    },

    getByCode: async (code: string): Promise<Company> => {
      return this.fetch<Company>(`/api/v1/stocks/${code}`)
    },

    getDetail: async (code: string): Promise<CompanyDetail> => {
      return this.fetch<CompanyDetail>(`/api/v1/stocks/${code}`)
    },

    getDisclosures: async (code: string, params?: {
      limit?: number
    }): Promise<Disclosure[]> => {
      const searchParams = new URLSearchParams()
      if (params?.limit) searchParams.set('limit', params.limit.toString())
      
      const query = searchParams.toString()
      return this.fetch<Disclosure[]>(`/api/v1/stocks/${code}/disclosures${query ? `?${query}` : ''}`)
    },

    getFinancials: async (code: string): Promise<any> => {
      return this.fetch(`/api/v1/stocks/${code}/financials`)
    },

    getIndustries: async (): Promise<string[]> => {
      return this.fetch<string[]>('/api/v1/stocks/industries/list')
    },

    getMarkets: async (): Promise<string[]> => {
      return this.fetch<string[]>('/api/v1/stocks/markets/list')
    },
  }
}

// 导出单例实例
export const apiClient = new APIClient(API_BASE_URL)

// 导出便捷方法
export const disclosureAPI = {
  getList: (params?: Parameters<typeof apiClient.disclosures.list>[0]) => 
    apiClient.disclosures.list(params),
  getLatest: (limit?: number) => 
    apiClient.disclosures.getLatest(limit),
  getById: (id: number) => 
    apiClient.disclosures.getById(id),
  getDetail: (id: number) => 
    apiClient.disclosures.getById(id),
}

export const companyAPI = {
  getList: (params?: Parameters<typeof apiClient.companies.list>[0]) => 
    apiClient.companies.list(params),
  getByCode: (code: string) => 
    apiClient.companies.getByCode(code),
  getDetail: (code: string) => 
    apiClient.companies.getDetail(code),
  getDisclosures: (code: string, params?: Parameters<typeof apiClient.companies.getDisclosures>[1]) => 
    apiClient.companies.getDisclosures(code, params),
  getFinancials: (code: string) => 
    apiClient.companies.getFinancials(code),
  getIndustries: () => 
    apiClient.companies.getIndustries(),
  getMarkets: () => 
    apiClient.companies.getMarkets(),
}
