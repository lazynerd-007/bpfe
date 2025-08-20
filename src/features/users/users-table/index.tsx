"use client";

import {useState, useMemo, useEffect, useCallback} from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    PaginationState,
} from "@tanstack/react-table";
import {IconArrowsSort, IconUser, IconMail, IconUserCheck, IconPhone, IconCalendar, IconSettings} from "@tabler/icons-react";
import { createHeaderWithIcon } from "@/components/ui/standardized-data-table";
import {Badge} from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import {Button} from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {useUsers, useSelectedUser} from "../hooks";
import {User, UserRoleEnum} from "@/sdk/types";
import {CreateUserModal} from "../create-user/create-user-modal";
import {useToast} from "@/hooks/use-toast";
import {UserTableFilters} from "./user-table-filters";
import {UserTablePagination} from "./user-table-pagination";
import {UserTableSkeleton} from "./user-table-skeleton";
import {UserTableRow, UserTableActions} from "./user-table-row";
import { useAuth } from "@/features/auth/hooks";

interface UsersTableProps {
    onEdit?: (user: User) => void;
    onView?: (user: User) => void;
    showCreateDialog: boolean;
    setShowCreateDialog: (show: boolean) => void;
}

export function UsersTable({onEdit, onView, setShowCreateDialog, showCreateDialog}: UsersTableProps) {
    const {users, total, loading, deleteUser, filter, fetchUsers} = useUsers();
    const {selectUser} = useSelectedUser();
    const {toast} = useToast();
    const { isAuthenticated, loading: authLoading } = useAuth();

    const [sorting, setSorting] = useState<SortingState>(
        filter.sortBy ? [{id: filter.sortBy, desc: filter.sortOrder === 'desc'}] : []
    )
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState(filter.search || '')
    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false)

    // Convert internal pagination to server format
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: (filter.page || 1) - 1, // Convert 1-based to 0-based
        pageSize: filter.limit || 10,
    })

    const handleDelete = async (user: User) => {
        if (window.confirm(`Are you sure you want to delete user ${user.firstName} ${user.lastName}?`)) {
            try {
                await deleteUser(user.id);
                toast({
                    title: "Success",
                    description: "User deleted successfully",
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to delete user",
                    variant: "destructive",
                });
            }
        }
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case UserRoleEnum.ADMIN:
                return "destructive";
            case UserRoleEnum.MERCHANT:
                return "default";
            case UserRoleEnum.PARTNER_BANK:
                return "secondary";
            case UserRoleEnum.SUB_MERCHANT:
                return "outline";
            default:
                return "default";
        }
    };

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

    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            {
                accessorKey: "firstName",
                header: ({column}) => {
                    return createHeaderWithIcon(
                        <IconUser className="h-4 w-4" />,
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="h-auto p-0 font-semibold"
                        >
                            Name
                            <IconArrowsSort className="ml-2 h-4 w-4"/>
                        </Button>
                    )
                },
                cell: ({row}) => {
                    const user = row.original
                    return (
                        <div className="font-medium">
                            {user.firstName} {user.lastName}
                        </div>
                    )
                },
            },
            {
                accessorKey: "email",
                header: ({column}) => {
                    return createHeaderWithIcon(
                        <IconMail className="h-4 w-4" />,
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="h-auto p-0 font-semibold"
                        >
                            Email
                            <IconArrowsSort className="ml-2 h-4 w-4"/>
                        </Button>
                    )
                },
            },
            {
                accessorKey: "role",
                header: ({column}) => {
                    return createHeaderWithIcon(
                        <IconUserCheck className="h-4 w-4" />,
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="h-auto p-0 font-semibold"
                        >
                            Role
                            <IconArrowsSort className="ml-2 h-4 w-4"/>
                        </Button>
                    )
                },
                cell: ({row}) => {
                    const role = row.getValue("role") as string
                    return (
                        <Badge variant={getRoleBadgeVariant(role)}>
                            {role}
                        </Badge>
                    )
                },
            },
            {
                accessorKey: "status",
                header: ({column}) => {
                    return createHeaderWithIcon(
                        <IconUserCheck className="h-4 w-4" />,
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="h-auto p-0 font-semibold"
                        >
                            Status
                            <IconArrowsSort className="ml-2 h-4 w-4"/>
                        </Button>
                    )
                },
                cell: ({row}) => {
                    const status = row.getValue("status") as string
                    return <StatusBadge status={status} type="user" />
                },
            },
            {
                accessorKey: "phoneNumber",
                header: () => createHeaderWithIcon(
                    <IconPhone className="h-4 w-4" />,
                    "Phone"
                ),
                cell: ({row}) => {
                    const phone = row.getValue("phoneNumber") as string
                    return phone || "-"
                },
            },
            {
                accessorKey: "createdAt",
                header: ({column}) => {
                    return createHeaderWithIcon(
                        <IconCalendar className="h-4 w-4" />,
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="h-auto p-0 font-semibold"
                        >
                            Created At
                            <IconArrowsSort className="ml-2 h-4 w-4"/>
                        </Button>
                    )
                },
                cell: ({row}) => {
                    const date = row.getValue("createdAt") as string
                    return new Date(date).toLocaleDateString()
                },
            },
            {
                id: "actions",
                header: () => createHeaderWithIcon(
                    <IconSettings className="h-4 w-4" />,
                    "Actions"
                ),
                enableHiding: false,
                cell: ({row}) => {
                    const user = row.original
                    return (
                        <UserTableActions
                            user={user}
                            onEdit={onEdit}
                            onView={onView}
                            onDelete={handleDelete}
                            onSelect={selectUser}
                        />
                    )
                },
            },
        ],
        [onEdit, onView, selectUser, toast]
    )

    // Memoized search handler to prevent recreation on every render
    const handleGlobalFilterChange = useCallback((value: string) => {
        setGlobalFilter(value)
    }, [])

    // Sync table state changes with server
    useEffect(() => {
        // Skip the first render to avoid duplicate initial load
        if (isInitialLoad) {
            setIsInitialLoad(false)
            return
        }

        const debounceTimer = setTimeout(() => {
            const newFilter: any = {
                page: pagination.pageIndex + 1, // Convert 0-based to 1-based
                limit: pagination.pageSize,
            }

            // Handle sorting
            if (sorting.length > 0) {
                const sort = sorting[0]
                newFilter.sortBy = sort.id
                newFilter.sortOrder = sort.desc ? 'desc' : 'asc'
            }

            // Handle global search
            if (globalFilter.trim()) {
                newFilter.search = globalFilter.trim()
            }

            // Handle column filters
            columnFilters.forEach((filter) => {
                if (filter.value) {
                    newFilter[filter.id] = filter.value
                }
            })

            fetchUsers(newFilter)
        }, 300) // 300ms debounce

        return () => clearTimeout(debounceTimer)
    }, [pagination, sorting, columnFilters, globalFilter])

    // Load data once when authentication is ready
    useEffect(() => {
        if (!isAuthenticated || authLoading) return;
        fetchUsers().finally(() => {
            setHasLoadedOnce(true)
        })
    }, [isAuthenticated, authLoading, fetchUsers])

    const table = useReactTable({
        data: users,
        columns,
        rowCount: total, // Server-side total count
        manualPagination: true, // Server-side pagination
        manualSorting: true, // Server-side sorting
        manualFiltering: true, // Server-side filtering
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
            globalFilter,
        },
    })

    // Show skeleton for full page on initial load
    if (loading && !hasLoadedOnce) {
        return (
            <div className="w-full space-y-4">
                <UserTableFilters
                    table={table}
                    globalFilter={globalFilter}
                    onGlobalFilterChange={handleGlobalFilterChange}
                />
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="border-b bg-muted/50">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead 
                                            key={header.id}
                                            className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground bg-muted/30"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            <UserTableSkeleton/>
                        </TableBody>
                    </Table>
                </div>
                <UserTablePagination table={table} total={total} usersCount={users.length}/>
            </div>
        )
    }

    return (
        <>
            <div className="w-full space-y-4">
                <UserTableFilters
                    table={table}
                    globalFilter={globalFilter}
                    onGlobalFilterChange={handleGlobalFilterChange}
                />
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="border-b bg-muted/50">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead 
                                            key={header.id}
                                            className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground bg-muted/30"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {loading && hasLoadedOnce ? (
                                <UserTableSkeleton/>
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <UserTableRow
                                        key={row.id}
                                        user={row.original}
                                        onEdit={onEdit}
                                        onView={onView}
                                        onDelete={handleDelete}
                                        onSelect={selectUser}
                                        isSelected={row.getIsSelected()}
                                    />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <UserTablePagination table={table} total={total} usersCount={users.length}/>
            </div>
            <CreateUserModal showCreateDialog={showCreateDialog} setShowCreateDialog={setShowCreateDialog}/>
        </>
    );
}