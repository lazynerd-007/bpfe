import { AxiosError } from 'axios';
import { 
  ApiError, 
  ValidationError, 
  NetworkError, 
  BusinessError, 
  ErrorType, 
  ErrorContext, 
  ApiResponse 
} from './types';

/**
 * Creates a standardized API error from an Axios error or response
 */
export function createApiError(
  error: AxiosError | unknown,
  context: ErrorContext,
  fallbackMessage: string
): ApiError {
  const timestamp = new Date().toISOString();

  // Handle network errors
  if (error instanceof AxiosError) {
    if (!error.response) {
      // Handle specific network errors
      if (error.code === 'ERR_HTTP2_PROTOCOL_ERROR') {
        return createNetworkError(error, context, timestamp);
      }
      return createNetworkError(error, context, timestamp);
    }

    const { response } = error;
    const apiResponse = response.data as ApiResponse<unknown>;

    // Handle different HTTP status codes
    switch (response.status) {
      case 400:
        return createValidationError(apiResponse, context, timestamp);
      case 401:
        return createBusinessError(
          'AUTHENTICATION_FAILED',
          'AUTHENTICATION',
          apiResponse.message || 'Authentication failed',
          response.status,
          context,
          timestamp
        );
      case 403:
        return createBusinessError(
          'AUTHORIZATION_FAILED',
          'AUTHORIZATION',
          apiResponse.message || 'Access denied',
          response.status,
          context,
          timestamp
        );
      case 404:
        return createBusinessError(
          'RESOURCE_NOT_FOUND',
          'RESOURCE_NOT_FOUND',
          apiResponse.message || 'Resource not found',
          response.status,
          context,
          timestamp
        );
      case 422:
        return createValidationError(apiResponse, context, timestamp);
      case 500:
      case 502:
      case 503:
      case 504:
        return createServerError(apiResponse, response.status, context, timestamp);
      default:
        return createGenericApiError(
          apiResponse.message || fallbackMessage,
          response.status,
          context,
          timestamp,
          apiResponse
        );
    }
  }

  // Handle non-Axios errors
  if (error instanceof Error) {
    return createGenericApiError(
      error.message || fallbackMessage,
      500,
      context,
      timestamp,
      error
    );
  }

  // Handle unknown errors
  return createGenericApiError(
    fallbackMessage,
    500,
    context,
    timestamp,
    error
  );
}

/**
 * Creates a network error (connection issues, timeouts, etc.)
 */
function createNetworkError(
  error: AxiosError,
  context: ErrorContext,
  timestamp: string
): NetworkError {
  const isTimeout = error.code === 'ECONNABORTED' || error.message.includes('timeout');
  const isOffline = !navigator.onLine;

  return {
    name: 'NetworkError',
    message: isTimeout 
      ? 'Request timed out. Please try again.' 
      : 'Network connection failed. Please check your internet connection.',
    code: 'NETWORK_ERROR',
    statusCode: 0,
    timeout: isTimeout,
    offline: isOffline,
    retryable: true,
    timestamp,
    details: {
      context,
      axiosError: {
        code: error.code,
        message: error.message,
      }
    }
  };
}

/**
 * Creates a validation error from API response
 */
function createValidationError(
  apiResponse: ApiResponse<unknown>,
  context: ErrorContext,
  timestamp: string
): ValidationError {
  // Try to extract field-specific validation errors
  const details = apiResponse.data as any;
  
  if (details && details.field) {
    return {
      name: 'ValidationError',
      message: apiResponse.message || 'Validation failed',
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      field: details.field,
      value: details.value,
      constraints: details.constraints || [],
      timestamp,
      details: { context, apiResponse }
    };
  }

  // Generic validation error
  return {
    name: 'ValidationError',
    message: apiResponse.message || 'Invalid input provided',
    code: 'VALIDATION_ERROR',
    statusCode: 400,
    field: 'unknown',
    value: null,
    constraints: [apiResponse.message || 'Invalid input'],
    timestamp,
    details: { context, apiResponse }
  };
}

/**
 * Creates a business logic error
 */
function createBusinessError(
  businessCode: string,
  category: BusinessError['category'],
  message: string,
  statusCode: number,
  context: ErrorContext,
  timestamp: string
): BusinessError {
  return {
    name: 'BusinessError',
    message,
    code: 'BUSINESS_ERROR',
    statusCode,
    businessCode,
    category,
    timestamp,
    details: { context }
  };
}

/**
 * Creates a server error (5xx status codes)
 */
function createServerError(
  apiResponse: ApiResponse<unknown>,
  statusCode: number,
  context: ErrorContext,
  timestamp: string
): ApiError {
  return {
    name: 'ApiError',
    message: statusCode >= 500 
      ? 'Server error occurred. Please try again later.' 
      : apiResponse.message || 'Server error',
    code: 'SERVER_ERROR',
    statusCode,
    timestamp,
    details: { context, apiResponse }
  };
}

/**
 * Creates a generic API error
 */
function createGenericApiError(
  message: string,
  statusCode: number,
  context: ErrorContext,
  timestamp: string,
  details?: unknown
): ApiError {
  return {
    name: 'ApiError',
    message,
    code: 'API_ERROR',
    statusCode,
    timestamp,
    details: { context, originalError: details }
  };
}

/**
 * Determines the error type for categorization
 */
export function getErrorType(error: ApiError): ErrorType {
  if (error.name === 'ValidationError') return 'VALIDATION';
  if (error.name === 'NetworkError') return 'NETWORK';
  if (error.name === 'BusinessError') return 'BUSINESS';
  return 'UNKNOWN';
}

/**
 * Checks if an error is retryable
 */
export function isRetryableError(error: ApiError): boolean {
  // Network errors are generally retryable
  if (error.name === 'NetworkError') {
    return (error as NetworkError).retryable;
  }

  // Server errors (5xx) are retryable
  if (error.statusCode >= 500) {
    return true;
  }

  // Rate limiting (429) is retryable
  if (error.statusCode === 429) {
    return true;
  }

  // Client errors (4xx) are generally not retryable
  return false;
}

/**
 * Gets a user-friendly error message
 */
export function getUserFriendlyMessage(error: ApiError): string {
  // Return custom user-friendly messages for common errors
  switch (error.code) {
    case 'NETWORK_ERROR':
      return 'Connection problem. Please check your internet and try again.';
    case 'VALIDATION_ERROR':
      return error.message; // Validation messages are usually already user-friendly
    case 'AUTHENTICATION_FAILED':
      return 'Please log in to continue.';
    case 'AUTHORIZATION_FAILED':
      return 'You don\'t have permission to perform this action.';
    case 'SERVER_ERROR':
      return 'Something went wrong on our end. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
}

/**
 * Validates API response and handles errors consistently
 */
export function validateApiResponse<T>(
  response: ApiResponse<T>,
  context: ErrorContext,
  fallbackMessage: string
): T {
  if (response.status === 'success' && response.data !== null && response.data !== undefined) {
    return response.data;
  }

  // Create a proper API error for failed responses
  throw createGenericApiError(
    response.message || fallbackMessage,
    response.statusCode || 500,
    context,
    new Date().toISOString(),
    response
  );
}