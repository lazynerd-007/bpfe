'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Plus, CreditCard, Smartphone } from 'lucide-react';
import { useCreateTransaction } from './hooks';
import { CreateTransactionDto } from '@/sdk/types';
import { MerchantSelect } from '@/components/dropdowns';

const createTransactionSchema = z.object({
  merchantId: z.string().uuid('Merchant ID must be a valid UUID'),
  processor: z.enum(['MTN', 'AIRTEL', 'TIGO', 'VODAFONE', 'ORANGE']),
  surchargeOn: z.enum(['CUSTOMER', 'MERCHANT', 'CUSTOMER_AND_MERCHANT', 'PARENT']),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().optional(),
  customerPhone: z.string().min(10, 'Please enter a valid phone number'),
  currency: z.string().default('GHS'),
  transactionRef: z.string().min(1, 'Transaction reference is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['MOBILE_MONEY', 'CARD']),
});

type CreateTransactionFormData = z.infer<typeof createTransactionSchema>;

const processorOptions = [
  { value: 'MTN' as const, label: 'MTN Mobile Money', color: 'bg-yellow-500' },
  { value: 'AIRTEL' as const, label: 'Airtel Money', color: 'bg-red-500' },
  { value: 'TIGO' as const, label: 'Tigo Cash', color: 'bg-blue-500' },
  { value: 'VODAFONE' as const, label: 'Vodafone Cash', color: 'bg-purple-500' },
  { value: 'ORANGE' as const, label: 'Orange Money', color: 'bg-orange-500' },
];

const surchargeOptions = [
  { value: 'CUSTOMER', label: 'Customer' },
  { value: 'MERCHANT', label: 'Merchant' },
  { value: 'CUSTOMER_AND_MERCHANT', label: 'Customer and Merchant' },
  { value: 'PARENT', label: 'Parent' },
];

interface CreateTransactionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateTransactionForm({ onSuccess, onCancel }: CreateTransactionFormProps) {
  const { create, loading, error } = useCreateTransaction();
  const [transactionType, setTransactionType] = useState<'MOBILE_MONEY' | 'CARD'>('MOBILE_MONEY');

  const form = useForm({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      merchantId: '',
      processor: 'MTN' as const,
      surchargeOn: 'CUSTOMER' as const,
      amount: 0,
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      currency: 'GHS',
      transactionRef: `TXN${Date.now()}`,
      description: '',
      type: 'MOBILE_MONEY' as const,
    },
  });

  // Generate a new transaction reference when form loads
  React.useEffect(() => {
    form.setValue('transactionRef', `TXN${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  }, [form]);

  const onSubmit = async (data: CreateTransactionFormData) => {
    try {
      const transactionData: CreateTransactionDto = {
        merchantId: data.merchantId,
        processor: data.processor,
        type: data.type,
        surchargeOn: data.surchargeOn,
        amount: data.amount,
        customer: {
          name: data.customerName,
          email: data.customerEmail || undefined,
          mobileNumber: data.customerPhone,
          amount: data.amount,
        },
        currency: data.currency,
        transactionRef: data.transactionRef,
        description: data.description,
      };

      await create(transactionData);
      onSuccess?.();
      form.reset();
      // Generate new transaction ref for next transaction
      form.setValue('transactionRef', `TXN${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    } catch (error) {
      console.error('Transaction creation failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Create New Transaction</span>
        </CardTitle>
        <CardDescription>
          Process a new mobile money or card payment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Transaction Type */}
          <div className="space-y-3">
            <Label>Transaction Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={transactionType === 'MOBILE_MONEY' ? 'default' : 'outline'}
                className="h-16 flex-col space-y-2"
                onClick={() => {
                  setTransactionType('MOBILE_MONEY');
                  form.setValue('type', 'MOBILE_MONEY');
                }}
              >
                <Smartphone className="h-6 w-6" />
                <span>Mobile Money</span>
              </Button>
              <Button
                type="button"
                variant={transactionType === 'CARD' ? 'default' : 'outline'}
                className="h-16 flex-col space-y-2"
                onClick={() => {
                  setTransactionType('CARD');
                  form.setValue('type', 'CARD');
                }}
              >
                <CreditCard className="h-6 w-6" />
                <span>Card Payment</span>
              </Button>
            </div>
          </div>

          {/* Merchant and Surcharge */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="merchantId">Merchant</Label>
              <MerchantSelect
                value={form.watch('merchantId')}
                onValueChange={(value) => form.setValue('merchantId', value)}
                disabled={loading}
                placeholder="Select merchant..."
                className="w-full"
              />
              {form.formState.errors.merchantId && (
                <p className="text-sm text-red-500">{form.formState.errors.merchantId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Surcharge On</Label>
              <Select
                onValueChange={(value) => form.setValue('surchargeOn', value as 'CUSTOMER' | 'MERCHANT' | 'CUSTOMER_AND_MERCHANT' | 'PARENT')}
                defaultValue="CUSTOMER"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select surcharge target" />
                </SelectTrigger>
                <SelectContent>
                  {surchargeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.surchargeOn && (
                <p className="text-sm text-red-500">{form.formState.errors.surchargeOn.message}</p>
              )}
            </div>
          </div>

          {/* Amount and Transaction Ref */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (GHS)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...form.register('amount', { valueAsNumber: true })}
                disabled={loading}
              />
              {form.formState.errors.amount && (
                <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactionRef">Transaction Reference</Label>
              <Input
                id="transactionRef"
                placeholder="TXN123456789"
                {...form.register('transactionRef')}
                disabled={loading}
              />
              {form.formState.errors.transactionRef && (
                <p className="text-sm text-red-500">{form.formState.errors.transactionRef.message}</p>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                placeholder="Enter customer name"
                {...form.register('customerName')}
                disabled={loading}
              />
              {form.formState.errors.customerName && (
                <p className="text-sm text-red-500">{form.formState.errors.customerName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone Number</Label>
              <Input
                id="customerPhone"
                placeholder="+233241234567"
                {...form.register('customerPhone')}
                disabled={loading}
              />
              {form.formState.errors.customerPhone && (
                <p className="text-sm text-red-500">{form.formState.errors.customerPhone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerEmail">Customer Email (Optional)</Label>
            <Input
              id="customerEmail"
              type="email"
              placeholder="customer@example.com"
              {...form.register('customerEmail')}
              disabled={loading}
            />
            {form.formState.errors.customerEmail && (
              <p className="text-sm text-red-500">{form.formState.errors.customerEmail.message}</p>
            )}
          </div>

          {/* Processor Selection (for mobile money) */}
          {transactionType === 'MOBILE_MONEY' && (
            <div className="space-y-2">
              <Label>Mobile Money Provider</Label>
              <Select
                onValueChange={(value) => form.setValue('processor', value as 'MTN' | 'AIRTEL' | 'TIGO' | 'VODAFONE' | 'ORANGE')}
                defaultValue="MTN"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {processorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${option.color}`} />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Payment description..."
              {...form.register('description')}
              disabled={loading}
              rows={3}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
            )}
          </div>

          {/* Transaction Summary */}
          <Card className="bg-gray-50">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Transaction Type:</span>
                  <Badge variant="outline">
                    {transactionType === 'MOBILE_MONEY' ? 'Mobile Money' : 'Card Payment'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">
                    GHS {form.watch('amount')?.toFixed(2) || '0.00'}
                  </span>
                </div>
                {transactionType === 'MOBILE_MONEY' && (
                  <div className="flex justify-between">
                    <span>Provider:</span>
                    <span className="font-medium">{form.watch('processor')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Surcharge On:</span>
                  <span className="font-medium">{form.watch('surchargeOn')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Reference:</span>
                  <span className="font-medium text-xs">{form.watch('transactionRef')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Processing...' : 'Create Transaction'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}