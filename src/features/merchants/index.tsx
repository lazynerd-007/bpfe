'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Download, Plus, Search, Filter, X} from 'lucide-react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {useMerchantsPage} from './hooks';
import {MerchantsTable} from './merchants-table';
import {Merchant} from '@/sdk/types';
import {PageContainer, PageHeader, BreadCrumbs, BreadcrumbPage, Actions} from '@/components/layout/page-container';
import {useRouter} from 'next/navigation';

export function MerchantsPage() {
    const {merchants, loading, error, filters, updateFilters, resetFilters} = useMerchantsPage();
    const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState({
        merchantName: filters.merchantName || '',
        startDate: filters.startDate || '',
        endDate: filters.endDate || '',
        search: filters.search || ''
    });
    const router = useRouter();

    const handlePageChange = async (page: number) => {
        await updateFilters({page});
    };

    const handleSearch = async (search: string) => {
        setLocalFilters(prev => ({...prev, search}));
        await updateFilters({search, page: 1});
    };

    const handleApplyFilters = async () => {
        await updateFilters({
            ...localFilters,
            page: 1
        });
        setShowFilters(false);
    };

    const handleClearFilters = async () => {
        setLocalFilters({
            merchantName: '',
            startDate: '',
            endDate: '',
            search: ''
        });
        await resetFilters();
        setShowFilters(false);
    };

    const handleViewMerchant = (merchant: Merchant) => {
        setSelectedMerchant(merchant);
    };

    const handleEditMerchant = (merchant: Merchant) => {
        // TODO: Implement edit functionality
        console.log('Edit merchant:', merchant);
    };

    const handleViewSubMerchants = (merchant: Merchant) => {
        // TODO: Implement sub-merchants view
        console.log('View sub-merchants for:', merchant);
    };

    const handleManageApiKeys = (merchant: Merchant) => {
        // TODO: Implement API keys management
        console.log('Manage API keys for:', merchant);
    };

    const handleCreateMerchant = () => {
        router.push('/merchants/onboarding');
    };

    if (error) {
        return (
            <PageContainer>
                <PageHeader>
                    <BreadCrumbs>
                        <BreadcrumbPage>Merchants</BreadcrumbPage>
                    </BreadCrumbs>
                </PageHeader>

                <div className="text-center py-12">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader>
                <BreadCrumbs>
                    <BreadcrumbPage>Merchants</BreadcrumbPage>
                </BreadCrumbs>
                <Actions>
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="h-4 w-4 mr-2"/>
                        Filters
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2"/>
                        Export
                    </Button>
                    <Button onClick={handleCreateMerchant}>
                        <Plus className="h-4 w-4 mr-2"/>
                        New Merchant
                    </Button>
                </Actions>
            </PageHeader>

            {/* Filters Panel */}
            {showFilters && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Filter Merchants</span>
                            <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setShowFilters(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="merchantName">Merchant Name</Label>
                                <Input
                                    id="merchantName"
                                    placeholder="Enter merchant name..."
                                    value={localFilters.merchantName}
                                    onChange={(e) => setLocalFilters(prev => ({...prev, merchantName: e.target.value}))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={localFilters.startDate}
                                    onChange={(e) => setLocalFilters(prev => ({...prev, startDate: e.target.value}))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">End Date</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={localFilters.endDate}
                                    onChange={(e) => setLocalFilters(prev => ({...prev, endDate: e.target.value}))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="search">Search</Label>
                                <Input
                                    id="search"
                                    placeholder="Search merchants..."
                                    value={localFilters.search}
                                    onChange={(e) => setLocalFilters(prev => ({...prev, search: e.target.value}))}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Button onClick={handleApplyFilters}>
                                Apply Filters
                            </Button>
                            <Button variant="outline" onClick={handleClearFilters}>
                                Clear All
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Merchants Table */}
            <MerchantsTable
                merchants={merchants?.data || []}
                loading={loading}
                pagination={merchants ? {
                    page: filters.page || 1,
                    perPage: filters.perPage || 10,
                    total: merchants.meta?.total || 0,
                    totalPages: Math.ceil((merchants.meta?.total || 0) / (filters.perPage || 10))
                } : undefined}
                onPageChange={handlePageChange}
                onViewMerchant={handleViewMerchant}
                onEditMerchant={handleEditMerchant}
                onViewSubMerchants={handleViewSubMerchants}
                onManageApiKeys={handleManageApiKeys}
            />

            {/* Merchant Details Dialog */}
            <Dialog
                open={!!selectedMerchant}
                onOpenChange={(open) => !open && setSelectedMerchant(null)}
            >
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Merchant Details</DialogTitle>
                    </DialogHeader>
                    {selectedMerchant && (
                        <div className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <h4 className="font-medium mb-4">Basic Information</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-muted-foreground">Name:</span>
                                            <span>{selectedMerchant.merchantName}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-muted-foreground">Code:</span>
                                            <span className="font-mono">{selectedMerchant.merchantCode}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-muted-foreground">Category:</span>
                                            <span>{selectedMerchant.merchantCategoryCode}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-muted-foreground">Country:</span>
                                            <span>{selectedMerchant.country}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-muted-foreground">Email:</span>
                                            <span>{selectedMerchant.notificationEmail}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-4">Services</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-muted-foreground">Mobile Money:</span>
                                            <span>{selectedMerchant.canProcessMomoTransactions ? 'Enabled' : 'Disabled'}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-muted-foreground">Card Payments:</span>
                                            <span>{selectedMerchant.canProcessCardTransactions ? 'Enabled' : 'Disabled'}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-muted-foreground">Partner Bank:</span>
                                            <span>{selectedMerchant.partnerBankId}</span>
                                        </div>
                                        {selectedMerchant.webhookUrl && (
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="text-muted-foreground">Webhook:</span>
                                                <span
                                                    className="font-mono text-xs break-all">{selectedMerchant.webhookUrl}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <h4 className="font-medium mb-4">Settlement Details</h4>
                                    <div className="space-y-3 text-sm">
                                        {selectedMerchant.settlementDetails ? (
                                            <>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <span className="text-muted-foreground">Bank:</span>
                                                    <span>{selectedMerchant.settlementDetails.bankName}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <span className="text-muted-foreground">Account:</span>
                                                    <span
                                                        className="font-mono">{selectedMerchant.settlementDetails.accountNumber}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <span className="text-muted-foreground">Name:</span>
                                                    <span>{selectedMerchant.settlementDetails.accountName}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-muted-foreground">No settlement details available</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-4">Bank Details</h4>
                                    <div className="space-y-3 text-sm">
                                        {selectedMerchant.bankDetails ? (
                                            <>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <span className="text-muted-foreground">Bank:</span>
                                                    <span>{selectedMerchant.bankDetails.bankName}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <span className="text-muted-foreground">Account:</span>
                                                    <span
                                                        className="font-mono">{selectedMerchant.bankDetails.accountNumber}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <span className="text-muted-foreground">Name:</span>
                                                    <span>{selectedMerchant.bankDetails.accountName}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-muted-foreground">No bank details available</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {selectedMerchant.apiKey && (
                                <div>
                                    <h4 className="font-medium mb-4">API Integration</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-muted-foreground">Public Key:</span>
                                            <span
                                                className="font-mono text-xs break-all">{selectedMerchant.apiKey.publicKey}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-muted-foreground">Status:</span>
                                            <span>{selectedMerchant.apiKey.isActive ? 'Active' : 'Inactive'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </PageContainer>
    );
}

export default MerchantsPage;