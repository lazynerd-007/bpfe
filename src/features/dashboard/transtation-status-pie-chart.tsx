"use client"

import * as React from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import { useAtomValue } from 'jotai'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { dashboardAnalyticsAtom, dashboardLoadingAtom } from "./atoms"
import { Skeleton } from "@/components/ui/skeleton"
import { getTransactionStatusConfig, TRANSACTION_STATUS_MAP } from "./constants"

const chartConfig = Object.keys(TRANSACTION_STATUS_MAP).reduce((config, status) => {
    const statusConfig = TRANSACTION_STATUS_MAP[status]
    config[status.toLowerCase()] = {
        label: statusConfig.title,
        color: statusConfig.color,
    }
    return config
}, {
    transactions: {
        label: "Transactions",
    }
} as Record<string, { label: string; color?: string }>) satisfies ChartConfig

export function TransactionStatusPieChart() {
    const analytics = useAtomValue(dashboardAnalyticsAtom)
    const loading = useAtomValue(dashboardLoadingAtom)

    const chartData = React.useMemo(() => {
        if (!analytics) return []

        const successfulCount = (parseInt(analytics.successTotalMoneyInCount?.toString() || '0') + 
                               parseInt(analytics.successTotalMoneyOutCount?.toString() || '0'))
        const failedCount = parseInt(analytics.failedTotalCount?.toString() || '0')
        const pendingCount = parseInt(analytics.pendingTransactions?.toString() || '0')

        const statuses = [
            { key: "successful", count: successfulCount },
            { key: "failed", count: failedCount },
            { key: "pending", count: pendingCount },
        ]

        return statuses
            .filter(item => item.count > 0)
            .map(item => {
                const statusConfig = getTransactionStatusConfig(item.key)
                return {
                    status: item.key,
                    displayName: statusConfig.title,
                    count: item.count,
                    fill: statusConfig.color,
                    icon: statusConfig.icon,
                }
            })
    }, [analytics])

    const totalTransactions = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.count, 0)
    }, [chartData])

    // Calculate success rate
    const successfulCount = chartData.find(item => item.status === 'successful')?.count || 0
    const successRate = totalTransactions > 0 ? ((successfulCount / totalTransactions) * 100).toFixed(1) : '0'
    
    // Determine trend based on success rate
    const getSuccessRateTrend = () => {
        const rate = parseFloat(successRate)
        if (rate >= 95) return { icon: <TrendingUp className="h-4 w-4" />, text: "Excellent success rate", color: "text-green-600" }
        if (rate >= 80) return { icon: <Minus className="h-4 w-4" />, text: "Good success rate", color: "text-yellow-600" }
        return { icon: <TrendingDown className="h-4 w-4" />, text: "Needs improvement", color: "text-red-600" }
    }

    const trend = getSuccessRateTrend()

    if (loading) {
        return (
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <Skeleton className="h-6 w-48 rounded" />
                    <Skeleton className="h-4 w-32 rounded" />
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <Skeleton className="mx-auto aspect-square max-h-[250px] rounded-full" />
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                    <Skeleton className="h-4 w-40 rounded" />
                    <Skeleton className="h-4 w-48 rounded" />
                </CardFooter>
            </Card>
        )
    }

    if (totalTransactions === 0) {
        return (
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Transaction Status</CardTitle>
                    <CardDescription>Success vs failure breakdown</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <div className="mx-auto aspect-square max-h-[250px] flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                            <p>No transaction data</p>
                            <p className="text-sm mt-2">Data will appear once transactions are processed</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                    <div className="text-muted-foreground text-center">
                        No transactions to display
                    </div>
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Transaction Status</CardTitle>
                <CardDescription>Success vs failure breakdown</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent 
                                    hideLabel 
                                    formatter={(value: unknown, name: unknown, props: any) => {
                                        const data = props.payload
                                        return [
                                            <>
                                                <div className="flex items-center gap-2">
                                                    {data.icon}
                                                    <span className="font-medium">{data.displayName}</span>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {Number(value).toLocaleString()} transactions
                                                </div>
                                            </>,
                                            ""
                                        ]
                                    }}
                                />
                            }
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="status"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {successRate}%
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Success Rate
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className={`flex items-center gap-2 leading-none font-medium ${trend.color}`}>
                    {trend.text} ({successRate}% success rate) {trend.icon}
                </div>
                <div className="text-muted-foreground leading-none text-center">
                    {totalTransactions.toLocaleString()} total transactions
                    {chartData.map((item, index) => (
                        <span key={item.status} className="flex items-center gap-1">
                            {index > 0 ? ' • ' : ' • '}
                            {item.icon}
                            {item.displayName}: {item.count}
                        </span>
                    ))}
                </div>
            </CardFooter>
        </Card>
    )
}