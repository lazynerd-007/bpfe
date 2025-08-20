"use client";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCommissions } from "./hooks";
import { useToast } from "@/hooks/use-toast";
import { MerchantSelect, PartnerBankSelect } from "@/components/dropdowns";

const createCommissionSchema = z.object({
  type: z.enum(["PERCENTAGE", "FIXED", "TIERED"]),
  rate: z.number().min(0).max(100).optional(),
  amount: z.number().min(0).optional(),
  currency: z.string().optional(),
  merchantId: z.string().optional(),
  partnerBankId: z.string().optional(),
  minTransactionAmount: z.number().min(0).optional(),
  maxTransactionAmount: z.number().min(0).optional(),
  description: z.string().optional(),
}).refine((data) => {
  if (data.type === "PERCENTAGE" && (!data.rate || data.rate <= 0)) {
    return false;
  }
  if (data.type === "FIXED" && (!data.amount || data.amount <= 0)) {
    return false;
  }
  return true;
}, {
  message: "Rate is required for percentage type, amount is required for fixed type",
});

type CreateCommissionFormData = z.infer<typeof createCommissionSchema>;

interface CreateCommissionFormProps {
  onSuccess?: () => void;
}

export function CreateCommissionForm({ onSuccess }: CreateCommissionFormProps) {
  const { createCommission, loading } = useCommissions();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateCommissionFormData>({
    resolver: zodResolver(createCommissionSchema),
    defaultValues: {
      type: "PERCENTAGE",
      rate: undefined,
      amount: undefined,
      currency: "USD",
      merchantId: "",
      partnerBankId: "",
      minTransactionAmount: undefined,
      maxTransactionAmount: undefined,
      description: "",
    },
  });

  const selectedType = form.watch("type");

  const onSubmit = async (data: CreateCommissionFormData) => {
    try {
      setIsSubmitting(true);
      
      const commissionData = { ...data };
      
      if (!commissionData.merchantId) {
        delete commissionData.merchantId;
      }
      
      if (!commissionData.partnerBankId) {
        delete commissionData.partnerBankId;
      }
      
      if (!commissionData.description) {
        delete commissionData.description;
      }
      
      if (!commissionData.currency) {
        delete commissionData.currency;
      }
      
      if (!commissionData.minTransactionAmount) {
        delete commissionData.minTransactionAmount;
      }
      
      if (!commissionData.maxTransactionAmount) {
        delete commissionData.maxTransactionAmount;
      }

      if (commissionData.type === "PERCENTAGE") {
        delete commissionData.amount;
      } else if (commissionData.type === "FIXED") {
        delete commissionData.rate;
      }

      await createCommission(commissionData);
      
      toast({
        title: "Success",
        description: "Commission rule created successfully",
      });
      
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create commission",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commission Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select commission type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="FIXED">Fixed Amount</SelectItem>
                    <SelectItem value="TIERED">Tiered</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {selectedType === "PERCENTAGE" && (
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      max="100"
                      placeholder="Enter percentage rate"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {(selectedType === "FIXED" || selectedType === "TIERED") && (
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      min="0"
                      placeholder="Enter fixed amount"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="NGN">NGN</SelectItem>
                    <SelectItem value="KES">KES</SelectItem>
                    <SelectItem value="GHS">GHS</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="merchantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Merchant (Optional)</FormLabel>
                <FormControl>
                  <MerchantSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select merchant..."
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="partnerBankId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Partner Bank (Optional)</FormLabel>
              <FormControl>
                <PartnerBankSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select partner bank..."
                  className="w-full"
                  showActiveOnly={true}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="minTransactionAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Transaction Amount (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    min="0"
                    placeholder="Enter minimum amount"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="maxTransactionAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Transaction Amount (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    min="0"
                    placeholder="Enter maximum amount"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter commission description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting || loading}>
            {isSubmitting ? "Creating..." : "Create Commission"}
          </Button>
        </div>
      </form>
    </Form>
  );
}