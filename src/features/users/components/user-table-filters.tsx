"use client";

import { useRef, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Table } from "@tanstack/react-table";
import { User } from "@/sdk/types";

interface UserTableFiltersProps {
  table: Table<User>;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
}

export function UserTableFilters({ 
  table, 
  globalFilter, 
  onGlobalFilterChange 
}: UserTableFiltersProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = useCallback((value: string) => {
    onGlobalFilterChange(value);
  }, [onGlobalFilterChange]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Input
          ref={searchInputRef}
          placeholder="Search users (name, email, phone)..."
          value={globalFilter ?? ""}
          onChange={(event) => handleSearchChange(event.target.value)}
          className="max-w-sm"
        />
        
        {/* Role Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Role {table.getColumn("role")?.getFilterValue() ? `(${table.getColumn("role")?.getFilterValue()})` : ''} 
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => table.getColumn("role")?.setFilterValue("")}>
              All Roles
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => table.getColumn("role")?.setFilterValue("administrator")}>
              Administrator
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => table.getColumn("role")?.setFilterValue("merchant")}>
              Merchant
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => table.getColumn("role")?.setFilterValue("partner-bank")}>
              Partner Bank
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => table.getColumn("role")?.setFilterValue("submerchant")}>
              Sub Merchant
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Status {table.getColumn("status")?.getFilterValue() ? `(${table.getColumn("status")?.getFilterValue()})` : ''} 
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("")}>
              All Status
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("ACTIVE")}>
              Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("INACTIVE")}>
              Inactive
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("SUSPENDED")}>
              Suspended
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Column Visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}