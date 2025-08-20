"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useAtomValue, useSetAtom } from 'jotai'
import { UserRoleEnum } from '@/sdk/types'

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
import { paginatedTransactionsAtom, fetchPaginatedTransactionsAtom, transactionsLoadingAtom } from "./atoms"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from '@/features/auth/hooks'
import { getProcessorConfig, PROCESSOR_MAP } from "./constants"

const chartConfig = Object.keys(PROCESSOR_MAP).reduce((config, processor) => {
    const processorConfig = PROCESSOR_MAP[processor]
    config[processor] = {
        label: processorConfig.title,
        color: processorConfig.color,
    }
    return config
}, {} as Record<string, { label: string; color: string }>) satisfies ChartConfig

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency: 'GHS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

export function TransactionProcessorBarChart() {
    const { user } = useAuth()
    const paginatedTransactions = useAtomValue(paginatedTransactionsAtom)
    const loading = useAtomValue(transactionsLoadingAtom)
    const fetchTransactions = useSetAtom(fetchPaginatedTransactionsAtom)

    // Fetch larger dataset for aggregation (first 100 transactions)
    React.useEffect(() => {
        fetchTransactions({ 
            page: 1, 
            perPage: 100
        })
    }, [fetchTransactions])

    const chartData = React.useMemo(() => {
        if (!paginatedTransactions?.data || paginatedTransactions.data.length === 0) {
            return []
        }

        // Aggregate transactions by processor
        const processorStats = paginatedTransactions.data.reduce((acc, transaction) => {
            const processor = transaction.processor || 'UNKNOWN'
            const amount = parseFloat(transaction.amount?.toString() || '0')
            
            if (!acc[processor]) {
                acc[processor] = {
                    processor,
                    count: 0,
                    totalAmount: 0,
                    successfulCount: 0,
                    failedCount: 0,
                }
            }

            acc[processor].count += 1
            acc[processor].totalAmount += Math.abs(amount)
            
            if (transaction.status === 'SUCCESSFUL') {
                acc[processor].successfulCount += 1
            } else if (transaction.status === 'FAILED') {
                acc[processor].failedCount += 1
            }

            return acc
        }, {} as Record<string, {
            processor: string
            count: number
            totalAmount: number
            successfulCount: number
            failedCount: number
        }>)

        // Convert to array and sort by transaction count
        return Object.values(processorStats)
            .sort((a, b) => b.count - a.count)
            .map(stat => {
                const processorConfig = getProcessorConfig(stat.processor)
                return {
                    processor: stat.processor,
                    displayName: processorConfig.title,
                    count: stat.count,
                    amount: stat.totalAmount,
                    successRate: stat.count > 0 ? ((stat.successfulCount / stat.count) * 100).toFixed(1) : '0',
                    fill: processorConfig.color,
                    icon: processorConfig.icon,
                }
            })
    }, [paginatedTransactions?.data])

    const totalTransactions = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.count, 0)
    }, [chartData])

    const topProcessor = React.useMemo(() => {
        return chartData.length > 0 ? chartData[0] : null
    }, [chartData])

    if (loading) {
        return (
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <Skeleton className="h-6 w-48 rounded" />
                    <Skeleton className="h-4 w-32 rounded" />
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <Skeleton className="aspect-auto h-[250px] w-full rounded" />
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                    <Skeleton className="h-4 w-40 rounded" />
                    <Skeleton className="h-4 w-48 rounded" />
                </CardFooter>
            </Card>
        )
    }

    if (chartData.length === 0) {
        return (
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Transactions by Processor</CardTitle>
                    <CardDescription>Payment processor breakdown</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <div className="aspect-auto h-[250px] flex items-center justify-center text-muted-foreground">
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
                <CardTitle>Transactions by Processor</CardTitle>
                <CardDescription>Payment processor breakdown</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="processor"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            fontSize={12}
                            tickFormatter={(value) => {
                                const config = getProcessorConfig(value)
                                return config.title.split(' ')[0] // Show first word only for space
                            }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            fontSize={12}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent 
                                    hideLabel
                                    formatter={(value, name, props) => {
                                        const data = props.payload
                                        return [
                                            <>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        {data.icon}
                                                        <span className="font-medium">{data.displayName}</span>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {data.count} transactions
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {formatCurrency(data.amount)} total
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {data.successRate}% success rate
                                                    </div>
                                                </div>
                                            </>,
                                            ""
                                        ]
                                    }}
                                />
                            }
                        />
                        <Bar 
                            dataKey="count" 
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    {topProcessor && (
                        <>
                            <span className="flex items-center gap-1">
                                {topProcessor.icon}
                                {topProcessor.displayName}
                            </span>
                            leads with {topProcessor.count} transactions <TrendingUp className="h-4 w-4" />
                        </>
                    )}
                </div>
                <div className="text-muted-foreground leading-none text-center">
                    {totalTransactions.toLocaleString()} total transactions across {chartData.length} processors
                </div>
            </CardFooter>
        </Card>
    )
}
