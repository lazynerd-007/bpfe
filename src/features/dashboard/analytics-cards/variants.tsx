"use client"
import clsx from "clsx"
import Link from "next/link"
import type { ComponentType } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Skeleton} from "@/components/ui/skeleton"

type Trend = "up" | "down" | "neutral"

export interface AnalyticsCardItem {
    id: string
    title: string
    value: string
    count: number | null
    description: string
    Icon: ComponentType<{ className?: string }>
    trend: Trend
    color: string         // e.g. "text-green-600"
    bgColor: string       // e.g. "bg-green-50"
    cta?: { ctaRoute: string; ctaTitle: string }
}

interface SectionCardsProps {
    items: AnalyticsCardItem[]
    className?: string
}


export function SectionCards({ items, className }: SectionCardsProps) {
    return (
        <div
            className={clsx(
                "[grid-template-columns:repeat(auto-fit,minmax(16rem,1fr))] grid gap-4",
                "*:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs",
                "dark:*:data-[slot=card]:bg-card",
                className,
            )}
        >
            {items.map(
                (
                    {
                        id,
                        title,
                        value,
                        description,
                        cta,
                    },
                    idx,
                ) => {

                    return (
                        <Card key={id ?? idx} className="@container/card" data-slot="card">
                            <CardHeader>
                                <CardDescription>{title}</CardDescription>
                                <CardTitle className="text-2xl font-medium tabular-nums @[250px]/card:text-3xl">
                                    {value}
                                </CardTitle>
                            </CardHeader>

                            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                                <div className="line-clamp-1 flex gap-2 ">
                                    {description}
                                </div>

                                {/*{count !== null && (*/}
                                {/*    <div className="text-muted-foreground">*/}
                                {/*        {count.toLocaleString()} total*/}
                                {/*    </div>*/}
                                {/*)}*/}

                                {cta && (
                                    <Button size="sm" asChild>
                                        <Link href={cta.ctaRoute}>{cta.ctaTitle}</Link>
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    )
                },
            )}
        </div>
    )
}




export const AnalyticsCardsLoading = () => {
    return (
        <div className="flex gap-4 w-full">
            {
                Array.from({ length: 4 }).map((_, index) => (<Skeleton key={index} className="h-24 w-full rounded-md" />
                ))}

        </div>
    );
};

interface AnalyticsCardsErrorProps {
    error?: string | null;
}

export const AnalyticsCardsError = ({ error }: AnalyticsCardsErrorProps) => {
    return (
        <div className="flex gap-4 w-full">
            <p className="text-destructive">
                {error || "We encountered an error while loading the analytics cards. Please try again later."}
            </p>
            {
                Array.from({ length: 4 }).map(() => (
                    <div key={Math.random()} className="h-24 w-full rounded-md flex items-center justify-center"/>

                ))}

        </div>
    );

}