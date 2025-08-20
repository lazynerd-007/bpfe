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
import { PartnerBank } from "@/sdk/types";
import { IconDots, IconTrash, IconEdit, IconEye } from "@tabler/icons-react";

interface PartnerBankTableRowProps {
  partnerBank: PartnerBank;
  onEdit?: (partnerBank: PartnerBank) => void;
  onView?: (partnerBank: PartnerBank) => void;
  onDelete?: (partnerBank: PartnerBank) => void;
  onSelect?: (partnerBank: PartnerBank) => void;
  isSelected?: boolean;
}

export function PartnerBankTableRow({ 
  partnerBank, 
  onEdit, 
  onView, 
  onDelete, 
  onSelect,
  isSelected 
}: PartnerBankTableRowProps) {
  return (
    <>
      <div className="font-medium">{partnerBank.name}</div>
      <div>{partnerBank.slug || '-'}</div>
      <div>
        {partnerBank.commissionRatio ? `${(partnerBank.commissionRatio * 100).toFixed(1)}%` : '-'}
      </div>
      <div>
        <Badge variant="outline">
          {partnerBank.devices?.length || 0} devices
        </Badge>
      </div>
      <div>
        <Badge variant="outline">
          {partnerBank.merchants?.length || 0} merchants
        </Badge>
      </div>
      <div>{new Date(partnerBank.createdAt).toLocaleDateString()}</div>
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
                onSelect?.(partnerBank);
                onView?.(partnerBank);
              }}
            >
              <IconEye className="h-4 w-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                onSelect?.(partnerBank);
                onEdit?.(partnerBank);
              }}
            >
              <IconEdit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(partnerBank)}
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
interface PartnerBankTableActionsProps {
  partnerBank: PartnerBank;
  onEdit?: (partnerBank: PartnerBank) => void;
  onView?: (partnerBank: PartnerBank) => void;
  onDelete?: (partnerBank: PartnerBank) => void;
  onSelect?: (partnerBank: PartnerBank) => void;
}

export function PartnerBankTableActions({ 
  partnerBank, 
  onEdit, 
  onView, 
  onDelete, 
  onSelect 
}: PartnerBankTableActionsProps) {
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
            onSelect?.(partnerBank);
            onView?.(partnerBank);
          }}
        >
          <IconEye className="h-4 w-4 mr-2" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onSelect?.(partnerBank);
            onEdit?.(partnerBank);
          }}
        >
          <IconEdit className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete?.(partnerBank)}
          className="text-red-600"
        >
          <IconTrash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}