"use client"

import React from 'react'

interface ChartProps {
  children: React.ReactNode
  data?: any[]
  width?: number | string
  height?: number | string
}

interface BarProps {
  dataKey: string
  name?: string
  fill?: string
  radius?: number[]
}

interface AxisProps {
  dataKey?: string
  type?: 'number' | 'category'
}

export const ResponsiveContainer: React.FC<ChartProps> = ({ children, width = "100%", height = 350 }) => {
  return (
    <div style={{ width, height }}>
      {children}
    </div>
  )
}

export const BarChart: React.FC<ChartProps> = ({ children, data = [], width = 800, height = 400 }) => {
  return (
    <svg width={width} height={height} style={{ maxWidth: '100%', height: 'auto' }}>
      <defs>
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" strokeDasharray="3 3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { data, width, height })
        }
        return child
      })}
    </svg>
  )
}

export const Bar: React.FC<BarProps & { data?: any[], width?: number, height?: number }> = ({ 
  dataKey, 
  name, 
  fill = "#8884d8", 
  radius = [0, 0, 0, 0],
  data = [],
  width = 800,
  height = 400
}) => {
  if (!data || data.length === 0) return null

  const margin = { top: 40, right: 40, left: 40, bottom: 40 }
  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom

  // Calculate scales
  const maxValue = Math.max(...data.map(d => Math.max(d.transactions || 0, d.fraudAlerts || 0)))
  const xScale = chartWidth / data.length
  const yScale = chartHeight / (maxValue || 1)

  return (
    <g transform={`translate(${margin.left},${margin.top})`}>
      {data.map((item, index) => {
        const x = index * xScale
        const transactionsHeight = (item.transactions || 0) * yScale
        const fraudAlertsHeight = (item.fraudAlerts || 0) * yScale
        
        return (
          <g key={index}>
            {/* Transactions bar */}
            <rect
              x={x + 5}
              y={chartHeight - transactionsHeight}
              width={xScale - 10}
              height={transactionsHeight}
              fill="hsl(var(--primary))"
              rx={radius[0]}
              ry={radius[1]}
            />
            {/* Fraud Alerts bar */}
            <rect
              x={x + 5}
              y={chartHeight - fraudAlertsHeight}
              width={xScale - 10}
              height={fraudAlertsHeight}
              fill="hsl(var(--destructive))"
              rx={radius[0]}
              ry={radius[1]}
            />
          </g>
        )
      })}
    </g>
  )
}

export const CartesianGrid: React.FC<{ strokeDasharray?: string }> = () => {
  return null // Grid is handled in BarChart
}

export const XAxis: React.FC<AxisProps & { dataKey?: string, data?: any[] }> = ({ dataKey, data = [] }) => {
  if (!data || data.length === 0) return null

  const margin = { top: 40, right: 40, left: 40, bottom: 40 }
  const chartWidth = 800 - margin.left - margin.right
  const xScale = chartWidth / data.length

  return (
    <g transform={`translate(${margin.left},${400 - margin.bottom})`}>
      {data.map((item, index) => {
        const x = index * xScale
        return (
          <text
            key={index}
            x={x + xScale / 2}
            y={20}
            textAnchor="middle"
            fontSize="12"
            fill="currentColor"
          >
            {item.name || item[dataKey || '']}
          </text>
        )
      })}
    </g>
  )
}

export const YAxis: React.FC<AxisProps> = () => {
  const margin = { top: 40, right: 40, left: 40, bottom: 40 }
  const chartHeight = 400 - margin.top - margin.bottom
  
  return (
    <g transform={`translate(${margin.left},${margin.top})`}>
      {[0, 25, 50, 75, 100].map((tick, index) => {
        const y = chartHeight - (tick / 100) * chartHeight
        return (
          <g key={index}>
            <line
              x1={-5}
              y1={y}
              x2={0}
              y2={y}
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.2"
            />
            <text
              x={-10}
              y={y + 4}
              textAnchor="end"
              fontSize="12"
              fill="currentColor"
            >
              {tick}
            </text>
          </g>
        )
      })}
    </g>
  )
}

export const Tooltip: React.FC = () => {
  return null
}

export const Legend: React.FC = () => {
  return (
    <g transform="translate(20, 10)">
      <rect x="0" y="0" width="12" height="12" fill="hsl(var(--primary))" />
      <text x="20" y="10" fontSize="12" fill="currentColor">Transactions</text>
      <rect x="0" y="20" width="12" height="12" fill="hsl(var(--destructive))" />
      <text x="20" y="30" fontSize="12" fill="currentColor">Fraud Alerts</text>
    </g>
  )
}

