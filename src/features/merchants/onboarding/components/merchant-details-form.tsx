'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CountrySelect } from '@/components/ui/country-select';
import { IconBuilding, IconArrowRight, IconBarcode, IconMail, IconWorld, IconCategory, IconBuildingEstate, IconDevices, IconNumber, IconMapPin } from '@tabler/icons-react';
import { TerminalSelect } from '@/components/dropdowns';
import { ROUTES } from '@/lib/constants';
import { 
  merchantDetailsSchema, 
  type MerchantDetailsFormData,
  countries,
  organizationTypes,
  merchantCategories
} from '../schema';
import { 
  merchantDetailsAtom, 
  currentStepAtom, 
  markStepCompletedAtom 
} from '../store';

export function MerchantDetailsForm() {
  const router = useRouter();
  const [merchantDetails, setMerchantDetails] = useAtom(merchantDetailsAtom);
  const [, setCurrentStep] = useAtom(currentStepAtom);
  const [, markStepCompleted] = useAtom(markStepCompletedAtom);

  const form = useForm<MerchantDetailsFormData>({
    resolver: zodResolver(merchantDetailsSchema),
    defaultValues: {
      merchantCode: merchantDetails.merchantCode || '',
      merchantName: merchantDetails.merchantName || '',
      merchantAddress: merchantDetails.merchantAddress || '',
      notificationEmail: merchantDetails.notificationEmail || '',
      country: merchantDetails.country || 'GHANA',
      tinNumber: merchantDetails.tinNumber || '',
      orgType: merchantDetails.orgType || 1,
      merchantCategory: merchantDetails.merchantCategory || 5411,
      terminal: merchantDetails.terminal || '',
    },
  });

  const onSubmit = (data: MerchantDetailsFormData) => {
    // Save form data to store
    setMerchantDetails(data);
    
    // Mark step as completed
    markStepCompleted(1);
    
    // Navigate to next step
    setCurrentStep(2);
    router.push(ROUTES.MERCHANTS.ONBOARDING.SETTLEMENT_DETAILS);
  };

  return (
    <div className="w-full border rounded-lg p-6 ">
      <div className="mb-8">
        <h6 className="flex items-center space-x-2 text-foreground mb-2 font-medium">
          <IconBuilding className={'size-4'} />
          <span>Merchant Details</span>
        </h6>
        <p className="text-muted-foreground text-sm ">
          Enter basic information about the merchant
        </p>
      </div>
      <div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="merchantName" className="flex items-center gap-2">
                <IconBuilding className="h-4 w-4" />
                Merchant Name
              </Label>
              <Input
                id="merchantName"
                placeholder="Enter merchant name"
                className="w-full"
                {...form.register('merchantName')}
              />
              {form.formState.errors.merchantName && (
                <p className="text-sm text-red-500">{form.formState.errors.merchantName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="merchantCode" className="flex items-center gap-2">
                <IconBarcode className="h-4 w-4" />
                Merchant Code
              </Label>
              <Input
                id="merchantCode"
                placeholder="BP001"
                className="w-full"
                {...form.register('merchantCode')}
              />
              {form.formState.errors.merchantCode && (
                <p className="text-sm text-red-500">{form.formState.errors.merchantCode.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="notificationEmail" className="flex items-center gap-2">
                <IconMail className="h-4 w-4" />
                Notification Email
              </Label>
              <Input
                id="notificationEmail"
                type="email"
                placeholder="notifications@merchant.com"
                className="w-full"
                {...form.register('notificationEmail')}
              />
              {form.formState.errors.notificationEmail && (
                <p className="text-sm text-red-500">{form.formState.errors.notificationEmail.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <IconWorld className="h-4 w-4" />
                Country
              </Label>
              <CountrySelect
                value={form.watch('country')}
                onValueChange={(value) => form.setValue('country', value)}
                placeholder="Select country"
                className="w-full"
              />
              {form.formState.errors.country && (
                <p className="text-sm text-red-500">{form.formState.errors.country.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <IconCategory className="h-4 w-4" />
                Merchant Category
              </Label>
              <Select
                onValueChange={(value) => form.setValue('merchantCategory', parseInt(value))}
                defaultValue={form.watch('merchantCategory')?.toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {merchantCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value.toString()}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.merchantCategory && (
                <p className="text-sm text-red-500">{form.formState.errors.merchantCategory.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <IconBuildingEstate className="h-4 w-4" />
                Organization Type
              </Label>
              <Select
                onValueChange={(value) => form.setValue('orgType', parseInt(value))}
                defaultValue={form.watch('orgType')?.toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select organization type" />
                </SelectTrigger>
                <SelectContent>
                  {organizationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value.toString()}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.orgType && (
                <p className="text-sm text-red-500">{form.formState.errors.orgType.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="terminal" className="flex items-center gap-2">
                <IconDevices className="h-4 w-4" />
                Terminal
              </Label>
              <TerminalSelect
                value={form.watch('terminal')}
                onValueChange={(value) => form.setValue('terminal', value)}
                placeholder="Select terminal..."
                className="w-full"
              />
              {form.formState.errors.terminal && (
                <p className="text-sm text-red-500">{form.formState.errors.terminal.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tinNumber" className="flex items-center gap-2">
                <IconNumber className="h-4 w-4" />
                TIN Number
              </Label>
              <Input
                id="tinNumber"
                placeholder="Enter TIN number (11-15 characters)"
                className="w-full"
                {...form.register('tinNumber')}
              />
              {form.formState.errors.tinNumber && (
                <p className="text-sm text-red-500">{form.formState.errors.tinNumber.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="merchantAddress" className="flex items-center gap-2">
              <IconMapPin className="h-4 w-4" />
              Merchant Address
            </Label>
            <Input
              id="merchantAddress"
              placeholder="Enter merchant address"
              className="w-full"
              {...form.register('merchantAddress')}
            />
            {form.formState.errors.merchantAddress && (
              <p className="text-sm text-red-500">{form.formState.errors.merchantAddress.message}</p>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-end">
            <Button type="submit" className="gap-2">
              Continue to Settlement Details
              <IconArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}