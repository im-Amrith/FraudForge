"use client"
import type React from "react"
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard/overview"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { FraudAlerts } from "@/components/dashboard/fraud-alerts"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Download, LoaderCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface DashboardPage {
  totalTransactions: number
  fraudAlerts: number
  avgRisk: number
  complianceScore: number
  transactionPercentage: number
  chartData: Array<{ date: string; count: number }>
}

export default function DashboardPage() {
  const router = useRouter()

  const [data, setData] = useState<DashboardPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [liveData, setLiveData] = useState({
    totalTransactions: 0,
    fraudAlerts: 0,
    avgRisk: 0,
    complianceScore: 0,
    lastUpdate: new Date()
  })

  // Fetch initial data
  useEffect(() => {
    fetch('/api/overview')
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLiveData({
          totalTransactions: data.totalTransactions || 0,
          fraudAlerts: data.fraudAlerts || 0,
          avgRisk: data.avgRisk || 0,
          complianceScore: data.complianceScore || 0,
          lastUpdate: new Date()
        })
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
        setLoading(false)
      })
  }, [])

  // Real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => {
        // Simulate new transactions
        const newTransactions = Math.floor(Math.random() * 3) + 1
        const newTotalTransactions = prev.totalTransactions + newTransactions
        
        // Simulate fraud alerts (random chance)
        const newFraudAlerts = Math.random() < 0.1 ? prev.fraudAlerts + 1 : prev.fraudAlerts
        
        // Simulate risk score fluctuations
        const riskChange = (Math.random() - 0.5) * 0.02
        const newAvgRisk = Math.max(0, Math.min(1, prev.avgRisk + riskChange))
        
        // Simulate compliance score changes
        const complianceChange = (Math.random() - 0.5) * 0.01
        const newComplianceScore = Math.max(0, Math.min(1, prev.complianceScore + complianceChange))
        
        return {
          totalTransactions: newTotalTransactions,
          fraudAlerts: newFraudAlerts,
          avgRisk: newAvgRisk,
          complianceScore: newComplianceScore,
          lastUpdate: new Date()
        }
      })
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="animate-spin h-28 w-28 text-purple-600" />
      </div>
    )
  }

  const handleTabChange = (value: string) => {
    if (value === "analytics") {
      router.push("/dashboard/analytics")
    } else if (value === "reports") {
      router.push("/dashboard/policies")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your fraud detection metrics.
          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            Live • Last updated: {liveData.lastUpdate.toLocaleTimeString()}
          </span>
        </p>
      </div>
      <Tabs defaultValue="overview" className="space-y-6" onValueChange={handleTabChange}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-green-400 to-green-600 animate-pulse"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold transition-all duration-500 ease-in-out">
                  {liveData.totalTransactions.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {data?.transactionPercentage !== undefined && data?.transactionPercentage < 0 ? "-" : "+"}
                  {((data?.transactionPercentage ?? 12.5) * 1).toFixed(2)}% from last month
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-red-400 to-red-600 animate-pulse"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fraud Alerts</CardTitle>
                <AlertIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold transition-all duration-500 ease-in-out">
                  {liveData.fraudAlerts}
                </div>
                <p className="text-xs text-muted-foreground">-4% from last month</p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-blue-400 to-blue-600 animate-pulse"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Risk Score</CardTitle>
                <ShieldIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold transition-all duration-500 ease-in-out">
                  {liveData.avgRisk.toFixed(3)}
                </div>
                <p className="text-xs text-muted-foreground">Lower is better</p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-purple-400 to-purple-600 animate-pulse"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                <CheckIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold transition-all duration-500 ease-in-out">
                  {(liveData.complianceScore * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">+2% from last month</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Transaction Overview</CardTitle>
                <CardDescription>Transaction volume and fraud detection over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3 overflow-y-scroll h-[550px]">
              <CardHeader>
                <CardTitle>Recent Fraud Alerts</CardTitle>
                <CardDescription>Recent transactions flagged as potentially fraudulent</CardDescription>
              </CardHeader>
              <CardContent>
                <FraudAlerts />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Recent transactions processed by your organization</CardDescription>
              </div>
              <Link href="/dashboard/transactions">
                <Button variant="outline" size="sm" className="gap-1">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <RecentTransactions />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ... (keep all your icon components exactly as they are)

function CreditCardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}

function AlertIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" x2="12" y1="9" y2="13" />
      <line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
  )
}

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

