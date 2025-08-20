import { ApiClient } from '../client';
import { ApiResponse } from '../types';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
}));

describe('ApiClient', () => {
  let client: ApiClient;
  let mockAxiosInstance: any;

  beforeEach(() => {
    client = new ApiClient('http://test-api.com');
    mockAxiosInstance = (client as any).client;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get method', () => {
    it('returns data on successful response', async () => {
      const mockData = { id: 1, name: 'Test User' };
      const mockResponse: ApiResponse<typeof mockData> = {
        status: 'success',
        message: 'Success',
        data: mockData,
        statusCode: 200,
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.get('/users/1');
      expect(result).toEqual(mockData);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/1', { params: undefined });
    });

    it('throws ApiError on failed response status', async () => {
      const mockResponse: ApiResponse<null> = {
        status: 'error',
        message: 'User not found',
        data: null,
        statusCode: 404,
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      await expect(client.get('/users/999')).rejects.toMatchObject({
        name: 'ApiError',
        message: 'User not found',
        code: 'API_ERROR',
        statusCode: 500,
      });
    });

    it('handles network errors properly', async () => {
      const networkError = new Error('Network Error');
      mockAxiosInstance.get.mockRejectedValue(networkError);

      await expect(client.get('/users')).rejects.toMatchObject({
        name: 'ApiError',
        message: 'Network Error',
        code: 'API_ERROR',
      });
    });
  });

  describe('post method', () => {
    it('returns data on successful response', async () => {
      const postData = { name: 'New User', email: 'test@example.com' };
      const responseData = { id: 1, ...postData };
      const mockResponse: ApiResponse<typeof responseData> = {
        status: 'success',
        message: 'User created',
        data: responseData,
        statusCode: 201,
      };

      mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

      const result = await client.post('/users', postData);
      expect(result).toEqual(responseData);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users', postData);
    });
  });

  describe('authentication methods', () => {
    it('sets authentication token and partner bank ID', () => {
      client.setAuth('test-token', 'partner-bank-123');
      
      expect((client as any).token).toBe('test-token');
      expect((client as any).partnerBankId).toBe('partner-bank-123');
    });

    it('clears authentication', () => {
      client.setAuth('test-token', 'partner-bank-123');
      client.clearAuth();
      
      expect((client as any).token).toBeNull();
      expect((client as any).partnerBankId).toBeNull();
    });
  });
});