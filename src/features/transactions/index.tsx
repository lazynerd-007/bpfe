'use client';
import {BreadcrumbPage, BreadCrumbs, PageContainer, PageHeader, Actions} from "@/components/layout/page-container";
import {BreadcrumbLink} from "@/components/ui/breadcrumb";

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Plus} from 'lucide-react';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import {useTransactionsPage} from './hooks';
import {TransactionFilters} from './transaction-filters';
import {TransactionsTable} from './transactions-table';
import {CreateTransactionForm} from './create-transaction-form';
import {Transaction} from '@/sdk/types';
import {ROUTES} from "@/lib/constants";

export function TransactionsPage() {
    const {transactions, loading, error, updateFilters, refetch} = useTransactionsPage();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const handlePageChange = async (page: number) => {
        await updateFilters({page});
    };

    const handleViewTransaction = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
    };

    const handleCreateSuccess = () => {
        setShowCreateForm(false);
        refetch();
    };


    return (
        <PageContainer>
            <PageHeader>
                <BreadCrumbs>
                    <BreadcrumbPage>Transactions</BreadcrumbPage>
                </BreadCrumbs>
            </PageHeader>

            <TransactionsTable/>

            {/* Transaction Details Dialog */}
            <Dialog
                open={!!selectedTransaction}
                onOpenChange={(open) => !open && setSelectedTransaction(null)}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Transaction Details</DialogTitle>
                    </DialogHeader>
                    {selectedTransaction && (
                        <div className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <h4 className="font-medium mb-2">Transaction Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Reference:</span>
                                            <span className="font-mono">{selectedTransaction.transactionRef}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Amount:</span>
                                            <span className="font-medium">
                        {new Intl.NumberFormat('en-GH', {
                            style: 'currency',
                            currency: 'GHS',
                        }).format(selectedTransaction.amount)}
                      </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Status:</span>
                                            <span>{selectedTransaction.status}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Processor:</span>
                                            <span>{selectedTransaction.processor}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Type:</span>
                                            <span>{selectedTransaction.type}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Customer Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Name:</span>
                                            <span>{selectedTransaction.customer.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Phone:</span>
                                            <span>{selectedTransaction.customer.phoneNumber}</span>
                                        </div>
                                        {selectedTransaction.customer.email && (
                                            <div className="flex justify-between">
                                                <span>Email:</span>
                                                <span>{selectedTransaction.customer.email}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {selectedTransaction.description && (
                                <div>
                                    <h4 className="font-medium mb-2">Description</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedTransaction.description}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Created: {new Date(selectedTransaction.createdAt).toLocaleString()}</span>
                                <span>Updated: {new Date(selectedTransaction.updatedAt).toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </PageContainer>
    );
}

export default TransactionsPage;