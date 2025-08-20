"use client";

import { useState } from "react";
import { MoreHorizontal, Plus, Trash2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSettlements, useSelectedSettlement } from "./hooks";
import { Settlement } from "@/sdk/types";
import { CreateSettlementForm } from "./create-settlement-form";
import { useToast } from "@/hooks/use-toast";

export function SettlementsTable() {
  const { settlements, loading, deleteSettlement } = useSettlements();
  const { selectSettlement } = useSelectedSettlement();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleDelete = async (settlement: Settlement) => {
    if (window.confirm(`Are you sure you want to delete this settlement configuration?`)) {
      try {
        await deleteSettlement(settlement.uuid);
        toast({
          title: "Success",
          description: "Settlement deleted successfully",
        });
      } catch {
        toast({
          title: "Error",
          description: "Failed to delete settlement",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "INACTIVE":
        return "secondary";
      case "PENDING":
        return "outline";
      default:
        return "outline";
    }
  };

  const getFrequencyBadge = (frequency: string) => {
    const colors = {
      DAILY: "bg-green-100 text-green-800",
      WEEKLY: "bg-blue-100 text-blue-800", 
      MONTHLY: "bg-purple-100 text-purple-800"
    };
    return colors[frequency as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Settlement Configurations</h3>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Settlement
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Frequency</TableHead>
              <TableHead>Surcharge On</TableHead>
              <TableHead>Merchant Fee</TableHead>
              <TableHead>Customer Fee</TableHead>
              <TableHead>Parent Bank</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {settlements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  No settlements found
                </TableCell>
              </TableRow>
            ) : (
              settlements.map((settlement) => (
                <TableRow key={settlement.uuid}>
                  <TableCell>
                    <Badge className={getFrequencyBadge(settlement.frequency)}>
                      {settlement.frequency}
                    </Badge>
                  </TableCell>
                  <TableCell>{settlement.surchargeOn}</TableCell>
                  <TableCell>{settlement.surchargeOnMerchant}%</TableCell>
                  <TableCell>{settlement.surchargeOnCustomer}%</TableCell>
                  <TableCell>{settlement.parentBank}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(settlement.status)}>
                      {settlement.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(settlement.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            selectSettlement(settlement);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(settlement)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Settlement Configuration</DialogTitle>
            <DialogDescription>
              Configure settlement frequency, surcharges, and banking details.
            </DialogDescription>
          </DialogHeader>
          <CreateSettlementForm onSuccess={() => setShowCreateDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}