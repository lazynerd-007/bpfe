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
import { Upload, FileText, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const bulkCashoutSchema = z.object({
  batchName: z.string().min(1, "Batch name is required"),
  processor: z.enum(["AIRTEL", "MTN", "TIGO", "VODAFONE", "ORANGE"]),
  description: z.string().optional(),
  totalAmount: z.number().min(0.01, "Total amount must be greater than 0"),
  recipientCount: z.number().min(1, "Must have at least 1 recipient"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type BulkCashoutFormData = z.infer<typeof bulkCashoutSchema>;

export function BulkCashoutForm() {
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [otpRequested, setOtpRequested] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BulkCashoutFormData>({
    resolver: zodResolver(bulkCashoutSchema),
    defaultValues: {
      batchName: "",
      processor: "MTN",
      description: "",
      totalAmount: 0,
      recipientCount: 0,
      otp: "",
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        toast({
          title: "Error",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
        return;
      }
      
      setUploadedFile(file);
      
      // Parse CSV and calculate totals (mock implementation)
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        const dataLines = lines.slice(1); // Skip header
        
        let totalAmount = 0;
        dataLines.forEach(line => {
          const columns = line.split(',');
          if (columns.length >= 3) {
            const amount = parseFloat(columns[2]) || 0;
            totalAmount += amount;
          }
        });
        
        form.setValue('recipientCount', dataLines.length);
        form.setValue('totalAmount', totalAmount);
        form.setValue('batchName', `Batch_${new Date().toISOString().split('T')[0]}`);
      };
      reader.readAsText(file);
    }
  };

  const requestOtp = async () => {
    try {
      // Mock OTP request
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOtpRequested(true);
      toast({
        title: "OTP Sent",
        description: "OTP has been sent to your registered mobile number",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: BulkCashoutFormData) => {
    if (!uploadedFile) {
      toast({
        title: "Error",
        description: "Please upload a CSV file with recipient details",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Mock cashout processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Success",
        description: `Bulk cashout initiated for ${data.recipientCount} recipients`,
      });
      
      // Reset form
      form.reset();
      setUploadedFile(null);
      setOtpRequested(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process bulk cashout",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="csv-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Upload CSV file with recipient details
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                CSV format: Name, Phone, Amount, Description
              </span>
            </label>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
          {uploadedFile && (
            <div className="mt-4 flex items-center justify-center">
              <FileText className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm text-green-600">{uploadedFile.name}</span>
            </div>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="batchName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter batch name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="processor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Processor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select processor" />
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="recipientCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipients Count</FormLabel>
                  <FormControl>
                    <Input {...field} disabled className="bg-gray-50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount (GHS)</FormLabel>
                  <FormControl>
                    <Input {...field} disabled className="bg-gray-50" />
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
                    placeholder="Enter batch description..."
                    className="min-h-[80px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* OTP Section */}
          <div className="border rounded-lg p-4 bg-yellow-50">
            <h3 className="font-medium mb-4">OTP Verification Required</h3>
            <div className="space-y-4">
              {!otpRequested ? (
                <Button type="button" onClick={requestOtp} variant="outline">
                  Request OTP
                </Button>
              ) : (
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter OTP</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter 6-digit OTP" 
                          maxLength={6}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                form.reset();
                setUploadedFile(null);
                setOtpRequested(false);
              }}
            >
              Reset
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !uploadedFile || !otpRequested}
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Processing..." : "Execute Cashout"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}