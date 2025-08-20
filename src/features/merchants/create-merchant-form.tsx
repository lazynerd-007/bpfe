'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Building2 } from 'lucide-react';
import { useCreateMerchant } from './hooks';
import { ExtendedCreateMerchantDto } from '@/sdk/types';
import { TerminalSelect, PartnerBankSelect, BankSelect, BranchSelect } from '@/components/dropdowns';

const createMerchantSchema = z.object({
  // Merchant Type
  merchantType: z.enum(['parent', 'sub-merchant']),
  parent: z.string().uuid().optional(),
  
  // Merchant Details
  merchantName: z.string().min(2, 'Merchant name must be at least 2 characters'),
  merchantNameSlug: z.string().optional(),
  merchantCode: z.string().min(1, 'Merchant code is required'),
  merchantCategory: z.number().min(1, 'Category is required'),
  orgType: z.number().min(1, 'Organization type is required'),
  terminal: z.string().uuid('Terminal must be a valid UUID'),
  merchantKey: z.string().min(1, 'Merchant key is required'),
  merchantToken: z.string().min(1, 'Merchant token is required'),
  notificationEmail: z.string().email('Please enter a valid email address'),
  country: z.enum(['GHANA']),
  address: z.string().optional(),
  canProcessCardTransactions: z.boolean().default(false),
  canProcessMomoTransactions: z.boolean().default(true),
  
  // Settlement Details
  settlementFrequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
  surchargeOn: z.enum(['CUSTOMER', 'MERCHANT', 'CUSTOMER_AND_MERCHANT', 'PARENT']),
  surchargeOnMerchant: z.number().min(0).max(1.5).default(0),
  surchargeOnCustomer: z.number().min(0).max(1.5).default(0),
  parentBank: z.string().uuid('Parent bank must be a valid UUID'),
  settlementAcct: z.enum(['PARENT_BANK', 'MERCHANT_BANK']),
  vatApplicable: z.boolean().default(false),
  vatPercentage: z.number().min(0).max(100).default(0),
  taxNumber: z.string().min(11).max(15),
  surchargeSum: z.boolean().default(false),
  
  // User Details
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phoneNumber: z.string().optional(),
  role: z.enum(['merchant']).default('merchant'),
  profileImage: z.string().optional(),
  
  // Bank Details
  bankId: z.string().uuid('Bank ID must be a valid UUID'),
  branch: z.string().uuid('Branch must be a valid UUID'),
  accountName: z.string().min(1, 'Account name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  accountType: z.enum(['CALL_ACCOUNT', 'CURRENT_ACCOUNT', 'SAVINGS', 'CREDIT', 'MB_WALLET_ACCOUNT', 'PLS_ACCOUNT', 'TDR_ACCOUNT']),
});

type CreateMerchantFormData = z.infer<typeof createMerchantSchema>;

const countries = [
  { value: 'GHANA', label: 'Ghana' },
];

const organizationTypes = [
  { value: 1, label: 'Private Limited Company' },
  { value: 2, label: 'Public Limited Company' },
  { value: 3, label: 'Partnership' },
  { value: 4, label: 'Sole Proprietorship' },
  { value: 5, label: 'NGO/Non-Profit' },
];

const accountTypes = [
  { value: 'CURRENT_ACCOUNT', label: 'Current Account' },
  { value: 'SAVINGS', label: 'Savings Account' },
  { value: 'CALL_ACCOUNT', label: 'Call Account' },
  { value: 'CREDIT', label: 'Credit Account' },
  { value: 'MB_WALLET_ACCOUNT', label: 'Mobile Wallet Account' },
  { value: 'PLS_ACCOUNT', label: 'PLS Account' },
  { value: 'TDR_ACCOUNT', label: 'TDR Account' },
];

const settlementFrequencies = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
];

const surchargeOptions = [
  { value: 'CUSTOMER', label: 'Customer' },
  { value: 'MERCHANT', label: 'Merchant' },
  { value: 'CUSTOMER_AND_MERCHANT', label: 'Customer and Merchant' },
  { value: 'PARENT', label: 'Parent' },
];

const settlementAccountTypes = [
  { value: 'PARENT_BANK', label: 'Parent Bank' },
  { value: 'MERCHANT_BANK', label: 'Merchant Bank' },
];

