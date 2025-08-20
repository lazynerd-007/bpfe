import { apiClient } from './client';
import { ApiResponse, PaginatedResponse, Commission, CreateCommissionDto, UpdateCommissionDto } from './types';

export const commissionService = {
  async getCommissions(params?: Record<string, unknown>): Promise<PaginatedResponse<Commission>> {
    return await apiClient.get('/commissions', { params });
  },

  async getCommission(id: string): Promise<Commission> {
    return await apiClient.get(`/commissions/${id}`);
  },

  async createCommission(data: CreateCommissionDto): Promise<Commission> {
    return await apiClient.post('/commissions', data);
  },

  async updateCommission(id: string, data: UpdateCommissionDto): Promise<Commission> {
    return await apiClient.put(`/commissions/${id}`, data);
  },

  async deleteCommission(id: string): Promise<void> {
    return await apiClient.delete(`/commissions/${id}`);
  },

  async getCommissionsByMerchant(merchantId: string): Promise<Commission[]> {
    return await apiClient.get(`/commissions/merchant/${merchantId}`);
  },

  async getCommissionsByPartnerBank(partnerBankId: string): Promise<Commission[]> {
    return await apiClient.get(`/commissions/partner-bank/${partnerBankId}`);
  },
};