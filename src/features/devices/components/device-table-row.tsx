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
import { Device } from "@/sdk/types";
import { IconDots, IconTrash, IconEdit, IconEye } from "@tabler/icons-react";

interface DeviceTableRowProps {
  device: Device;
  onEdit?: (device: Device) => void;
  onView?: (device: Device) => void;
  onDelete?: (device: Device) => void;
  onSelect?: (device: Device) => void;
  isSelected?: boolean;
}

export function DeviceTableRow({ 
  device, 
  onEdit, 
  onView, 
  onDelete, 
  onSelect,
  isSelected 
}: DeviceTableRowProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "INACTIVE":
        return "secondary";
      case "MAINTENANCE":
        return "outline";
      case "ASSIGNED":
        return "default";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "ALLOCATED";
      case "INACTIVE":
        return "SUBMITTED";
      case "MAINTENANCE":
        return "MAINTENANCE";
      case "ASSIGNED":
        return "ALLOCATED";
      default:
        return status;
    }
  };

  return (
    <>
      <div className="font-medium">{device.serialNumber}</div>
      <div>
        <Badge variant={getStatusBadgeVariant(device.status)}>
          {getStatusLabel(device.status)}
        </Badge>
      </div>
      <div>{device.merchantId || "-"}</div>
      <div>
        {new Date(device.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
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
                onSelect?.(device);
                onView?.(device);
              }}
            >
              <IconEye className="h-4 w-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                onSelect?.(device);
                onEdit?.(device);
              }}
            >
              <IconEdit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(device)}
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
interface DeviceTableActionsProps {
  device: Device;
  onEdit?: (device: Device) => void;
  onView?: (device: Device) => void;
  onDelete?: (device: Device) => void;
  onSelect?: (device: Device) => void;
}

export function DeviceTableActions({ 
  device, 
  onEdit, 
  onView, 
  onDelete, 
  onSelect 
}: DeviceTableActionsProps) {
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
            onSelect?.(device);
            onView?.(device);
          }}
        >
          <IconEye className="h-4 w-4 mr-2" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onSelect?.(device);
            onEdit?.(device);
          }}
        >
          <IconEdit className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete?.(device)}
          className="text-red-600"
        >
          <IconTrash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}