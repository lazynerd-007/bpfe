import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  merchantsAtom,
  subMerchantsAtom,
  selectedMerchantAtom,
  merchantApiKeysAtom,
  merchantFiltersAtom,
  merchantsLoadingAtom,
  merchantsErrorAtom,
  fetchMerchantsAtom,
  fetchMerchantAtom,
  createMerchantAtom,
  updateMerchantAtom,
  deleteMerchantAtom,
  fetchSubMerchantsAtom,
  createSubMerchantAtom,
  fetchApiKeysAtom,
  reIssueApiKeysAtom,
  registerWebhookAtom,
} from './atoms';
import { MerchantFilters } from '@/sdk/types';

export function useMerchants() {
  const merchants = useAtomValue(merchantsAtom);
  const loading = useAtomValue(merchantsLoadingAtom);
  const error = useAtomValue(merchantsErrorAtom);
  const [, fetchMerchants] = useAtom(fetchMerchantsAtom);

  const refetch = useCallback(async () => {
    await fetchMerchants();
  }, [fetchMerchants]);

  return {
    merchants,
    loading,
    error,
    refetch,
  };
}

export function useMerchantFilters() {
  const [filters, setFilters] = useAtom(merchantFiltersAtom);
  const [, fetchMerchants] = useAtom(fetchMerchantsAtom);

  const updateFilters = useCallback(
    async (newFilters: Partial<MerchantFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      await fetchMerchants();
    },
    [filters, setFilters, fetchMerchants]
  );

  const resetFilters = useCallback(async () => {
    const defaultFilters: MerchantFilters = {
      page: 1,
      perPage: 10,
      search: '',
    };
    setFilters(defaultFilters);
    await fetchMerchants();
  }, [setFilters, fetchMerchants]);

  return {
    filters,
    updateFilters,
    resetFilters,
  };
}

export function useMerchant() {
  const merchant = useAtomValue(selectedMerchantAtom);
  const loading = useAtomValue(merchantsLoadingAtom);
  const error = useAtomValue(merchantsErrorAtom);
  const [, fetchMerchant] = useAtom(fetchMerchantAtom);
  const [, updateMerchant] = useAtom(updateMerchantAtom);
  const [, deleteMerchant] = useAtom(deleteMerchantAtom);

  const fetch = useCallback(
    async (merchantId: string) => {
      await fetchMerchant(merchantId);
    },
    [fetchMerchant]
  );

  const update = useCallback(
    async (merchantId: string, data: any) => {
      await updateMerchant({ merchantId, data });
    },
    [updateMerchant]
  );

  const remove = useCallback(
    async (merchantId: string) => {
      await deleteMerchant(merchantId);
    },
    [deleteMerchant]
  );

  return {
    merchant,
    loading,
    error,
    fetch,
    update,
    remove,
  };
}

export function useCreateMerchant() {
  const loading = useAtomValue(merchantsLoadingAtom);
  const error = useAtomValue(merchantsErrorAtom);
  const [, createMerchant] = useAtom(createMerchantAtom);

  const create = useCallback(
    async (data: any) => {
      return await createMerchant(data);
    },
    [createMerchant]
  );

  return {
    create,
    loading,
    error,
  };
}

export function useSubMerchants() {
  const subMerchants = useAtomValue(subMerchantsAtom);
  const loading = useAtomValue(merchantsLoadingAtom);
  const error = useAtomValue(merchantsErrorAtom);
  const [, fetchSubMerchants] = useAtom(fetchSubMerchantsAtom);
  const [, createSubMerchant] = useAtom(createSubMerchantAtom);

  const fetch = useCallback(
    async (merchantId: string) => {
      await fetchSubMerchants(merchantId);
    },
    [fetchSubMerchants]
  );

  const create = useCallback(
    async (merchantId: string, data: any) => {
      return await createSubMerchant({ merchantId, data });
    },
    [createSubMerchant]
  );

  return {
    subMerchants,
    loading,
    error,
    fetch,
    create,
  };
}

export function useApiKeys() {
  const apiKeys = useAtomValue(merchantApiKeysAtom);
  const loading = useAtomValue(merchantsLoadingAtom);
  const error = useAtomValue(merchantsErrorAtom);
  const [, fetchApiKeys] = useAtom(fetchApiKeysAtom);
  const [, reIssueApiKeys] = useAtom(reIssueApiKeysAtom);

  const fetch = useCallback(async () => {
    await fetchApiKeys();
  }, [fetchApiKeys]);

  const reIssue = useCallback(async () => {
    await reIssueApiKeys();
  }, [reIssueApiKeys]);

  return {
    apiKeys,
    loading,
    error,
    fetch,
    reIssue,
  };
}

export function useWebhook() {
  const loading = useAtomValue(merchantsLoadingAtom);
  const error = useAtomValue(merchantsErrorAtom);
  const [, registerWebhook] = useAtom(registerWebhookAtom);

  const register = useCallback(
    async (webhookUrl: string) => {
      return await registerWebhook(webhookUrl);
    },
    [registerWebhook]
  );

  return {
    register,
    loading,
    error,
  };
}

export function useMerchantsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const merchants = useMerchants();
  const [filters, setFilters] = useAtom(merchantFiltersAtom);
  const [, fetchMerchants] = useAtom(fetchMerchantsAtom);
  const createMerchant = useCreateMerchant();

  // Initialize filters from URL params on mount
  useEffect(() => {
    const urlFilters: MerchantFilters = {
      page: parseInt(searchParams.get('page') || '1'),
      perPage: parseInt(searchParams.get('perPage') || '10'),
      search: searchParams.get('search') || '',
      merchantName: searchParams.get('merchantName') || '',
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
      status: searchParams.get('status') || '',
      country: searchParams.get('country') || '',
      partnerBankId: searchParams.get('partnerBankId') || '',
    };

    // Remove empty string values
    Object.keys(urlFilters).forEach(key => {
      if (urlFilters[key as keyof MerchantFilters] === '') {
        delete urlFilters[key as keyof MerchantFilters];
      }
    });

    setFilters(urlFilters);
    fetchMerchants();
  }, [searchParams, setFilters, fetchMerchants]);

  const updateFilters = useCallback(
    async (newFilters: Partial<MerchantFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      
      // Update URL with new filters
      const params = new URLSearchParams();
      Object.entries(updatedFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.set(key, String(value));
        }
      });
      
      router.push(`/merchants?${params.toString()}`);
      await fetchMerchants();
    },
    [filters, setFilters, router, fetchMerchants]
  );

  const resetFilters = useCallback(async () => {
    const defaultFilters: MerchantFilters = {
      page: 1,
      perPage: 10,
      search: '',
    };
    setFilters(defaultFilters);
    router.push('/merchants');
    await fetchMerchants();
  }, [setFilters, router, fetchMerchants]);

  return {
    ...merchants,
    filters,
    updateFilters,
    resetFilters,
    createMerchant,
  };
}