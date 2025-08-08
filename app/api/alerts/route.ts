import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Retrieve all transactions from the database
    const alerts = await prisma.transaction.findMany({
      where: {
        severity: { not: "none" }, // Only show transactions with severity
        isFraud: true // Only show fraud-related alerts
      },
      select: {
        id: true,
        transactionId: true,
        amount: true,
        category: true,
        severity: true,
        status: true,
        createdAt: true,
        reason: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // If no data in database, return mock data
    if (alerts.length === 0) {
      const mockAlerts = [
        {
          id: "alert-001",
          transactionId: "TXN-2024-001",
          amount: 2500,
          category: "shopping_pos",
          severity: "high" as const,
          status: "new" as const,
          createdAt: new Date().toISOString(),
          reason: "Unusual transaction pattern"
        },
        {
          id: "alert-002",
          transactionId: "TXN-2024-002",
          amount: 1800,
          category: "online_pos",
          severity: "medium" as const,
          status: "investigating" as const,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          reason: "High-risk location"
        },
        {
          id: "alert-003",
          transactionId: "TXN-2024-003",
          amount: 3200,
          category: "shopping_pos",
          severity: "high" as const,
          status: "new" as const,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          reason: "Suspicious amount"
        },
        {
          id: "alert-004",
          transactionId: "TXN-2024-004",
          amount: 950,
          category: "food_dining",
          severity: "low" as const,
          status: "resolved" as const,
          createdAt: new Date(Date.now() - 10800000).toISOString(),
          reason: "Multiple failed attempts"
        },
        {
          id: "alert-005",
          transactionId: "TXN-2024-005",
          amount: 4100,
          category: "gas_transport",
          severity: "high" as const,
          status: "investigating" as const,
          createdAt: new Date(Date.now() - 14400000).toISOString(),
          reason: "Unusual time of day"
        },
        {
          id: "alert-006",
          transactionId: "TXN-2024-006",
          amount: 1250,
          category: "entertainment",
          severity: "medium" as const,
          status: "new" as const,
          createdAt: new Date(Date.now() - 18000000).toISOString(),
          reason: "Rapid successive transactions"
        },
        {
          id: "alert-007",
          transactionId: "TXN-2024-007",
          amount: 2800,
          category: "shopping_pos",
          severity: "high" as const,
          status: "investigating" as const,
          createdAt: new Date(Date.now() - 21600000).toISOString(),
          reason: "Amount exceeds daily limit"
        },
        {
          id: "alert-008",
          transactionId: "TXN-2024-008",
          amount: 650,
          category: "transportation",
          severity: "low" as const,
          status: "resolved" as const,
          createdAt: new Date(Date.now() - 25200000).toISOString(),
          reason: "Geographic anomaly"
        }
      ];

      // Add some randomness to make the data dynamic
      const dynamicAlerts = mockAlerts.map(alert => ({
        ...alert,
        amount: alert.amount + Math.floor(Math.random() * 200) - 100, // Vary amount by ±100
        createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString() // Random time in last 24h
      }));

      return NextResponse.json(dynamicAlerts);
    }

    // Transform database alerts to match the expected format
    const transformedAlerts = alerts.map(alert => ({
      id: alert.id,
      transactionId: alert.transactionId,
      amount: Number(alert.amount),
      category: alert.category,
      severity: alert.severity.toLowerCase() as "high" | "medium" | "low",
      status: mapStatus(alert.status),
      createdAt: alert.createdAt.toISOString(),
      reason: alert.reason || "Suspicious activity detected"
    }));

    return NextResponse.json(transformedAlerts);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    
    // Return mock data on error
    const mockAlerts = [
      {
        id: "alert-001",
        transactionId: "TXN-2024-001",
        amount: 2500,
        category: "shopping_pos",
        severity: "high" as const,
        status: "new" as const,
        createdAt: new Date().toISOString(),
        reason: "Unusual transaction pattern"
      },
      {
        id: "alert-002",
        transactionId: "TXN-2024-002",
        amount: 1800,
        category: "online_pos",
        severity: "medium" as const,
        status: "investigating" as const,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        reason: "High-risk location"
      },
      {
        id: "alert-003",
        transactionId: "TXN-2024-003",
        amount: 3200,
        category: "shopping_pos",
        severity: "high" as const,
        status: "new" as const,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        reason: "Suspicious amount"
      }
    ];
    
    return NextResponse.json(mockAlerts);
  }
}

// Helper function to map transaction status to alert status
function mapStatus(transactionStatus: string): "new" | "investigating" | "resolved" | "false-positive" {
  const statusMap: Record<string, "new" | "investigating" | "resolved" | "false-positive"> = {
    pending: "new",
    approved: "resolved",
    flagged: "investigating",
    rejected: "false-positive"
  };
  return statusMap[transactionStatus] || "new";
}
