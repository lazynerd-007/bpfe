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
import { usePartnerBanks } from "./hooks";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { CreatePartnerBankFormDto } from "@/sdk/types";
import { BankSelect } from "@/components/dropdowns";

const createPartnerBankSchema = z.object({
  name: z.string().min(2, "Bank name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  logo: z.instanceof(File).optional(), // File upload
  commissionBank: z.string().uuid("Commission bank must be a valid UUID"),
  settlementBank: z.string().uuid("Settlement bank must be a valid UUID"),
  commissionRatio: z.number().min(0).max(1, "Commission ratio must be between 0 and 1"),
  headers: z.array(z.string()).min(1, "At least one header is required"),
});

type CreatePartnerBankFormData = z.infer<typeof createPartnerBankSchema>;

// Ensure the form data structure matches the DTO
const _typeCheck: CreatePartnerBankFormData extends CreatePartnerBankFormDto ? true : false = true;

interface CreatePartnerBankFormProps {
  onSuccess?: () => void;
}

export function CreatePartnerBankForm({ onSuccess }: CreatePartnerBankFormProps) {
  const { createPartnerBank, loading } = usePartnerBanks();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>(['Authorization', 'Content-Type']);
  const [newHeader, setNewHeader] = useState('');

  const form = useForm<CreatePartnerBankFormData>({
    resolver: zodResolver(createPartnerBankSchema),
    defaultValues: {
      name: "",
      email: "",
      logo: undefined,
      commissionBank: "",
      settlementBank: "",
      commissionRatio: 0,
      headers: ['Authorization', 'Content-Type'],
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      form.setValue('logo', file);
    }
  };

  const addHeader = () => {
    if (newHeader.trim() && !headers.includes(newHeader.trim())) {
      const updatedHeaders = [...headers, newHeader.trim()];
      setHeaders(updatedHeaders);
      form.setValue('headers', updatedHeaders);
      setNewHeader('');
    }
  };

  const removeHeader = (index: number) => {
    const updatedHeaders = headers.filter((_, i) => i !== index);
    setHeaders(updatedHeaders);
    form.setValue('headers', updatedHeaders);
  };

  const onSubmit = async (data: CreatePartnerBankFormData) => {
    try {
      setIsSubmitting(true);
      
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('commissionBank', data.commissionBank);
      formData.append('settlementBank', data.settlementBank);
      formData.append('commissionRatio', data.commissionRatio.toString());
      
      // Add headers as JSON string or individual entries
      data.headers.forEach((header, index) => {
        formData.append(`headers[${index}]`, header);
      });
      
      if (selectedFile) {
        formData.append('logo', selectedFile);
      }

      await createPartnerBank(formData);
      
      toast({
        title: "Success",
        description: "Partner bank created successfully",
      });
      
      form.reset();
      setSelectedFile(null);
      setHeaders(['Authorization', 'Content-Type']);
      setNewHeader('');
      onSuccess?.();
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
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

        {/* Logo Upload */}
        <div className="space-y-2">
          <FormLabel>Bank Logo (Optional)</FormLabel>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <div className="text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Upload Logo
              </label>
              {selectedFile && (
                <p className="mt-2 text-sm text-green-600">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="commissionBank"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commission Bank</FormLabel>
                <FormControl>
                  <BankSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select commission bank..."
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="settlementBank"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Settlement Bank</FormLabel>
                <FormControl>
                  <BankSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select settlement bank..."
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

        {/* Headers Management */}
        <div className="space-y-4">
          <FormLabel>API Headers</FormLabel>
          <div className="space-y-2">
            {headers.map((header, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input value={header} disabled className="flex-1" />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeHeader(index)}
                  disabled={headers.length <= 1}
                >
                  Remove
                </Button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Add new header"
                value={newHeader}
                onChange={(e) => setNewHeader(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHeader())}
              />
              <Button type="button" variant="outline" onClick={addHeader}>
                Add Header
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting || loading}>
            {isSubmitting ? "Creating..." : "Create Partner Bank"}
          </Button>
        </div>
      </form>
    </Form>
  );
}