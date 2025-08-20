"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PartnerBank } from "@/sdk/types";
import { usePartnerBanks } from "../hooks";
import { useToast } from "@/hooks/use-toast";
import { IconEdit, IconUpload, IconFile, IconX } from "@tabler/icons-react";
import { BankSelect } from "@/components/dropdowns";

const editPartnerBankSchema = z.object({
  email: z.string().email("Invalid email address"),
  commissionRatio: z.number().min(0).max(100, "Commission ratio must be between 0 and 100"),
  // Commission Account Details
  commissionBankName: z.string().min(1, "Commission bank name is required"),
  commissionAccountName: z.string().min(1, "Commission account name is required"),
  commissionAccountNumber: z.string().min(1, "Commission account number is required"),
  // Settlement Account Details
  settlementBankName: z.string().min(1, "Settlement bank name is required"),
  settlementAccountName: z.string().min(1, "Settlement account name is required"),
  settlementAccountNumber: z.string().min(1, "Settlement account number is required"),
  // Settlement Sample Files
  crSampleFile: z.instanceof(File).optional(),
  drSampleFile: z.instanceof(File).optional(),
});

type EditPartnerBankFormData = z.infer<typeof editPartnerBankSchema>;

interface EditPartnerBankModalProps {
  partnerBank: PartnerBank | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditPartnerBankModal({
  partnerBank,
  open,
  onOpenChange,
  onSuccess,
}: EditPartnerBankModalProps) {
  const { updatePartnerBank, loading } = usePartnerBanks();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [crSampleFile, setCrSampleFile] = useState<File | undefined>(undefined);
  const [drSampleFile, setDrSampleFile] = useState<File | undefined>(undefined);

  const form = useForm<EditPartnerBankFormData>({
    resolver: zodResolver(editPartnerBankSchema),
    defaultValues: {
      email: "",
      commissionRatio: 0,
      commissionBankName: "",
      commissionAccountName: "",
      commissionAccountNumber: "",
      settlementBankName: "",
      settlementAccountName: "",
      settlementAccountNumber: "",
      crSampleFile: undefined,
      drSampleFile: undefined,
    },
  });

  // Reset form when partnerBank changes
  useEffect(() => {
    if (partnerBank && open) {
      // Extract commission bank details
      const commissionBank = typeof partnerBank.commissionBank === 'object' 
        ? partnerBank.commissionBank as any
        : {};
      
      // Extract settlement bank details
      const settlementBank = typeof partnerBank.settlementBank === 'object'
        ? partnerBank.settlementBank as any
        : {};

      form.reset({
        email: "", // Partner bank doesn't have email in the interface, will need to add
        commissionRatio: partnerBank.commissionRatio || 0,
        commissionBankName: commissionBank.bankName || "",
        commissionAccountName: commissionBank.accountName || "",
        commissionAccountNumber: commissionBank.accountNumber || "",
        settlementBankName: settlementBank.bankName || "",
        settlementAccountName: settlementBank.accountName || "",
        settlementAccountNumber: settlementBank.accountNumber || "",
        crSampleFile: undefined,
        drSampleFile: undefined,
      });
      setCrSampleFile(undefined);
      setDrSampleFile(undefined);
    }
  }, [partnerBank, open, form]);

  const handleCrFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setCrSampleFile(file || undefined);
    form.setValue('crSampleFile', file || undefined);
  };

  const handleDrFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setDrSampleFile(file || undefined);
    form.setValue('drSampleFile', file || undefined);
  };

  const onSubmit = async (data: EditPartnerBankFormData) => {
    if (!partnerBank) return;

    try {
      setIsSubmitting(true);
      
      // Create FormData for multipart/form-data if files are included
      const hasFiles = data.crSampleFile || data.drSampleFile;
      
      if (hasFiles) {
        const formData = new FormData();
        formData.append('email', data.email);
        formData.append('commissionRatio', data.commissionRatio.toString());
        
        // Commission account details
        formData.append('commissionBankName', data.commissionBankName);
        formData.append('commissionAccountName', data.commissionAccountName);
        formData.append('commissionAccountNumber', data.commissionAccountNumber);
        
        // Settlement account details
        formData.append('settlementBankName', data.settlementBankName);
        formData.append('settlementAccountName', data.settlementAccountName);
        formData.append('settlementAccountNumber', data.settlementAccountNumber);
        
        // Add files if present
        if (data.crSampleFile) {
          formData.append('crSampleFile', data.crSampleFile);
        }
        if (data.drSampleFile) {
          formData.append('drSampleFile', data.drSampleFile);
        }
        
        await updatePartnerBank(partnerBank.uuid, formData as any);
      } else {
        // Send as JSON if no files
        const updateData = {
          email: data.email,
          commissionRatio: data.commissionRatio / 100, // Convert percentage to decimal
          commissionBank: {
            bankName: data.commissionBankName,
            accountName: data.commissionAccountName,
            accountNumber: data.commissionAccountNumber,
          },
          settlementBank: {
            bankName: data.settlementBankName,
            accountName: data.settlementAccountName,
            accountNumber: data.settlementAccountNumber,
          },
        };
        
        await updatePartnerBank(partnerBank.uuid, updateData);
      }
      
      toast({
        title: "Success",
        description: "Partner bank updated successfully",
      });
      
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update partner bank",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!partnerBank) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconEdit className="h-5 w-5" />
            Edit Partner Bank - {partnerBank.name}
          </DialogTitle>
          <DialogDescription>
            Update partner bank details, commission settings, and account information.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="contact@partnerbank.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="commissionRatio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Commission Ratio (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Commission Account Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Commission Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="commissionBankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter bank name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
              </CardContent>
            </Card>

            {/* Settlement Account Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Settlement Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="settlementBankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter bank name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
              </CardContent>
            </Card>

            {/* Settlement Sample Files */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Settlement Sample Files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* CR Sample File */}
                  <div className="space-y-2">
                    <FormLabel>CR Sample File</FormLabel>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="text-center">
                        <input
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          onChange={handleCrFileChange}
                          className="hidden"
                          id="cr-file-upload"
                        />
                        <label
                          htmlFor="cr-file-upload"
                          className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <IconUpload className="h-4 w-4 mr-2" />
                          Upload CR File
                        </label>
                        {crSampleFile && (
                          <div className="mt-2 flex items-center justify-center gap-2">
                            <IconFile className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">
                              {crSampleFile.name}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCrSampleFile(undefined);
                                form.setValue('crSampleFile', undefined);
                              }}
                            >
                              <IconX className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* DR Sample File */}
                  <div className="space-y-2">
                    <FormLabel>DR Sample File</FormLabel>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="text-center">
                        <input
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          onChange={handleDrFileChange}
                          className="hidden"
                          id="dr-file-upload"
                        />
                        <label
                          htmlFor="dr-file-upload"
                          className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <IconUpload className="h-4 w-4 mr-2" />
                          Upload DR File
                        </label>
                        {drSampleFile && (
                          <div className="mt-2 flex items-center justify-center gap-2">
                            <IconFile className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">
                              {drSampleFile.name}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDrSampleFile(undefined);
                                form.setValue('drSampleFile', undefined);
                              }}
                            >
                              <IconX className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || loading}>
                {isSubmitting ? "Updating..." : "Update Partner Bank"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}