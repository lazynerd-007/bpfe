"use client";

import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { StandardizedDataTable, createHeaderWithIcon } from "@/components/ui/standardized-data-table";
import { CommissionTableActions } from "./components/commission-table-row";
import { useCommissions, useSelectedCommission } from "./hooks";
import { Commission } from "@/sdk/types";
import { CreateCommissionForm } from "./create-commission-form";
import { useToast } from "@/hooks/use-toast";
import { 
  IconPercentage, 
  IconCurrencyDollar, 
  IconStatusChange, 
  IconBuildingStore, 
  IconBuildingBank,
  IconCalendar,
  IconSettings
} from "@tabler/icons-react";

interface CommissionsTableProps {
    onEdit?: (commission: Commission) => void;
    onView?: (commission: Commission) => void;
    showCreateDialog: boolean;
    setShowCreateDialog: (show: boolean) => void;
}

export function CommissionsTable({onEdit, onView, setShowCreateDialog, showCreateDialog}: CommissionsTableProps) {
    const {commissions, loading, deleteCommission} = useCommissions();
    const {selectCommission} = useSelectedCommission();
    const {toast} = useToast();

    const handleDelete = async (commission: Commission) => {
        if (window.confirm(`Are you sure you want to delete this commission rule?`)) {
            try {
                await deleteCommission(commission.id);
                toast({
                    title: "Success",
                    description: "Commission deleted successfully",
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to delete commission",
                    variant: "destructive",
                });
            }
        }
    };

    const handleView = (commission: Commission) => {
        selectCommission(commission);
        onView?.(commission);
    };

    const handleEdit = (commission: Commission) => {
        selectCommission(commission);
        onEdit?.(commission);
    };

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

    const columns = useMemo<ColumnDef<Commission>[]>(
        () => [
            {
                accessorKey: "type",
                header: () => createHeaderWithIcon(
                    <IconPercentage className="h-4 w-4" />,
                    "Type"
                ),
                cell: ({ row }) => (
                    <Badge variant={getTypeBadgeVariant(row.getValue("type"))}>
                        {row.getValue("type")}
                    </Badge>
                ),
            },
            {
                id: "rateAmount",
                header: () => createHeaderWithIcon(
                    <IconCurrencyDollar className="h-4 w-4" />,
                    "Rate/Amount"
                ),
                cell: ({ row }) => {
                    const commission = row.original;
                    return (
                        <div className="font-medium">
                            {commission.type === 'PERCENTAGE'
                                ? `${commission.rate}%`
                                : formatCurrency(commission.amount || 0)
                            }
                        </div>
                    );
                },
                enableSorting: false,
            },
            {
                accessorKey: "status",
                header: () => createHeaderWithIcon(
                    <IconStatusChange className="h-4 w-4" />,
                    "Status"
                ),
                cell: ({ row }) => (
                    <Badge variant={getStatusBadgeVariant(row.getValue("status"))}>
                        {row.getValue("status")}
                    </Badge>
                ),
            },
            {
                accessorKey: "merchantId",
                header: () => createHeaderWithIcon(
                    <IconBuildingStore className="h-4 w-4" />,
                    "Merchant"
                ),
                cell: ({ row }) => (
                    <div>{row.getValue("merchantId") || "-"}</div>
                ),
            },
            {
                accessorKey: "partnerBankId",
                header: () => createHeaderWithIcon(
                    <IconBuildingBank className="h-4 w-4" />,
                    "Partner Bank"
                ),
                cell: ({ row }) => (
                    <div>{row.getValue("partnerBankId") || "-"}</div>
                ),
            },
            {
                accessorKey: "createdAt",
                header: () => createHeaderWithIcon(
                    <IconCalendar className="h-4 w-4" />,
                    "Created At"
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
                    <CommissionTableActions
                        commission={row.original}
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
        <div className="space-y-4">
            <StandardizedDataTable
                columns={columns}
                data={commissions}
                loading={loading}
                searchable={true}
                searchPlaceholder="Search commissions..."
                searchKey="type"
                emptyMessage="No commissions found"
                loadingMessage="Loading commissions..."
            />

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create Commission Rule</DialogTitle>
                        <DialogDescription>
                            Set up a new commission structure for transactions.
                        </DialogDescription>
                    </DialogHeader>
                    <CreateCommissionForm onSuccess={() => setShowCreateDialog(false)}/>
                </DialogContent>
            </Dialog>
        </div>
    );
}