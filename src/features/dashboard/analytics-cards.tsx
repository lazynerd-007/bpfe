"use client"

import * as React from "react"
import { useAtomValue } from 'jotai'
import { IconTrendingUp, IconTrendingDown, IconArrowUpRight, IconArrowDownLeft, IconX, IconCheck } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { dashboardAnalyticsAtom, dashboardLoadingAtom } from "./atoms"
import { formatCurrency } from "@/lib/utils"

export function AnalyticsCards() {
  const analytics = useAtomValue(dashboardAnalyticsAtom)
  const loading = useAtomValue(dashboardLoadingAtom)

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="@container/card">
            <CardHeader>
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-8 w-32 rounded" />
              <CardAction>
                <Skeleton className="h-6 w-16 rounded" />
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <Skeleton className="h-4 w-40 rounded" />
              <Skeleton className="h-3 w-32 rounded" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="@container/card">
            <CardHeader>
              <CardDescription>No Data</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                --
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="text-muted-foreground">
                Analytics data will appear once transactions are processed
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  const totalSuccessfulAmount = analytics.successTotalMoneyInAmount + analytics.successTotalMoneyOutAmount
  const totalSuccessfulCount = analytics.successTotalMoneyInCount + analytics.successTotalMoneyOutCount
  const totalFailedAmount = analytics.failedTotalAmount
  const totalFailedCount = analytics.failedTotalCount
  const totalTransactions = totalSuccessfulCount + totalFailedCount
  const successRate = totalTransactions > 0 ? (totalSuccessfulCount / totalTransactions) * 100 : 0

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Revenue */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(totalSuccessfulAmount)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="h-3 w-3" />
              {totalSuccessfulCount} transactions
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Successful transactions <IconCheck className="size-4 text-green-600" />
          </div>
          <div className="text-muted-foreground">
            Money In: {formatCurrency(analytics.successTotalMoneyInAmount)} ({analytics.successTotalMoneyInCount})
          </div>
          <div className="text-muted-foreground">
            Money Out: {formatCurrency(analytics.successTotalMoneyOutAmount)} ({analytics.successTotalMoneyOutCount})
          </div>
        </CardFooter>
      </Card>

      {/* Money In */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Money In</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(analytics.successTotalMoneyInAmount)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconArrowUpRight className="h-3 w-3" />
              {analytics.successTotalMoneyInCount}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Incoming payments <IconArrowUpRight className="size-4 text-green-600" />
          </div>
          <div className="text-muted-foreground">
            {analytics.successTotalMoneyInCount} successful transactions
          </div>
        </CardFooter>
      </Card>

      {/* Money Out */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Money Out</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(analytics.successTotalMoneyOutAmount)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconArrowDownLeft className="h-3 w-3" />
              {analytics.successTotalMoneyOutCount}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Outgoing payments <IconArrowDownLeft className="size-4 text-blue-600" />
          </div>
          <div className="text-muted-foreground">
            {analytics.successTotalMoneyOutCount} successful transactions
          </div>
        </CardFooter>
      </Card>

      {/* Success Rate */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Success Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {successRate.toFixed(1)}%
          </CardTitle>
          <CardAction>
            <Badge variant={successRate >= 90 ? "default" : successRate >= 70 ? "secondary" : "destructive"}>
              {successRate >= 90 ? (
                <IconTrendingUp className="h-3 w-3" />
              ) : (
                <IconTrendingDown className="h-3 w-3" />
              )}
              {totalTransactions} total
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {successRate >= 90 ? (
              <>Excellent performance <IconCheck className="size-4 text-green-600" /></>
            ) : successRate >= 70 ? (
              <>Good performance <IconTrendingUp className="size-4 text-yellow-600" /></>
            ) : (
              <>Needs attention <IconX className="size-4 text-red-600" /></>
            )}
          </div>
          <div className="text-muted-foreground">
            {totalFailedCount} failed • {formatCurrency(totalFailedAmount)} lost
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}