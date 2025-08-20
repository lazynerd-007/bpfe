'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Plus, Minus, RefreshCw } from 'lucide-react';
import { WalletBalance } from '@/sdk/types';

interface WalletBalanceCardProps {
  balance: WalletBalance | null;
  loading?: boolean;
  onRefresh?: () => void;
  onFund?: () => void;
  onCashout?: () => void;
}

export function WalletBalanceCard({ 
  balance, 
  loading, 
  onRefresh, 
  onFund, 
  onCashout 
}: WalletBalanceCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-12 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: balance?.currency || 'GHS',
    }).format(amount);
  };

  const getBalanceColor = (amount: number) => {
    if (amount < 100) return 'text-red-600';
    if (amount < 1000) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5" />
            <span>Wallet Balance</span>
          </CardTitle>
          <CardDescription>
            Current available balance
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {balance ? (
          <>
            <div className="space-y-2 mb-4">
              <div className={`text-3xl font-bold ${getBalanceColor(balance.balance)}`}>
                {formatAmount(balance.balance)}
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {balance.currency}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Last updated: {new Date(balance.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button size="sm" onClick={onFund}>
                <Plus className="h-4 w-4 mr-1" />
                Fund
              </Button>
              <Button variant="outline" size="sm" onClick={onCashout}>
                <Minus className="h-4 w-4 mr-1" />
                Cashout
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            Unable to load wallet balance
          </div>
        )}
      </CardContent>
    </Card>
  );
}