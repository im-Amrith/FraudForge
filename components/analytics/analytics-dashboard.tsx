"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

interface TimeSeriesData {
  date: string
  fraudRate: number
  avgAmount: number
  totalTransactions: number
}

interface FraudTypeData {
  name: string
  value: number
}

export function AnalyticsDashboard() {
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([])
  const [fraudTypeData, setFraudTypeData] = useState<FraudTypeData[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timeSeriesResponse = await fetch('/api/analytics/timeseries')
        const fraudTypeResponse = await fetch('/api/analytics/fraudtypes')

        if (!timeSeriesResponse.ok || !fraudTypeResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const timeSeriesData = await timeSeriesResponse.json()
        const fraudTypeData = await fraudTypeResponse.json()

        setTimeSeriesData(timeSeriesData)
        setFraudTypeData(fraudTypeData)
        setLastUpdated(new Date())
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 12000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  const latestFraudRate = timeSeriesData[timeSeriesData.length - 1]?.fraudRate || 0
  const latestTransactionCount = timeSeriesData[timeSeriesData.length - 1]?.totalTransactions || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span>Live • Last updated {lastUpdated.toLocaleTimeString()}</span>
      </div>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Fraud Rate</CardTitle>
                <CardDescription>Monthly fraud detection rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(latestFraudRate * 100).toFixed(2)}%</div>
                <div className="h-[200px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="fraudRate" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Transaction Volume</CardTitle>
                <CardDescription>Monthly transaction count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{latestTransactionCount}</div>
                <div className="h-[200px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="totalTransactions" stroke="#00C49F" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Fraud Types</CardTitle>
                <CardDescription>Distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={fraudTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                        {fraudTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Average Transaction Amount</CardTitle>
              <CardDescription>Monthly average transaction value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="avgAmount" stroke="#FFBB28" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Trends</CardTitle>
              <CardDescription>Historical fraud detection trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="fraudRate" stroke="#8884d8" name="Fraud Rate (%)" />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="totalTransactions"
                        stroke="#82ca9d"
                        name="Total Transactions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="patterns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Patterns</CardTitle>
              <CardDescription>Detected fraud patterns and anomalies</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                The system has identified the following patterns in recent fraud attempts:
              </p>
              <ul className="space-y-4">
                <li className="p-4 border rounded-md">
                  <h3 className="font-medium">Time-based Pattern</h3>
                  <p className="text-sm text-muted-foreground">
                    Increased fraud attempts detected between 2AM and 4AM local time, suggesting automated attacks
                    during low-monitoring hours.
                  </p>
                </li>
                <li className="p-4 border rounded-md">
                  <h3 className="font-medium">Location Anomalies</h3>
                  <p className="text-sm text-muted-foreground">
                    Multiple transactions from different geographic locations for the same account within short time
                    periods.
                  </p>
                </li>
                <li className="p-4 border rounded-md">
                  <h3 className="font-medium">Amount Clustering</h3>
                  <p className="text-sm text-muted-foreground">
                    Fraudulent transactions tend to cluster around specific amount ranges, particularly $500-$1000.
                  </p>
                </li>
                <li className="p-4 border rounded-md">
                  <h3 className="font-medium">Device Switching</h3>
                  <p className="text-sm text-muted-foreground">
                    Rapid switching between different devices and browsers for the same account.
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
              <CardDescription>Generated analytics reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">Monthly Fraud Summary</h3>
                    <p className="text-sm text-muted-foreground">March 2025</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">Quarterly Risk Assessment</h3>
                    <p className="text-sm text-muted-foreground">Q1 2025</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">Fraud Pattern Analysis</h3>
                    <p className="text-sm text-muted-foreground">February 2025</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">Geographic Risk Report</h3>
                    <p className="text-sm text-muted-foreground">March 2025</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
