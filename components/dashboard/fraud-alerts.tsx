"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface FraudAlert {
  id: string
  transactionId: string
  amount: number
  customerName: string
  reason: string
  riskScore: number
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export function FraudAlerts() {
  const [alerts, setAlerts] = useState<FraudAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('/api/recent-fraud')
        const data = await response.json()
        setAlerts(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching fraud alerts:', error)
        setLoading(false)
      }
    }

    fetchAlerts()

    // Update alerts every 15 seconds
    const interval = setInterval(() => {
      fetchAlerts()
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const handleAction = async (alertId: string, action: 'approve' | 'reject') => {
    // Simulate API call
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: action === 'approve' ? 'approved' : 'rejected' }
        : alert
    ))
  }

  const getRiskColor = (riskScore: number) => {
    if (riskScore > 0.8) return "text-red-500"
    if (riskScore > 0.5) return "text-yellow-500"
    return "text-green-500"
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
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
      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No fraud alerts at the moment</p>
          <p className="text-sm text-muted-foreground">All transactions are being processed normally</p>
        </div>
      ) : (
        alerts.slice(0, 5).map((alert) => (
          <div key={alert.id} className="flex items-center space-x-4 p-4 border rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${alert.customerName}`} />
              <AvatarFallback>
                {alert.customerName.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium leading-none">
                  {alert.customerName}
                </p>
                <Badge variant={alert.status === 'pending' ? 'secondary' : alert.status === 'approved' ? 'default' : 'destructive'}>
                  {alert.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {alert.transactionId.slice(0, 8)}... • ${alert.amount.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {alert.reason}
              </p>
              <p className={`text-xs font-medium ${getRiskColor(alert.riskScore)}`}>
                Risk Score: {alert.riskScore.toFixed(2)}
              </p>
            </div>
            {alert.status === 'pending' && (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => handleAction(alert.id, 'approve')}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => handleAction(alert.id, 'reject')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

