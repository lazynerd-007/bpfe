"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  MouseSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLayoutColumns,
  IconLoader,
  IconUser,
  IconCalendar,
  IconHash,
  IconCreditCard,
  IconReceipt,
  IconCurrencyDollar,
  IconCircleFilled,
  IconAlertCircle,
  IconClock,
  IconRefresh,
  IconDownload,
  IconUpload,
  IconRotateClockwise,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Transaction, TransactionStatus, TransactionType, UserRoleEnum } from "@/sdk/types"
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { 
  paginatedTransactionsAtom, 
  transactionsPaginationAtom, 
  transactionsLoadingAtom, 
  transactionsErrorAtom,
  fetchPaginatedTransactionsAtom 
} from "./atoms"
import { useAuth } from '@/features/auth/hooks'
import { getProcessorConfig, getTransactionStatusConfig } from "./constants"
import { StatusBadge } from "@/components/status-badge"

// Create a sortable header component for column reordering
const SortableHeader = React.memo(({ id, children }: { id: string; children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="cursor-grab active:cursor-grabbing"
    >
      {children}
    </div>
  )
});

const getStatusBadge = React.memo((status: string) => {
  const statusConfig = getTransactionStatusConfig(status);

  return (
    <Badge variant={statusConfig.variant} className="gap-1">
      {statusConfig.icon}
      {statusConfig.title.toUpperCase()}
    </Badge>
  );
});

const getTransactionIcon = (transaction: any) => {
  // Since API doesn't provide type, assume positive amounts are MONEY_IN
  const isMoneyIn = (transaction.amount && parseFloat(transaction.amount) > 0) || true;
  return isMoneyIn ? (
    <IconDownload className="h-4 w-4 text-green-500" />
  ) : (
    <IconUpload className="h-4 w-4 text-red-500" />
  );
};

function getTransactionTypeHelper(transaction: any): string {
  // Since API doesn't provide type, assume MONEY_IN for positive amounts
  return (transaction.amount && parseFloat(transaction.amount) > 0) ? 'MONEY_IN' : 'MONEY_OUT';
}

function formatAmountHelper(amount: number): string {
  const formatter = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
  });
  return formatter.format(amount);
}

function getProcessorLogoHelper(processor: string): string {
  const processorConfig = getProcessorConfig(processor);
  return processorConfig.logoPath || '/logos/default.png';
}

