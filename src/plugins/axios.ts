import type { AxiosError } from 'axios';
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

const hasOwnProperty = <T extends object>(value: T, propertyName: string): boolean =>
  Object.prototype.hasOwnProperty.call(value, propertyName);

const isAxiosConfig = (value: unknown): value is AxiosRequestConfig =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  (hasOwnProperty(value, 'adapter') ||
    hasOwnProperty(value, 'headers') ||
    hasOwnProperty(value, 'params') ||
    hasOwnProperty(value, 'withCredentials') ||
    hasOwnProperty(value, 'timeout') ||
    hasOwnProperty(value, 'signal') ||
    hasOwnProperty(value, 'baseURL') ||
    hasOwnProperty(value, 'validateStatus'));

export function createHttpClient(config: AxiosRequestConfig = {}) {
  const httpClient = axios.create(config);

  function get<T = any>(
    url: string,
    params: Record<string, unknown> | AxiosRequestConfig = {},
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    const requestConfig = isAxiosConfig(params) ? { ...params, ...config } : { ...config, params };

    return httpClient
      .get<T>(url, requestConfig)
      .then((resp: AxiosResponse<T>) => resp.data)
      .catch((err: AxiosError) => {
        throw err;
      });
  }

  function post<T = any>(
    url: string,
    params: Record<string, unknown> | AxiosRequestConfig = {},
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    const payload = isAxiosConfig(params) ? undefined : params;
    const requestConfig = isAxiosConfig(params) ? { ...params, ...config } : { ...config };

    return httpClient
      .post<T>(url, payload, requestConfig)
      .then((resp: AxiosResponse<T>) => resp.data)
      .catch((err: AxiosError) => {
        throw err;
      });
  }

  function put<T = any>(
    url: string,
    params: Record<string, unknown> | AxiosRequestConfig = {},
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    const payload = isAxiosConfig(params) ? undefined : params;
    const requestConfig = isAxiosConfig(params) ? { ...params, ...config } : { ...config };

    return httpClient
      .put<T>(url, payload, requestConfig)
      .then((resp: AxiosResponse<T>) => resp.data)
      .catch((err: AxiosError) => {
        throw err;
      });
  }

  function patch<T = any>(
    url: string,
    params: Record<string, unknown> | AxiosRequestConfig = {},
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    const payload = isAxiosConfig(params) ? undefined : params;
    const requestConfig = isAxiosConfig(params) ? { ...params, ...config } : { ...config };

    return httpClient
      .patch<T>(url, payload, requestConfig)
      .then((resp: AxiosResponse<T>) => resp.data)
      .catch((err: AxiosError) => {
        throw err;
      });
  }

  function del<T = any>(
    url: string,
    params: Record<string, unknown> | AxiosRequestConfig = {},
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    const requestConfig = isAxiosConfig(params) ? { ...params, ...config } : { ...config, params };

    return httpClient
      .delete<T>(url, requestConfig)
      .then((resp: AxiosResponse<T>) => resp.data)
      .catch((err: AxiosError) => {
        throw err;
      });
  }

  return {
    get,
    post,
    put,
    patch,
    del,
    delete: del, // Alias for compatibility
    httpClient,
    defaults: httpClient.defaults, // Expose axios defaults
  };
}
