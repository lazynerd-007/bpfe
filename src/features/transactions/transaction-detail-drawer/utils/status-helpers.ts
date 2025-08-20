import { Transaction } from '@/sdk/types';

export const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'SUCCESSFUL':
      return 'default';
    case 'FAILED':
      return 'destructive';
    case 'PENDING':
      return 'secondary';
    default:
      return 'outline';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'SUCCESSFUL':
      return 'text-green-600';
    case 'FAILED':
      return 'text-red-600';
    case 'PENDING':
      return 'text-yellow-600';
    default:
      return 'text-gray-600';
  }
};

export const getFailureReason = (transaction: Transaction, transactionStatus?: any) => {
  if (transaction?.status !== 'FAILED') return null;
  
  // Check statusMessage from API
  if (transactionStatus?.statusMessage) {
    return transactionStatus.statusMessage;
  }
  
  // Check transaction description
  if (transaction.description) {
    return transaction.description;
  }
  
  // Check processor response for error messages
  if (transaction.processorResponse) {
    const response = transaction.processorResponse;
    
    // Common error fields in processor responses
    const errorFields = [
      'error', 'message', 'errorMessage', 'reason', 'description',
      'failureReason', 'responseMessage', 'statusDescription'
    ];
    
    for (const field of errorFields) {
      if (response[field]) {
        return response[field];
      }
    }
    
    // If response has error code, show it
    if (response.errorCode || response.responseCode) {
      return `Error Code: ${response.errorCode || response.responseCode}`;
    }
  }
  
  return 'Transaction failed - reason not specified';
};