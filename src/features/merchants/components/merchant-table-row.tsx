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
import { Merchant } from "@/sdk/types";
import { IconDots, IconTrash, IconEdit, IconEye, IconUsers, IconKey } from "@tabler/icons-react";

interface MerchantTableRowProps {
  merchant: Merchant;
  onEdit?: (merchant: Merchant) => void;
  onView?: (merchant: Merchant) => void;
  onDelete?: (merchant: Merchant) => void;
  onViewSubMerchants?: (merchant: Merchant) => void;
  onManageApiKeys?: (merchant: Merchant) => void;
  onSelect?: (merchant: Merchant) => void;
  isSelected?: boolean;
}

export function MerchantTableRow({ 
  merchant, 
  onEdit, 
  onView, 
  onDelete,
  onViewSubMerchants,
  onManageApiKeys, 
  onSelect,
  isSelected 
}: MerchantTableRowProps) {
  return (
    <>
      <div>
        <div className="font-medium">{merchant.merchantName}</div>
        <div className="text-sm text-muted-foreground">
          {merchant.notificationEmail}
        </div>
      </div>
      <div className="font-mono text-sm">{merchant.merchantCode}</div>
      <div>
        <Badge variant="outline">{merchant.country}</Badge>
      </div>
      <div className="flex flex-wrap gap-1">
        {merchant.canProcessMomoTransactions && (
          <Badge variant="secondary" className="text-xs">
            Mobile Money
          </Badge>
        )}
        {merchant.canProcessCardTransactions && (
          <Badge variant="secondary" className="text-xs">
            Cards
          </Badge>
        )}
      </div>
      <div className="text-sm">{merchant.partnerBankId}</div>
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
                onSelect?.(merchant);
                onView?.(merchant);
              }}
            >
              <IconEye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                onSelect?.(merchant);
                onEdit?.(merchant);
              }}
            >
              <IconEdit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onViewSubMerchants?.(merchant)}
            >
              <IconUsers className="h-4 w-4 mr-2" />
              Sub-Merchants
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onManageApiKeys?.(merchant)}
            >
              <IconKey className="h-4 w-4 mr-2" />
              API Keys
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(merchant)}
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
interface MerchantTableActionsProps {
  merchant: Merchant;
  onEdit?: (merchant: Merchant) => void;
  onView?: (merchant: Merchant) => void;
  onDelete?: (merchant: Merchant) => void;
  onViewSubMerchants?: (merchant: Merchant) => void;
  onManageApiKeys?: (merchant: Merchant) => void;
  onSelect?: (merchant: Merchant) => void;
}

export function MerchantTableActions({ 
  merchant, 
  onEdit, 
  onView, 
  onDelete,
  onViewSubMerchants,
  onManageApiKeys, 
  onSelect 
}: MerchantTableActionsProps) {
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
            onSelect?.(merchant);
            onView?.(merchant);
          }}
        >
          <IconEye className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onSelect?.(merchant);
            onEdit?.(merchant);
          }}
        >
          <IconEdit className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onViewSubMerchants?.(merchant)}
        >
          <IconUsers className="h-4 w-4 mr-2" />
          Sub-Merchants
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onManageApiKeys?.(merchant)}
        >
          <IconKey className="h-4 w-4 mr-2" />
          API Keys
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete?.(merchant)}
          className="text-red-600"
        >
          <IconTrash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}