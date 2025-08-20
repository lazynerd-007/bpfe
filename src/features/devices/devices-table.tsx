"use client";

import React, { useMemo, useState } from "react";
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
import { DeviceTableActions } from "./components/device-table-row";
import { DeviceViewModal } from './components/device-view-modal';
import { EditDeviceModal } from './components/edit-device-modal';
import { useDevices, useSelectedDevice } from "./hooks";
import { Device } from "@/sdk/types";
import { CreateDeviceForm } from "./create-device-form";
import { useToast } from "@/hooks/use-toast";
import { 
  IconDevices, 
  IconStatusChange, 
  IconUser, 
  IconCalendar,
  IconSettings
} from "@tabler/icons-react";

interface DevicesTableProps {
    onEdit?: (device: Device) => void;
    onView?: (device: Device) => void;
    showCreateDialog: boolean;
    setShowCreateDialog: (show: boolean) => void;
}

export function DevicesTable({onEdit, onView, setShowCreateDialog, showCreateDialog}: DevicesTableProps) {
    const {devices, loading, deleteDevice} = useDevices();
    const {selectDevice} = useSelectedDevice();
    const {toast} = useToast();
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

    const handleDelete = async (device: Device) => {
        if (window.confirm(`Are you sure you want to delete device ${device.deviceId}?`)) {
            try {
                await deleteDevice(device.uuid);
                toast({
                    title: "Success",
                    description: "Device deleted successfully",
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to delete device",
                    variant: "destructive",
                });
            }
        }
    };

    const handleView = (device: Device) => {
        selectDevice(device);
        setSelectedDevice(device);
        setShowViewModal(true);
        onView?.(device);
    };

    const handleEdit = (device: Device) => {
        setSelectedDevice(device);
        setShowEditModal(true);
    };

    const handleEditSuccess = () => {
        setShowEditModal(false);
        setSelectedDevice(null);
        // Refresh the devices list
        // refetch();
    };

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

    const columns = useMemo<ColumnDef<Device>[]>(
        () => [
            {
                accessorKey: "deviceId",
                header: () => createHeaderWithIcon(
                    <IconDevices className="h-4 w-4" />,
                    "Device ID"
                ),
                cell: ({ row }) => (
                    <div className="font-medium">{row.getValue("deviceId")}</div>
                ),
            },
            {
                accessorKey: "status",
                header: () => createHeaderWithIcon(
                    <IconStatusChange className="h-4 w-4" />,
                    "Status"
                ),
                cell: ({ row }) => {
                    const status = row.getValue("status") as string;
                    return (
                        <Badge variant={getStatusBadgeVariant(status)}>
                            {getStatusLabel(status)}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "merchant",
                header: () => createHeaderWithIcon(
                    <IconUser className="h-4 w-4" />,
                    "Allocated To"
                ),
                cell: ({ row }) => {
                    const merchant = row.original.merchant;
                    return <div>{merchant?.merchantName || "-"}</div>;
                },
            },
            {
                accessorKey: "createdAt",
                header: () => createHeaderWithIcon(
                    <IconCalendar className="h-4 w-4" />,
                    "Date Created"
                ),
                cell: ({ row }) => {
                    const date = row.getValue("createdAt") as string;
                    return (
                        <div>
                            {new Date(date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>
                    );
                },
            },
            {
                id: "actions",
                header: () => createHeaderWithIcon(
                    <IconSettings className="h-4 w-4" />,
                    "Actions"
                ),
                cell: ({ row }) => (
                    <DeviceTableActions
                        device={row.original}
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
                data={devices}
                loading={loading}
                searchable={true}
                searchPlaceholder="Search devices..."
                searchKey="deviceId"
                emptyMessage="No devices found"
                loadingMessage="Loading devices..."
            />

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add New Device</DialogTitle>
                        <DialogDescription>
                            Register a new device/terminal in the system.
                        </DialogDescription>
                    </DialogHeader>
                    <CreateDeviceForm onSuccess={() => setShowCreateDialog(false)}/>
                </DialogContent>
            </Dialog>

            <DeviceViewModal
                device={selectedDevice}
                open={showViewModal}
                onOpenChange={setShowViewModal}
            />

            <EditDeviceModal
                 device={selectedDevice}
                 open={showEditModal}
                 onOpenChange={setShowEditModal}
                 onSuccess={handleEditSuccess}
             />
        </div>
    );
}