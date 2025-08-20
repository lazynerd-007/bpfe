'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { IconReceipt, IconArrowLeft, IconArrowRight, IconCalendarEvent, IconPercentage, IconBuildingBank, IconFileInvoice, IconCash, IconCoin } from '@tabler/icons-react';
import { PartnerBankSelect } from '@/components/dropdowns';
import { ROUTES } from '@/lib/constants';
import { 
  settlementDetailsSchema, 
  type SettlementDetailsFormData,
  settlementFrequencies,
  surchargeOptions,
  settlementAccountTypes
} from '../schema';
import { 
  settlementDetailsAtom, 
  currentStepAtom, 
  markStepCompletedAtom,
  canNavigateToStepAtom,
  merchantDetailsAtom
} from '../store';

export function SettlementDetailsForm() {
  const router = useRouter();
  const [settlementDetails, setSettlementDetails] = useAtom(settlementDetailsAtom);
  const [merchantDetails] = useAtom(merchantDetailsAtom);
  const [, setCurrentStep] = useAtom(currentStepAtom);
  const [, markStepCompleted] = useAtom(markStepCompletedAtom);
  const [canNavigateToStep] = useAtom(canNavigateToStepAtom);

  const form = useForm<SettlementDetailsFormData>({
    resolver: zodResolver(settlementDetailsSchema),
    defaultValues: {
      settlementFrequency: settlementDetails.settlementFrequency || 'MONTHLY',
      surcharge: settlementDetails.surcharge || 'Customer',
      partnerBank: settlementDetails.partnerBank || '',
      settlementAccount: settlementDetails.settlementAccount || 'PARENT_BANK',
      totalSurcharge: settlementDetails.totalSurcharge || 1.5,
      merchantPercentageSurcharge: settlementDetails.merchantPercentageSurcharge || 0,
      customerPercentageSurcharge: settlementDetails.customerPercentageSurcharge || 0,
      surchargeCap: settlementDetails.surchargeCap || undefined,
      surchargeHasCap: settlementDetails.surchargeHasCap ?? true,
    },
  });

  // Check if user can access this step
  useEffect(() => {
    if (!canNavigateToStep(2)) {
      router.push(ROUTES.MERCHANTS.ONBOARDING.MERCHANT_DETAILS);
      return;
    }

    // Ensure we have required previous step data
    if (!merchantDetails.merchantName || !merchantDetails.merchantCode) {
      router.push(ROUTES.MERCHANTS.ONBOARDING.MERCHANT_DETAILS);
    }
  }, [canNavigateToStep, merchantDetails, router]);

  // Watch surcharge type to enable/disable surcharge fields
  const surchargeType = form.watch('surcharge');
  const totalSurcharge = form.watch('totalSurcharge');
  const surchargeHasCap = form.watch('surchargeHasCap');

  // Automatically update surcharge distribution based on type
  useEffect(() => {
    if (surchargeType === 'Customer') {
      form.setValue('merchantPercentageSurcharge', 0);
      form.setValue('customerPercentageSurcharge', totalSurcharge);
    } else if (surchargeType === 'Merchant') {
      form.setValue('merchantPercentageSurcharge', totalSurcharge);
      form.setValue('customerPercentageSurcharge', 0);
    } else if (surchargeType === 'BOTH') {
      // Let user manually set both values
      form.setValue('merchantPercentageSurcharge', 0);
      form.setValue('customerPercentageSurcharge', 0);
    }
  }, [surchargeType, totalSurcharge, form]);

  const onSubmit = (data: SettlementDetailsFormData) => {
    // Save form data to store
    setSettlementDetails(data);
    
    // Mark step as completed
    markStepCompleted(2);
    
    // Navigate to next step
    setCurrentStep(3);
    router.push(ROUTES.MERCHANTS.ONBOARDING.USER_DETAILS);
  };

  const handleBack = () => {
    setCurrentStep(1);
    router.push(ROUTES.MERCHANTS.ONBOARDING.MERCHANT_DETAILS);
  };

  return (
    <div className="w-full border rounded-lg p-6">
      <div className="mb-8">
        <h6 className="flex items-center space-x-2 text-foreground mb-2 font-medium">
          <IconReceipt className={'size-4'} />
          <span>Settlement Details</span>
        </h6>
        <p className="text-muted-foreground text-sm">
          Configure settlement frequency, surcharges, and banking details
        </p>
      </div>
      <div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <IconCalendarEvent className="h-4 w-4" />
                Settlement Frequency
              </Label>
              <Select
                onValueChange={(value) => form.setValue('settlementFrequency', value as 'DAILY' | 'WEEKLY' | 'MONTHLY')}
                defaultValue={form.watch('settlementFrequency')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {settlementFrequencies.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.settlementFrequency && (
                <p className="text-sm text-red-500">{form.formState.errors.settlementFrequency.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <IconPercentage className="h-4 w-4" />
                Surcharge On
              </Label>
              <Select
                onValueChange={(value) => form.setValue('surcharge', value as 'Customer' | 'Merchant' | 'BOTH')}
                defaultValue={form.watch('surcharge')}
              >
                <SelectTrigger className="w-full">
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
              {form.formState.errors.surcharge && (
                <p className="text-sm text-red-500">{form.formState.errors.surcharge.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="partnerBank" className="flex items-center gap-2">
                <IconBuildingBank className="h-4 w-4" />
                Partner Bank
              </Label>
              <PartnerBankSelect
                value={form.watch('partnerBank')}
                onValueChange={(value) => form.setValue('partnerBank', value)}
                placeholder="Select partner bank..."
                className="w-full"
                showActiveOnly={true}
              />
              {form.formState.errors.partnerBank && (
                <p className="text-sm text-red-500">{form.formState.errors.partnerBank.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <IconFileInvoice className="h-4 w-4" />
                Settlement Account Type
              </Label>
              <Select
                onValueChange={(value) => form.setValue('settlementAccount', value as 'PARENT_BANK' | 'MERCHANT_BANK')}
                defaultValue={form.watch('settlementAccount')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  {settlementAccountTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.settlementAccount && (
                <p className="text-sm text-red-500">{form.formState.errors.settlementAccount.message}</p>
              )}
            </div>
          </div>

          {/* Surcharge Details */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Surcharge Details</Label>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="totalSurcharge" className="flex items-center gap-2">
                  <IconPercentage className="h-4 w-4" />
                  Total Surcharge (%)
                </Label>
                <Input
                  id="totalSurcharge"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1.5"
                  placeholder="1.5"
                  className="w-full"
                  {...form.register('totalSurcharge', { valueAsNumber: true })}
                />
                {form.formState.errors.totalSurcharge && (
                  <p className="text-sm text-red-500">{form.formState.errors.totalSurcharge.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="merchantPercentageSurcharge" className="flex items-center gap-2">
                  <IconCoin className="h-4 w-4" />
                  Merchant Surcharge (%)
                </Label>
                <Input
                  id="merchantPercentageSurcharge"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1.5"
                  placeholder="0.00"
                  disabled={surchargeType !== 'BOTH'}
                  className="w-full"
                  {...form.register('merchantPercentageSurcharge', { valueAsNumber: true })}
                />
                {form.formState.errors.merchantPercentageSurcharge && (
                  <p className="text-sm text-red-500">{form.formState.errors.merchantPercentageSurcharge.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerPercentageSurcharge" className="flex items-center gap-2">
                  <IconCash className="h-4 w-4" />
                  Customer Surcharge (%)
                </Label>
                <Input
                  id="customerPercentageSurcharge"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1.5"
                  placeholder="0.00"
                  disabled={surchargeType !== 'BOTH'}
                  className="w-full"
                  {...form.register('customerPercentageSurcharge', { valueAsNumber: true })}
                />
                {form.formState.errors.customerPercentageSurcharge && (
                  <p className="text-sm text-red-500">{form.formState.errors.customerPercentageSurcharge.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {!surchargeHasCap && (
                <div className="space-y-2">
                  <Label htmlFor="surchargeCap">Cap (GHS)</Label>
                  <Input
                    id="surchargeCap"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="45"
                    {...form.register('surchargeCap', { valueAsNumber: true })}
                    className="w-32"
                  />
                  {form.formState.errors.surchargeCap && (
                    <p className="text-sm text-red-500">{form.formState.errors.surchargeCap.message}</p>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="surchargeHasCap"
                  checked={!surchargeHasCap} // Inverted because the checkbox is "No Surcharge Cap applied"
                  onCheckedChange={(checked) => 
                    form.setValue('surchargeHasCap', !checked)
                  }
                />
                <Label htmlFor="surchargeHasCap">No Surcharge Cap applied</Label>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleBack}
              className="gap-2"
            >
              <IconArrowLeft className="w-4 h-4" />
              Back to Merchant Details
            </Button>
            <Button type="submit" className="gap-2">
              Continue to User Details
              <IconArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}