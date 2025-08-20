"use client";

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
import { Commission } from "@/sdk/types";
import { IconDots, IconTrash, IconEdit, IconEye } from "@tabler/icons-react";

interface CommissionTableRowProps {
  commission: Commission;
  onEdit?: (commission: Commission) => void;
  onView?: (commission: Commission) => void;
  onDelete?: (commission: Commission) => void;
  onSelect?: (commission: Commission) => void;
  isSelected?: boolean;
}

export function CommissionTableRow({ 
  commission, 
  onEdit, 
  onView, 
  onDelete, 
  onSelect,
  isSelected 
}: CommissionTableRowProps) {
  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "PERCENTAGE":
        return "default";
      case "FIXED":
        return "secondary";
      case "TIERED":
        return "outline";
      default:
        return "outline";
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

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  return (
    <>
      <div>
        <Badge variant={getTypeBadgeVariant(commission.type)}>
          {commission.type}
        </Badge>
      </div>
      <div className="font-medium">
        {commission.type === 'PERCENTAGE'
          ? `${commission.rate}%`
          : formatCurrency(commission.amount || 0)
        }
      </div>
      <div>
        <Badge variant={getStatusBadgeVariant(commission.status)}>
          {commission.status}
        </Badge>
      </div>
      <div>{commission.merchantId || "-"}</div>
      <div>{commission.partnerBankId || "-"}</div>
      <div>{new Date(commission.createdAt).toLocaleDateString()}</div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <IconDots className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                onSelect?.(commission);
                onView?.(commission);
              }}
            >
              <IconEye className="h-4 w-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                onSelect?.(commission);
                onEdit?.(commission);
              }}
            >
              <IconEdit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(commission)}
              className="text-red-600"
            >
              <IconTrash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

// Actions component for use in column definitions
interface CommissionTableActionsProps {
  commission: Commission;
  onEdit?: (commission: Commission) => void;
  onView?: (commission: Commission) => void;
  onDelete?: (commission: Commission) => void;
  onSelect?: (commission: Commission) => void;
}

export function CommissionTableActions({ 
  commission, 
  onEdit, 
  onView, 
  onDelete, 
  onSelect 
}: CommissionTableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <IconDots className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            onSelect?.(commission);
            onView?.(commission);
          }}
        >
          <IconEye className="h-4 w-4 mr-2" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onSelect?.(commission);
            onEdit?.(commission);
          }}
        >
          <IconEdit className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete?.(commission)}
          className="text-red-600"
        >
          <IconTrash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}