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
import { basicDetailsAtom, markStepCompletedAtom } from '@/features/partner-banks/onboarding/store';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { PartnerBankOnboardingStepper } from '@/components/ui/partner-bank-onboarding-stepper';
import { useState } from 'react';
import { IconBuilding, IconArrowRight } from '@tabler/icons-react';
import { ImageUpload } from '@/components/ui/image-upload';

const basicDetailsSchema = z.object({
  name: z.string().min(2, "Bank name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  logo: z.instanceof(File).optional(),
});

type BasicDetailsFormData = z.infer<typeof basicDetailsSchema>;

export default function BasicDetailsPage() {
  const [basicDetails, setBasicDetails] = useAtom(basicDetailsAtom);
  const [, markStepCompleted] = useAtom(markStepCompletedAtom);
  const [selectedFile, setSelectedFile] = useState<File | null>(basicDetails.logo || null);
  const router = useRouter();

  const form = useForm<BasicDetailsFormData>({
    resolver: zodResolver(basicDetailsSchema),
    defaultValues: {
      name: basicDetails.name || "",
      email: basicDetails.email || "",
      logo: basicDetails.logo,
    },
  });

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    form.setValue('logo', file || undefined);
    if (file) {
      form.clearErrors('logo');
    }
  };

  const onSubmit = async (data: BasicDetailsFormData) => {
    setBasicDetails(data);
    markStepCompleted(1);
    router.push(ROUTES.PARTNER_BANKS.ONBOARDING.COMMISSION_DETAILS);
  };

  return (
    <div className="space-y-6">

      <div className="w-full border rounded-lg p-6">
        <div className="mb-8">
          <h6 className="flex items-center space-x-2 text-foreground mb-2 font-medium">
            <IconBuilding className="size-4" />
            <span>Basic Details</span>
          </h6>
          <p className="text-muted-foreground text-sm">
            Enter the basic information for the partner bank
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner Bank Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter bank name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contact@partnerbank.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="logo"
              render={() => (
                <FormItem>
                  <FormLabel>Bank Logo (Optional)</FormLabel>
                  <FormControl>
                    <ImageUpload
                      onFileChange={handleFileChange}
                      placeholder="Drop your bank logo here"
                      maxSizeMB={5}
                      defaultValue={selectedFile}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" className="gap-2">
                Continue to Commission Details
                <IconArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}