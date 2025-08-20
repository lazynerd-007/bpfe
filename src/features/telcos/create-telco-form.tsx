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
import { useTelcos } from "./hooks";
import { useToast } from "@/hooks/use-toast";
import { CreateTelcoManagementDto } from "@/sdk/types";
import { MerchantSelect } from "@/components/dropdowns";

const createTelcoSchema = z.object({
  telco: z.enum(["AIRTEL", "MTN", "TIGO", "VODAFONE", "ORANGE"]),
  name: z.string().min(2, "Name must be at least 2 characters"),
  apiUrl: z.string().url("Must be a valid URL"),
  apiKey: z.string().optional(),
  secretKey: z.string().optional(),
  merchantId: z.string().optional(),
  config: z.string().optional(),
});

type CreateTelcoFormData = z.infer<typeof createTelcoSchema>;

interface CreateTelcoFormProps {
  onSuccess?: () => void;
}

export function CreateTelcoForm({ onSuccess }: CreateTelcoFormProps) {
  const { createTelco, loading } = useTelcos();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateTelcoFormData>({
    resolver: zodResolver(createTelcoSchema),
    defaultValues: {
      telco: "MTN",
      name: "",
      apiUrl: "",
      apiKey: "",
      secretKey: "",
      merchantId: "",
      config: "",
    },
  });

  const onSubmit = async (data: CreateTelcoFormData) => {
    try {
      setIsSubmitting(true);
      
      // Create telco data with proper types
      const telcoData: CreateTelcoManagementDto = {
        telco: data.telco,
        name: data.name,
        apiUrl: data.apiUrl,
      };
      
      // Add optional fields
      if (data.apiKey) telcoData.apiKey = data.apiKey;
      if (data.secretKey) telcoData.secretKey = data.secretKey;
      if (data.merchantId) telcoData.merchantId = data.merchantId;
      
      // Parse config JSON if provided
      if (data.config) {
        try {
          const parsedConfig = JSON.parse(data.config);
          telcoData.config = parsedConfig as Record<string, unknown>;
        } catch {
          toast({
            title: "Error",
            description: "Invalid JSON format in configuration",
            variant: "destructive",
          });
          return;
        }
      }

      await createTelco(telcoData);
      
      toast({
        title: "Success",
        description: "Telco configuration created successfully",
      });
      
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create telco configuration",
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
            name="telco"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telco Provider</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select telco provider" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MTN">MTN</SelectItem>
                    <SelectItem value="VODAFONE">Vodafone</SelectItem>
                    <SelectItem value="AIRTEL">Airtel</SelectItem>
                    <SelectItem value="TIGO">Tigo</SelectItem>
                    <SelectItem value="ORANGE">Orange</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Configuration Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter configuration name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="apiUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API URL</FormLabel>
              <FormControl>
                <Input placeholder="https://api.telco.com/v1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Key (Optional)</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter API key" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="secretKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secret Key (Optional)</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter secret key" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <FormField
          control={form.control}
          name="config"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Configuration (Optional JSON)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder='{"timeout": 30000, "retries": 3}'
                  className="min-h-[100px]"
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
            {isSubmitting ? "Creating..." : "Create Configuration"}
          </Button>
        </div>
      </form>
    </Form>
  );
}