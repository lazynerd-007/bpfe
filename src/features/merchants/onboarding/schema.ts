import { z } from 'zod';

// Simplified merchant creation schema based on legacy implementation
export const createMerchantSchema = z.object({
  // Merchant Details
  merchantCode: z.string().min(1, 'Merchant code is required'),
  merchantName: z.string().min(2, 'Merchant name must be at least 2 characters'),
  merchantAddress: z.string().min(1, 'Merchant address is required'),
  notificationEmail: z.string().email('Please enter a valid email address'),
  country: z.string().min(1, 'Country is required'),
  tinNumber: z.string().min(11, 'TIN must be at least 11 characters').max(15, 'TIN cannot exceed 15 characters'),
  orgType: z.number().min(1, 'Organization type is required'),
  merchantCategory: z.number().min(1, 'Merchant category is required'),
  terminal: z.string().uuid('Terminal must be a valid UUID'),
  
  // Settlement Details
  settlementFrequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
  surcharge: z.enum(['Customer', 'Merchant', 'BOTH']),
  partnerBank: z.string().uuid('Partner bank must be a valid UUID'),
  settlementAccount: z.enum(['PARENT_BANK', 'MERCHANT_BANK']),
  totalSurcharge: z.number().min(0).max(1.5, 'Total surcharge cannot exceed 1.5%'),
  merchantPercentageSurcharge: z.number().min(0).max(1.5).default(0),
  customerPercentageSurcharge: z.number().min(0).max(1.5).default(0),
  surchargeCap: z.number().min(1).max(100).optional(),
  surchargeHasCap: z.boolean().default(true),
  
  // User Details  
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').max(12, 'Phone number cannot exceed 12 digits'),
  
  // Bank Details
  merchantBank: z.string().uuid('Merchant bank must be a valid UUID'),
  branch: z.string().uuid('Branch must be a valid UUID'),
  accountType: z.enum(['CURRENT_ACCOUNT', 'SAVINGS', 'CALL_ACCOUNT']),
  accountNumber: z.string().min(1, 'Account number is required'),
  accountName: z.string().min(1, 'Account name is required'),
  
  // OVA Details
  mtnOva: z.object({
    ovaUuid: z.string().min(1, 'MTN OVA is required'),
    telco: z.string()
  }),
  airtelOva: z.object({
    ovaUuid: z.string().min(1, 'Airtel OVA is required'),
    telco: z.string()
  }),
  telecelOva: z.object({
    ovaUuid: z.string().min(1, 'Telecel OVA is required'),
    telco: z.string()
  })
});

// Step 1: Merchant Details Schema
export const merchantDetailsSchema = createMerchantSchema.pick({
  merchantCode: true,
  merchantName: true,
  merchantAddress: true,
  notificationEmail: true,
  country: true,
  tinNumber: true,
  orgType: true,
  merchantCategory: true,
  terminal: true,
});

// Step 2: Settlement Details Schema
export const settlementDetailsSchema = createMerchantSchema.pick({
  settlementFrequency: true,
  surcharge: true,
  partnerBank: true,
  settlementAccount: true,
  totalSurcharge: true,
  merchantPercentageSurcharge: true,
  customerPercentageSurcharge: true,
  surchargeCap: true,
  surchargeHasCap: true,
});

// Step 3: User Details Schema
export const userDetailsSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number cannot exceed 15 digits'),
});

// Step 4: Bank Details Schema  
export const bankDetailsSchema = createMerchantSchema.pick({
  merchantBank: true,
  branch: true,
  accountType: true,
  accountNumber: true,
  accountName: true,
});

// Step 5: OVA Details Schema
export const ovaDetailsSchema = z.object({
  mtnOva: z.object({
    ovaUuid: z.string(),
    telco: z.string()
  }),
  airtelOva: z.object({
    ovaUuid: z.string(),
    telco: z.string()
  }),
  telecelOva: z.object({
    ovaUuid: z.string(),
    telco: z.string()
  }),
});

// Type exports
export type CreateMerchantFormData = z.infer<typeof createMerchantSchema>;
export type MerchantDetailsFormData = z.infer<typeof merchantDetailsSchema>;
export type SettlementDetailsFormData = z.infer<typeof settlementDetailsSchema>;
export type UserDetailsFormData = z.infer<typeof userDetailsSchema>;
export type BankDetailsFormData = z.infer<typeof bankDetailsSchema>;
export type OvaDetailsFormData = z.infer<typeof ovaDetailsSchema>;

// Constants (moved from original form)
export const countries = [
  { value: 'GHANA', label: 'Ghana' },
];

export const organizationTypes = [
  { value: 1, label: 'Private Limited Company' },
  { value: 2, label: 'Public Limited Company' },
  { value: 3, label: 'Partnership' },
  { value: 4, label: 'Sole Proprietorship' },
  { value: 5, label: 'NGO/Non-Profit' },
];

export const accountTypes = [
  { value: 'CURRENT_ACCOUNT', label: 'Current Account' },
  { value: 'SAVINGS', label: 'Savings Account' },
  { value: 'CALL_ACCOUNT', label: 'Call Account' },
];

export const settlementFrequencies = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
];

export const surchargeOptions = [
  { value: 'Customer', label: 'Customer' },
  { value: 'Merchant', label: 'Merchant' },
  { value: 'BOTH', label: 'Both' },
];

export const settlementAccountTypes = [
  { value: 'PARENT_BANK', label: 'Parent Bank' },
  { value: 'MERCHANT_BANK', label: 'Merchant Bank' },
];

// API-compliant enum mappings for validation
export const apiEnumMappings = {
  frequency: {
    'DAILY': 'daily',
    'WEEKLY': 'weekly', 
    'MONTHLY': 'monthly'
  },
  surcharge: {
    'Customer': 'customer',
    'Merchant': 'merchant',
    'BOTH': 'customer_and_merchant'
  },
  settlementAccount: {
    'PARENT_BANK': 'parent-bank',
    'MERCHANT_BANK': 'sub-merchant-bank'
  },
  accountType: {
    'CURRENT_ACCOUNT': 'current_account',
    'SAVINGS': 'savings',
    'CALL_ACCOUNT': 'call_account'
  }
};

export const merchantCategories = [
  { value: 5411, label: 'Grocery Stores, Supermarkets' },
  { value: 5812, label: 'Eating Places, Restaurants' },
  { value: 5999, label: 'Miscellaneous Retail' },
  { value: 6011, label: 'Financial Institutions' },
  { value: 7372, label: 'Computer Programming Services' },
  { value: 8220, label: 'Colleges, Universities' },
  { value: 8062, label: 'Hospitals' },
  { value: 4121, label: 'Taxicabs and Limousines' },
];