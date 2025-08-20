'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ZodError } from 'zod';
import { apiClient } from '@/sdk/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconDeviceMobile, IconArrowLeft, IconCheck } from '@tabler/icons-react';
import { ROUTES } from '@/lib/constants';
import { 
  ovaDetailsSchema, 
  type OvaDetailsFormData
} from '../schema';
import { 
  apiCreateMerchantSchema,
  mapFrontendToApiFormat,
  type ApiCreateMerchant
} from '../api-schema';
import { 
  ovaDetailsAtom, 
  currentStepAtom, 
  markStepCompletedAtom,
  canNavigateToStepAtom,
  bankDetailsAtom,
  merchantOnboardingAtom,
  resetFormAtom
} from '../store';
import { useCreateMerchant } from '../../hooks';
import { ExtendedCreateMerchantDto } from '@/sdk/types';

// Mock OVA data - disabled since no OVAs exist in database
const mtnOvas: Array<{ uuid: string; name: string; telco: string }> = [];
const airtelOvas: Array<{ uuid: string; name: string; telco: string }> = [];
const telecelOvas: Array<{ uuid: string; name: string; telco: string }> = [];

export function OvaDetailsForm() {
  const router = useRouter();
  const [ovaDetails, setOvaDetails] = useAtom(ovaDetailsAtom);
  const [bankDetails] = useAtom(bankDetailsAtom);
  const [, setCurrentStep] = useAtom(currentStepAtom);
  const [, markStepCompleted] = useAtom(markStepCompletedAtom);
  const [canNavigateToStep] = useAtom(canNavigateToStepAtom);
  const [onboardingState] = useAtom(merchantOnboardingAtom);
  const [, resetForm] = useAtom(resetFormAtom);
  const { create, loading, error } = useCreateMerchant();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<OvaDetailsFormData>({
    resolver: zodResolver(ovaDetailsSchema),
    defaultValues: {
      mtnOva: ovaDetails?.mtnOva && ovaDetails.mtnOva.ovaUuid ? ovaDetails.mtnOva : { ovaUuid: '', telco: 'mtn' },
      airtelOva: ovaDetails?.airtelOva && ovaDetails.airtelOva.ovaUuid ? ovaDetails.airtelOva : { ovaUuid: '', telco: 'airtel' },
      telecelOva: ovaDetails?.telecelOva && ovaDetails.telecelOva.ovaUuid ? ovaDetails.telecelOva : { ovaUuid: '', telco: 'telecel' },
    },
  });

  // Check if user can access this step
  useEffect(() => {
    if (!canNavigateToStep(5)) {
      router.push(ROUTES.MERCHANTS.ONBOARDING.BANK_DETAILS);
      return;
    }

    // Ensure we have required previous step data
    if (!bankDetails.merchantBank || !bankDetails.accountNumber) {
      router.push(ROUTES.MERCHANTS.ONBOARDING.BANK_DETAILS);
    }
  }, [canNavigateToStep, bankDetails, router]);

  const onSubmit = async (data: OvaDetailsFormData) => {
    try {
      setIsSubmitting(true);
      setValidationErrors([]);
      setApiError(null);
      setSuccessMessage(null);
      
      console.log('Form submitted with data:', data);
      console.log('Onboarding state:', onboardingState);
      
      // Save OVA details to store
      setOvaDetails(data);
      
      // Mark step as completed
      markStepCompleted(5);

      // Combine all form data from different steps
      const frontendFormData = {
        // Merchant Details
        merchantCode: onboardingState.merchantDetails.merchantCode!,
        merchantName: onboardingState.merchantDetails.merchantName!,
        merchantAddress: onboardingState.merchantDetails.merchantAddress!,
        notificationEmail: onboardingState.merchantDetails.notificationEmail!,
        country: onboardingState.merchantDetails.country!,
        tinNumber: onboardingState.merchantDetails.tinNumber!,
        orgType: onboardingState.merchantDetails.orgType!,
        merchantCategory: onboardingState.merchantDetails.merchantCategory!,
        terminal: onboardingState.merchantDetails.terminal!,
        
        // Settlement Details
        settlementFrequency: onboardingState.settlementDetails.settlementFrequency!,
        surcharge: onboardingState.settlementDetails.surcharge!,
        partnerBank: onboardingState.settlementDetails.partnerBank!,
        settlementAccount: onboardingState.settlementDetails.settlementAccount!,
        merchantPercentageSurcharge: onboardingState.settlementDetails.merchantPercentageSurcharge!,
        customerPercentageSurcharge: onboardingState.settlementDetails.customerPercentageSurcharge!,
        surchargeCap: onboardingState.settlementDetails.surchargeCap,
        surchargeHasCap: onboardingState.settlementDetails.surchargeHasCap!,
        
        // User Details  
        firstName: onboardingState.userDetails.firstName!,
        lastName: onboardingState.userDetails.lastName!,
        email: onboardingState.userDetails.email!,
        phoneNumber: onboardingState.userDetails.phoneNumber!,
        
        // Bank Details
        merchantBank: onboardingState.bankDetails.merchantBank!,
        branch: onboardingState.bankDetails.branch!,
        accountType: onboardingState.bankDetails.accountType!,
        accountNumber: onboardingState.bankDetails.accountNumber!,
        accountName: onboardingState.bankDetails.accountName!,
        
        // OVA Details (only include if actually selected, not default empty values)
        mtnOva: data.mtnOva?.ovaUuid && data.mtnOva.ovaUuid.trim() !== '' ? data.mtnOva : { ovaUuid: '', telco: 'mtn' },
        airtelOva: data.airtelOva?.ovaUuid && data.airtelOva.ovaUuid.trim() !== '' ? data.airtelOva : { ovaUuid: '', telco: 'airtel' },
        telecelOva: data.telecelOva?.ovaUuid && data.telecelOva.ovaUuid.trim() !== '' ? data.telecelOva : { ovaUuid: '', telco: 'telecel' },
      };

      console.log('Frontend form data:', JSON.stringify(frontendFormData, null, 2));
      console.log('OVA data specifically:', JSON.stringify({
        mtnOva: frontendFormData.mtnOva,
        airtelOva: frontendFormData.airtelOva,
        telecelOva: frontendFormData.telecelOva
      }, null, 2));

      // Map frontend data to API format
      const apiFormData = mapFrontendToApiFormat(frontendFormData);
      
      console.log('API form data before validation:', JSON.stringify(apiFormData, null, 2));
      console.log('OVA details in API format:', JSON.stringify(apiFormData.ovaDetails, null, 2));

      // Validate using API schema
      const validatedData = apiCreateMerchantSchema.parse(apiFormData);
      
      console.log('Validated API data:', JSON.stringify(validatedData, null, 2));

      // Call the API to create the merchant
      const createdMerchant = await create(validatedData);
      
      console.log('Merchant created successfully:', JSON.stringify(createdMerchant, null, 2));
      
      // Show success message
      setSuccessMessage('Merchant created successfully! Redirecting...');
      
      // Reset form data and localStorage on successful creation
      console.log('Resetting form and clearing localStorage...');
      resetForm();
      
      // Navigate to merchants list after a short delay to show success message
      setTimeout(() => {
        router.push(ROUTES.MERCHANTS.INDEX);
      }, 2000);
    } catch (error) {
      console.error('Merchant creation failed:', error);
      
      if (error instanceof ZodError) {
        // Handle validation errors
        const errorMessages = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`);
        setValidationErrors(errorMessages);
      } else if (error instanceof Error) {
        // Handle API errors
        let errorMessage = error.message;
        
        // Try to parse API error response
        try {
          const errorData = JSON.parse(error.message);
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // Keep original error message if not JSON
        }
        
        setApiError(errorMessage);
      } else {
        setApiError('An unexpected error occurred while creating the merchant.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(4);
    router.push(ROUTES.MERCHANTS.ONBOARDING.BANK_DETAILS);
  };

  return (
    <div className="w-full border rounded-lg p-6">
      <div className="mb-8">
        <h6 className="flex items-center space-x-2 text-foreground mb-2 font-medium">
          <IconDeviceMobile className={'size-4'} />
          <span>OVA Details</span>
        </h6>
        <p className="text-muted-foreground text-sm">
          Select OVAs (Online Virtual Account) settings for each mobile network operator. OVA selections are Required.
        </p>
      </div>
      <div>
        {/* Success Message */}
        {successMessage && (
          <Alert variant="default" className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* API Error */}
        {(error || apiError) && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error || apiError}</AlertDescription>
          </Alert>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Please fix the following errors:</p>
                <ul className="list-disc list-inside text-sm">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Form Field Errors */}
        {Object.keys(form.formState.errors).length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {form.formState.errors.root?.message || "OVA selections are optional. You can skip if no OVAs are available."}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Show message when no OVAs are available */}
          {mtnOvas.length === 0 && airtelOvas.length === 0 && telecelOvas.length === 0 && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> No OVAs are currently configured in the system. Merchants will be created without OVA assignments. Contact your system administrator to configure OVAs if needed.
              </p>
            </div>
          )}
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label>MTN OVA</Label>
              <Select
                onValueChange={(value) => {
                  const selectedOva = mtnOvas.find(ova => ova.uuid === value);
                  if (selectedOva) {
                    form.setValue('mtnOva', { ovaUuid: selectedOva.uuid, telco: selectedOva.telco });
                  }
                }}
                defaultValue={form.watch('mtnOva')?.ovaUuid}
                disabled={loading || isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select MTN OVA" />
                </SelectTrigger>
                <SelectContent>
                  {mtnOvas.map((ova) => (
                    <SelectItem key={ova.uuid} value={ova.uuid}>
                      {ova.name.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.mtnOva && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.mtnOva.message || 'MTN OVA selection is required'}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Airtel OVA</Label>
              <Select
                onValueChange={(value) => {
                  const selectedOva = airtelOvas.find(ova => ova.uuid === value);
                  if (selectedOva) {
                    form.setValue('airtelOva', { ovaUuid: selectedOva.uuid, telco: selectedOva.telco });
                  }
                }}
                defaultValue={form.watch('airtelOva')?.ovaUuid}
                disabled={loading || isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Airtel OVA" />
                </SelectTrigger>
                <SelectContent>
                  {airtelOvas.map((ova) => (
                    <SelectItem key={ova.uuid} value={ova.uuid}>
                      {ova.name.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.airtelOva && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.airtelOva.message || 'Airtel OVA selection is required'}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Telecel OVA</Label>
              <Select
                onValueChange={(value) => {
                  const selectedOva = telecelOvas.find(ova => ova.uuid === value);
                  if (selectedOva) {
                    form.setValue('telecelOva', { ovaUuid: selectedOva.uuid, telco: selectedOva.telco });
                  }
                }}
                defaultValue={form.watch('telecelOva')?.ovaUuid}
                disabled={loading || isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Telecel OVA" />
                </SelectTrigger>
                <SelectContent>
                  {telecelOvas.map((ova) => (
                    <SelectItem key={ova.uuid} value={ova.uuid}>
                      {ova.name.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.telecelOva && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.telecelOva.message || 'Telecel OVA selection is required'}
                </p>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleBack}
              disabled={loading || isSubmitting}
              className="gap-2"
            >
              <IconArrowLeft className="w-4 h-4" />
              Back to Bank Details
            </Button>
            <Button 
              type="submit" 
              disabled={loading || isSubmitting}
              className="gap-2"
            >
              {loading || isSubmitting ? 'Creating Merchant...' : 'Create Merchant'}
              <IconCheck className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}