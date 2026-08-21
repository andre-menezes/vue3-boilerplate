<template>
  <header class="sticky top-0 z-50 border-b border-slate-200 bg-slate-50/85 backdrop-blur-md">
    <div class="mx-auto flex h-15 max-w-7xl items-center gap-8 px-6">
      <!-- Brand -->
      <div class="flex shrink-0 items-center gap-2">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path d="M2 4L16 28L30 4H24.5L16 18.5L7.5 4H2Z" fill="#7E60F4"></path>
            <path d="M7.5 4L16 18.5L24.5 4H19.5L16.0653 10.0126L12.5 4H7.5Z" fill="#3730A3"></path>
          </g>
        </svg>
        <span class="text-base font-bold tracking-tight text-slate-900">Vue3 Boilerplate</span>
      </div>

      <!-- Nav links — provided by the parent via default slot -->
      <nav
        v-if="$slots.default"
        class="hidden items-center gap-1 md:flex"
        aria-label="Navegação principal"
      >
        <slot />
      </nav>

      <!-- Actions -->
      <div class="ml-auto flex items-center gap-3">
        <!-- User chip -->
        <button
          type="button"
          class="profile-btn"
          title="Perfil"
          @click="router.push({ name: 'Profile' })"
        >
          <div
            class="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-600 text-[0.6875rem] font-bold text-white"
          >
            {{ userInitials }}
          </div>
          <span class="text-[0.8125rem] font-medium whitespace-nowrap text-slate-800">
            {{ authStore.fullName }}
          </span>
        </button>

        <!-- Logout -->
        <button
          data-testid="logout-btn"
          class="logout-btn"
          :title="$t('auth.logout')"
          @click="handleLogout"
        >
          <s-icon name="Logout2" />
          <span class="hidden sm:inline">{{ $t('auth.logout') }}</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const userInitials = computed(() => {
  return authStore.fullName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
});

function handleLogout() {
  authStore.logout();
  router.push({ name: 'Login' });
}
</script>

<style scoped>
.logout-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: inherit;
  white-space: nowrap;
  border-radius: 0.5rem;
  border: 1px solid var(--color-slate-200);
  background: var(--color-surface);
  color: var(--color-slate-500);
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
}

.profile-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.625rem 0.25rem 0.25rem;
  border-radius: 9999px;
  border: 1px solid var(--color-slate-200);
  background: var(--color-surface);
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
}

.profile-btn:hover {
  border-color: rgb(var(--rgb-primary) / 0.3);
  background: rgb(var(--rgb-primary) / 0.04);
}

.logout-btn:hover {
  color: var(--color-danger-600);
  border-color: rgb(var(--rgb-danger) / 0.3);
  background: rgb(var(--rgb-danger) / 0.04);
}
</style>
