/**
 * 财务数据图表组件（客户端）
 */
'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import type { FinancialReport } from '@/lib/types'

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface FinancialChartProps {
  data: FinancialReport[]
}

export default function FinancialChart({ data }: FinancialChartProps) {
  // 按日期排序
  const sortedData = [...data].sort((a, b) => {
    return a.fiscal_year.localeCompare(b.fiscal_year)
  })
  
  // 准备图表数据
  const labels = sortedData.map(d => `${d.fiscal_year} ${d.period}`)
  
  const chartData = {
    labels,
    datasets: [
      {
        label: '营业收入 (亿日元)',
        data: sortedData.map(d => d.revenue ? d.revenue / 1000 : null),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: '营业利润 (亿日元)',
        data: sortedData.map(d => d.operating_income ? d.operating_income / 1000 : null),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        fill: false,
      },
      {
        label: '净利润 (亿日元)',
        data: sortedData.map(d => d.net_income ? d.net_income / 1000 : null),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.3,
        fill: false,
      },
    ],
  }
  
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              label += `${context.parsed.y.toFixed(1)} 亿日元`
            }
            return label
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return value + ' 亿'
          },
        },
      },
    },
  }
  
  return (
    <div className="w-full" style={{ minHeight: '300px' }}>
      <Line data={chartData} options={options} />
    </div>
  )
}
