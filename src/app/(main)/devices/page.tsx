import {Metadata} from 'next';
import {PageContainer} from '@/components/layout/page-container';
import DevicesPage from '@/features/devices';

export const metadata: Metadata = {
    title: 'Devices & Terminals - Blupay Africa',
    description: 'Manage POS terminals, ATMs, and mobile devices',
};

export default function Page() {
    return (
        <DevicesPage/>
    );
}