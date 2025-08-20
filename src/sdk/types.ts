export interface ApiResponse<T = unknown> {
  status: string;
  message: string;
  data: T;
  total?: number;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

// Standardized Error Types
export interface ApiError extends Error {
  code: string;
  statusCode: number;
  details?: unknown;
  timestamp: string;
}

export interface ValidationError extends ApiError {
  field: string;
  value: unknown;
  constraints: string[];
}

export interface NetworkError extends ApiError {
  timeout: boolean;
  offline: boolean;
  retryable: boolean;
}

export interface BusinessError extends ApiError {
  businessCode: string;
  category: 'AUTHENTICATION' | 'AUTHORIZATION' | 'BUSINESS_RULE' | 'RESOURCE_NOT_FOUND';
}

export type ErrorType = 'VALIDATION' | 'NETWORK' | 'BUSINESS' | 'UNKNOWN';

export interface ErrorContext {
  endpoint: string;
  method: string;
  requestId?: string;
  userId?: string;
}

// Filter Interfaces
export interface TransactionFilters extends Record<string, unknown> {
  status?: TransactionStatus;
  type?: TransactionType;
  source?: TransactionSource;
  processor?: Telco;
  startDate?: string;
  endDate?: string;
  merchantId?: string;
  customerPhone?: string;
  amountMin?: number;
  amountMax?: number;
  page?: number;
  limit?: number;
}

export interface MerchantFilters extends Record<string, unknown> {
  status?: string;
  country?: string;
  partnerBankId?: string;
  canProcessCardTransactions?: boolean;
  canProcessMomoTransactions?: boolean;
  search?: string;
  merchantName?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  perPage?: number;
  limit?: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: UserRoleEnum;
  status: UserStatus;
  smsEnabled?: boolean;
  emailEnabled?: boolean;
  merchantId?: string;
  partnerBankId?: string;
  merchant?: Merchant;
  subMerchant?: SubMerchant;
  createdAt: string;
  updatedAt: string;
}

export enum UserRoleEnum {
  MERCHANT = 'merchant',
  ADMIN = 'administrator',
  SUB_MERCHANT = 'submerchant',
  PARTNER_BANK = 'partner-bank',
}


export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';

export interface Merchant {
  uuid: string;
  merchantCode: string;
  merchantName: string;
  merchantNameSlug: string;
  merchantCategoryCode: string;
  canProcessCardTransactions: boolean;
  canProcessMomoTransactions: boolean;
  merchantKey: string;
  merchantToken: string;
  notificationEmail: string;
  country: string;
  partnerBankId: string;
  webhookUrl?: string;
  settlementDetails: Settlement;
  bankDetails: MerchantBankDetails;
  apiKey: MerchantApiKeys;
}

export interface SubMerchant {
  uuid: string;
  name: string;
  email: string;
  phoneNumber: string;
  merchantId: string;
  status: UserStatus;
}

export interface Settlement {
  uuid: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  sortCode?: string;
}

export interface MerchantBankDetails {
  uuid: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  sortCode?: string;
}

export interface MerchantApiKeys {
  uuid: string;
  publicKey: string;
  secretKey: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  uuid: string;
  merchantId: string;
  processor: Telco;
  status: TransactionStatus;
  type: TransactionType;
  source: TransactionSource;
  amount: number;
  surchargeOnCustomer: number;
  surchargeOnMerchant: number;
  customer: Customer;
  currency: string;
  transactionRef: string;
  description: string;
  processorResponse: Record<string, unknown>;
  elevyResponse: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type Telco = 'AIRTEL' | 'MTN' | 'TIGO' | 'VODAFONE' | 'ORANGE';
export type TransactionStatus = 'PENDING' | 'FAILED' | 'SUCCESSFUL';
export type TransactionType = 'MONEY_IN' | 'MONEY_OUT' | 'RE_QUERY' | 'REVERSAL';
export type TransactionSource = 'MOMO' | 'CARD';

export interface Customer {
  name: string;
  email?: string;
  phoneNumber: string;
}

export type DeviceStatus = 'SUBMITTED' | 'ALLOCATED' | 'BLOCKED' | 'REMOVED';
export type DeviceType = 'POS' | 'ATM' | 'MOBILE';
export type PartnerBankStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';

export interface Device {
  uuid: string;
  deviceId: string;
  status: DeviceStatus;
  merchantUuid?: string;
  merchant?: Merchant;
  assignedTo?: PartnerBank;
  transactions?: Transaction[];
  createdAt: string;
  updatedAt: string;
}

export interface Terminal {
  id: string;
  terminalId: string;
  serialNo: string;
  active: boolean;
  location?: string;
  partnerBankId?: string;
  merchantId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerBank {
  uuid: string;
  name: string;
  slug?: string;
  commissionRatio?: number;
  settlementBank?: string | Record<string, unknown>;
  commissionBank?: string | Record<string, unknown>;
  fileHeaders?: string[];
  devices?: Device[];
  merchants?: Merchant[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  userType?: 'finance' | 'support' | 'administrator' | 'merchant' | 'submerchant' | 'partner-bank';
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthTokenPayload {
  user: User;
  merchantId?: string;
}

export interface TransactionRequest {
  amount: number;
  phoneNumber: string;
  processor: Telco;
  description?: string;
  customerName?: string;
  customerEmail?: string;
}

// Extended Transaction Creation DTO (used by forms)
export interface CreateTransactionDto {
  merchantId: string;
  processor: Telco;
  type: 'MOBILE_MONEY' | 'CARD';
  surchargeOn: 'CUSTOMER' | 'MERCHANT' | 'CUSTOMER_AND_MERCHANT' | 'PARENT';
  amount: number;
  customer: {
    name: string;
    email?: string;
    mobileNumber: string;
    amount: number;
  };
  currency: string;
  transactionRef: string;
  description: string;
}

// Analytics Response matching Postman collection AnalyticsResponse schema
export interface TransactionAnalytics {
  successTotalMoneyInAmount: number;
  successTotalMoneyInCount: number;
  successTotalMoneyOutAmount: number;
  successTotalMoneyOutCount: number;
  failedTotalAmount: number;
  failedTotalCount: number;
  
  timeScaleData: Array<{
    transactionHour?: string;
    dayOfWeek?: string;
    monthOfYear?: string;
    successfulAmount: string;
    failedAmount: string;
  }>;
  
  // Legacy fields for backward compatibility
  totalTransactions?: number;
  totalAmount?: number;
  successfulTransactions?: number;
  failedTransactions?: number;
  pendingTransactions?: number;
  transactionsByDate?: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
}

export interface WalletBalance {
  balance: number;
  currency: string;
  lastUpdated: string;
}

// Commission Types
export interface Commission {
  id: string;
  type: CommissionType;
  rate?: number;
  amount?: number;
  currency?: string;
  status: CommissionStatus;
  merchantId?: string;
  partnerBankId?: string;
  minTransactionAmount?: number;
  maxTransactionAmount?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type CommissionType = 'PERCENTAGE' | 'FIXED' | 'TIERED';
export type CommissionStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export interface CreateCommissionDto {
  type: CommissionType;
  rate?: number;
  amount?: number;
  currency?: string;
  merchantId?: string;
  partnerBankId?: string;
  minTransactionAmount?: number;
  maxTransactionAmount?: number;
  description?: string;
}

export interface UpdateCommissionDto {
  type?: CommissionType;
  rate?: number;
  amount?: number;
  currency?: string;
  status?: CommissionStatus;
  merchantId?: string;
  partnerBankId?: string;
  minTransactionAmount?: number;
  maxTransactionAmount?: number;
  description?: string;
}

// Device Types (matching API)
export interface CreateDeviceDto {
  deviceId: string;
}

export interface UpdateDeviceDto {
  serialNumber?: string;
  deviceType?: DeviceType;
  model?: string;
  manufacturer?: string;
  location?: string;
  status?: DeviceStatus;
  partnerBankId?: string;
  merchantId?: string;
  description?: string;
}

export interface CreateTerminalDto {
  terminalId: string;
  serialNo: string;
  location?: string;
  partnerBankId?: string;
  merchantId?: string;
}

export interface UpdateTerminalDto {
  terminalId?: string;
  serialNo?: string;
  active?: boolean;
  location?: string;
  partnerBankId?: string;
  merchantId?: string;
}

// Partner Bank Types (extended)
export interface CreatePartnerBankDto {
  name: string;
  code: string;
  country: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  description?: string;
  swiftCode?: string;
  routingNumber?: string;
}

export interface UpdatePartnerBankDto {
  name?: string;
  code?: string;
  country?: string;
  status?: PartnerBankStatus;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  description?: string;
  swiftCode?: string;
  routingNumber?: string;
  email?: string;
  commissionRatio?: number;
  commissionBank?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
  settlementBank?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
}

// User Types (extended)
export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: UserRoleEnum;
  partnerBankId?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  role?: UserRoleEnum;
  status?: UserStatus;
  partnerBankId?: string;
}


// Merchant Types (extended)
export interface CreateMerchantDto {
  merchantName: string;
  merchantCategoryCode: string;
  notificationEmail: string;
  country: string;
  canProcessCardTransactions?: boolean;
  canProcessMomoTransactions?: boolean;
  settlementBankName: string;
  settlementAccountNumber: string;
  settlementAccountName: string;
  settlementSortCode?: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  sortCode?: string;
  partnerBankId?: string;
  webhookUrl?: string;
}

export interface UpdateMerchantDto {
  merchantName?: string;
  merchantCategoryCode?: string;
  notificationEmail?: string;
  country?: string;
  canProcessCardTransactions?: boolean;
  canProcessMomoTransactions?: boolean;
  settlementBankName?: string;
  settlementAccountNumber?: string;
  settlementAccountName?: string;
  settlementSortCode?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  sortCode?: string;
  partnerBankId?: string;
  webhookUrl?: string;
  status?: string;
}


// Extended Partner Bank Form DTO (used by forms with additional fields)
export interface CreatePartnerBankFormDto {
  name: string;
  email: string;
  commissionBank: string;
  settlementBank: string;
  commissionRatio: number;
  headers: string[];
  logo?: File;
}

// Settlement Types  
export interface Settlement {
  uuid: string;
  frequency: SettlementFrequency;
  surchargeOn: SurchargeType;
  surchargeOnMerchant: number;
  surchargeOnCustomer: number;
  parentBank: string;
  settlementAcct: SettlementAccount;
  vatApplicable: boolean;
  vatPercentage: number;
  taxNumber?: string;
  surchargeSum: boolean;
  merchantId?: string;
  status: SettlementStatus;
  createdAt: string;
  updatedAt: string;
}

export type SettlementFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type SurchargeType = 'CUSTOMER' | 'MERCHANT' | 'CUSTOMER_AND_MERCHANT' | 'PARENT';
export type SettlementAccount = 'PARENT_BANK' | 'MERCHANT_BANK';
export type SettlementStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export interface CreateSettlementDto {
  frequency: SettlementFrequency;
  surchargeOn: SurchargeType;
  surchargeOnMerchant: number;
  surchargeOnCustomer: number;
  parentBank: string;
  settlementAcct: SettlementAccount;
  vatApplicable: boolean;
  vatPercentage: number;
  taxNumber?: string;
  surchargeSum: boolean;
  merchantId?: string;
}

export interface UpdateSettlementDto {
  frequency?: SettlementFrequency;
  surchargeOn?: SurchargeType;
  surchargeOnMerchant?: number;
  surchargeOnCustomer?: number;
  parentBank?: string;
  settlementAcct?: SettlementAccount;
  vatApplicable?: boolean;
  vatPercentage?: number;
  taxNumber?: string;
  surchargeSum?: boolean;
  status?: SettlementStatus;
}

// Telcos Management Types
export interface TelcoManagement {
  uuid: string;
  telco: Telco;
  name: string;
  apiUrl: string;
  apiKey?: string;
  secretKey?: string;
  merchantId?: string;
  isActive: boolean;
  config?: Record<string, unknown>;
  status: TelcoStatus;
  createdAt: string;
  updatedAt: string;
}

export type TelcoStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'TESTING';

export interface CreateTelcoManagementDto {
  telco: Telco;
  name: string;
  apiUrl: string;
  apiKey?: string;
  secretKey?: string;
  merchantId?: string;
  config?: Record<string, unknown>;
}

export interface UpdateTelcoManagementDto {
  telco?: Telco;
  name?: string;
  apiUrl?: string;
  apiKey?: string;
  secretKey?: string;
  merchantId?: string;
  isActive?: boolean;
  config?: Record<string, unknown>;
  status?: TelcoStatus;
}

// Query DTOs
export interface QueryDto {
  page?: number;
  perPage?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  startDate?: string;
  endDate?: string;
  status?: string;
  paginateData?: boolean;
}

// Account Types for Merchant Bank Details
export type AccountType = 'CALL_ACCOUNT' | 'CURRENT_ACCOUNT' | 'SAVINGS' | 'CREDIT' | 'MB_WALLET_ACCOUNT' | 'PLS_ACCOUNT' | 'TDR_ACCOUNT';

// Extended Merchant Creation DTO (used by forms that create merchant with settlement, user, and bank details)
export interface ExtendedCreateMerchantDto {
  merchantType: 'parent' | 'sub-merchant';
  parent?: string;
  merchantDetails: {
    merchantName: string;
    merchantNameSlug?: string;
    merchantCode: string;
    merchantCategory: number;
    orgType: number;
    terminal: string;
    merchantKey: string;
    merchantToken: string;
    notificationEmail: string;
    country: string;
    address?: string;
    canProcessCardTransactions: boolean;
    canProcessMomoTransactions: boolean;
  };
  settlementDetails: {
    frequency: SettlementFrequency;
    surchargeOn: SurchargeType;
    surchargeOnMerchant: number;
    surchargeOnCustomer: number;
    parentBank: string;
    settlementAcct: SettlementAccount;
    vatApplicable: boolean;
    vatPercentage: number;
    taxNumber: string;
    surchargeSum: boolean;
  };
  userDetails: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    role: 'merchant';
    profileImage?: string;
  };
  bankDetails: {
    bankId: string;
    branch: string;
    accountName: string;
    accountNumber: string;
    accountType: AccountType;
  };
}