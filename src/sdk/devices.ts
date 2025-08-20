import { apiClient } from './client';
import { Device, CreateDeviceDto, UpdateDeviceDto } from './types';

export const deviceService = {
  async getDevices(params?: Record<string, unknown>): Promise<{data: Device[], total: number}> {
    const data = await apiClient.get<Device[]>('/devices', params);
    
    // Transform the direct array response into expected format
    return {
      data: data || [],
      total: (data || []).length // We don't have total from API, so use current page length
    };
  },

  async getDevice(id: string): Promise<Device> {
    return apiClient.get(`/devices/${id}`);
  },

  async createDevice(data: CreateDeviceDto): Promise<Device> {
    return apiClient.post('/devices', data);
  },

  async updateDevice(id: string, data: UpdateDeviceDto): Promise<Device> {
    return apiClient.put(`/devices/${id}`, data);
  },

  async deleteDevice(id: string): Promise<void> {
    return apiClient.delete(`/devices/${id}`);
  },

  async getDevicesByMerchant(merchantId: string): Promise<Device[]> {
    return apiClient.get(`/devices/merchant/${merchantId}`);
  },

  async getDevicesByPartnerBank(partnerBankId: string): Promise<Device[]> {
    return apiClient.get(`/devices/partner-bank/${partnerBankId}`);
  },
};