"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Transaction {
  id: string
  transactionId: string
  amount: number
  status: "completed" | "pending" | "flagged" | "processing"
  customerName: string
  riskScore: number
  createdAt: string
}

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/recent-transaction')
        const data = await response.json()
        setTransactions(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching transactions:', error)
        setLoading(false)
      }
    }

    fetchTransactions()

    // Update transactions every 10 seconds
    const interval = setInterval(() => {
      fetchTransactions()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "flagged":
        return "bg-red-100 text-red-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskColor = (riskScore: number) => {
    if (riskScore > 0.7) return "text-red-500"
    if (riskScore > 0.3) return "text-yellow-500"
    return "text-green-500"
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 animate-pulse">
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No recent transactions</p>
          <p className="text-sm text-muted-foreground">Transactions will appear here as they are processed</p>
        </div>
      ) : (
        transactions.slice(0, 5).map((transaction) => (
          <div key={transaction.id} className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${transaction.customerName}`} />
              <AvatarFallback>
                {transaction.customerName.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                {transaction.customerName}
              </p>
              <p className="text-sm text-muted-foreground">
                {transaction.transactionId.slice(0, 8)}... • ${transaction.amount.toLocaleString()}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <Badge className={getStatusColor(transaction.status)}>
                {transaction.status}
              </Badge>
              <p className={`text-xs font-medium ${getRiskColor(transaction.riskScore)}`}>
                • {transaction.riskScore.toFixed(2)}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

