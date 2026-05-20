<template>
  <div class="flex min-h-screen flex-col bg-slate-50">
    <!-- Minimal header -->
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex h-15 max-w-7xl items-center px-6">
        <router-link to="/" class="flex items-center gap-2 no-underline">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <polygon points="3,5 25,5 14,23" fill="var(--color-primary-500)" />
            <polygon points="7.5,5 20.5,5 14,19" fill="var(--color-primary-800)" />
          </svg>
          <span class="text-base font-bold tracking-tight text-slate-900">Vue3 Boilerplate</span>
        </router-link>
      </div>
    </header>

    <!-- 404 content -->
    <main class="flex flex-1 items-center justify-center px-6 py-12">
      <div class="flex w-full max-w-140 flex-col items-center gap-6 text-center">
        <!-- Illustration -->
        <div class="w-full max-w-75 sm:max-w-105">
          <img
            :src="notFoundImg"
            alt="Página não encontrada"
            class="block h-auto w-full"
            width="480"
            height="360"
          />
        </div>

        <!-- Text -->
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.875rem]">
            Página não encontrada
          </h1>
          <p class="mx-auto mt-2 max-w-105 text-base leading-[1.7] text-slate-500">
            Parece que você se perdeu. A página que você está procurando não existe ou foi movida
            para outro endereço.
          </p>
        </div>

        <!-- Actions -->
        <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <router-link
            to="/"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 12L6 8L10 4"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Voltar para Home
          </router-link>
          <button
            class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            @click="$router.back()"
          >
            Página anterior
          </button>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import notFoundImg from '@/assets/not-found.svg';
import AppFooter from '@/components/AppFooter.vue';
</script>
