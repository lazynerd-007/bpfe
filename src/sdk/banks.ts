import { apiClient } from './client';

export interface Bank {
  uuid: string;
  name: string;
  code: string;
  tmsId?: number;
  branches?: Branch[];
}

export interface Branch {
  uuid: string;
  name: string;
  code: string;
  bankId: string;
  bank?: Bank;
}

export const bankService = {
  async getBanks(params?: Record<string, unknown>): Promise<Bank[]> {
    try {
      const data = await apiClient.get<Bank[]>('/banks', params);
      return data || [];
    } catch (error) {
      console.error('Failed to fetch banks:', error);
      return [];
    }
  },

  async getBank(id: string): Promise<Bank> {
    return apiClient.get(`/banks/${id}`);
  },

  async getBranches(bankId?: string): Promise<Branch[]> {
    try {
      if (bankId) {
        // Get specific bank with its branches, then extract branches
        const bank = await this.getBank(bankId);
        return bank.branches || [];
      } else {
        // Get all banks with branches, then flatten all branches
        const banks = await this.getBanks();
        const allBranches: Branch[] = [];
        banks.forEach(bank => {
          if (bank.branches) {
            allBranches.push(...bank.branches);
          }
        });
        return allBranches;
      }
    } catch (error) {
      console.error('Failed to fetch branches:', error);
      return [];
    }
  },

  async getBranch(id: string): Promise<Branch> {
    // Since there's no direct branch endpoint, we need to find it through banks
    const banks = await this.getBanks();
    for (const bank of banks) {
      if (bank.branches) {
        const branch = bank.branches.find(b => b.uuid === id);
        if (branch) return branch;
      }
    }
    throw new Error('Branch not found');
  },
};