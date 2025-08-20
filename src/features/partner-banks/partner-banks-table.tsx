"use client";

import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { PartnerBank } from "@/sdk/types";
import { StandardizedDataTable, createHeaderWithIcon } from "@/components/ui/standardized-data-table";
import { PartnerBankTableActions } from "./components/partner-bank-table-row";
import { usePartnerBanks, useSelectedPartnerBank } from "./hooks";
import { useToast } from "@/hooks/use-toast";
import { 
  IconBuildingBank, 
  IconTag, 
  IconPercentage, 
  IconDevices, 
  IconUsers, 
  IconCalendar,
  IconSettings
} from "@tabler/icons-react";

interface PartnerBanksTableProps {
  onEdit?: (partnerBank: PartnerBank) => void;
  onView?: (partnerBank: PartnerBank) => void;
  showCreateDialog: boolean;
  setShowCreateDialog: (show: boolean) => void;
}

export function PartnerBanksTable({ onEdit, onView, setShowCreateDialog, showCreateDialog }: PartnerBanksTableProps) {
  const { partnerBanks, loading, deletePartnerBank } = usePartnerBanks();
  const { selectPartnerBank } = useSelectedPartnerBank();
  const { toast } = useToast();

  const handleDelete = async (partnerBank: PartnerBank) => {
    if (window.confirm(`Are you sure you want to delete partner bank ${partnerBank.name}?`)) {
      try {
        await deletePartnerBank(partnerBank.uuid);
        toast({
          title: "Success",
          description: "Partner bank deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete partner bank",
          variant: "destructive",
        });
      }
    }
  };

  const handleView = (partnerBank: PartnerBank) => {
    selectPartnerBank(partnerBank);
    onView?.(partnerBank);
  };

  const handleEdit = (partnerBank: PartnerBank) => {
    selectPartnerBank(partnerBank);
    onEdit?.(partnerBank);
  };

  const columns: ColumnDef<PartnerBank>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: () => createHeaderWithIcon(
          <IconBuildingBank className="h-4 w-4" />,
          "Name"
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "slug",
        header: () => createHeaderWithIcon(
          <IconTag className="h-4 w-4" />,
          "Slug"
        ),
        cell: ({ row }) => (
          <div>{row.getValue("slug") || "-"}</div>
        ),
      },
      {
        accessorKey: "commissionRatio",
        header: () => createHeaderWithIcon(
          <IconPercentage className="h-4 w-4" />,
          "Commission Rate"
        ),
        cell: ({ row }) => {
          const ratio = row.getValue("commissionRatio") as number;
          return (
            <div>
              {ratio ? `${(ratio * 100).toFixed(1)}%` : "-"}
            </div>
          );
        },
      },
      {
        accessorKey: "devices",
        header: () => createHeaderWithIcon(
          <IconDevices className="h-4 w-4" />,
          "Devices"
        ),
        cell: ({ row }) => {
          const devices = row.getValue("devices") as any[];
          return (
            <Badge variant="outline">
              {devices?.length || 0} devices
            </Badge>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "merchants",
        header: () => createHeaderWithIcon(
          <IconUsers className="h-4 w-4" />,
          "Merchants"
        ),
        cell: ({ row }) => {
          const merchants = row.getValue("merchants") as any[];
          return (
            <Badge variant="outline">
              {merchants?.length || 0} merchants
            </Badge>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "createdAt",
        header: () => createHeaderWithIcon(
          <IconCalendar className="h-4 w-4" />,
          "Created"
        ),
        cell: ({ row }) => (
          <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
        ),
      },
      {
        id: "actions",
        header: () => createHeaderWithIcon(
          <IconSettings className="h-4 w-4" />,
          "Actions"
        ),
        cell: ({ row }) => (
          <PartnerBankTableActions
            partnerBank={row.original}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [handleView, handleEdit, handleDelete]
  );

  return (
    <StandardizedDataTable
      columns={columns}
      data={partnerBanks}
      loading={loading}
      searchable={true}
      searchPlaceholder="Search partner banks..."
      searchKey="name"
      emptyMessage="No partner banks found"
      loadingMessage="Loading partner banks..."
    />
  );
}