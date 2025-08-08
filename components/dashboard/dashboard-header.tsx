"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search, Settings, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface Notification {
  id: string
  message: string
  type: "info" | "warning" | "error" | "success"
  timestamp: Date
}

export function DashboardHeader() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    // Simulate new notifications
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        message: getRandomNotification(),
        type: getRandomNotificationType(),
        timestamp: new Date()
      }
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 4)])
      setNotificationCount(prev => prev + 1)
    }, 12000) // New notification every 12 seconds

    return () => clearInterval(interval)
  }, [])

  const getRandomNotification = () => {
    const notifications = [
      "New transaction detected",
      "Fraud alert triggered",
      "Risk score updated",
      "Compliance check completed",
      "System scan finished",
      "New user registered",
      "Transaction approved",
      "Alert resolved"
    ]
    return notifications[Math.floor(Math.random() * notifications.length)]
  }

  const getRandomNotificationType = (): "info" | "warning" | "error" | "success" => {
    const types = ["info", "warning", "error", "success"] as const
    return types[Math.floor(Math.random() * types.length)]
  }

  const clearNotifications = () => {
    setNotifications([])
    setNotificationCount(0)
  }

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <span className="font-bold text-xl hidden md:inline-block">FraudForge AI</span>
      </div>
      <div className="flex flex-1 items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search transactions..."
            className="pl-8"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              {notificationCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearNotifications}>
                  Clear all
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <DropdownMenuItem disabled>
                No new notifications
              </DropdownMenuItem>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start">
                  <div className="flex items-center gap-2">
                    <Badge variant={notification.type === "error" ? "destructive" : notification.type === "warning" ? "secondary" : "default"}>
                      {notification.type}
                    </Badge>
                    <span className="text-sm">{notification.message}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {notification.timestamp.toLocaleTimeString()}
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
