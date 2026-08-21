import instance from '@/services/instance';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import { ref, type Ref } from 'vue';

/**
 * Generic composable for making HTTP requests with method-chaining
 *
 * Usage:
 *   const { data, error, loading } = await useFetch().get<User>('/users/1');
 *   const { data, error, loading } = await useFetch().post<User>('/users', { name, email });
 *   const { data, error, loading } = await useFetch().delete<void>(`/users/${id}`);
 *
 * Chaining:
 *   const response1 = await useFetch().get<Users[]>('/users');
 *   const response2 = await useFetch().post<User>('/users', newUser);
 *
 * Returns:
 *   - data: T | null — the response data (null if error)
 *   - error: string | null — error message (null if success)
 *   - loading: Ref<boolean> — reactive loading state
 */
interface UseFetchReturn<T> {
  data: T | null;
  error: string | null;
  loading: Ref<boolean>;
}

export function useFetch() {
  const http = instance.httpClient;

  /**
   * Extract error message from Axios error
   */
  const getErrorMessage = (err: unknown): string => {
    const maybeResponse = (err as { response?: { data?: unknown } })?.response;
    const data = maybeResponse?.data;

    if (data && typeof data === 'object' && 'error' in data) {
      const errorMessage = (data as { error?: string }).error;
      if (errorMessage) {
        return String(errorMessage);
      }
    }

    if (err instanceof Error) {
      const axiosErr = err as AxiosError;
      if (axiosErr.response?.data && typeof axiosErr.response.data === 'object') {
        const responseData = axiosErr.response.data as Record<string, unknown>;
        return responseData.error ? String(responseData.error) : axiosErr.message;
      }
      return axiosErr.message;
    }

    return 'Unknown error occurred';
  };

  return {
    /**
     * GET request
     */
    async get<T>(url: string, config: AxiosRequestConfig = {}): Promise<UseFetchReturn<T>> {
      const loading = ref(true);
      let data: T | null = null;
      let error: string | null = null;

      try {
        const response = await http.get<T>(url, { ...config });
        data = response.data as T;
      } catch (err) {
        error = getErrorMessage(err);
      } finally {
        loading.value = false;
      }

      return { data, error, loading };
    },

    /**
     * POST request
     */
    async post<T>(
      url: string,
      payload: Record<string, unknown> = {},
      config: AxiosRequestConfig = {}
    ): Promise<UseFetchReturn<T>> {
      const loading = ref(true);
      let data: T | null = null;
      let error: string | null = null;

      try {
        const response = await http.post<T>(url, payload, { ...config });
        data = response.data as T;
      } catch (err) {
        error = getErrorMessage(err);
      } finally {
        loading.value = false;
      }

      return { data, error, loading };
    },

    /**
     * PUT request
     */
    async put<T>(
      url: string,
      payload: Record<string, unknown> = {},
      config: AxiosRequestConfig = {}
    ): Promise<UseFetchReturn<T>> {
      const loading = ref(true);
      let data: T | null = null;
      let error: string | null = null;

      try {
        const response = await http.put<T>(url, payload, { ...config });
        data = response.data as T;
      } catch (err) {
        error = getErrorMessage(err);
      } finally {
        loading.value = false;
      }

      return { data, error, loading };
    },

    /**
     * PATCH request
     */
    async patch<T>(
      url: string,
      payload: Record<string, unknown> = {},
      config: AxiosRequestConfig = {}
    ): Promise<UseFetchReturn<T>> {
      const loading = ref(true);
      let data: T | null = null;
      let error: string | null = null;

      try {
        const response = await http.patch<T>(url, payload, { ...config });
        data = response.data as T;
      } catch (err) {
        error = getErrorMessage(err);
      } finally {
        loading.value = false;
      }

      return { data, error, loading };
    },

    /**
     * DELETE request
     */
    async del<T>(url: string, config: AxiosRequestConfig = {}): Promise<UseFetchReturn<T>> {
      const loading = ref(true);
      let data: T | null = null;
      let error: string | null = null;

      try {
        const response = await http.delete<T>(url, { ...config });
        data = response.data as T;
      } catch (err) {
        error = getErrorMessage(err);
      } finally {
        loading.value = false;
      }

      return { data, error, loading };
    },
  };
}
