import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { UserWithoutPassword } from '@app-types/auth';
import { authService } from '@/services/auth';

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<UserWithoutPassword | null>(null);
    const token = ref<string | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // getters
    const isAuthenticated = computed(() => !!token.value);
    const isAdmin = computed(() => user.value?.role === 'admin');
    const fullName = computed(() => user.value?.name ?? '');

    // actions
    async function login(email: string, password: string) {
      isLoading.value = true;
      error.value = null;
      try {
        const response = await authService.login(email, password);
        user.value = response.user;
        token.value = response.accessToken;
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Erro ao fazer login';
        throw err;
      } finally {
        isLoading.value = false;
      }
    }

    async function register(email: string, password: string, name: string) {
      isLoading.value = true;
      error.value = null;
      try {
        const response = await authService.register(email, password, name);
        user.value = response.user;
        token.value = response.accessToken;
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Erro ao registrar';
        throw err;
      } finally {
        isLoading.value = false;
      }
    }

    function logout() {
      user.value = null;
      token.value = null;
      error.value = null;
    }

    function clearError() {
      error.value = null;
    }

    return {
      user,
      token,
      isLoading,
      error,
      isAuthenticated,
      isAdmin,
      fullName,
      login,
      register,
      logout,
      clearError,
    };
  },
  {
    persist: true,
  }
);
