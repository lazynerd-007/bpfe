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
import { PhoneNumberInput } from "@/components/ui/phone-number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsers } from "../hooks";
import { useToast } from "@/hooks/use-toast";
import { UserRoleEnum } from "@/sdk/types";
import { IconPlus, IconRefresh } from "@tabler/icons-react";
import { getAllRoles, getRoleIcon } from "@/lib/user-roles";
import { PartnerBankSelect } from "@/components/dropdowns";

const createUserSchema = z.object({
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .refine((val) => /^[a-zA-Z\s]+$/.test(val), "First name can only contain letters and spaces"),
  lastName: z.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .refine((val) => /^[a-zA-Z\s]+$/.test(val), "Last name can only contain letters and spaces"),
  email: z.string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters")
    .toLowerCase(),
  phoneNumber: z.string()
    .min(1, "Phone number is required")
    .refine((val) => {
      // Phone input component handles formatting, so we just need to check it's a valid E.164 format
      return /^\+[1-9]\d{1,14}$/.test(val?.trim() || "");
    }, "Please enter a valid phone number"),
  role: z.enum(["administrator", "merchant", "partner-bank", "submerchant"], {
    errorMap: () => ({ message: "Please select a valid role" })
  }),
  partnerBankId: z.string().optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserFormProps {
  onSuccess?: () => void;
}

export function CreateUserForm({ onSuccess }: CreateUserFormProps) {
  const { createUser, loading } = useUsers();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      role: "merchant",
      partnerBankId: "",
    },
  });

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      setIsSubmitting(true);
      
      // Clear any existing form errors
      form.clearErrors();
      
      // Generate auto-password following legacy pattern: firstName_001
      const autoPassword = `${data.firstName}_001`;
      const userData = { ...data, password: autoPassword };
      
      // Remove empty optional fields and trim phone number
      const cleanUserData = {
        ...userData,
        phoneNumber: userData.phoneNumber?.trim() || undefined,
        partnerBankId: userData.partnerBankId || undefined,
      };

      await createUser({ ...cleanUserData, role: cleanUserData.role as UserRoleEnum });
      
      toast({
        title: "User Created Successfully",
        description: `${data.firstName} ${data.lastName} has been added with the role of ${data.role}. The temporary password is: ${autoPassword}`,
      });
      
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      console.error('User creation error:', error);
      
      // Handle validation errors from backend
      if (error?.response?.status === 400 && error?.response?.data) {
        const errorData = error.response.data;
        
        // Handle specific validation errors
        if (typeof errorData.message === 'string') {
          // Check for common uniqueness errors
          if (errorData.message.toLowerCase().includes('email') && 
              (errorData.message.toLowerCase().includes('exists') || 
               errorData.message.toLowerCase().includes('unique') ||
               errorData.message.toLowerCase().includes('duplicate'))) {
            form.setError("email", {
              message: "This email address is already registered. Please use a different email."
            });
            return;
          }
          
          // Check for phone number validation
          if (errorData.message.toLowerCase().includes('phone')) {
            form.setError("phoneNumber", {
              message: errorData.message
            });
            return;
          }
          
          // Check for role validation
          if (errorData.message.toLowerCase().includes('role')) {
            form.setError("role", {
              message: errorData.message
            });
            return;
          }
        }
        
        // Handle array of validation errors
        if (Array.isArray(errorData.message)) {
          errorData.message.forEach((msg: string) => {
            if (msg.toLowerCase().includes('email')) {
              form.setError("email", { message: msg });
            } else if (msg.toLowerCase().includes('phone')) {
              form.setError("phoneNumber", { message: msg });
            } else if (msg.toLowerCase().includes('firstname') || msg.toLowerCase().includes('first name')) {
              form.setError("firstName", { message: msg });
            } else if (msg.toLowerCase().includes('lastname') || msg.toLowerCase().includes('last name')) {
              form.setError("lastName", { message: msg });
            } else if (msg.toLowerCase().includes('role')) {
              form.setError("role", { message: msg });
            }
          });
          return;
        }
      }
      
      // Handle network errors
      if (error?.code === 'NETWORK_ERROR' || !error?.response) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to the server. Please check your connection and try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Handle 401/403 errors
      if (error?.response?.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        return;
      }
      
      if (error?.response?.status === 403) {
        toast({
          title: "Permission Error",
          description: "You don't have permission to create users.",
          variant: "destructive",
        });
        return;
      }
      
      // Generic error fallback
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Failed to create user. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRole = form.watch("role");

  // Clear field errors when user starts typing
  const clearFieldError = (fieldName: keyof CreateUserFormData) => {
    if (form.formState.errors[fieldName]) {
      form.clearErrors(fieldName);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter first name" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      clearFieldError("firstName");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter last name" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      clearFieldError("lastName");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="Enter email address" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      clearFieldError("email");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <PhoneNumberInput
                    {...field}
                    onChange={(value) => {
                      field.onChange(value);
                      clearFieldError("phoneNumber");
                    }}
                    placeholder="Enter phone number"
                    error={!!form.formState.errors.phoneNumber}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    clearFieldError("role");
                  }} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getAllRoles().map((role) => {
                      const RoleIcon = getRoleIcon(role.value);
                      return (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center gap-2">
                            <RoleIcon size={16} className="text-muted-foreground" />
                            {role.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {(selectedRole === "merchant" || selectedRole === "submerchant") && (
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
          )}
        </div>


        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => form.reset()}
          >
            <IconRefresh className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || loading}
          >
            <IconPlus className="w-4 h-4 mr-2" />
            {isSubmitting ? "Creating..." : "Create User"}
          </Button>
        </div>
      </form>
    </Form>
  );
}