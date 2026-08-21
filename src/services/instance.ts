import { useAuthStore } from '@/stores/auth';
import router from '@/router';
import { createHttpClient } from '@/plugins/axios';

const instance = createHttpClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.httpClient.interceptors.request.use((config) => {
  const authStore = useAuthStore();

  if (authStore.token && config.headers) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }

  return config;
});

instance.httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      router.push({ name: 'Login' });
    }
    return Promise.reject(error);
  }
);

export default instance;
