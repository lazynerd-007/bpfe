"use client";

import {useEffect, useState} from "react";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {DevicesTable} from "./devices-table";
import {DeviceFilters} from "./device-filters";
import {useDevices} from "./hooks";
import {PageContainer, BreadcrumbPage, BreadCrumbs, PageHeader, Actions} from "@/components/layout/page-container";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";

export default function DevicesPage() {
    const {fetchDevices, loading, error} = useDevices();
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]);

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <PageContainer>
            <PageHeader>
                <BreadCrumbs>
                    <BreadcrumbPage>Devices</BreadcrumbPage>
                </BreadCrumbs>
                <Actions>
                    <Button onClick={() => setShowCreateDialog(true)}>
                        <Plus className="h-4 w-4 mr-2"/>
                        Add Device
                    </Button>
                </Actions>
            </PageHeader>

            <div className="space-y-6">
                <DevicesTable showCreateDialog={showCreateDialog} setShowCreateDialog={setShowCreateDialog} />
            </div>
        </PageContainer>
    );
}