const merchantCategories = [
  { value: 5411, label: 'Grocery Stores, Supermarkets' },
  { value: 5812, label: 'Eating Places, Restaurants' },
  { value: 5999, label: 'Miscellaneous Retail' },
  { value: 6011, label: 'Financial Institutions' },
  { value: 7372, label: 'Computer Programming Services' },
  { value: 8220, label: 'Colleges, Universities' },
  { value: 8062, label: 'Hospitals' },
  { value: 4121, label: 'Taxicabs and Limousines' },
];

interface CreateMerchantFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateMerchantForm({ onSuccess, onCancel }: CreateMerchantFormProps) {
  const { create, loading, error } = useCreateMerchant();

  const form = useForm({
    resolver: zodResolver(createMerchantSchema),
    defaultValues: {
      merchantType: 'parent',
      parent: undefined,
      merchantName: '',
      merchantNameSlug: '',
      merchantCode: '',
      merchantCategory: 5411,
      orgType: 1,
      terminal: '',
      merchantKey: '',
      merchantToken: '',
      notificationEmail: '',
      country: 'GHANA',
      address: '',
      canProcessCardTransactions: false,
      canProcessMomoTransactions: true,
      settlementFrequency: 'MONTHLY',
      surchargeOn: 'CUSTOMER',
      surchargeOnMerchant: 0,
      surchargeOnCustomer: 0,
      parentBank: '',
      settlementAcct: 'PARENT_BANK',
      vatApplicable: false,
      vatPercentage: 0,
      taxNumber: '',
      surchargeSum: false,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      role: 'merchant',
      profileImage: '',
      bankId: '',
      branch: '',
      accountName: '',
      accountNumber: '',
      accountType: 'CURRENT_ACCOUNT',
    },
  });

