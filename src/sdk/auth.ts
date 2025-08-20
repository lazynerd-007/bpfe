import { apiClient } from './client';
import { LoginRequest, LoginResponse, User, ApiResponse } from './types';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface OTPRequest {
  requestedFor: 'registration' | 'password-reset' | 'remittance';
}

export interface VerifyOTPRequest {
  otp: string;
  requestedFor: 'registration' | 'password-reset' | 'remittance';
}

export interface CompleteResetPasswordRequest {
  token: string;
  password: string;
}

export class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log('[Auth Service] Login request:', { email: credentials.email, userType: credentials.userType });
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    console.log('[Auth Service] Login response:', { 
      hasToken: !!response.token, 
      userRole: response.user?.role,
      userEmail: response.user?.email 
    });
    apiClient.setAuth(response.token);
    return response;
  }

  async register(data: RegisterRequest): Promise<void> {
    // TODO: Backend endpoint needs to be added to auth.controller.ts
    // For now, we'll prepare the request structure
    return apiClient.post<void>('/auth/register', data);
  }

  async getMe(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  }

  async requestOtp(requestedFor: OTPRequest['requestedFor'] = 'registration'): Promise<void> {
    return apiClient.post<void>('/auth/otp-request', { requestedFor });
  }

  async verifyOtp(data: VerifyOTPRequest): Promise<any> {
    // TODO: Backend endpoint needs to be exposed in auth.controller.ts
    // The service exists but no controller endpoint
    return apiClient.post<any>('/auth/verify-otp', data);
  }

  async initiatePasswordReset(email: string): Promise<any> {
    return apiClient.post<any>('/auth/initiate-reset-password', { email });
  }

  async completePasswordReset(data: CompleteResetPasswordRequest): Promise<any> {
    return apiClient.post<any>('/auth/complete-reset-password', data);
  }

  async requestRemittanceOtp(): Promise<void> {
    return apiClient.post<void>('/auth/remittance-otp-request');
  }

  logout(): void {
    apiClient.clearAuth();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-data');
      sessionStorage.clear();
    }
  }
}

export const authService = new AuthService();