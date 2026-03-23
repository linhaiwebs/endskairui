/**
 * 动态生成Sitemap
 */
import { MetadataRoute } from 'next'
import { disclosureAPI, companyAPI } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jp-disclosure.com'
  
  // 获取最新的披露和公司数据
  const [disclosures, companies] = await Promise.all([
    disclosureAPI.getList({ page_size: 100 }).catch(() => ({ items: [], total: 0, page: 1, page_size: 100, total_pages: 0 })),
    companyAPI.getList({ limit: 100 }).catch(() => []),
  ])
  
  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/disclosures`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/stocks`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]
  
  // 披露详情页
  const disclosurePages: MetadataRoute.Sitemap = disclosures.items.map((d) => ({
    url: `${baseUrl}/disclosure/${d.id}`,
    lastModified: new Date(d.submit_date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
  
  // 公司详情页
  const companyPages: MetadataRoute.Sitemap = companies.map((c) => ({
    url: `${baseUrl}/stock/${c.stock_code}`,
    lastModified: new Date(c.updated_at || new Date()),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))
  
  return [...staticPages, ...disclosurePages, ...companyPages]
}