  const onSubmit = async (data: CreateMerchantFormData) => {
    try {
      // Transform form data to match API structure
      const merchantData: ExtendedCreateMerchantDto = {
        merchantType: data.merchantType,
        parent: data.parent || undefined,
        merchantDetails: {
          merchantName: data.merchantName,
          merchantNameSlug: data.merchantNameSlug || data.merchantName.toLowerCase().replace(/\s+/g, '-'),
          merchantCode: data.merchantCode,
          merchantCategory: data.merchantCategory,
          orgType: data.orgType,
          terminal: data.terminal,
          merchantKey: data.merchantKey,
          merchantToken: data.merchantToken,
          notificationEmail: data.notificationEmail,
          country: data.country,
          address: data.address,
          canProcessCardTransactions: data.canProcessCardTransactions,
          canProcessMomoTransactions: data.canProcessMomoTransactions,
        },
        settlementDetails: {
          frequency: data.settlementFrequency,
          surchargeOn: data.surchargeOn,
          surchargeOnMerchant: data.surchargeOnMerchant,
          surchargeOnCustomer: data.surchargeOnCustomer,
          parentBank: data.parentBank,
          settlementAcct: data.settlementAcct,
          vatApplicable: data.vatApplicable,
          vatPercentage: data.vatPercentage,
          taxNumber: data.taxNumber,
          surchargeSum: data.surchargeSum,
        },
        userDetails: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          phoneNumber: data.phoneNumber,
          role: data.role,
          profileImage: data.profileImage,
        },
        bankDetails: {
          bankId: data.bankId,
          branch: data.branch,
          accountName: data.accountName,
          accountNumber: data.accountNumber,
          accountType: data.accountType,
        },
      };

      await create(merchantData);
      onSuccess?.();
      form.reset();
    } catch (error) {
      console.error('Merchant creation failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building2 className="h-5 w-5" />
          <span>Create New Merchant</span>
        </CardTitle>
        <CardDescription>
          Add a new merchant to the platform with their banking details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="merchantName">Merchant Name</Label>
                <Input
                  id="merchantName"
                  placeholder="Enter merchant name"
                  {...form.register('merchantName')}
                  disabled={loading}
                />
                {form.formState.errors.merchantName && (
                  <p className="text-sm text-red-500">{form.formState.errors.merchantName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="merchantCode">Merchant Code</Label>
                <Input
                  id="merchantCode"
                  placeholder="BP001"
                  {...form.register('merchantCode')}
                  disabled={loading}
                />
                {form.formState.errors.merchantCode && (
                  <p className="text-sm text-red-500">{form.formState.errors.merchantCode.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="notificationEmail">Notification Email</Label>
                <Input
                  id="notificationEmail"
                  type="email"
                  placeholder="notifications@merchant.com"
                  {...form.register('notificationEmail')}
                  disabled={loading}
                />
                {form.formState.errors.notificationEmail && (
                  <p className="text-sm text-red-500">{form.formState.errors.notificationEmail.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Country</Label>
                <Select
                  onValueChange={(value) => form.setValue('country', value as 'GHANA')}
                  defaultValue="GHANA"
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.country && (
                  <p className="text-sm text-red-500">{form.formState.errors.country.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Merchant Category</Label>
                <Select
                  onValueChange={(value) => form.setValue('merchantCategory', parseInt(value))}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {merchantCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value.toString()}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.merchantCategory && (
                  <p className="text-sm text-red-500">{form.formState.errors.merchantCategory.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Organization Type</Label>
                <Select
                  onValueChange={(value) => form.setValue('orgType', parseInt(value))}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value.toString()}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.orgType && (
                  <p className="text-sm text-red-500">{form.formState.errors.orgType.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="terminal">Terminal</Label>
                <TerminalSelect
                  value={form.watch('terminal')}
                  onValueChange={(value) => form.setValue('terminal', value)}
                  disabled={loading}
                  placeholder="Select terminal..."
                  className="w-full"
                />
                {form.formState.errors.terminal && (
                  <p className="text-sm text-red-500">{form.formState.errors.terminal.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address (Optional)</Label>
                <Input
                  id="address"
                  placeholder="Enter merchant address"
                  {...form.register('address')}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="merchantKey">Merchant Key</Label>
                <Input
                  id="merchantKey"
                  placeholder="mk_test_key_001"
                  {...form.register('merchantKey')}
                  disabled={loading}
                />
                {form.formState.errors.merchantKey && (
                  <p className="text-sm text-red-500">{form.formState.errors.merchantKey.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="merchantToken">Merchant Token</Label>
                <Input
                  id="merchantToken"
                  placeholder="mt_test_token_001"
                  {...form.register('merchantToken')}
                  disabled={loading}
                />
                {form.formState.errors.merchantToken && (
                  <p className="text-sm text-red-500">{form.formState.errors.merchantToken.message}</p>
                )}
              </div>
            </div>

            {/* Processing Options */}
            <div className="space-y-3">
              <Label>Processing Options</Label>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="canProcessMomoTransactions"
                    checked={form.watch('canProcessMomoTransactions')}
                    onCheckedChange={(checked) => 
                      form.setValue('canProcessMomoTransactions', checked as boolean)
                    }
                    disabled={loading}
                  />
                  <Label htmlFor="canProcessMomoTransactions">Mobile Money</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="canProcessCardTransactions"
                    checked={form.watch('canProcessCardTransactions')}
                    onCheckedChange={(checked) => 
                      form.setValue('canProcessCardTransactions', checked as boolean)
                    }
                    disabled={loading}
                  />
                  <Label htmlFor="canProcessCardTransactions">Card Payments</Label>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Settlement Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Settlement Details</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Settlement Frequency</Label>
                <Select
                  onValueChange={(value) => form.setValue('settlementFrequency', value as 'DAILY' | 'WEEKLY' | 'MONTHLY')}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {settlementFrequencies.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.settlementFrequency && (
                  <p className="text-sm text-red-500">{form.formState.errors.settlementFrequency.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Surcharge On</Label>
                <Select
                  onValueChange={(value) => form.setValue('surchargeOn', value as 'CUSTOMER' | 'MERCHANT' | 'CUSTOMER_AND_MERCHANT' | 'PARENT')}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select surcharge target" />
                  </SelectTrigger>
                  <SelectContent>
                    {surchargeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.surchargeOn && (
                  <p className="text-sm text-red-500">{form.formState.errors.surchargeOn.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="surchargeOnMerchant">Merchant Surcharge (%)</Label>
                <Input
                  id="surchargeOnMerchant"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1.5"
                  placeholder="0.00"
                  {...form.register('surchargeOnMerchant', { valueAsNumber: true })}
                  disabled={loading}
                />
                {form.formState.errors.surchargeOnMerchant && (
                  <p className="text-sm text-red-500">{form.formState.errors.surchargeOnMerchant.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="surchargeOnCustomer">Customer Surcharge (%)</Label>
                <Input
                  id="surchargeOnCustomer"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1.5"
                  placeholder="0.00"
                  {...form.register('surchargeOnCustomer', { valueAsNumber: true })}
                  disabled={loading}
                />
                {form.formState.errors.surchargeOnCustomer && (
                  <p className="text-sm text-red-500">{form.formState.errors.surchargeOnCustomer.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="parentBank">Parent Bank</Label>
                <PartnerBankSelect
                  value={form.watch('parentBank')}
                  onValueChange={(value) => form.setValue('parentBank', value)}
                  disabled={loading}
                  placeholder="Select parent bank..."
                  className="w-full"
                  showActiveOnly={true}
                />
                {form.formState.errors.parentBank && (
                  <p className="text-sm text-red-500">{form.formState.errors.parentBank.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Settlement Account Type</Label>
                <Select
                  onValueChange={(value) => form.setValue('settlementAcct', value as 'PARENT_BANK' | 'MERCHANT_BANK')}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    {settlementAccountTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.settlementAcct && (
                  <p className="text-sm text-red-500">{form.formState.errors.settlementAcct.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="taxNumber">Tax Number</Label>
                <Input
                  id="taxNumber"
                  placeholder="12345678901 (11-15 characters)"
                  {...form.register('taxNumber')}
                  disabled={loading}
                />
                {form.formState.errors.taxNumber && (
                  <p className="text-sm text-red-500">{form.formState.errors.taxNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vatPercentage">VAT Percentage (%)</Label>
                <Input
                  id="vatPercentage"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="0.00"
                  {...form.register('vatPercentage', { valueAsNumber: true })}
                  disabled={loading}
                />
                {form.formState.errors.vatPercentage && (
                  <p className="text-sm text-red-500">{form.formState.errors.vatPercentage.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vatApplicable"
                  checked={form.watch('vatApplicable')}
                  onCheckedChange={(checked) => 
                    form.setValue('vatApplicable', checked as boolean)
                  }
                  disabled={loading}
                />
                <Label htmlFor="vatApplicable">VAT Applicable</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="surchargeSum"
                  checked={form.watch('surchargeSum')}
                  onCheckedChange={(checked) => 
                    form.setValue('surchargeSum', checked as boolean)
                  }
                  disabled={loading}
                />
                <Label htmlFor="surchargeSum">Sum Surcharges</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* User Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">User Details</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  {...form.register('firstName')}
                  disabled={loading}
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  {...form.register('lastName')}
                  disabled={loading}
                />
                {form.formState.errors.lastName && (
                  <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">User Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@merchant.com"
                  {...form.register('email')}
                  disabled={loading}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+233501234567"
                  {...form.register('phoneNumber')}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password (min 8 characters)"
                {...form.register('password')}
                disabled={loading}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Bank Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Bank Details</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bankId">Bank</Label>
                <BankSelect
                  value={form.watch('bankId')}
                  onValueChange={(value) => {
                    form.setValue('bankId', value);
                    // Clear branch when bank changes
                    if (form.watch('branch')) {
                      form.setValue('branch', '');
                    }
                  }}
                  disabled={loading}
                  placeholder="Select bank..."
                  className="w-full"
                />
                {form.formState.errors.bankId && (
                  <p className="text-sm text-red-500">{form.formState.errors.bankId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <BranchSelect
                  value={form.watch('branch')}
                  onValueChange={(value) => form.setValue('branch', value)}
                  disabled={loading || !form.watch('bankId')}
                  placeholder="Select branch..."
                  className="w-full"
                  bankId={form.watch('bankId')}
                />
                {form.formState.errors.branch && (
                  <p className="text-sm text-red-500">{form.formState.errors.branch.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  placeholder="Account holder name"
                  {...form.register('accountName')}
                  disabled={loading}
                />
                {form.formState.errors.accountName && (
                  <p className="text-sm text-red-500">{form.formState.errors.accountName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="Account number"
                  {...form.register('accountNumber')}
                  disabled={loading}
                />
                {form.formState.errors.accountNumber && (
                  <p className="text-sm text-red-500">{form.formState.errors.accountNumber.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Account Type</Label>
              <Select
                onValueChange={(value) => form.setValue('accountType', value as 'CALL_ACCOUNT' | 'CURRENT_ACCOUNT' | 'SAVINGS' | 'CREDIT' | 'MB_WALLET_ACCOUNT' | 'PLS_ACCOUNT' | 'TDR_ACCOUNT')}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.accountType && (
                <p className="text-sm text-red-500">{form.formState.errors.accountType.message}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Creating...' : 'Create Merchant'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}