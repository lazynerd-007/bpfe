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
import { useDevices } from "./hooks";
import { useToast } from "@/hooks/use-toast";
import { CreateDeviceDto } from "@/sdk/types";

const createDeviceSchema = z.object({
  deviceId: z.string().min(1, "Device ID is required"),
});

type CreateDeviceFormData = z.infer<typeof createDeviceSchema>;

// Ensure the form data structure matches the DTO
const _typeCheck: CreateDeviceFormData extends CreateDeviceDto ? true : false = true;

interface CreateDeviceFormProps {
  onSuccess?: () => void;
}

export function CreateDeviceForm({ onSuccess }: CreateDeviceFormProps) {
  const { createDevice, loading } = useDevices();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateDeviceFormData>({
    resolver: zodResolver(createDeviceSchema),
    defaultValues: {
      deviceId: "",
    },
  });

  const onSubmit = async (data: CreateDeviceFormData) => {
    try {
      setIsSubmitting(true);

      await createDevice(data);
      
      toast({
        title: "Success",
        description: "Device created successfully",
      });
      
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create device",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="deviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Device ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter device ID (e.g., POS001234)" {...field} />
              </FormControl>
              <FormMessage />
              <div className="text-sm text-gray-500">
                This should be the unique identifier for the device
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting || loading}>
            {isSubmitting ? "Creating..." : "Create Device"}
          </Button>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Note:</h4>
          <p className="text-sm text-blue-800">
            According to the API specification, only the Device ID is required to create a device. 
            Additional device details like status and assignment can be updated later using the device management endpoints.
          </p>
        </div>
      </form>
    </Form>
  );
}