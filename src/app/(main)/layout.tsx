import React from 'react';
import {AppSidebar} from "@/components/layout/app-sidebar";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";

interface LayoutProps {
    children: React.ReactNode;
}


const Layout = (props: LayoutProps) => {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset"/>
            <SidebarInset>
                {props.children}
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Layout;