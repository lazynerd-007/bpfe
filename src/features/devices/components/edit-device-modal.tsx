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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MerchantSelect } from "@/components/dropdowns/merchant-select";
import { PartnerBankSelect } from "@/components/dropdowns/partner-bank-select";
import { useDevices } from "../hooks";
import { useToast } from "@/hooks/use-toast";
import { Device, DeviceType, DeviceStatus, UpdateDeviceDto } from "@/sdk/types";

const editDeviceSchema = z.object({
  status: z.enum(["SUBMITTED", "ALLOCATED", "BLOCKED", "REMOVED"]).optional(),
  partnerBankId: z.string().optional(),
  merchantId: z.string().optional(),
  description: z.string().optional(),
});

type EditDeviceFormData = z.infer<typeof editDeviceSchema>;

interface EditDeviceModalProps {
  device: Device | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditDeviceModal({
  device,
  open,
  onOpenChange,
  onSuccess,
}: EditDeviceModalProps) {
  const { updateDevice, loading } = useDevices();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditDeviceFormData>({
    resolver: zodResolver(editDeviceSchema),
    defaultValues: {
      status: device?.status || "SUBMITTED",
      partnerBankId: device?.assignedTo?.uuid || '',
      merchantId: device?.merchantUuid || '',
      description: "",
    },
  });

  // Reset form when device changes
  useEffect(() => {
    if (device && open) {
      form.reset({
        status: device.status,
        partnerBankId: device.assignedTo?.uuid || "",
        merchantId: device.merchantUuid || "",
        description: "",
      });
    }
  }, [device, open, form]);

  const onSubmit = async (data: EditDeviceFormData) => {
    if (!device) return;

    try {
      setIsSubmitting(true);

      // Filter out empty strings and undefined values
      const updateData: UpdateDeviceDto = {};
      Object.entries(data).forEach(([key, value]) => {
        if (value !== "" && value !== undefined) {
          (updateData as any)[key] = value;
        }
      });

      await updateDevice(device.uuid, updateData);

      toast({
        title: "Success",
        description: "Device updated successfully",
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update device",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  if (!device) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Device</DialogTitle>
          <DialogDescription>
            Update device information for {device.deviceId}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SUBMITTED">Submitted</SelectItem>
                        <SelectItem value="ALLOCATED">Allocated</SelectItem>
                        <SelectItem value="BLOCKED">Blocked</SelectItem>
                        <SelectItem value="REMOVED">Removed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="partnerBankId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner Bank</FormLabel>
                    <FormControl>
                      <PartnerBankSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select partner bank"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="merchantId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Merchant</FormLabel>
                    <FormControl>
                      <MerchantSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select merchant"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter device description"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || loading}>
                {isSubmitting ? "Updating..." : "Update Device"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}