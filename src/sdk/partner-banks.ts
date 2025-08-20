import { apiClient } from './client';
import { PartnerBank, CreatePartnerBankDto, UpdatePartnerBankDto, PaginatedResponse, PartnerBankStatus } from './types';

export const partnerBankService = {
  async getPartnerBanks(params?: Record<string, unknown>): Promise<PaginatedResponse<PartnerBank>> {
    // Map params to match legacy API format
    const apiParams = params ? {
      page: params.page,
      perPage: params.limit,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder
    } : undefined;
    
    const data = await apiClient.get<PartnerBank[]>('/banks/partners', apiParams);
    
    // Transform the direct array response into PaginatedResponse format
    return {
      data: data || [],
      meta: {
        page: params?.page as number || 1,
        perPage: params?.limit as number || 10,
        total: (data || []).length, // We don't have total from API, so use current page length
        totalPages: 1 // We don't have total pages from API
      }
    };
  },

  async getPartnerBank(id: string): Promise<PartnerBank> {
    return await apiClient.get(`/partner-banks/${id}`);
  },

  async createPartnerBank(data: CreatePartnerBankDto | FormData): Promise<PartnerBank> {
    return await apiClient.post('/banks/partners', data);
  },

  async updatePartnerBank(id: string, data: UpdatePartnerBankDto | FormData): Promise<PartnerBank> {
    return await apiClient.put(`/partner-banks/${id}`, data);
  },

  async deletePartnerBank(id: string): Promise<void> {
    return await apiClient.delete(`/partner-banks/${id}`);
  },

  async getPartnerBankAnalytics(partnerBankId: string, filters: { startDate?: string; endDate?: string } = {}): Promise<Record<string, unknown>> {
    return apiClient.get(`/partner-banks/${partnerBankId}/analytics`, filters);
  },
};