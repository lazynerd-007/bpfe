'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconUser, IconArrowLeft, IconArrowRight, IconMail, IconPhone } from '@tabler/icons-react';
import { PhoneNumberInput } from '@/components/ui/phone-number-input';
import { ROUTES } from '@/lib/constants';
import { 
  userDetailsSchema, 
  type UserDetailsFormData
} from '../schema';
import { 
  userDetailsAtom, 
  currentStepAtom, 
  markStepCompletedAtom,
  canNavigateToStepAtom,
  settlementDetailsAtom
} from '../store';

export function UserDetailsForm() {
  const router = useRouter();
  const [userDetails, setUserDetails] = useAtom(userDetailsAtom);
  const [settlementDetails] = useAtom(settlementDetailsAtom);
  const [, setCurrentStep] = useAtom(currentStepAtom);
  const [, markStepCompleted] = useAtom(markStepCompletedAtom);
  const [canNavigateToStep] = useAtom(canNavigateToStepAtom);

  const form = useForm<UserDetailsFormData>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      firstName: userDetails.firstName || '',
      lastName: userDetails.lastName || '',
      email: userDetails.email || '',
      phoneNumber: userDetails.phoneNumber || '',
    },
  });

  // Check if user can access this step
  useEffect(() => {
    if (!canNavigateToStep(3)) {
      router.push(ROUTES.MERCHANTS.ONBOARDING.SETTLEMENT_DETAILS);
      return;
    }

    // Ensure we have required previous step data
    if (!settlementDetails.settlementFrequency || !settlementDetails.partnerBank) {
      router.push(ROUTES.MERCHANTS.ONBOARDING.SETTLEMENT_DETAILS);
    }
  }, [canNavigateToStep, settlementDetails, router]);

  const onSubmit = (data: UserDetailsFormData) => {
    // Save form data to store
    setUserDetails(data);
    
    // Mark step as completed
    markStepCompleted(3);
    
    // Navigate to next step
    setCurrentStep(4);
    router.push(ROUTES.MERCHANTS.ONBOARDING.BANK_DETAILS);
  };

  const handleBack = () => {
    setCurrentStep(2);
    router.push(ROUTES.MERCHANTS.ONBOARDING.SETTLEMENT_DETAILS);
  };

  return (
    <div className="w-full border rounded-lg p-6">
      <div className="mb-8">
        <h6 className="flex items-center space-x-2 text-foreground mb-2 font-medium">
          <IconUser className={'size-4'} />
          <span>User Details</span>
        </h6>
        <p className="text-muted-foreground text-sm">
          Create the user account for this merchant
        </p>
      </div>
      <div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <IconUser className="h-4 w-4" />
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="Enter first name"
                className="w-full"
                {...form.register('firstName')}
              />
              {form.formState.errors.firstName && (
                <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="flex items-center gap-2">
                <IconUser className="h-4 w-4" />
                Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="Enter last name"
                className="w-full"
                {...form.register('lastName')}
              />
              {form.formState.errors.lastName && (
                <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <IconMail className="h-4 w-4" />
                User Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="user@merchant.com"
                className="w-full"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                <IconPhone className="h-4 w-4" />
                Phone Number
              </Label>
              <PhoneNumberInput
                id="phoneNumber"
                placeholder="Enter phone number"
                defaultCountry="GH"
                className="w-full"
                value={form.watch('phoneNumber')}
                onChange={(value) => form.setValue('phoneNumber', value || '')}
              />
              {form.formState.errors.phoneNumber && (
                <p className="text-sm text-red-500">{form.formState.errors.phoneNumber.message}</p>
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
              Back to Settlement Details
            </Button>
            <Button type="submit" className="gap-2">
              Continue to Bank Details
              <IconArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}