"use client"

import * as React from "react"
import Image from "next/image"
import {
    IconAffiliate,
    IconBuildingBank,
    IconCreditCardPay,
    IconDashboard,
    IconHelp,
    IconSquareRoundedPercentage,
    IconSettings,
    IconUsers,
    IconDeviceTabletDollar,
    IconPigMoney,
    IconSquareRoundedLetterM,
} from "@tabler/icons-react"

import {NavGroup} from "@/components/layout/nav-group"
import {NavMain} from "@/components/layout/nav-main"
import {NavSecondary} from "@/components/layout/nav-secondary"
import {NavUser} from "@/components/layout/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {ROUTES} from "@/lib/constants"
import { useAuth } from "@/features/auth/hooks";
import {UserRoleEnum} from "@/sdk";

const getNavigationData = (user: { firstName: string; lastName: string; email: string; role: string } | null) => {
    const baseNavMain = [
        {
            title: "Dashboard",
            url: ROUTES.DASHBOARD,
            icon: IconDashboard,
        },
        {
            title: "Transactions",
            url: ROUTES.TRANSACTIONS.INDEX,
            icon: IconCreditCardPay,
        },
        {
            title: "Commissions",
            url: ROUTES.COMMISSIONS.INDEX,
            icon: IconSquareRoundedPercentage,
        },
    ];

    const adminManagement = [
        {
            name: "Merchants",
            url: ROUTES.MERCHANTS.INDEX,
            icon: IconSquareRoundedLetterM,
        },
        {
            name: "Users",
            url: ROUTES.USERS.INDEX,
            icon: IconUsers,
        },
        // {
        //     name: "Devices",
        //     url: ROUTES.DEVICES.INDEX,
        //     icon: IconDeviceTabletDollar,
        // },
        // {
        //     name: "Settlements",
        //     url: ROUTES.SETTLEMENTS.INDEX,
        //     icon: IconPigMoney,
        // },
        // {
        //     name: "Telcos",
        //     url: ROUTES.TELCOS.INDEX,
        //     icon: IconWorldWww,
        // },
        // {
        //     name: "Cashout",
        //     url: ROUTES.CASHOUT.INDEX,
        //     icon: IconMoneybag,
        // },
        // {
        //     name: "Remittance",
        //     url: ROUTES.REMITTANCE.INDEX,
        //     icon: IconTransfer,
        // },
        // {
        //     name: "SP Transfers",
        //     url: ROUTES.SP_TRANSFERS.INDEX,
        //     icon: IconFileText,
        // },
        // {
        //     name: "Sub-Merchants",
        //     url: ROUTES.SUB_MERCHANTS.INDEX,
        //     icon: IconAffiliate,
        // },
        // {
        //     name: "API Keys",
        //     url: ROUTES.API_KEYS.INDEX,
        //     icon: IconSettings,
        // },
    ];

    const merchantManagement = [
        {
            name: "Sub-Merchants",
            url: ROUTES.SUB_MERCHANTS.INDEX,
            icon: IconAffiliate,
        },
        {
            name: "API Keys",
            url: ROUTES.API_KEYS.INDEX,
            icon: IconSettings,
        },
    ];



    const pos = [
        {
            name: "Terminals",
            url: ROUTES.DEVICES.INDEX,
            icon: IconDeviceTabletDollar,
        },
    ];

    const navSecondary = [
        {
            title: "Settings",
            url: ROUTES.SETTINGS.INDEX,
            icon: IconSettings,
        },
        {
            title: "Get Help",
            url: ROUTES.HELP,
            icon: IconHelp,
            allowedRoles: ['ADMIN', 'MERCHANT'],
        },
    ];

    // Admin-only navigation
    let management: typeof adminManagement = [];
    if (user?.role === UserRoleEnum.ADMIN) {
        management = adminManagement;
    }

    return {
        user: {
            name: user ? `${user.firstName} ${user.lastName}` : "Guest",
            email: user?.email || "",
            avatar: "/avatars/default.jpg",
        },
        navMain: baseNavMain,
        management,
        merchantManagement: user?.role === UserRoleEnum.ADMIN ? merchantManagement : [],
        pos: user?.role === UserRoleEnum.ADMIN ? pos : [],
        navSecondary,
    };
};

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const { user } = useAuth();
    const data = React.useMemo(() => getNavigationData(user), [user]);

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className="data-[slot=sidebar-menu-button]:!p-1"
                        >
                            <Image
                                src="/logo.png"
                                alt="Blupay Africa Logo"
                                width={32}
                                height={32}
                                className="rounded-sm"
                                unoptimized
                            />
                            <span className="text-base font-semibold">
                              Blupay Africa
                            </span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
                {data.management.length > 0 && <NavGroup label={"Management"} items={data.management}/>}
                {data.pos.length > 0 && <NavGroup label={"POS"} items={data.pos}/>}
                <NavSecondary items={data.navSecondary} className="mt-auto"/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user}/>
            </SidebarFooter>
        </Sidebar>
    )
}
