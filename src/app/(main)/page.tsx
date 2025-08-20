import {BreadcrumbPage, BreadCrumbs, PageContainer, PageHeader} from "@/components/layout/page-container";
import {BreadcrumbLink} from "@/components/ui/breadcrumb";
import {TransactionChart} from "@/features/dashboard/transaction-chart";
import {TransactionsTable} from "@/features/dashboard/transactions-table";
import {ROUTES} from "@/lib/constants";
import {AnalyticsCards} from "@/features/dashboard/analytics-cards";

import {TransactionMoneyInOutChart} from "@/features/dashboard/transactions-money-in-out-chart";
import {TransactionStatusPieChart} from "@/features/dashboard/transtation-status-pie-chart";
import {TransactionProcessorBarChart} from "@/features/dashboard/transaction-processor-bar-chart";


export default function Home() {
    return (
        <PageContainer>
            <PageHeader>
                <BreadCrumbs>
                    <BreadcrumbLink href={ROUTES.DASHBOARD}>Dashboard</BreadcrumbLink>
                    <BreadcrumbPage>Transaction Report</BreadcrumbPage>
                </BreadCrumbs>
            </PageHeader>
            <AnalyticsCards/>
            <TransactionChart/>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TransactionMoneyInOutChart/>
                <TransactionStatusPieChart/>
                <TransactionProcessorBarChart/>
            </div>

            <TransactionsTable/>
        </PageContainer>
    );
}
