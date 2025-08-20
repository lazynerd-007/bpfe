"use client";

import {useEffect, useState} from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CommissionsTable } from "./commissions-table";
import { useCommissions } from "./hooks";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react"
import {
  Actions,
  BreadcrumbPage,
  BreadCrumbs,
  PageContainer,
  PageHeader
} from '@/components/layout/page-container';
import {ROUTES} from "@/lib/constants";

export default function CommissionsPage() {
  const { fetchCommissions, loading, error, filters } = useCommissions();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  useEffect(() => {
    fetchCommissions();
  }, [fetchCommissions, filters]);

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
          <BreadcrumbPage>Commissions</BreadcrumbPage>
        </BreadCrumbs>
        <Actions>
          <Button onClick={() => setShowCreateDialog(true)}>
            <IconPlus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </Actions>
      </PageHeader>
      <CommissionsTable setShowCreateDialog={setShowCreateDialog} showCreateDialog={showCreateDialog} />
    </PageContainer>
  );
}