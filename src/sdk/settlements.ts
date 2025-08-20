import { apiClient, ApiClient } from './client';
import type { 
  Settlement,
  CreateSettlementDto, 
  UpdateSettlementDto,
  ApiResponse, 
  PaginatedResponse,
  QueryDto 
} from './types';

export class SettlementsSDK {
  constructor(private client: ApiClient) {}

  async getSettlements(params?: QueryDto): Promise<PaginatedResponse<Settlement>> {
    const response = await this.client.get<ApiResponse<PaginatedResponse<Settlement>>>('/settlements', { params });
    return response.data;
  }

  async getSettlement(id: string): Promise<Settlement> {
    const response = await this.client.get<ApiResponse<Settlement>>(`/settlements/${id}`);
    return response.data;
  }

  async createSettlement(data: CreateSettlementDto): Promise<Settlement> {
    const response = await this.client.post<ApiResponse<Settlement>>('/settlements', data);
    return response.data;
  }

  async updateSettlement(id: string, data: UpdateSettlementDto): Promise<Settlement> {
    const response = await this.client.patch<ApiResponse<Settlement>>(`/settlements/${id}`, data);
    return response.data;
  }

  async deleteSettlement(id: string): Promise<void> {
    await this.client.delete(`/settlements/${id}`);
  }

  // Get settlements by merchant
  async getSettlementsByMerchant(merchantId: string, params?: QueryDto): Promise<PaginatedResponse<Settlement>> {
    const response = await this.client.get<ApiResponse<PaginatedResponse<Settlement>>>('/settlements', {
      params: { ...params, merchantId }
    });
    return response.data;
  }

  // Get settlement statistics
  async getSettlementStats(params?: { startDate?: string; endDate?: string; merchantId?: string }): Promise<{
    totalSettlements: number;
    totalAmount: number;
    pendingSettlements: number;
    completedSettlements: number;
    averageSettlementTime: number;
  }> {
    const response = await this.client.get<ApiResponse<{
      totalSettlements: number;
      totalAmount: number;
      pendingSettlements: number;
      completedSettlements: number;
      averageSettlementTime: number;
    }>>('/settlements/stats', { params });
    return response.data;
  }
}

export const settlementsService = new SettlementsSDK(apiClient);