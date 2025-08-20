"use client";
import {useDashboard} from "@/features/dashboard/hooks";
import {SectionCards, AnalyticsCardsLoading, AnalyticsCardsError} from "./variants";


export function AnalyticsCards() {
    const {analyticsCards, loading, error} = useDashboard();


    if (loading) return <AnalyticsCardsLoading/>;
    if (error) return <AnalyticsCardsError error={error}/>;


    return (
        <SectionCards
            items={analyticsCards}
        />
    );
}
