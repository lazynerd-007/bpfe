import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse } from './types';
import { createApiError, validateApiResponse } from './error-utils';
import {ENV_VARIABLES} from "@/lib/constants";

export class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string = ENV_VARIABLES.NEXT_PUBLIC_API_URL) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Added: log the configured base URL to help diagnose network issues
    try {
      console.log(`[API Client] Initialized with baseURL: ${baseURL}`);
    } catch {}

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        // List of endpoints that don't require authentication
        const publicEndpoints = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];
        const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.includes(endpoint));
        
        // Add Bearer token authentication for non-public endpoints (matching Postman collection)
        if (!isPublicEndpoint) {
          // Attempt to hydrate token from localStorage if not already set (handles early requests/race conditions)
          if (!this.token && typeof window !== 'undefined') {
            try {
              const stored = window.localStorage?.getItem('auth-token');
              if (stored && stored.trim()) {
                this.token = stored;
                console.log('[API Client] Restored auth token from localStorage in request interceptor');
              }
            } catch (e) {
              console.warn('[API Client] Unable to access localStorage to restore token');
            }
          }

          if (this.token) {
            const tokenStr = String(this.token).trim();
            if (!tokenStr) {
              console.error(`[API Client] Token is empty or whitespace for ${config.method?.toUpperCase()} ${config.url}`);
              return Promise.reject(new Error('Invalid token: empty or whitespace'));
            }
            
            // Enhanced debugging for users and merchants endpoints
            if (config.url && (config.url.includes('/users') || config.url.includes('/merchants'))) {
              console.log(`[API Client] REQUEST DEBUG:`);
              console.log(`[API Client] URL: ${config.method?.toUpperCase()} ${config.url}`);
              console.log(`[API Client] Token length: ${tokenStr.length}`);
              console.log(`[API Client] Token (first 50 chars): ${tokenStr.substring(0, 50)}...`);
              console.log(`[API Client] Token has Bearer prefix: ${tokenStr.startsWith('Bearer ')}`);
            }
            
            // Ensure Bearer prefix for token authentication
            const bearerToken = tokenStr.startsWith('Bearer ') ? tokenStr : `Bearer ${tokenStr}`;
            config.headers.Authorization = bearerToken;
            
            // Log the final Authorization header
            if (config.url && (config.url.includes('/users') || config.url.includes('/merchants'))) {
              console.log(`[API Client] Authorization header: ${bearerToken.substring(0, 50)}...`);
            }
          } else {
            console.warn(`[API Client] No token available for ${config.method?.toUpperCase()} ${config.url}`);
          }
        }
        
        // Add idempotency key for state-changing operations
        const method = config.method?.toUpperCase();
        if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
          config.headers['Idempotency-Key'] = crypto.randomUUID();
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => response,
      (error: AxiosError<ApiResponse>) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access - clear auth and redirect to login
          const isNextAuthCallback = error.config?.url?.includes('/api/auth/callback');
          const isLoginEndpoint = error.config?.url?.includes('/auth/login');
          
          if (!isNextAuthCallback && !isLoginEndpoint) {
            this.clearAuth();
            
            // Clear authentication storage
            if (typeof window !== 'undefined') {
              localStorage.removeItem('auth-token');
              localStorage.removeItem('current-user');
              window.location.href = '/auth/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  setAuth(token: string) {
    // Enhanced token validation when setting auth
    if (!token) {
      console.error('[API Client] setAuth called with empty/null token');
      this.token = null;
      return;
    }
    
    const tokenStr = String(token).trim();
    if (!tokenStr) {
      console.error('[API Client] setAuth called with whitespace-only token');
      this.token = null;
      return;
    }
    
    console.log(`[API Client] Setting auth token`);
    console.log(`[API Client] Token type: ${typeof token}`);
    console.log(`[API Client] Token length: ${tokenStr.length}`);
    console.log(`[API Client] Token (first 20 chars): ${tokenStr.substring(0, 20)}...`);
    
    this.token = tokenStr;
  }

  clearAuth() {
    console.log('[API Client] Clearing auth token');
    this.token = null;
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    try {
      // Added: log resolved full URL for debugging
      const fullUrl = (() => {
        try {
          return new URL(url, this.client.defaults.baseURL).toString();
        } catch {
          return `${this.client.defaults.baseURL || ''}${url}`;
        }
      })();

      console.log(`[API Client] GET ${url} with params:`, JSON.stringify(params));
      console.log(`[API Client] Resolved GET URL: ${fullUrl}`);
      console.log(`[API Client] Current token: ${this.token ? 'Present' : 'Missing'}`);
      
      const response = await this.client.get<ApiResponse<T>>(url, { params });
      console.log(`[API Client] GET ${url} response:`, response.status);

      const resData: any = response.data as any;
      // If the backend returns the standard envelope, validate and return
      if (resData && typeof resData === 'object' && 'status' in resData) {
        return validateApiResponse(
          resData,
          { endpoint: url, method: 'GET' },
          `Failed to fetch data from ${url}`
        );
      }

      // Fallback: handle non-enveloped responses (e.g., raw arrays or plain objects)
      if (response.status >= 200 && response.status < 300) {
        console.warn(`[API Client] Non-standard response for GET ${url}: treating response body as data`);
        return resData as T;
      }

      // If not successful, throw a generic error
      throw new Error(`Unexpected response for ${url}`);
    } catch (error) {
      // Improve error logging to avoid [object Object]
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const statusText = error.response?.statusText;
        const method = error.config?.method?.toUpperCase();
        const reqUrl = error.config?.url;
        const data = error.response?.data;
        
        // Added: clearer diagnostics for network-level failures (no response)
        if (!error.response) {
          const code: any = (error as any)?.code;
          const message: any = (error as any)?.message;
          const base = (error.config as any)?.baseURL || this.client.defaults.baseURL || '';
          const path = (error.config as any)?.url || url;
          let fullUrlError = `${base}${path}`;
          try { fullUrlError = new URL(path, base).toString(); } catch {}

          let hint = '';
          if (typeof window !== 'undefined') {
            const origin = window.location.origin || '';
            if (origin.startsWith('https://') && String(base).startsWith('http://')) {
              hint = 'Potential mixed-content: page is HTTPS but API is HTTP. Use HTTPS for the API or run the app over HTTP during development.';
            }
          }

          console.error(`[API Client] Network error for GET ${fullUrlError}: code=${code}, message=${message}. ${hint}`);
        }

        console.error(`[API Client] GET ${url} failed: status=${status} ${statusText || ''}, request=${method} ${reqUrl}, data=${safeJson(data)}`);
      } else {
        console.error(`[API Client] GET ${url} failed:`, (error as any)?.message || error);
      }
      throw createApiError(
        error,
        { endpoint: url, method: 'GET' },
        `Failed to fetch data from ${url}`
      );
    }
  }

  async post<T>(url: string, data?: unknown, config?: { headers?: Record<string, string> }): Promise<T> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data, config);
      return validateApiResponse(
        response.data,
        { endpoint: url, method: 'POST' },
        `Failed to post data to ${url}`
      );
    } catch (error) {
      console.error(`[API Client] POST ${url} failed:`, JSON.stringify(error, null, 2));
      throw createApiError(
        error,
        { endpoint: url, method: 'POST' },
        `Failed to post data to ${url}`
      );
    }
  }

  async patch<T>(url: string, data?: unknown): Promise<T> {
    try {
      const response = await this.client.patch<ApiResponse<T>>(url, data);
      return validateApiResponse(
        response.data,
        { endpoint: url, method: 'PATCH' },
        `Failed to update data at ${url}`
      );
    } catch (error) {
      console.error(`[API Client] PATCH ${url} failed:`, JSON.stringify(error, null, 2));
      throw createApiError(
        error,
        { endpoint: url, method: 'PATCH' },
        `Failed to update data at ${url}`
      );
    }
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data);
      return validateApiResponse(
        response.data,
        { endpoint: url, method: 'PUT' },
        `Failed to update data at ${url}`
      );
    } catch (error) {
      console.error(`[API Client] PUT ${url} failed:`, JSON.stringify(error, null, 2));
      throw createApiError(
        error,
        { endpoint: url, method: 'PUT' },
        `Failed to update data at ${url}`
      );
    }
  }

  async delete<T>(url: string): Promise<T> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url);
      return validateApiResponse(
        response.data,
        { endpoint: url, method: 'DELETE' },
        `Failed to delete resource at ${url}`
      );
    } catch (error) {
      console.error(`[API Client] DELETE ${url} failed:`, JSON.stringify(error, null, 2));
      throw createApiError(
        error,
        { endpoint: url, method: 'DELETE' },
        `Failed to delete resource at ${url}`
      );
    }
  }
}

function safeJson(value: any): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export const apiClient = new ApiClient();