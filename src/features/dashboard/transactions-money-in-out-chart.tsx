"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
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

const chartConfig = {
    moneyIn: {
        label: "Money In",
        color: "hsl(var(--chart-1))",
    },
    moneyOut: {
        label: "Money Out",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency: 'GHS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

export function TransactionMoneyInOutChart() {
    const analytics = useAtomValue(dashboardAnalyticsAtom)
    const loading = useAtomValue(dashboardLoadingAtom)

    if (loading) {
        return (
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <Skeleton className="h-6 w-48 rounded" />
                    <Skeleton className="h-4 w-32 rounded" />
                </CardHeader>
                <CardContent className="flex flex-1 items-center pb-0">
                    <Skeleton className="mx-auto aspect-square w-full max-w-[250px] rounded-full" />
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                    <Skeleton className="h-4 w-40 rounded" />
                    <Skeleton className="h-4 w-48 rounded" />
                </CardFooter>
            </Card>
        )
    }

    const moneyInAmount = parseFloat(analytics?.successTotalMoneyInAmount?.toString() || '0')
    const moneyOutAmount = parseFloat(analytics?.successTotalMoneyOutAmount?.toString() || '0')
    const moneyInCount = parseInt(analytics?.successTotalMoneyInCount?.toString() || '0')
    const moneyOutCount = parseInt(analytics?.successTotalMoneyOutCount?.toString() || '0')
    
    const totalAmount = moneyInAmount + moneyOutAmount
    const totalTransactions = moneyInCount + moneyOutCount

    const chartData = [{ 
        period: "current", 
        moneyIn: moneyInAmount, 
        moneyOut: moneyOutAmount 
    }]

    // Calculate trend (for now using simple comparison)
    const netFlow = moneyInAmount - moneyOutAmount
    const isPositive = netFlow > 0
    const isNeutral = netFlow === 0
    
    // Calculate percentage of money in vs out
    const moneyInPercentage = totalAmount > 0 ? ((moneyInAmount / totalAmount) * 100).toFixed(1) : '0'
    const moneyOutPercentage = totalAmount > 0 ? ((moneyOutAmount / totalAmount) * 100).toFixed(1) : '0'

    const getTrendIcon = () => {
        if (isNeutral) return <Minus className="h-4 w-4" />
        return isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
    }

    const getTrendText = () => {
        if (isNeutral) return "Balanced money flow"
        if (isPositive) {
            return `Net positive flow of ${formatCurrency(netFlow)}`
        } else {
            return `Net negative flow of ${formatCurrency(Math.abs(netFlow))}`
        }
    }

    const getTrendColor = () => {
        if (isNeutral) return "text-muted-foreground"
        return isPositive ? "text-green-600" : "text-red-600"
    }

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Money In vs Money Out</CardTitle>
                <CardDescription>Transaction flow comparison</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 items-center pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-[250px]"
                >
                    <RadialBarChart
                        data={chartData}
                        endAngle={180}
                        innerRadius={80}
                        outerRadius={130}
                    >
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent 
                                    hideLabel 
                                    formatter={(value: unknown, name: unknown) => [
                                        formatCurrency(Number(value)),
                                        String(name) === 'moneyIn' ? 'Money In' : 'Money Out'
                                    ]}
                                />
                            }
                        />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) - 16}
                                                    className="fill-foreground text-2xl font-bold"
                                                >
                                                    {totalTransactions.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 4}
                                                    className="fill-muted-foreground"
                                                >
                                                    Transactions
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                        <RadialBar
                            dataKey="moneyIn"
                            stackId="a"
                            cornerRadius={5}
                            fill="var(--color-moneyIn)"
                            className="stroke-transparent stroke-2"
                        />
                        <RadialBar
                            dataKey="moneyOut"
                            fill="var(--color-moneyOut)"
                            stackId="a"
                            cornerRadius={5}
                            className="stroke-transparent stroke-2"
                        />
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className={`flex items-center gap-2 leading-none font-medium ${getTrendColor()}`}>
                    {getTrendText()} {getTrendIcon()}
                </div>
                <div className="text-muted-foreground leading-none text-center">
                    Money In: {moneyInPercentage}% ({moneyInCount} transactions) • 
                    Money Out: {moneyOutPercentage}% ({moneyOutCount} transactions)
                </div>
            </CardFooter>
        </Card>
    )
}