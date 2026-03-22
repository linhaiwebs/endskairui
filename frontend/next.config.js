/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 配置API代理（开发环境）
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/:path*`,
      },
    ]
  },
  
  // 图片优化配置
  images: {
    domains: ['disclosure.edinet-fsa.go.jp', 'www.release.tdnet.info'],
    unoptimized: false,
  },
  
  // 输出配置（支持Vercel部署）
  output: 'standalone',
}

module.exports = nextConfig
