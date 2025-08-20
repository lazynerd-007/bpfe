'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Merchant } from '@/sdk/types';
import { StandardizedDataTable, createHeaderWithIcon } from '@/components/ui/standardized-data-table';
import { MerchantTableActions } from './components/merchant-table-row';
import { useMerchant } from './hooks';
import { 
  IconBuildingStore, 
  IconCode, 
  IconWorld, 
  IconCreditCard, 
  IconBuildingBank,
  IconSettings
} from '@tabler/icons-react';

interface MerchantsTableProps {
    merchants: Merchant[];
    loading?: boolean;
    pagination?: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
    };
    onPageChange?: (page: number) => void;
    onViewMerchant?: (merchant: Merchant) => void;
    onEditMerchant?: (merchant: Merchant) => void;
    onViewSubMerchants?: (merchant: Merchant) => void;
    onManageApiKeys?: (merchant: Merchant) => void;
}

export function MerchantsTable({
    merchants,
    loading,
    pagination,
    onPageChange,
    onViewMerchant,
    onEditMerchant,
    onViewSubMerchants,
    onManageApiKeys,
}: MerchantsTableProps) {
    const { remove } = useMerchant();

    const handleDelete = async (merchant: Merchant) => {
        if (confirm('Are you sure you want to delete this merchant?')) {
            try {
                await remove(merchant.uuid);
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    const columns: ColumnDef<Merchant>[] = useMemo(
        () => [
            {
                accessorKey: "merchantName",
                header: () => createHeaderWithIcon(
                    <IconBuildingStore className="h-4 w-4" />,
                    "Merchant"
                ),
                cell: ({ row }) => (
                    <div>
                        <div className="font-medium">{row.getValue("merchantName")}</div>
                        <div className="text-sm text-muted-foreground">
                            {row.original.notificationEmail}
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: "merchantCode",
                header: () => createHeaderWithIcon(
                    <IconCode className="h-4 w-4" />,
                    "Code"
                ),
                cell: ({ row }) => (
                    <div className="font-mono text-sm">
                        {row.getValue("merchantCode")}
                    </div>
                ),
            },
            {
                accessorKey: "country",
                header: () => createHeaderWithIcon(
                    <IconWorld className="h-4 w-4" />,
                    "Country"
                ),
                cell: ({ row }) => (
                    <Badge variant="outline">{row.getValue("country")}</Badge>
                ),
            },
            {
                id: "services",
                header: () => createHeaderWithIcon(
                    <IconCreditCard className="h-4 w-4" />,
                    "Services"
                ),
                cell: ({ row }) => (
                    <div className="flex flex-wrap gap-1">
                        {row.original.canProcessMomoTransactions && (
                            <Badge variant="secondary" className="text-xs">
                                Mobile Money
                            </Badge>
                        )}
                        {row.original.canProcessCardTransactions && (
                            <Badge variant="secondary" className="text-xs">
                                Cards
                            </Badge>
                        )}
                    </div>
                ),
                enableSorting: false,
            },
            {
                accessorKey: "partnerBankId",
                header: () => createHeaderWithIcon(
                    <IconBuildingBank className="h-4 w-4" />,
                    "Partner Bank"
                ),
                cell: ({ row }) => (
                    <div className="text-sm">{row.getValue("partnerBankId")}</div>
                ),
            },
            {
                id: "actions",
                header: () => createHeaderWithIcon(
                    <IconSettings className="h-4 w-4" />,
                    "Actions"
                ),
                cell: ({ row }) => (
                    <MerchantTableActions
                        merchant={row.original}
                        onView={onViewMerchant}
                        onEdit={onEditMerchant}
                        onViewSubMerchants={onViewSubMerchants}
                        onManageApiKeys={onManageApiKeys}
                        onDelete={handleDelete}
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
        ],
        [onViewMerchant, onEditMerchant, onViewSubMerchants, onManageApiKeys, handleDelete]
    );

    return (
        <StandardizedDataTable
            columns={columns}
            data={merchants}
            loading={loading}
            searchable={true}
            searchPlaceholder="Search merchants..."
            searchKey="merchantName"
            emptyMessage="No merchants found"
            loadingMessage="Loading merchants..."
        />
    );
}