/**
 * 关于页面
 */
import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: '关于本站',
  description: '日本上市公司信息披露平台介绍、使用说明和免责声明。',
}

export default function AboutPage() {
  return (
    <>
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">关于本站</h1>
            
            {/* 项目介绍 */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">📌 项目简介</h2>
              <p className="text-gray-700 leading-relaxed">
                日本上市公司信息披露平台是一个完全中立的第三方信息平台，致力于为用户提供便捷的日本上市公司公开披露信息查询服务。
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                本平台整合了日本金融厅EDINET系统和东京证券交易所TDnet系统的披露信息，帮助用户快速查找年报、季报、临时报告等公开披露文件。
              </p>
            </section>
            
            {/* 数据来源 */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">📊 数据来源</h2>
              <div className="space-y-3">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                  <h3 className="font-medium text-blue-900">EDINET</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    日本金融厅电子披露系统，提供有价证券报告书、季度报告书等法定披露文件。
                  </p>
                  <a 
                    href="https://disclosure.edinet-fsa.go.jp/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
                  >
                    访问官网 →
                  </a>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                  <h3 className="font-medium text-green-900">TDnet</h3>
                  <p className="text-sm text-green-700 mt-1">
                    东京证券交易所适时披露系统，提供业绩预告、分红通知等实时披露信息。
                  </p>
                  <a 
                    href="https://www.release.tdnet.info/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-green-600 hover:text-green-800 mt-2 inline-block"
                  >
                    访问官网 →
                  </a>
                </div>
              </div>
            </section>
            
            {/* 主要功能 */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">🎯 主要功能</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">✓</span>
                  <span>公司搜索：支持公司名称（日文/英文）和股票代码搜索</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">✓</span>
                  <span>披露浏览：查看年报、季报、临时报告等各类披露文件</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">✓</span>
                  <span>财务数据：浏览公司的财务指标和趋势图表</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">✓</span>
                  <span>原文跳转：直接访问官方系统的完整披露文档</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">✓</span>
                  <span>数据筛选：按披露类型、日期范围、数据来源筛选</span>
                </li>
              </ul>
            </section>
            
            {/* 使用说明 */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">📖 使用说明</h2>
              <div className="prose prose-sm max-w-none text-gray-700">
                <ol className="space-y-2">
                  <li><strong>搜索公司</strong>：在首页搜索框输入公司名称或股票代码，快速找到目标公司</li>
                  <li><strong>浏览披露</strong>：在公司详情页查看最新的披露信息列表</li>
                  <li><strong>查看财报</strong>：浏览公司的财务数据和趋势图表</li>
                  <li><strong>访问原文</strong>：点击链接跳转到EDINET或TDnet查看完整文档</li>
                </ol>
              </div>
            </section>
            
            {/* 免责声明 */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">⚠️ 免责声明</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="space-y-3 text-sm text-yellow-800">
                  <p>
                    <strong>重要提示：</strong>本网站仅提供公开披露信息的整理和查询服务，不构成任何投资建议。
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>所有数据均来源于官方披露系统（EDINET、TDnet）</li>
                    <li>本平台不保证数据的完整性、准确性和及时性</li>
                    <li>投资有风险，入市需谨慎</li>
                    <li>任何投资决策应基于个人独立研究和专业咨询</li>
                    <li>本平台与任何上市公司、金融机构无关联</li>
                  </ul>
                </div>
              </div>
            </section>
            
            {/* 版权说明 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">©️ 版权说明</h2>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  本平台为第三方中立信息平台，所有披露内容的版权归原作者公司所有。
                </p>
                <p>
                  平台仅提供信息查询服务，不对披露内容负责。
                </p>
                <p>
                  如有版权问题，请联系相关公司或官方披露系统。
                </p>
              </div>
            </section>
          </div>
          
          {/* 联系信息 */}
          <div className="card mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">📧 问题反馈</h2>
            <p className="text-gray-700">
              如有使用问题或建议，请通过以下方式反馈：
            </p>
            <ul className="mt-3 space-y-1 text-gray-600 text-sm">
              <li>• 在GitHub提交Issue</li>
              <li>• 通过官方披露系统报告数据问题</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}
