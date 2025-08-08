"use client"

import { useState, useEffect } from "react"
import {
  type ColumnDef,
  type Row,
  type HeaderGroup,
  type Cell,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { MoreHorizontal, AlertTriangle, Clock, CheckCircle2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

type AlertStatus = "new" | "investigating" | "resolved" | "false-positive"
type AlertSeverity = "high" | "medium" | "low"

interface Alert {
  id: string
  amount: number
  reason: string
  category: string
  transactionId: string
  severity: AlertSeverity
  status: AlertStatus
  createdAt: string
}

const columns: ColumnDef<Alert>[] = [
  {
    accessorKey: "id",
    header: "Alert ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "reason",
    header: "Type",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("reason") || "No reason provided"}
      </div>
    )
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate" title={row.getValue("category")}>
        {row.getValue("category")}
      </div>
    ),
  },
  {
    accessorKey: "transactionId",
    header: "Transaction ID",
  },
  {
    accessorKey: "severity",
    header: "Severity",
    cell: ({ row }) => {
      const severity = row.getValue("severity") as AlertSeverity
      const variantMap: Record<AlertSeverity, "destructive" | "secondary" | "outline"> = {
        high: "destructive",
        medium: "secondary",
        low: "outline",
      }
      return <Badge variant={variantMap[severity]}>{severity}</Badge>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as AlertStatus
      const statusIcons = {
        "new": <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />,
        "investigating": <Clock className="mr-2 h-4 w-4 text-amber-500" />,
        "resolved": <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />,
        "false-positive": <XCircle className="mr-2 h-4 w-4 text-muted-foreground" />,
      }
      const statusText = status
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      return (
        <div className="flex items-center">
          {statusIcons[status]}
          <span>{statusText}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Time",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      const now = new Date()
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      
      let timeDisplay = ""
      if (diffInMinutes < 1) {
        timeDisplay = "Just now"
      } else if (diffInMinutes < 60) {
        timeDisplay = `${diffInMinutes}m ago`
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60)
        timeDisplay = `${hours}h ago`
      } else {
        const days = Math.floor(diffInMinutes / 1440)
        timeDisplay = `${days}d ago`
      }

      return (
        <div className="text-sm text-muted-foreground">
          {timeDisplay}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const alert = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(alert.id)}>
              Copy alert ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Mark as investigating</DropdownMenuItem>
            <DropdownMenuItem>Mark as resolved</DropdownMenuItem>
            <DropdownMenuItem>Mark as false positive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function AlertsTable() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("/api/alerts");
        if (!response.ok) throw new Error("Failed to fetch alerts");
        const data = await response.json();
        setAlerts(data);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch alerts");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    // Update alerts every 15 seconds
    const interval = setInterval(() => {
      fetchAlerts();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  })

  const table = useReactTable({
    data: alerts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  })

  if (loading) {
    return (
      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<Alert>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(7)].map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<Alert>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-red-500">
                  Error loading alerts: {error}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<Alert>) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: Row<Alert>) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell: Cell<Alert, unknown>) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No alerts found.</p>
                    <p className="text-sm text-muted-foreground">Alerts will appear here when suspicious activity is detected.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Showing {table.getFilteredRowModel().rows.length} of {alerts.length} alerts
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live • Last updated {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  )
}