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
import { commissionDetailsAtom, markStepCompletedAtom } from '@/features/partner-banks/onboarding/store';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { PartnerBankOnboardingStepper } from '@/components/ui/partner-bank-onboarding-stepper';
import { IconArrowLeft, IconReceipt } from '@tabler/icons-react';

const commissionDetailsSchema = z.object({
  commissionBankName: z.string().min(2, "Bank name must be at least 2 characters"),
  commissionAccountName: z.string().min(2, "Account name must be at least 2 characters"),
  commissionAccountNumber: z.string().min(5, "Account number must be at least 5 characters"),
  commissionRatio: z.number().min(0, "Commission ratio must be positive").max(1, "Commission ratio cannot exceed 1"),
});

type CommissionDetailsFormData = z.infer<typeof commissionDetailsSchema>;

export default function CommissionDetailsPage() {
  const [commissionDetails, setCommissionDetails] = useAtom(commissionDetailsAtom);
  const [, markStepCompleted] = useAtom(markStepCompletedAtom);
  const router = useRouter();

  const form = useForm<CommissionDetailsFormData>({
    resolver: zodResolver(commissionDetailsSchema),
    defaultValues: {
      commissionBankName: commissionDetails.commissionBankName || "",
      commissionAccountName: commissionDetails.commissionAccountName || "",
      commissionAccountNumber: commissionDetails.commissionAccountNumber || "",
      commissionRatio: commissionDetails.commissionRatio || 0,
    },
  });

  const onSubmit = async (data: CommissionDetailsFormData) => {
    setCommissionDetails(data);
    markStepCompleted(2);
    router.push(ROUTES.PARTNER_BANKS.ONBOARDING.SETTLEMENT_DETAILS);
  };

  const goBack = () => {
    router.push(ROUTES.PARTNER_BANKS.ONBOARDING.BASIC_DETAILS);
  };

  return (
    <div className="space-y-6">

      <div className="w-full border rounded-lg p-6">
        <div className="mb-8">
          <h6 className="flex items-center space-x-2 text-foreground mb-2 font-medium">
            <IconReceipt className="size-4" />
            <span>Commission Details</span>
          </h6>
          <p className="text-muted-foreground text-sm">
            Enter the commission bank information and commission ratio
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="commissionBankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commission Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter commission bank name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="commissionAccountName"
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
                name="commissionAccountNumber"
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

            <FormField
              control={form.control}
              name="commissionRatio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commission Ratio (0-1)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      placeholder="0.15"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={goBack}>
                <IconArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button type="submit">
                Continue to Settlement Details
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}