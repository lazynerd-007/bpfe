'use client';

import { useState } from "react";
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
import { settlementDetailsAtom, markStepCompletedAtom } from '@/features/partner-banks/onboarding/store';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { PartnerBankOnboardingStepper } from '@/components/ui/partner-bank-onboarding-stepper';
import { IconArrowLeft, IconCreditCard, IconUpload, IconFile } from '@tabler/icons-react';

const settlementDetailsSchema = z.object({
  settlementBankName: z.string().min(2, "Bank name must be at least 2 characters"),
  settlementAccountName: z.string().min(2, "Account name must be at least 2 characters"),
  settlementAccountNumber: z.string().min(5, "Account number must be at least 5 characters"),
});

type SettlementDetailsFormData = z.infer<typeof settlementDetailsSchema>;

export default function SettlementDetailsPage() {
  const [settlementDetails, setSettlementDetails] = useAtom(settlementDetailsAtom);
  const [, markStepCompleted] = useAtom(markStepCompletedAtom);
  const router = useRouter();
  const [crSampleFile, setCrSampleFile] = useState<File | undefined>(settlementDetails.crSampleFile);
  const [drSampleFile, setDrSampleFile] = useState<File | undefined>(settlementDetails.drSampleFile);

  const form = useForm<SettlementDetailsFormData>({
    resolver: zodResolver(settlementDetailsSchema),
    defaultValues: {
      settlementBankName: settlementDetails.settlementBankName || "",
      settlementAccountName: settlementDetails.settlementAccountName || "",
      settlementAccountNumber: settlementDetails.settlementAccountNumber || "",
    },
  });

  const onSubmit = async (data: SettlementDetailsFormData) => {
    setSettlementDetails({
      ...data,
      crSampleFile,
      drSampleFile,
    });
    markStepCompleted(3);
    router.push(ROUTES.PARTNER_BANKS.ONBOARDING.CONFIGURATION);
  };

  const handleCrFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setCrSampleFile(file);
  };

  const handleDrFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setDrSampleFile(file);
  };

  const goBack = () => {
    router.push(ROUTES.PARTNER_BANKS.ONBOARDING.COMMISSION_DETAILS);
  };

  return (
    <div className="space-y-6">
      <div className="w-full border rounded-lg p-6">
        <div className="mb-8">
          <h6 className="flex items-center space-x-2 text-foreground mb-2 font-medium">
            <IconCreditCard className="size-4" />
            <span>Settlement Details</span>
          </h6>
          <p className="text-muted-foreground text-sm">
            Enter the settlement bank information for transaction settlements
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="settlementBankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Settlement Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter settlement bank name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="settlementAccountName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter account name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="settlementAccountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter account number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Settlement Sample Files */}
            <div className="space-y-4">
              <div className="border-t pt-6">
                <h4 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                  <IconFile className="h-4 w-4" />
                  Settlement Sample Files
                </h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Upload sample files for Credit (CR) and Debit (DR) settlement formats
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* CR Sample File */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">CR Sample File</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id="cr-sample-upload"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleCrFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="cr-sample-upload"
                        className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <IconUpload className="h-4 w-4 mr-2" />
                        Choose CR File
                      </label>
                    </div>
                    {crSampleFile && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <IconFile className="h-3 w-3" />
                        {crSampleFile.name}
                      </p>
                    )}
                  </div>

                  {/* DR Sample File */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">DR Sample File</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id="dr-sample-upload"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleDrFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="dr-sample-upload"
                        className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <IconUpload className="h-4 w-4 mr-2" />
                        Choose DR File
                      </label>
                    </div>
                    {drSampleFile && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <IconFile className="h-3 w-3" />
                        {drSampleFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={goBack}>
                <IconArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button type="submit">
                Continue to Configuration
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}