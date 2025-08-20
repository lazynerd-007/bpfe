import { apiClient } from './client';
import { User, CreateUserDto, UpdateUserDto } from './types';

export const userService = {
  async getUsers(params?: Record<string, unknown>): Promise<{data: User[], total: number}> {
    try {
      console.log('[Users Service] Fetching users with params:', params);

      // Convert limit to perPage for API compatibility
      const apiParams = { ...params };
      if (apiParams.limit) {
        apiParams.perPage = apiParams.limit;
        delete apiParams.limit;
      }
      
      // Set default pagination if not provided
      if (!apiParams.page) apiParams.page = 1;
      if (!apiParams.perPage) apiParams.perPage = 10;
      
      const query = new URLSearchParams();
      if (apiParams.page) query.append('page', apiParams.page.toString());
      if (apiParams.perPage) query.append('limit', apiParams.perPage.toString());
      if (apiParams.search) query.append('search', apiParams.search as string);
      if (apiParams.role) query.append('role', apiParams.role as string);
      if (apiParams.status) query.append('status', apiParams.status as string);
      
      const queryString = query.toString();
      const url = `/users${queryString ? `?${queryString}` : ''}`;
      
      console.log('[Users Service] Fetching users with URL:', url);
      console.log('[Users Service] API URL:', apiClient['client']?.defaults?.baseURL);
      console.log('[Users Service] Current token:', apiClient['token'] ? 'Present' : 'Missing');
      
      const response = await apiClient.get<any>(url);
      console.log('[Users Service] Raw API response:', response);
      
      // Handle both direct array response and nested response structure
      let users: User[] = [];
      let total: number = 0;
      
      if (Array.isArray(response)) {
        // Direct array response
        users = response || [];
        total = users.length;
        console.log('[Users Service] Response is array, length:', users.length);
      } else if (response && typeof response === 'object') {
        // Nested response structure from API
        users = response.data?.users || response.users || response.data || [];
        total = response.data?.total || response.total || users.length;
        console.log('[Users Service] Found nested structure, users:', users.length, 'total:', total);
      } else {
        // Fallback for unexpected response
        users = [];
        total = 0;
        console.error('[Users Service] Unexpected response structure:', response);
      }
      
      return {
        data: users,
        total: total
      };
    } catch (error) {
      console.error('[Users Service] Error in getUsers:', error);
      throw error;
    }
  },

  async getUser(id: string): Promise<User> {
    return apiClient.get(`/users/${id}`);
  },

  async createUser(data: CreateUserDto): Promise<User> {
    return apiClient.post('/users/create', data);
  },

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    return apiClient.put(`/users/${id}`, data);
  },

  async deleteUser(id: string): Promise<void> {
    return apiClient.delete(`/users/${id}`);
  },

  async getUsersByRole(role: string): Promise<User[]> {
    return apiClient.get(`/users/role/${role}`);
  },

  async getUsersByPartnerBank(partnerBankId: string): Promise<User[]> {
    return apiClient.get(`/users/partner-bank/${partnerBankId}`);
  }
};