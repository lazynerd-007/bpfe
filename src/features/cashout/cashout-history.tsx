"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for demonstration
const mockCashoutHistory = [
  {
    id: "1",
    batchName: "Batch_2024-01-15",
    processor: "MTN",
    recipientCount: 150,
    totalAmount: 15000.00,
    status: "COMPLETED",
    createdAt: "2024-01-15T10:30:00Z",
    completedAt: "2024-01-15T10:45:00Z",
  },
  {
    id: "2", 
    batchName: "Batch_2024-01-14",
    processor: "VODAFONE",
    recipientCount: 75,
    totalAmount: 7500.00,
    status: "FAILED",
    createdAt: "2024-01-14T14:20:00Z",
    completedAt: null,
  },
  {
    id: "3",
    batchName: "Batch_2024-01-13",
    processor: "AIRTEL",
    recipientCount: 200,
    totalAmount: 20000.00,
    status: "PROCESSING",
    createdAt: "2024-01-13T09:15:00Z",
    completedAt: null,
  },
];

export function CashoutHistory() {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "default";
      case "PROCESSING":
        return "outline";
      case "FAILED":
        return "destructive";
      case "PENDING":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getProcessorBadgeColor = (processor: string) => {
    const colors = {
      MTN: "bg-yellow-100 text-yellow-800",
      VODAFONE: "bg-red-100 text-red-800",
      AIRTEL: "bg-red-100 text-red-800",
      TIGO: "bg-blue-100 text-blue-800",
      ORANGE: "bg-orange-100 text-orange-800"
    };
    return colors[processor as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch Name</TableHead>
              <TableHead>Processor</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Completed At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCashoutHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No cashout history found
                </TableCell>
              </TableRow>
            ) : (
              mockCashoutHistory.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.batchName}</TableCell>
                  <TableCell>
                    <Badge className={getProcessorBadgeColor(batch.processor)}>
                      {batch.processor}
                    </Badge>
                  </TableCell>
                  <TableCell>{batch.recipientCount.toLocaleString()}</TableCell>
                  <TableCell>{formatCurrency(batch.totalAmount)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(batch.status)}>
                      {batch.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDateTime(batch.createdAt)}</TableCell>
                  <TableCell>
                    {batch.completedAt ? formatDateTime(batch.completedAt) : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {mockCashoutHistory.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {mockCashoutHistory.length} batch(es)
        </div>
      )}
    </div>
  );
}