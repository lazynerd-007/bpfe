import { atom } from 'jotai';
import { Merchant, SubMerchant, MerchantApiKeys, PaginatedResponse } from '@/sdk/types';
import { MerchantFilters } from '@/sdk/types';

export const merchantsAtom = atom<PaginatedResponse<Merchant> | null>(null);

export const subMerchantsAtom = atom<SubMerchant[]>([]);

export const selectedMerchantAtom = atom<Merchant | null>(null);

export const merchantApiKeysAtom = atom<MerchantApiKeys | null>(null);

export const merchantFiltersAtom = atom<MerchantFilters>({
  page: 1,
  perPage: 10,
  search: '',
});

export const merchantsLoadingAtom = atom(false);

export const merchantsErrorAtom = atom<string | null>(null);

export const fetchMerchantsAtom = atom(
  null,
  async (get, set) => {
    try {
      set(merchantsLoadingAtom, true);
      set(merchantsErrorAtom, null);
      
      // Check if user is authenticated before making API calls (prevents requests without Authorization header)
      const { getSession } = await import('next-auth/react');
      const session = await getSession();
      if (!session?.user) {
        console.log('[Merchants] No authenticated session, skipping merchants fetch');
        set(merchantsAtom, {
          data: [],
          meta: {
            page: 1,
            perPage: 10,
            total: 0,
            totalPages: 0,
          },
        });
        set(merchantsLoadingAtom, false);
        return;
      }
      
      const { merchantsService } = await import('@/sdk/merchants');
      const filters = get(merchantFiltersAtom);
      
      const response = await merchantsService.getAllMerchants(filters);
      set(merchantsAtom, response);
      
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch merchants';
      set(merchantsErrorAtom, message);
      throw error;
    } finally {
      set(merchantsLoadingAtom, false);
    }
  }
);

export const fetchMerchantAtom = atom(
  null,
  async (get, set, merchantId: string) => {
    try {
      set(merchantsLoadingAtom, true);
      set(merchantsErrorAtom, null);
      
      const { merchantsService } = await import('@/sdk/merchants');
      const merchant = await merchantsService.getMerchant(merchantId);
      set(selectedMerchantAtom, merchant);
      
      return merchant;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch merchant';
      set(merchantsErrorAtom, message);
      throw error;
    } finally {
      set(merchantsLoadingAtom, false);
    }
  }
);

export const createMerchantAtom = atom(
  null,
  async (get, set, data: any) => {
    try {
      set(merchantsLoadingAtom, true);
      set(merchantsErrorAtom, null);
      
      const { merchantsService } = await import('@/sdk/merchants');
      const merchant = await merchantsService.createMerchant(data);
      
      // Refresh the merchants list
      await set(fetchMerchantsAtom);
      
      return merchant;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create merchant';
      set(merchantsErrorAtom, message);
      throw error;
    } finally {
      set(merchantsLoadingAtom, false);
    }
  }
);

export const updateMerchantAtom = atom(
  null,
  async (get, set, { merchantId, data }: { merchantId: string; data: any }) => {
    try {
      set(merchantsLoadingAtom, true);
      set(merchantsErrorAtom, null);
      
      const { merchantsService } = await import('@/sdk/merchants');
      const merchant = await merchantsService.updateMerchant(merchantId, data);
      
      // Update selected merchant if it matches
      const selectedMerchant = get(selectedMerchantAtom);
      if (selectedMerchant?.uuid === merchantId) {
        set(selectedMerchantAtom, merchant);
      }
      
      // Refresh the merchants list
      await set(fetchMerchantsAtom);
      
      return merchant;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update merchant';
      set(merchantsErrorAtom, message);
      throw error;
    } finally {
      set(merchantsLoadingAtom, false);
    }
  }
);

export const deleteMerchantAtom = atom(
  null,
  async (get, set, merchantId: string) => {
    try {
      set(merchantsLoadingAtom, true);
      set(merchantsErrorAtom, null);
      
      const { merchantsService } = await import('@/sdk/merchants');
      await merchantsService.deleteMerchant(merchantId);
      
      // Clear selected merchant if it matches
      const selectedMerchant = get(selectedMerchantAtom);
      if (selectedMerchant?.uuid === merchantId) {
        set(selectedMerchantAtom, null);
      }
      
      // Refresh the merchants list
      await set(fetchMerchantsAtom);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete merchant';
      set(merchantsErrorAtom, message);
      throw error;
    } finally {
      set(merchantsLoadingAtom, false);
    }
  }
);

export const fetchSubMerchantsAtom = atom(
  null,
  async (get, set, merchantId: string) => {
    try {
      const { merchantsService } = await import('@/sdk/merchants');
      const subMerchants = await merchantsService.getSubMerchants(merchantId);
      set(subMerchantsAtom, subMerchants);
      
      return subMerchants;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch sub-merchants';
      set(merchantsErrorAtom, message);
      throw error;
    }
  }
);

export const createSubMerchantAtom = atom(
  null,
  async (get, set, { merchantId, data }: { merchantId: string; data: any }) => {
    try {
      set(merchantsLoadingAtom, true);
      set(merchantsErrorAtom, null);
      
      const { merchantsService } = await import('@/sdk/merchants');
      const subMerchant = await merchantsService.createSubMerchant(merchantId, data);
      
      // Refresh sub-merchants list
      await set(fetchSubMerchantsAtom, merchantId);
      
      return subMerchant;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create sub-merchant';
      set(merchantsErrorAtom, message);
      throw error;
    } finally {
      set(merchantsLoadingAtom, false);
    }
  }
);

export const fetchApiKeysAtom = atom(
  null,
  async (get, set) => {
    try {
      const { merchantsService } = await import('@/sdk/merchants');
      const merchantId = get(selectedMerchantAtom)?.uuid;
      if (!merchantId) throw new Error('No merchant selected');
      
      const apiKeys = await merchantsService.getApiKeys(merchantId);
      set(merchantApiKeysAtom, apiKeys);
      
      return apiKeys;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch API keys';
      set(merchantsErrorAtom, message);
      throw error;
    }
  }
);

export const reIssueApiKeysAtom = atom(
  null,
  async (get, set) => {
    try {
      set(merchantsLoadingAtom, true);
      set(merchantsErrorAtom, null);
      
      const { merchantsService } = await import('@/sdk/merchants');
      const merchantId = get(selectedMerchantAtom)?.uuid;
      if (!merchantId) throw new Error('No merchant selected');
      
      const apiKeys = await merchantsService.regenerateApiKeys(merchantId);
      set(merchantApiKeysAtom, apiKeys);
      
      return apiKeys;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to re-issue API keys';
      set(merchantsErrorAtom, message);
      throw error;
    } finally {
      set(merchantsLoadingAtom, false);
    }
  }
);

export const registerWebhookAtom = atom(
  null,
  async (get, set, webhookUrl: string) => {
    try {
      set(merchantsLoadingAtom, true);
      set(merchantsErrorAtom, null);
      
      const { merchantsService } = await import('@/sdk/merchants');
      const selectedMerchant = get(selectedMerchantAtom);
      if (!selectedMerchant) throw new Error('No merchant selected');
      
      const merchant = await merchantsService.updateMerchant(selectedMerchant.uuid, { webhookUrl });
      
      // Update selected merchant
      set(selectedMerchantAtom, merchant);
      
      return merchant;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to register webhook';
      set(merchantsErrorAtom, message);
      throw error;
    } finally {
      set(merchantsLoadingAtom, false);
    }
  }
);