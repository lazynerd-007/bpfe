export const ACTION_MESSAGES = {
  PENDING: {
    icon: '💡',
    message: 'This transaction is pending. You can re-query to check for status updates from the processor.',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
  },
  SUCCESSFUL: {
    icon: '✅',
    message: 'This transaction completed successfully. You can reverse it if needed.',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
  },
  FAILED: {
    icon: '❌',
    message: 'This transaction failed. No further actions can be performed.',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
  },
};

export const TRANSACTION_TYPES = {
  MONEY_IN: 'Money In',
  MONEY_OUT: 'Money Out',
  TRANSFER: 'Transfer',
} as const;

export const PROCESSORS = {
  MTN: 'MTN Mobile Money',
  VODAFONE: 'Vodafone Cash',
  AIRTEL: 'AirtelTigo Money',
  ORANGE: 'Orange Money',
} as const;