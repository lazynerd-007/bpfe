'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAtom } from 'jotai';
import { 
  configurationAtom, 
  markStepCompletedAtom,
  partnerBankOnboardingAtom,
  resetFormAtom
} from '@/features/partner-banks/onboarding/store';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { PartnerBankOnboardingStepper } from '@/components/ui/partner-bank-onboarding-stepper';
import { IconArrowLeft, IconClipboardList } from '@tabler/icons-react';
import { useState } from 'react';
import { usePartnerBanks } from '@/features/partner-banks/hooks';
import { useToast } from '@/hooks/use-toast';

const reviewSchema = z.object({});

type ReviewFormData = z.infer<typeof reviewSchema>;

export default function ConfigurationPage() {
  const [configuration, setConfiguration] = useAtom(configurationAtom);
  const [, markStepCompleted] = useAtom(markStepCompletedAtom);
  const [formData] = useAtom(partnerBankOnboardingAtom);
  const [, resetForm] = useAtom(resetFormAtom);
  
  const { createPartnerBank, loading } = usePartnerBanks();
  const { toast } = useToast();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {},
  });



  const onSubmit = async (data: ReviewFormData) => {
    try {
      setIsSubmitting(true);
      markStepCompleted(4);

      // Prepare form data for submission
      const submitFormData = new FormData();
      
      // Basic details
      if (formData.basicDetails.name) submitFormData.append('name', formData.basicDetails.name);
      if (formData.basicDetails.email) submitFormData.append('email', formData.basicDetails.email);
      if (formData.basicDetails.logo) submitFormData.append('logo', formData.basicDetails.logo);
      
      // Commission details - create commission bank object
      const commissionBank = {
        accountName: formData.commissionDetails.commissionAccountName || '',
        accountNumber: formData.commissionDetails.commissionAccountNumber || '',
        bankName: formData.commissionDetails.commissionBankName || '',
      };
      submitFormData.append('commissionBank', JSON.stringify(commissionBank));
      
      // Settlement details - create settlement bank object
      const settlementBank = {
        accountName: formData.settlementDetails.settlementAccountName || '',
        accountNumber: formData.settlementDetails.settlementAccountNumber || '',
        bankName: formData.settlementDetails.settlementBankName || '',
      };
      submitFormData.append('settlementBank', JSON.stringify(settlementBank));
      
      // Commission ratio
      if (formData.commissionDetails.commissionRatio !== undefined) {
        submitFormData.append('commissionRatio', formData.commissionDetails.commissionRatio.toString());
      }
      
      // Add settlement sample files if they exist
      if (formData.settlementDetails.crSampleFile) {
        submitFormData.append('crSampleFile', formData.settlementDetails.crSampleFile);
      }
      if (formData.settlementDetails.drSampleFile) {
        submitFormData.append('drSampleFile', formData.settlementDetails.drSampleFile);
      }

      await createPartnerBank(submitFormData);
      
      toast({
        title: "Success",
        description: "Partner bank created successfully",
      });
      
      resetForm();
      router.push(ROUTES.PARTNER_BANKS.INDEX);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create partner bank",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    router.push(ROUTES.PARTNER_BANKS.ONBOARDING.SETTLEMENT_DETAILS);
  };

  return (
    <div className="space-y-6">

      <div className="w-full border rounded-lg p-6">
        <div className="mb-8">
          <h6 className="flex items-center space-x-2 text-foreground mb-2 font-medium">
            <IconClipboardList className="size-4" />
            <span>Review Summary</span>
          </h6>
          <p className="text-muted-foreground text-sm">
            Review all the details before creating the partner bank
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Summary Section */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
              <h3 className="font-medium mb-6 text-lg">Partner Bank Details Summary</h3>
              
              {/* Basic Information */}
              <div className="mb-6">
                <h4 className="font-medium text-foreground mb-3 text-sm uppercase tracking-wide">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Partner Bank Name:</span>
                      <span className="text-sm font-medium">{formData.basicDetails.name || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Email Address:</span>
                      <span className="text-sm font-medium">{formData.basicDetails.email || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Logo:</span>
                      <span className="text-sm font-medium">{formData.basicDetails.logo ? formData.basicDetails.logo.name : 'Not uploaded'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Commission Ratio:</span>
                      <span className="text-sm font-medium">{formData.commissionDetails.commissionRatio || 0}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Commission Details */}
              <div className="mb-6">
                <h4 className="font-medium text-foreground mb-3 text-sm uppercase tracking-wide">Commission Account Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Bank Name:</span>
                      <span className="text-sm font-medium">{formData.commissionDetails.commissionBankName || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Account Name:</span>
                      <span className="text-sm font-medium">{formData.commissionDetails.commissionAccountName || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Account Number:</span>
                      <span className="text-sm font-medium">{formData.commissionDetails.commissionAccountNumber || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Settlement Details */}
              <div className="mb-6">
                <h4 className="font-medium text-foreground mb-3 text-sm uppercase tracking-wide">Settlement Account Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Bank Name:</span>
                      <span className="text-sm font-medium">{formData.settlementDetails.settlementBankName || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Account Name:</span>
                      <span className="text-sm font-medium">{formData.settlementDetails.settlementAccountName || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Account Number:</span>
                      <span className="text-sm font-medium">{formData.settlementDetails.settlementAccountNumber || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Files */}
              <div>
                <h4 className="font-medium text-foreground mb-3 text-sm uppercase tracking-wide">Settlement Sample Files</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">CR Sample File:</span>
                      <span className="text-sm font-medium">{formData.settlementDetails.crSampleFile ? formData.settlementDetails.crSampleFile.name : 'Not uploaded'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">DR Sample File:</span>
                      <span className="text-sm font-medium">{formData.settlementDetails.drSampleFile ? formData.settlementDetails.drSampleFile.name : 'Not uploaded'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={goBack}>
                <IconArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button type="submit" disabled={isSubmitting || loading}>
                {isSubmitting ? "Creating Partner Bank..." : "Create Partner Bank"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}