"use client";

import {useEffect, useState} from "react";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {PartnerBanksTable} from "./partner-banks-table";
import {PartnerBankFilters} from "./partner-bank-filters";
import {ViewPartnerBankModal} from "./components/view-partner-bank-modal";
import {EditPartnerBankModal} from "./components/edit-partner-bank-modal";
import {usePartnerBanks} from "./hooks";
import {PageContainer, PageHeader, BreadCrumbs, BreadcrumbPage, Actions} from '@/components/layout/page-container';
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {useRouter} from "next/navigation";
import {ROUTES} from "@/lib/constants";
import {PartnerBank} from "@/sdk/types";

export default function PartnerBanksPage() {
    const {fetchPartnerBanks, total, loading, error} = usePartnerBanks();
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPartnerBank, setSelectedPartnerBank] = useState<PartnerBank | null>(null);
    const router = useRouter();

    const handleView = (partnerBank: PartnerBank) => {
        setSelectedPartnerBank(partnerBank);
        setShowViewModal(true);
    };

    const handleEdit = (partnerBank: PartnerBank) => {
        setSelectedPartnerBank(partnerBank);
        setShowEditModal(true);
    };

    const handleEditSuccess = () => {
        fetchPartnerBanks(); // Refresh the data after successful edit
    };

    useEffect(() => {
        fetchPartnerBanks();
    }, [fetchPartnerBanks]);

    if (error) {
        return (
            <PageContainer>
                <PageHeader>
                    <BreadCrumbs>
                        <BreadcrumbPage>Partner Banks</BreadcrumbPage>
                    </BreadCrumbs>
                </PageHeader>

                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader>
                <BreadCrumbs>
                    <BreadcrumbPage>Partner Banks</BreadcrumbPage>
                </BreadCrumbs>
                <Actions>
                    <Button onClick={() => router.push(ROUTES.PARTNER_BANKS.ONBOARDING.BASIC_DETAILS)}>
                        <Plus className="h-4 w-4 mr-2"/>
                        Add Partner Bank
                    </Button>
                </Actions>
            </PageHeader>

            <div className="space-y-4">
                <PartnerBanksTable 
                    setShowCreateDialog={setShowCreateDialog} 
                    showCreateDialog={showCreateDialog}
                    onView={handleView}
                    onEdit={handleEdit}
                />
            </div>

            <ViewPartnerBankModal
                partnerBank={selectedPartnerBank}
                open={showViewModal}
                onOpenChange={setShowViewModal}
            />

            <EditPartnerBankModal
                partnerBank={selectedPartnerBank}
                open={showEditModal}
                onOpenChange={setShowEditModal}
                onSuccess={handleEditSuccess}
            />
        </PageContainer>
    );
}