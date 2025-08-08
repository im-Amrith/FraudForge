"use client"

import { useState, useEffect } from "react"

interface ChartData {
  name: string
  transactions: number
  fraudAlerts: number
}

export function Overview() {
  const [data, setData] = useState<ChartData[]>([
    { name: "Jan", transactions: 120, fraudAlerts: 5 },
    { name: "Feb", transactions: 140, fraudAlerts: 8 },
    { name: "Mar", transactions: 170, fraudAlerts: 10 },
    { name: "Apr", transactions: 190, fraudAlerts: 7 },
    { name: "May", transactions: 210, fraudAlerts: 12 },
    { name: "Jun", transactions: 220, fraudAlerts: 9 },
    { name: "Jul", transactions: 240, fraudAlerts: 11 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        return prevData.map(item => ({
          ...item,
          transactions: Math.max(0, item.transactions + Math.floor(Math.random() * 10) - 5),
          fraudAlerts: Math.max(0, item.fraudAlerts + Math.floor(Math.random() * 3) - 1)
        }))
      })
    }, 8000) // Update every 8 seconds

    return () => clearInterval(interval)
  }, [])

  const maxValue = Math.max(...data.map(d => Math.max(d.transactions, d.fraudAlerts)))
  const chartHeight = 300
  const chartWidth = 700
  const margin = { top: 20, right: 30, left: 40, bottom: 40 }
  const barWidth = (chartWidth - margin.left - margin.right) / data.length - 10

  return (
    <div className="w-full h-[350px] flex items-center justify-center overflow-hidden">
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="max-w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Bars */}
        {data.map((item, index) => {
          const x = margin.left + index * ((chartWidth - margin.left - margin.right) / data.length)
          const transactionsHeight = (item.transactions / maxValue) * (chartHeight - margin.top - margin.bottom)
          const fraudAlertsHeight = (item.fraudAlerts / maxValue) * (chartHeight - margin.top - margin.bottom)
          
          return (
            <g key={index}>
              {/* Transactions bar */}
              <rect
                x={x + 5}
                y={chartHeight - margin.bottom - transactionsHeight}
                width={barWidth}
                height={transactionsHeight}
                fill="hsl(var(--primary))"
                rx="4"
                className="transition-all duration-500"
              />
              {/* Fraud Alerts bar */}
              <rect
                x={x + 5}
                y={chartHeight - margin.bottom - fraudAlertsHeight}
                width={barWidth}
                height={fraudAlertsHeight}
                fill="hsl(var(--destructive))"
                rx="4"
                className="transition-all duration-500"
              />
              {/* X-axis labels */}
              <text
                x={x + barWidth / 2 + 5}
                y={chartHeight - margin.bottom + 20}
                textAnchor="middle"
                fontSize="12"
                fill="currentColor"
                className="text-muted-foreground"
              >
                {item.name}
              </text>
            </g>
          )
        })}
        
        {/* Y-axis labels */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = chartHeight - margin.bottom - (tick / 100) * (chartHeight - margin.top - margin.bottom)
          return (
            <g key={tick}>
              <line
                x1={margin.left - 5}
                y1={y}
                x2={margin.left}
                y2={y}
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.2"
              />
              <text
                x={margin.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="currentColor"
                className="text-muted-foreground"
              >
                {Math.round((tick / 100) * maxValue)}
              </text>
            </g>
          )
        })}
        
        {/* Legend */}
        <g transform={`translate(${margin.left}, 10)`}>
          <rect x="0" y="0" width="12" height="12" fill="hsl(var(--primary))" rx="2" />
          <text x="20" y="10" fontSize="12" fill="currentColor">Transactions</text>
          <rect x="0" y="20" width="12" height="12" fill="hsl(var(--destructive))" rx="2" />
          <text x="20" y="30" fontSize="12" fill="currentColor">Fraud Alerts</text>
        </g>
      </svg>
    </div>
  )
}

