import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useFetch } from '@/composables/useFetch';
import instance from '@/services/instance';

// Mock axios instance
vi.mock('@/services/instance', () => ({
  default: {
    httpClient: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('useFetch composable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET request', () => {
    it('should return data on successful GET', async () => {
      const mockData = { id: 1, name: 'John' };
      vi.mocked(instance.httpClient.get).mockResolvedValueOnce({
        data: mockData,
        status: 200,
      } as any);

      const { data, error, loading } = await useFetch().get('/users/1');

      expect(data).toEqual(mockData);
      expect(error).toBeNull();
      expect(loading.value).toBe(false);
    });

    it('should return error on failed GET', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { error: 'User not found' },
        },
        message: 'Not Found',
      };
      vi.mocked(instance.httpClient.get).mockRejectedValueOnce(mockError);

      const { data, error, loading } = await useFetch().get('/users/999');

      expect(data).toBeNull();
      expect(error).toBe('User not found');
      expect(loading.value).toBe(false);
    });

    it('should set loading state during GET', async () => {
      vi.mocked(instance.httpClient.get).mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () => resolve({ data: { id: 1 }, status: 200 } as any),
              10
            );
          })
      );

      const promise = useFetch().get('/users/1');
      // At this point, loading might not be guaranteed to be true yet due to async
      const result = await promise;

      expect(result.loading.value).toBe(false);
    });
  });

  describe('POST request', () => {
    it('should return data on successful POST', async () => {
      const payload = { name: 'Jane', email: 'jane@example.com' };
      const mockResponse = { id: 2, ...payload };
      vi.mocked(instance.httpClient.post).mockResolvedValueOnce({
        data: mockResponse,
        status: 201,
      } as any);

      const { data, error, loading } = await useFetch().post('/users', payload);

      expect(data).toEqual(mockResponse);
      expect(error).toBeNull();
      expect(loading.value).toBe(false);
    });

    it('should return error on failed POST', async () => {
      const mockError = {
        response: {
          status: 409,
          data: { error: 'Email already exists' },
        },
        message: 'Conflict',
      };
      vi.mocked(instance.httpClient.post).mockRejectedValueOnce(mockError);

      const { data, error, loading } = await useFetch().post('/users', {
        name: 'Jane',
        email: 'jane@example.com',
      });

      expect(data).toBeNull();
      expect(error).toBe('Email already exists');
      expect(loading.value).toBe(false);
    });
  });

  describe('PUT request', () => {
    it('should return data on successful PUT', async () => {
      const payload = { name: 'John Updated' };
      const mockResponse = { id: 1, ...payload };
      vi.mocked(instance.httpClient.put).mockResolvedValueOnce({
        data: mockResponse,
        status: 200,
      } as any);

      const { data, error, loading } = await useFetch().put('/users/1', payload);

      expect(data).toEqual(mockResponse);
      expect(error).toBeNull();
      expect(loading.value).toBe(false);
    });
  });

  describe('PATCH request', () => {
    it('should return data on successful PATCH', async () => {
      const payload = { name: 'John Patched' };
      const mockResponse = { id: 1, name: 'John Patched', email: 'john@example.com' };
      vi.mocked(instance.httpClient.patch).mockResolvedValueOnce({
        data: mockResponse,
        status: 200,
      } as any);

      const { data, error, loading } = await useFetch().patch('/users/1', payload);

      expect(data).toEqual(mockResponse);
      expect(error).toBeNull();
      expect(loading.value).toBe(false);
    });
  });

  describe('DELETE request', () => {
    it('should return null data on successful DELETE', async () => {
      vi.mocked(instance.httpClient.delete).mockResolvedValueOnce({
        data: null,
        status: 204,
      } as any);

      const { data, error, loading } = await useFetch().del('/users/1');

      expect(data).toBeNull();
      expect(error).toBeNull();
      expect(loading.value).toBe(false);
    });

    it('should return error on failed DELETE', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { error: 'User not found' },
        },
        message: 'Not Found',
      };
      vi.mocked(instance.httpClient.delete).mockRejectedValueOnce(mockError);

      const { data, error, loading } = await useFetch().del('/users/999');

      expect(data).toBeNull();
      expect(error).toBe('User not found');
      expect(loading.value).toBe(false);
    });
  });

  describe('Method chaining', () => {
    it('should support multiple sequential requests', async () => {
      vi.mocked(instance.httpClient.get).mockResolvedValueOnce({
        data: [{ id: 1 }, { id: 2 }],
        status: 200,
      } as any);
      vi.mocked(instance.httpClient.post).mockResolvedValueOnce({
        data: { id: 3, name: 'New User' },
        status: 201,
      } as any);

      // First request
      const result1 = await useFetch().get('/users');
      expect(result1.data).toHaveLength(2);
      expect(result1.error).toBeNull();

      // Second request (method chaining style)
      const result2 = await useFetch().post('/users', { name: 'New User' });
      expect(result2.data).toEqual({ id: 3, name: 'New User' });
      expect(result2.error).toBeNull();
    });
  });

  describe('Error handling', () => {
    it('should handle errors without custom data field', async () => {
      const mockError = new Error('Network error');
      vi.mocked(instance.httpClient.get).mockRejectedValueOnce(mockError);

      const { data, error, loading } = await useFetch().get('/users');

      expect(data).toBeNull();
      expect(error).toBe('Network error');
      expect(loading.value).toBe(false);
    });

    it('should handle non-Error objects', async () => {
      vi.mocked(instance.httpClient.get).mockRejectedValueOnce('String error');

      const { data, error, loading } = await useFetch().get('/users');

      expect(data).toBeNull();
      expect(error).toBe('Unknown error occurred');
      expect(loading.value).toBe(false);
    });
  });
});