function createColumnsHelper(columnOrder: string[]): ColumnDef<Transaction>[] {
  const allColumns: Record<string, ColumnDef<Transaction>> = {
    select: {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    customer: {
      id: "customer",
      accessorKey: "customer.name",
      header: ({ column }) => (
        <SortableHeader id="customer">
          <div className="flex items-center gap-2">
            <IconUser className="w-4 h-4" />
            Customer Name
          </div>
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {getTransactionIcon(transaction)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">
                {transaction.customer?.name || 'Unknown Customer'}
              </p>
              <p className="text-xs text-muted-foreground">
                {transaction.customer?.phoneNumber || 'N/A'}
              </p>
            </div>
          </div>
        );
      },
      enableHiding: false,
    },
    date: {
      id: "date",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <SortableHeader id="date">
          <div className="flex items-center gap-2">
            <IconCalendar className="w-4 h-4" />
            Date
          </div>
        </SortableHeader>
      ),
      cell: ({ row }) => (
        <div>
          <div className="text-sm">
            {row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }) : 'N/A'}
          </div>
          <div className="text-xs text-muted-foreground">
            {row.original.createdAt ? new Date(row.original.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            }) : 'N/A'}
          </div>
        </div>
      ),
    },
    tid: {
      id: "tid",
      accessorKey: "merchant.terminal.deviceId",
      header: ({ column }) => (
        <SortableHeader id="tid">
          <div className="flex items-center gap-2">
            <IconHash className="w-4 h-4" />
            TID
          </div>
        </SortableHeader>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-mono">
          {(row.original as any).merchant?.terminal?.deviceId || 'N/A'}
        </div>
      ),
    },
    processor: {
      id: "processor",
      accessorKey: "processor",
      header: ({ column }) => (
        <SortableHeader id="processor">
          <div className="flex items-center gap-2">
            <IconCreditCard className="w-4 h-4" />
            Scheme
          </div>
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const processorConfig = getProcessorConfig(row.original.processor);
        return (
          <div className="flex items-center space-x-2">
            {processorConfig.logoPath ? (
              <img
                src={processorConfig.logoPath}
                alt={processorConfig.title}
                className="h-6 w-6 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : (
              <div className="h-6 w-6 flex items-center justify-center">
                {processorConfig.icon}
              </div>
            )}
            <span className="text-xs text-muted-foreground hidden">
              {processorConfig.title}
            </span>
          </div>
        );
      },
    },
    reference: {
      id: "reference",
      accessorKey: "transactionRef",
      header: ({ column }) => (
        <SortableHeader id="reference">
          <div className="flex items-center gap-2">
            <IconReceipt className="w-4 h-4" />
            Reference
          </div>
        </SortableHeader>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-mono">
          {row.original.transactionRef || 'N/A'}
        </div>
      ),
    },
    amount: {
      id: "amount",
      accessorKey: "amount",
      header: ({ column }) => (
        <SortableHeader id="amount">
          <div className="flex items-center gap-2">
            <IconCurrencyDollar className="w-4 h-4" />
            Amount
          </div>
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const transaction = row.original;
        const transactionType = getTransactionTypeHelper(transaction);
        const amount = parseFloat(transaction.amount?.toString() || '0') || 0;
        
        return (
          <div>
            <div className={`text-sm font-medium ${
              transactionType === 'MONEY_IN' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transactionType === 'MONEY_IN' ? '+' : '-'}
              {formatAmountHelper(Math.abs(amount))}
            </div>
            <div className="text-xs text-muted-foreground">
              {transaction.processor?.toUpperCase() || 'N/A'} • GHS
            </div>
          </div>
        );
      },
    },
    status: {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <SortableHeader id="status">
          <div className="flex items-center gap-2">
            <IconCircleFilled className="w-4 h-4" />
            Status
          </div>
        </SortableHeader>
      ),
      cell: ({ row }) => <StatusBadge status={row.original.status} type="transaction" />,
    },
    type: {
      id: "type",
      accessorKey: "type",
      header: ({ column }) => (
        <SortableHeader id="type">
          <div className="flex items-center gap-2">
            <IconRotateClockwise className="w-4 h-4" />
            Type
          </div>
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const transactionType = getTransactionTypeHelper(row.original);
        return (
          <Badge variant={transactionType === 'MONEY_IN' ? 'default' : 'secondary'}>
            {transactionType.replace('_', ' ')}
          </Badge>
        );
      },
    },
    surcharge: {
      id: "surcharge",
      accessorKey: "surchargeOnCustomer",
      header: ({ column }) => (
        <SortableHeader id="surcharge">
          <div className="flex items-center gap-2">
            <IconCurrencyDollar className="w-4 h-4" />
            Surcharge
          </div>
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const customerSurcharge = parseFloat(row.original.surchargeOnCustomer?.toString() || '0') || 0;
        const merchantSurcharge = parseFloat(row.original.surchargeOnMerchant?.toString() || '0') || 0;
        
        return (
          <div className="text-sm">
            <div>Customer: {formatAmountHelper(customerSurcharge)}</div>
            <div className="text-xs text-muted-foreground">
              Merchant: {formatAmountHelper(merchantSurcharge)}
            </div>
          </div>
        );
      },
    },
    description: {
      id: "description",
      accessorKey: "description",
      header: ({ column }) => (
        <SortableHeader id="description">
          <div className="flex items-center gap-2">
            <IconReceipt className="w-4 h-4" />
            Description
          </div>
        </SortableHeader>
      ),
      cell: ({ row }) => (
        <div className="text-sm max-w-48 truncate" title={row.original.description}>
          {row.original.description || 'N/A'}
        </div>
      ),
    },
    actions: {
      id: "actions",
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Download Receipt</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Dispute</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  };

  return columnOrder.map(id => allColumns[id]).filter(Boolean);
}


function LoadingState() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="h-10 w-10 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center">
          <IconAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Transactions</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={onRetry} className="gap-2">
            <IconRefresh className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export const TransactionsTable = React.memo(() => {
  const { user } = useAuth();
  const paginatedTransactions = useAtomValue(paginatedTransactionsAtom);
  const loading = useAtomValue(transactionsLoadingAtom);
  const error = useAtomValue(transactionsErrorAtom);
  const [pagination, setPagination] = useAtom(transactionsPaginationAtom);
  const fetchTransactions = useSetAtom(fetchPaginatedTransactionsAtom);
  
  // Memoized helper functions inside component
  const getTransactionType = React.useMemo(() => (transaction: any): string => {
    return getTransactionTypeHelper(transaction);
  }, []);

  const formatAmount = React.useMemo(() => {
    return (amount: number) => formatAmountHelper(amount);
  }, []);

  const getProcessorLogo = React.useMemo(() => (processor: string) => {
    return getProcessorLogoHelper(processor);
  }, []);

  const createColumns = React.useMemo(() => (columnOrder: string[]): ColumnDef<Transaction>[] => {
    return createColumnsHelper(columnOrder);
  }, []);
  
  const [data, setData] = React.useState<Transaction[]>([])
  const [activeTab, setActiveTab] = React.useState("all")
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnOrder, setColumnOrder] = React.useState<string[]>([
    'select', 'customer', 'date', 'tid', 'processor', 'reference', 
    'amount', 'status', 'type', 'surcharge', 'description', 'actions'
  ])

  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {})
  )
  
  const columns = React.useMemo(() => createColumns(columnOrder), [columnOrder])

  // Load transactions on mount and when pagination changes
  React.useEffect(() => {
    const merchantId = user?.role === UserRoleEnum.MERCHANT || user?.role === UserRoleEnum.SUB_MERCHANT 
      ? user.merchantId 
      : undefined;
    fetchTransactions({ 
      page: pagination.page, 
      perPage: pagination.perPage, 
      merchantId 
    });
  }, [fetchTransactions, pagination.page, pagination.perPage, user]);

  // Update data when paginated transactions change
  React.useEffect(() => {
    if (paginatedTransactions?.data) {
      setData(paginatedTransactions.data)
    } else {
      setData([])
    }
  }, [paginatedTransactions])

  // Filter data based on active tab
  const filteredData = React.useMemo(() => {
    if (!data) return []
    
    if (activeTab === "all") return data
    if (activeTab === "collection") return data.filter(t => getTransactionType(t) === 'MONEY_IN')
    if (activeTab === "payout") return data.filter(t => getTransactionType(t) === 'MONEY_OUT')
    if (activeTab === "reversal") return data.filter(t => t.status?.toLowerCase() === 'failed')
    
    return data
  }, [data, activeTab])

  const columnIds = React.useMemo(
    () => columnOrder,
    [columnOrder]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: pagination.page - 1, // TanStack uses 0-based indexing
        pageSize: pagination.perPage,
      },
    },
    getRowId: (row) => row.uuid,
    enableRowSelection: true,
    manualPagination: true, // Enable manual pagination
    pageCount: paginatedTransactions?.meta?.totalPages || 1,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newPagination = updater({
          pageIndex: pagination.page - 1,
          pageSize: pagination.perPage,
        });
        setPagination({
          page: newPagination.pageIndex + 1, // Convert back to 1-based
          perPage: newPagination.pageSize,
        });
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setColumnOrder((columns) => {
        const oldIndex = columns.indexOf(active.id as string)
        const newIndex = columns.indexOf(over.id as string)
        return arrayMove(columns, oldIndex, newIndex)
      })
    }
  }

  // Show loading state
  if (loading) {
    return <LoadingState />
  }

  // Show error state
  if (error) {
    const handleRetry = () => {
      const merchantId = user?.role === UserRoleEnum.MERCHANT || user?.role === UserRoleEnum.SUB_MERCHANT 
        ? user.merchantId 
        : undefined;
      fetchTransactions({ 
        page: pagination.page, 
        perPage: pagination.perPage, 
        merchantId 
      });
    };
    return <ErrorState error={error} onRetry={handleRetry} />
  }

  // Show loading state if paginatedTransactions is null (initial state)
  if (!paginatedTransactions && !error) {
    return <LoadingState />
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between">
        <TabsList className="grid w-fit grid-cols-4">
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="collection" className="gap-2">
            <IconDownload className="w-4 h-4" />
            Collection
          </TabsTrigger>
          <TabsTrigger value="reversal" className="gap-2">
            <IconRotateClockwise className="w-4 h-4" />
            Reversal
          </TabsTrigger>
          <TabsTrigger value="payout" className="gap-2">
            <IconUpload className="w-4 h-4" />
            Payout
          </TabsTrigger>
        </TabsList>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
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
                      {column.id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <TabsContent value={activeTab} className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                <SortableContext
                  items={columnIds}
                  strategy={horizontalListSortingStrategy}
                >
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </SortableContext>
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </DndContext>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {paginatedTransactions?.meta ? 
              `Showing ${((paginatedTransactions.meta.page - 1) * paginatedTransactions.meta.perPage) + 1}-${Math.min(paginatedTransactions.meta.page * paginatedTransactions.meta.perPage, paginatedTransactions.meta.total)} of ${paginatedTransactions.meta.total} transactions` :
              'No data'
            }
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${pagination.perPage}`}
                onValueChange={(value) => {
                  setPagination({
                    page: 1, // Reset to first page when changing page size
                    perPage: Number(value)
                  });
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue placeholder={pagination.perPage} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {pagination.page} of {paginatedTransactions?.meta?.totalPages || 1}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => setPagination(prev => ({ ...prev, page: 1 }))}
                disabled={pagination.page === 1}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= (paginatedTransactions?.meta?.totalPages || 1)}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => setPagination(prev => ({ ...prev, page: paginatedTransactions?.meta?.totalPages || 1 }))}
                disabled={pagination.page >= (paginatedTransactions?.meta?.totalPages || 1)}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
});