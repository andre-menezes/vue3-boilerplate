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
    const isAuthenticated = computed(() => !!token.value || !!user.value);
    const isAdmin = computed(() => user.value?.role === 'admin');
    const fullName = computed(() => user.value?.name ?? '');

    async function restoreSession() {
      try {
        const profile = await authService.getProfile();
        user.value = profile;
        token.value = null;
      } catch {
        user.value = null;
        token.value = null;
      }
    }

    // actions
    async function login(email: string, password: string) {
      isLoading.value = true;
      error.value = null;
      try {
        const response = await authService.login(email, password);
        user.value = response.user;
        token.value = response.accessToken ?? null;
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
        token.value = response.accessToken ?? null;
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Erro ao registrar';
        throw err;
      } finally {
        isLoading.value = false;
      }
    }

    async function logout() {
      user.value = null;
      token.value = null;
      error.value = null;

      try {
        await authService.logout();
      } catch {
        // ignora falha do logout do servidor para limpar o cliente localmente
      }
    }

    function clearError() {
      error.value = null;
    }

    async function updateProfile(payload: { name?: string; email?: string; password?: string }) {
      isLoading.value = true;
      error.value = null;

      try {
        user.value = await authService.updateProfile(payload);
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Erro ao atualizar perfil';
        throw err;
      } finally {
        isLoading.value = false;
      }
    }

    return {
      user,
      token,
      isLoading,
      error,
      isAuthenticated,
      isAdmin,
      fullName,
      restoreSession,
      login,
      register,
      updateProfile,
      logout,
      clearError,
    };
  },
  {
    persist: {
      pick: ['user'],
    },
  }
);
