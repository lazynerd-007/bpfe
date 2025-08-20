'use client';

import {
    PageContainer,
    BreadcrumbPage,
    BreadCrumbs,
    PageHeader,
    BreadcrumbLink
} from "@/components/layout/page-container";
import {IconBuilding, IconCreditCard, IconReceipt, IconUser, IconDeviceMobile} from "@tabler/icons-react";
import {ROUTES} from "@/lib/constants";
import {cn} from "@/lib/utils";
import {useAtom} from 'jotai';
import {usePathname} from 'next/navigation';
import {canNavigateToStepAtom} from '@/features/merchants/onboarding/store';

const steps = [
    {
        step: 1,
        title: "Merchant Details",
        icon: IconBuilding,
        route: ROUTES.MERCHANTS.ONBOARDING.MERCHANT_DETAILS,
    },
    {
        step: 2,
        title: "Settlement Details",
        icon: IconReceipt,
        route: ROUTES.MERCHANTS.ONBOARDING.SETTLEMENT_DETAILS,
    },
    {
        step: 3,
        title: "User Details",
        icon: IconUser,
        route: ROUTES.MERCHANTS.ONBOARDING.USER_DETAILS,
    },
    {
        step: 4,
        title: "Bank Details",
        icon: IconCreditCard,
        route: ROUTES.MERCHANTS.ONBOARDING.BANK_DETAILS,
    },
    {
        step: 5,
        title: "OVA Details",
        icon: IconDeviceMobile,
        route: ROUTES.MERCHANTS.ONBOARDING.OVA_DETAILS,
    },
]

const renderMerchantOnboardingBreadcrumbs = (currentPath: string, canNavigateToStep: (step: number) => boolean) => {
    return steps.map((step) => {
        const isCurrentStep = currentPath === step.route;
        const canNavigate = canNavigateToStep(step.step);
        
        if (isCurrentStep) {
            return (
                <BreadcrumbPage key={step.step}>
                    <div className={'flex items-center gap-2'}>
                        <step.icon className={'size-4'}/>
                        {step.title}
                    </div>
                </BreadcrumbPage>
            )
        } else if (canNavigate) {
            return (
                <BreadcrumbLink
                    key={step.step}
                    href={step.route}
                >
                    <div className={'flex items-center gap-2'}>
                        <step.icon className={'size-4'}/>
                        {step.title}
                    </div>
                </BreadcrumbLink>
            )
        } else {
            return (
                <BreadcrumbPage key={step.step}>
                    <div className={cn('flex items-center gap-2 text-muted-foreground/40')}>
                        <step.icon className={'size-4'}/>
                        {step.title}
                    </div>
                </BreadcrumbPage>
            )
        }
    })
}

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [canNavigateToStep] = useAtom(canNavigateToStepAtom);
    
    return (
        <PageContainer>
            <PageHeader>
                <BreadCrumbs disableLastTwoEllipsis>
                    <BreadcrumbLink href={ROUTES.MERCHANTS.ONBOARDING.MERCHANT_DETAILS}>Merchants Onboarding</BreadcrumbLink>
                    {renderMerchantOnboardingBreadcrumbs(pathname, canNavigateToStep)}
                </BreadCrumbs>
            </PageHeader>
            <div className="w-full">
                {children}
            </div>
        </PageContainer>
    );
}