"use client";

import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
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
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { IconDots, IconTrash, IconEdit, IconEye } from "@tabler/icons-react";
import { User } from "@/sdk/types";
import { getRoleIcon, getRoleLabel, getRoleBadgeVariant } from "@/lib/user-roles";

interface UserTableRowProps {
  user: User;
  onEdit?: (user: User) => void;
  onView?: (user: User) => void;
  onDelete?: (user: User) => void;
  onSelect?: (user: User) => void;
  isSelected?: boolean;
}

export function UserTableRow({ 
  user, 
  onEdit, 
  onView, 
  onDelete, 
  onSelect,
  isSelected 
}: UserTableRowProps) {

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "INACTIVE":
        return "secondary";
      case "SUSPENDED":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <TableRow data-state={isSelected && "selected"}>
      <TableCell className="font-medium">
        {user.firstName} {user.lastName}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Badge variant={getRoleBadgeVariant(user.role)} className={'gap-1 text-xs'}>
            {(() => {
              const RoleIcon = getRoleIcon(user.role);
              return <RoleIcon size={16} className="size-3" />;
            })()}
            {getRoleLabel(user.role)}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge status={user.status} type="user" />
      </TableCell>
      <TableCell>{user.phoneNumber || "-"}</TableCell>
      <TableCell>
        {new Date(user.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell>
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
                onSelect?.(user);
                onView?.(user);
              }}
            >
              <IconEye className="h-4 w-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                onSelect?.(user);
                onEdit?.(user);
              }}
            >
              <IconEdit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(user)}
              className="text-red-600"
            >
              <IconTrash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

// Also create a separate actions component for use in column definitions
interface UserTableActionsProps {
  user: User;
  onEdit?: (user: User) => void;
  onView?: (user: User) => void;
  onDelete?: (user: User) => void;
  onSelect?: (user: User) => void;
}

export function UserTableActions({ 
  user, 
  onEdit, 
  onView, 
  onDelete, 
  onSelect 
}: UserTableActionsProps) {
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
            onSelect?.(user);
            onView?.(user);
          }}
        >
          <IconEye className="h-4 w-4 mr-2" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onSelect?.(user);
            onEdit?.(user);
          }}
        >
          <IconEdit className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete?.(user)}
          className="text-red-600"
        >
          <IconTrash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}