"use client";

import {useEffect, useState} from "react";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {FeatureErrorBoundary} from "@/components/error-boundary";
import {UsersTable} from "./users-table";
import {useUsers} from "./hooks";
import {useAuth} from "@/features/auth/hooks";
import {PageContainer, PageHeader, BreadCrumbs, BreadcrumbPage, Actions} from "@/components/layout/page-container";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";

export default function UsersPage() {
    const { error } = useUsers();
    const {isAuthenticated, loading: authLoading} = useAuth();
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    // Show loading state while authentication is being established
    if (authLoading) {
        return (
            <PageContainer>
                <PageHeader>
                    <BreadCrumbs>
                        <BreadcrumbPage>Users</BreadcrumbPage>
                    </BreadCrumbs>
                </PageHeader>
                <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">Loading...</div>
                </div>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <PageHeader>
                    <BreadCrumbs>
                        <BreadcrumbPage>Users</BreadcrumbPage>
                    </BreadCrumbs>
                </PageHeader>

                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </PageContainer>
        );
    }

    return (
        <FeatureErrorBoundary featureName="Users Management">
            <PageContainer>
                <PageHeader>
                    <BreadCrumbs>
                        <BreadcrumbPage>Users</BreadcrumbPage>
                    </BreadCrumbs>
                    <Actions>
                        <Button onClick={() => setShowCreateDialog(true)}>
                            <Plus className="h-4 w-4 mr-2"/>
                            Add User
                        </Button>
                    </Actions>
                </PageHeader>

                <div className="space-y-4">
                    <FeatureErrorBoundary featureName="User Table">
                        <UsersTable showCreateDialog={showCreateDialog} setShowCreateDialog={setShowCreateDialog}/>
                    </FeatureErrorBoundary>
                </div>
            </PageContainer>
        </FeatureErrorBoundary>
    );
}