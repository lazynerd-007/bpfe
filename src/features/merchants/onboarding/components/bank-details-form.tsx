'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IconCreditCard, IconArrowLeft, IconArrowRight, IconBuildingBank, IconGitBranch, IconFileInvoice, IconNumber, IconUser } from '@tabler/icons-react';
import { BankSelect, BranchSelect } from '@/components/dropdowns';
import { ROUTES } from '@/lib/constants';
import { 
  bankDetailsSchema, 
  type BankDetailsFormData,
  accountTypes
} from '../schema';
import { 
  bankDetailsAtom, 
  currentStepAtom, 
  markStepCompletedAtom,
  canNavigateToStepAtom,
  userDetailsAtom
} from '../store';

export function BankDetailsForm() {
  const router = useRouter();
  const [bankDetails, setBankDetails] = useAtom(bankDetailsAtom);
  const [userDetails] = useAtom(userDetailsAtom);
  const [, setCurrentStep] = useAtom(currentStepAtom);
  const [, markStepCompleted] = useAtom(markStepCompletedAtom);
  const [canNavigateToStep] = useAtom(canNavigateToStepAtom);

  const form = useForm<BankDetailsFormData>({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: {
      merchantBank: bankDetails.merchantBank || '',
      branch: bankDetails.branch || '',
      accountType: bankDetails.accountType || 'CURRENT_ACCOUNT',
      accountNumber: bankDetails.accountNumber || '',
      accountName: bankDetails.accountName || '',
    },
  });

  // Check if user can access this step
  useEffect(() => {
    if (!canNavigateToStep(4)) {
      router.push(ROUTES.MERCHANTS.ONBOARDING.USER_DETAILS);
      return;
    }

    // Ensure we have required previous step data
    if (!userDetails.firstName || !userDetails.lastName || !userDetails.email) {
      router.push(ROUTES.MERCHANTS.ONBOARDING.USER_DETAILS);
    }
  }, [canNavigateToStep, userDetails, router]);

  const onSubmit = (data: BankDetailsFormData) => {
    // Save bank details to store
    setBankDetails(data);
    
    // Mark step as completed
    markStepCompleted(4);
    
    // Navigate to next step (OVA Details)
    setCurrentStep(5);
    router.push(ROUTES.MERCHANTS.ONBOARDING.OVA_DETAILS);
  };

  const handleBack = () => {
    setCurrentStep(3);
    router.push(ROUTES.MERCHANTS.ONBOARDING.USER_DETAILS);
  };

  return (
    <div className="w-full border rounded-lg p-6">
      <div className="mb-8">
        <h6 className="flex items-center space-x-2 text-foreground mb-2 font-medium">
          <IconCreditCard className={'size-4'} />
          <span>Bank Details</span>
        </h6>
        <p className="text-muted-foreground text-sm">
          Add banking information for settlement processing
        </p>
      </div>
      <div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="merchantBank" className="flex items-center gap-2">
                <IconBuildingBank className="h-4 w-4" />
                Merchant Bank
              </Label>
              <BankSelect
                value={form.watch('merchantBank')}
                onValueChange={(value) => {
                  form.setValue('merchantBank', value);
                  // Clear branch when bank changes
                  if (form.watch('branch')) {
                    form.setValue('branch', '');
                  }
                }}
                placeholder="Select bank..."
                className="w-full"
              />
              {form.formState.errors.merchantBank && (
                <p className="text-sm text-red-500">{form.formState.errors.merchantBank.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch" className="flex items-center gap-2">
                <IconGitBranch className="h-4 w-4" />
                Branch
              </Label>
              <BranchSelect
                value={form.watch('branch')}
                onValueChange={(value) => form.setValue('branch', value)}
                disabled={!form.watch('merchantBank')}
                placeholder="Select branch..."
                className="w-full"
                bankId={form.watch('merchantBank')}
              />
              {form.formState.errors.branch && (
                <p className="text-sm text-red-500">{form.formState.errors.branch.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <IconFileInvoice className="h-4 w-4" />
              Account Type
            </Label>
            <Select
              onValueChange={(value) => form.setValue('accountType', value as 'CURRENT_ACCOUNT' | 'SAVINGS' | 'CALL_ACCOUNT')}
              defaultValue={form.watch('accountType')}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                {accountTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.accountType && (
              <p className="text-sm text-red-500">{form.formState.errors.accountType.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="accountNumber" className="flex items-center gap-2">
                <IconNumber className="h-4 w-4" />
                Account Number
              </Label>
              <Input
                id="accountNumber"
                placeholder="Account number"
                className="w-full"
                {...form.register('accountNumber')}
              />
              {form.formState.errors.accountNumber && (
                <p className="text-sm text-red-500">{form.formState.errors.accountNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountName" className="flex items-center gap-2">
                <IconUser className="h-4 w-4" />
                Account Name
              </Label>
              <Input
                id="accountName"
                placeholder="Account holder name"
                className="w-full"
                {...form.register('accountName')}
              />
              {form.formState.errors.accountName && (
                <p className="text-sm text-red-500">{form.formState.errors.accountName.message}</p>
              )}
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
              Back to User Details
            </Button>
            <Button type="submit" className="gap-2">
              Continue to OVA Details
              <IconArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}