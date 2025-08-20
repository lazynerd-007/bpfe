import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useEffect, useMemo } from 'react';
import { UserRoleEnum } from '@/sdk/types';
import {
  dashboardAnalyticsAtom,
  walletBalanceAtom,
  recentTransactionsAtom,
  dashboardLoadingAtom,
  dashboardErrorAtom,
  analyticsDateRangeAtom,
  refreshDashboardAtom,
} from './atoms';
import { useAuth } from '@/features/auth/hooks';
import { DollarSign, XCircle, Wallet } from 'lucide-react';

export function useDashboard() {
  const analytics = useAtomValue(dashboardAnalyticsAtom);
  const balance = useAtomValue(walletBalanceAtom);
  const transactions = useAtomValue(recentTransactionsAtom);
  const loading = useAtomValue(dashboardLoadingAtom);
  const error = useAtomValue(dashboardErrorAtom);
  const [dateRange, setDateRange] = useAtom(analyticsDateRangeAtom);
  const [, refreshDashboard] = useAtom(refreshDashboardAtom);
  const { user } = useAuth();

  const refresh = useCallback(async () => {
    const merchantId = user?.role === UserRoleEnum.MERCHANT || user?.role === UserRoleEnum.SUB_MERCHANT 
      ? user.merchantId 
      : undefined;
    await refreshDashboard({ merchantId });
  }, [refreshDashboard, user]);

  const updateDateRange = useCallback(
    (startDate: string, endDate: string) => {
      setDateRange({ startDate, endDate });
    },
    [setDateRange]
  );



  useEffect(() => {
    if (user) {
      void refresh();
    }
  }, [user, refresh, dateRange]);


  const analyticsCards = useMemo(() => {
    if (!analytics) {
      return [];
    }

    const data = analytics;
    const isMerchant = user?.role === UserRoleEnum.MERCHANT || user?.role === UserRoleEnum.SUB_MERCHANT;
    const isPartner = user?.role === UserRoleEnum.PARTNER_BANK;
    const isAdmin = user?.role === UserRoleEnum.ADMIN;

    const cards = [];

    // Collections (Money In) - All roles
    cards.push({
      id: 'collections',
      title: 'Collections',
      value: new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
      }).format(data.successTotalMoneyInAmount || data.totalAmount || 0),
      count: data.successTotalMoneyInCount || data.successfulTransactions || 0,
      description: `${(data.successTotalMoneyInCount || data.successfulTransactions || 0).toLocaleString()} successful collections`,
      Icon: DollarSign,
      trend: (data.successTotalMoneyInAmount || data.totalAmount || 0) > 0 ? "up" as const : "neutral" as const,
      color: "text-green-600",
      bgColor: "bg-green-50",
    });

    // Failed Transactions - All roles
    cards.push({
      id: 'failed',
      title: 'Failed Transactions',
      value: new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
      }).format(data.failedTotalAmount || 0),
      count: data.failedTotalCount || data.failedTransactions || 0,
      description: `${(data.failedTotalCount || data.failedTransactions || 0).toLocaleString()} failed transactions`,
      Icon: XCircle,
      trend: (data.failedTotalCount || data.failedTransactions || 0) === 0 ? "up" as const : "down" as const,
      color: "text-red-600",
      bgColor: "bg-red-50",
    });

    // Wallet Balance - Merchants and Sub-Merchants
    if (isMerchant) {
      cards.push({
        id: 'wallet',
        title: 'Wallet Balance',
        value: new Intl.NumberFormat("en-GH", {
          style: "currency",
          currency: "GHS",
        }).format(balance?.balance || 0),
        count: null,
        description: 'Available balance',
        Icon: Wallet,
        trend: "neutral" as const,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        cta: {
          ctaRoute: '/merchants/cashout',
          ctaTitle: 'Make Payout',
        },
      });
    }

    // Payouts (Money Out) - All roles (4th card for everyone)
    cards.push({
      id: 'payouts',
      title: 'Payouts',
      value: new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
      }).format(data.successTotalMoneyOutAmount || 0),
      count: data.successTotalMoneyOutCount || 0,
      description: `${(data.successTotalMoneyOutCount || 0).toLocaleString()} successful payouts`,
      Icon: DollarSign,
      trend: (data.successTotalMoneyOutAmount || 0) > 0 ? "up" as const : "neutral" as const,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    });

    // For Partner Banks, add a System Overview card instead of Wallet Balance
    if (isPartner && !isMerchant) {
      cards.push({
        id: 'system-overview',
        title: 'System Overview',
        value: new Intl.NumberFormat("en-GH", {
          style: "currency",
          currency: "GHS",
        }).format((data.successTotalMoneyInAmount || 0) + (data.successTotalMoneyOutAmount || 0)),
        count: (data.successTotalMoneyInCount || 0) + (data.successTotalMoneyOutCount || 0),
        description: 'Total system activity',
        Icon: DollarSign,
        trend: "up" as const,
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
      });
    }

    // For Admins, add a System Health card instead of Wallet Balance  
    if (isAdmin && !isMerchant) {
      cards.push({
        id: 'system-health',
        title: 'System Health',
        value: new Intl.NumberFormat("en-GH", {
          style: "currency",
          currency: "GHS",
        }).format((data.successTotalMoneyInAmount || 0) + (data.successTotalMoneyOutAmount || 0)),
        count: (data.successTotalMoneyInCount || 0) + (data.successTotalMoneyOutCount || 0),
        description: 'Total platform activity',
        Icon: DollarSign,
        trend: "up" as const,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
      });
    }

    return cards;
  }, [analytics, balance, user?.role, loading, error]);

  const roleSpecificMetrics = useMemo(() => {
    if (!analytics || !user) return null;

    const baseMetrics = {
      totalTransactions: analytics.totalTransactions,
      totalAmount: analytics.totalAmount,
      successfulTransactions: analytics.successfulTransactions,
      failedTransactions: analytics.failedTransactions,
      pendingTransactions: analytics.pendingTransactions,
    };

    switch (user.role) {
      case UserRoleEnum.ADMIN:
        return {
          ...baseMetrics,
          title: 'System Overview',
          showMerchantBreakdown: true,
          showPartnerBankBreakdown: true,
        };
      
      case UserRoleEnum.PARTNER_BANK:
        return {
          ...baseMetrics,
          title: 'Partner Bank Dashboard',
          showMerchantBreakdown: true,
          showPartnerBankBreakdown: false,
        };
      
      case UserRoleEnum.MERCHANT:
        return {
          ...baseMetrics,
          title: 'Merchant Dashboard',
          showWalletBalance: true,
          showApiKeyManagement: true,
        };
      
      case UserRoleEnum.SUB_MERCHANT:
        return {
          ...baseMetrics,
          title: 'Sub-Merchant Dashboard',
          showWalletBalance: true,
        };
      
      default:
        return baseMetrics;
    }
  }, [analytics, user]);

  return {
    analytics,
    balance,
    transactions,
    loading,
    error,
    dateRange,
    user,
    
    // Processed data
    analyticsCards,
    roleSpecificMetrics,
    
    // Actions
    refresh,
    updateDateRange,
  };
}