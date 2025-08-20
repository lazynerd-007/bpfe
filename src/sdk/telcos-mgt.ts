import { apiClient, ApiClient } from './client';
import type { 
  TelcoManagement,
  CreateTelcoManagementDto, 
  UpdateTelcoManagementDto,
  ApiResponse, 
  PaginatedResponse,
  QueryDto,
  Telco 
} from './types';

export class TelcosManagementSDK {
  constructor(private client: ApiClient) {}

  async getTelcosManagement(params?: QueryDto): Promise<PaginatedResponse<TelcoManagement>> {
    const response = await this.client.get<ApiResponse<PaginatedResponse<TelcoManagement>>>('/telcos-mgt', { params });
    return response.data;
  }

  async getTelcoManagement(id: string): Promise<TelcoManagement> {
    const response = await this.client.get<ApiResponse<TelcoManagement>>(`/telcos-mgt/${id}`);
    return response.data;
  }

  async createTelcoManagement(data: CreateTelcoManagementDto): Promise<TelcoManagement> {
    const response = await this.client.post<ApiResponse<TelcoManagement>>('/telcos-mgt', data);
    return response.data;
  }

  async updateTelcoManagement(id: string, data: UpdateTelcoManagementDto): Promise<TelcoManagement> {
    const response = await this.client.patch<ApiResponse<TelcoManagement>>(`/telcos-mgt/${id}`, data);
    return response.data;
  }

  async deleteTelcoManagement(id: string): Promise<void> {
    await this.client.delete(`/telcos-mgt/${id}`);
  }

  // Get telco configurations by telco provider
  async getTelcoManagementByProvider(telco: Telco, params?: QueryDto): Promise<PaginatedResponse<TelcoManagement>> {
    const response = await this.client.get<ApiResponse<PaginatedResponse<TelcoManagement>>>('/telcos-mgt', {
      params: { ...params, telco }
    });
    return response.data;
  }

  // Test telco configuration
  async testTelcoConfiguration(id: string): Promise<{ 
    success: boolean; 
    message: string; 
    responseTime: number;
    endpoint: string;
  }> {
    const response = await this.client.post<ApiResponse<{ 
      success: boolean; 
      message: string; 
      responseTime: number;
      endpoint: string;
    }>>(`/telcos-mgt/${id}/test`);
    return response.data;
  }

  // Get telco statistics
  async getTelcoStats(params?: { startDate?: string; endDate?: string; telco?: Telco }): Promise<{
    totalConfigurations: number;
    activeConfigurations: number;
    inactiveConfigurations: number;
    maintenanceConfigurations: number;
    averageResponseTime: number;
    successRate: number;
  }> {
    const response = await this.client.get<ApiResponse<{
      totalConfigurations: number;
      activeConfigurations: number;
      inactiveConfigurations: number;
      maintenanceConfigurations: number;
      averageResponseTime: number;
      successRate: number;
    }>>('/telcos-mgt/stats', { params });
    return response.data;
  }

  // Toggle telco status
  async toggleTelcoStatus(id: string, isActive: boolean): Promise<TelcoManagement> {
    const response = await this.client.patch<ApiResponse<TelcoManagement>>(`/telcos-mgt/${id}`, { isActive });
    return response.data;
  }
}

export const telcosManagementService = new TelcosManagementSDK(apiClient);