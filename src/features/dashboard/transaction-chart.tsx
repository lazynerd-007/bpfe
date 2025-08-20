"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { UserRoleEnum } from '@/sdk/types'

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { dashboardAnalyticsAtom, fetchDashboardAnalyticsAtom, dashboardLoadingAtom } from "./atoms"
import { useAuth } from '@/features/auth/hooks'
import {Skeleton} from "@/components/ui/skeleton";

const chartConfig = {
  transactions: {
    label: "Transactions",
  },
  successful: {
    label: "Successful",
    color: "hsl(var(--chart-1))",
  },
  failed: {
    label: "Failed", 
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export const TransactionChart = React.memo(() => {
  // Helper functions to format time scale data
  const formatHourlyData = React.useCallback((timeScaleData: any[]) => {
    return timeScaleData.map(item => ({
      time: `${item.transactionHour}:00`,
      label: `${item.transactionHour}:00`,
      successful: parseFloat(item.successfulAmount) || 0,
      failed: parseFloat(item.failedAmount) || 0,
    }))
  }, [])

  const formatWeeklyData = React.useCallback((timeScaleData: any[]) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return timeScaleData.map(item => ({
      time: item.dayOfWeek,
      label: days[parseInt(item.dayOfWeek)] || 'Unknown',
      successful: parseFloat(item.successfulAmount) || 0,
      failed: parseFloat(item.failedAmount) || 0,
    }))
  }, [])

  const formatMonthlyData = React.useCallback((timeScaleData: any[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return timeScaleData.map(item => ({
      time: item.monthOfYear,
      label: months[parseInt(item.monthOfYear) - 1] || 'Unknown',
      successful: parseFloat(item.successfulAmount) || 0,
      failed: parseFloat(item.failedAmount) || 0,
    }))
  }, [])

  const isMobile = useIsMobile()
  const { user } = useAuth()
  const [timeRange, setTimeRange] = React.useState<'daily' | 'weekly' | 'monthly'>('daily')
  
  const analytics = useAtomValue(dashboardAnalyticsAtom)
  const loading = useAtomValue(dashboardLoadingAtom)
  const fetchAnalytics = useSetAtom(fetchDashboardAnalyticsAtom)

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('daily')
    }
  }, [isMobile])

  // Fetch analytics data when timeRange changes
  React.useEffect(() => {
    fetchAnalytics({ range: timeRange })
  }, [fetchAnalytics, timeRange])

  // Process time scale data based on current range
  const chartData = React.useMemo(() => {
    if (!analytics?.timeScaleData || analytics.timeScaleData.length === 0) {
      return []
    }

    switch (timeRange) {
      case 'daily':
        return formatHourlyData(analytics.timeScaleData)
      case 'weekly':
        return formatWeeklyData(analytics.timeScaleData)
      case 'monthly':
        return formatMonthlyData(analytics.timeScaleData)
      default:
        return []
    }
  }, [analytics?.timeScaleData, timeRange])

  const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
    }).format(value)
  }

  const getTitle = () => {
    switch (timeRange) {
      case 'daily':
        return 'Today\'s Transaction Trends'
      case 'weekly':
        return 'Weekly Transaction Trends'
      case 'monthly':
        return 'Monthly Transaction Trends'
      default:
        return 'Transaction Trends'
    }
  }

  const getDescription = () => {
    switch (timeRange) {
      case 'daily':
        return 'Hourly breakdown for today (8 AM - 11 PM)'
      case 'weekly':
        return 'Daily breakdown for this week'
      case 'monthly':
        return 'Monthly breakdown for this year'
      default:
        return 'Transaction analytics'
    }
  }

  if (loading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <Skeleton className="h-6 rounded w-64 animate-pulse"></Skeleton>
          <Skeleton className="h-4 rounded w-48 animate-pulse"></Skeleton>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <Skeleton className="aspect-auto h-[250px] w-full rounded animate-pulse"></Skeleton>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{getTitle()}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {getDescription()}
          </span>
          <span className="@[540px]/card:hidden">
            {timeRange === 'daily' ? 'Today' : timeRange === 'weekly' ? 'This week' : 'This year'}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => value && setTimeRange(value as any)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
            <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
            <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select time range"
            >
              <SelectValue placeholder="Daily" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="daily" className="rounded-lg">
                Daily
              </SelectItem>
              <SelectItem value="weekly" className="rounded-lg">
                Weekly
              </SelectItem>
              <SelectItem value="monthly" className="rounded-lg">
                Monthly
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {chartData.length === 0 ? (
          <div className="aspect-auto h-[250px] w-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p>No transaction data available</p>
              <p className="text-sm mt-2">Data will appear once transactions are processed</p>
            </div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillSuccessful" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-successful)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-successful)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillFailed" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-failed)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-failed)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      switch (timeRange) {
                        case 'daily':
                          return `${value}`
                        case 'weekly':  
                          return `${value}`
                        case 'monthly':
                          return `${value}`
                        default:
                          return value
                      }
                    }}
                    formatter={(value: unknown, name: unknown) => [
                      formatTooltipValue(Number(value)),
                      String(name) === 'successful' ? 'Successful' : 'Failed'
                    ]}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="failed"
                type="natural"
                fill="url(#fillFailed)"
                stroke="var(--color-failed)"
                stackId="a"
              />
              <Area
                dataKey="successful"
                type="natural"
                fill="url(#fillSuccessful)"
                stroke="var(--color-successful)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
});