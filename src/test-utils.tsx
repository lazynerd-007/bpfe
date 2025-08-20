import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { Provider as JotaiProvider } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

interface AllTheProvidersProps {
  children: React.ReactNode;
}

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  const queryClient = createTestQueryClient();

  return (
    <SessionProvider session={null}>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            {children}
          </ThemeProvider>
        </JotaiProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock data helpers
export const mockUser = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  role: 'ADMIN' as const,
  status: 'ACTIVE' as const,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockMerchant = {
  uuid: '1',
  merchantCode: 'MERCHANT001',
  merchantName: 'Test Merchant',
  merchantNameSlug: 'test-merchant',
  merchantCategoryCode: 'RETAIL',
  canProcessCardTransactions: true,
  canProcessMomoTransactions: true,
  merchantKey: 'test-key',
  merchantToken: 'test-token',
  notificationEmail: 'merchant@example.com',
  country: 'GH',
  partnerBankId: 'bank-1',
  settlementDetails: {
    bankName: 'Test Bank',
    accountNumber: '1234567890',
    accountName: 'Test Merchant',
  },
  bankDetails: {
    bankName: 'Test Bank',
    accountNumber: '1234567890',
    accountName: 'Test Merchant',
  },
  apiKey: {
    publicKey: 'pk_test',
    secretKey: 'sk_test',
  },
};

export const mockTransaction = {
  uuid: '1',
  amount: 100.00,
  currency: 'GHS',
  status: 'SUCCESSFUL' as const,
  type: 'MONEY_IN' as const,
  source: 'MOMO' as const,
  processor: 'MTN' as const,
  phoneNumber: '+233123456789',
  transactionRef: 'TXN001',
  description: 'Test transaction',
  processorResponse: {},
  elevyResponse: {},
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

// Mock API responses
export const mockApiResponse = <T,>(data: T) => ({
  status: true,
  message: 'Success',
  data,
  total: Array.isArray(data) ? data.length : undefined,
  statusCode: 200,
});

// Test ID helpers
export const getTestId = (id: string) => `[data-testid="${id}"]`;

// Form testing helpers
export const fillForm = async (
  getByLabelText: any,
  fields: Record<string, string>
) => {
  const { userEvent } = await import('@testing-library/user-event');
  const user = userEvent.setup();

  for (const [label, value] of Object.entries(fields)) {
    const field = getByLabelText(label);
    await user.clear(field);
    await user.type(field, value);
  }
};

// Wait for loading states
export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0));