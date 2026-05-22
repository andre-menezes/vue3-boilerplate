<template>
  <div class="flex min-h-screen flex-col bg-slate-50">
    <!-- ── Navbar ──────────────────────────────────────────────────── -->
    <AppNavbar>
      <a
        href="#hero"
        class="rounded-lg px-3 py-1.5 text-sm font-medium text-primary-500 bg-primary-500/6 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >Início</a
      >
      <a
        href="#features"
        class="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >Funcionalidades</a
      >
    </AppNavbar>

    <!-- ── Main ──────────────────────────────────────────────────────── -->
    <main class="mx-auto w-full max-w-7xl flex-1 px-6">
      <!-- Hero -->
      <section id="hero" class="grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2 lg:py-20">
        <div class="flex flex-col gap-6">
          <!-- Badge -->
          <div class="flex">
            <span
              class="inline-flex items-center gap-1.5 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-600"
            >
              <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
                <circle cx="5" cy="5" r="5" />
              </svg>
              v1.0 — Boilerplate pronto para uso
            </span>
          </div>

          <h1
            class="text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.1] tracking-[-0.04em] text-slate-900"
          >
            Vue 3 + Vite<br />
            <span
              class="bg-linear-to-br from-primary-500 to-violet-500 bg-clip-text text-transparent"
              >Boilerplate</span
            >
          </h1>

          <p class="max-w-120 text-[1.0625rem] leading-relaxed text-slate-500">
            Um template completo e opinado para construir aplicações Vue 3 modernas. Autenticação,
            i18n, roteamento e muito mais — tudo configurado.
          </p>

          <div class="flex flex-wrap gap-3">
            <a
              href="#features"
              class="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
            >
              Ver funcionalidades
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              GitHub
            </a>
          </div>
        </div>

        <!-- Illustration (desktop only) -->
        <div class="hidden items-center justify-center lg:flex">
          <div class="w-full max-w-125 overflow-hidden rounded-2xl p-6 pb-0">
            <img :src="homeImg" alt="" class="block h-auto w-full" width="500" height="500" />
          </div>
        </div>
      </section>

      <!-- Stats bar -->
      <div
        class="mb-16 grid grid-cols-2 overflow-hidden rounded-lg border border-slate-200 bg-slate-200 gap-px sm:grid-cols-4"
      >
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="flex flex-col items-center gap-1 bg-white px-5 py-5"
        >
          <span class="text-base font-bold tracking-tight text-slate-900">{{ stat.value }}</span>
          <span class="text-xs font-medium text-slate-400">{{ stat.label }}</span>
        </div>
      </div>

      <!-- Features -->
      <section id="features" class="pb-20">
        <div class="mb-12 text-center">
          <h2 class="mb-3 text-[1.875rem] font-extrabold tracking-[-0.03em] text-slate-900">
            Tudo que você precisa
          </h2>
          <p class="mx-auto max-w-130 text-[1.0625rem] text-slate-500">
            Cada funcionalidade foi escolhida para cobrir os casos de uso mais comuns, sem adicionar
            complexidade desnecessária.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="feature in featureList"
            :key="feature.title"
            class="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-card transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgb(0_0_0/0.1)]"
          >
            <div
              class="flex h-10 w-10 items-center justify-center rounded-[10px]"
              :class="feature.iconClass"
            >
              <component :is="feature.icon" />
            </div>
            <h3 class="text-[0.9375rem] font-semibold tracking-tight text-slate-900">
              {{ feature.title }}
            </h3>
            <p class="flex-1 text-sm leading-[1.65] text-slate-500">{{ feature.description }}</p>
            <div class="mt-1 flex flex-wrap gap-1.5">
              <span
                v-for="tag in feature.tags"
                :key="tag"
                class="inline-flex items-center rounded-full bg-primary-500/10 px-2 py-0.5 text-[0.6875rem] font-medium text-primary-600"
              >
                {{ tag }}
              </span>
            </div>
          </article>
        </div>
      </section>
    </main>

    <!-- ── Footer ─────────────────────────────────────────────────────── -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import homeImg from '@/assets/home-illustration.svg';
import AppNavbar from '@/components/AppNavbar.vue';
import AppFooter from '@/components/AppFooter.vue';
import IconVite from '@/components/icons/IconVite.vue';
import IconVue from '@/components/icons/IconVue.vue';
import IconPinia from '@/components/icons/IconPinia.vue';
import IconRouter from '@/components/icons/IconRouter.vue';
import IconI18n from '@/components/icons/IconI18n.vue';
import IconAuth from '@/components/icons/IconAuth.vue';

const stats = [
  { value: 'Vue 3', label: 'Composition API' },
  { value: 'Vite 6', label: 'Build Tool' },
  { value: 'Pinia', label: 'State Management' },
  { value: 'i18n', label: 'Internacionalização' },
];

const featureList = [
  {
    title: 'Vite + HMR Instantâneo',
    description:
      'Desenvolvimento ultrarrápido com Hot Module Replacement e builds otimizados para produção.',
    icon: IconVite,
    iconClass: 'bg-amber-500/12 text-amber-600',
    tags: ['Vite 6', 'ESM'],
  },
  {
    title: 'Vue 3 Composition API',
    description:
      'Componentes tipados com TypeScript, script setup e todas as vantagens da Composition API.',
    icon: IconVue,
    iconClass: 'bg-emerald-500/12 text-emerald-600',
    tags: ['Vue 3', 'TypeScript'],
  },
  {
    title: 'Pinia com Persistência',
    description:
      'Gerenciamento de estado modular com persistência automática no localStorage via plugin.',
    icon: IconPinia,
    iconClass: 'bg-violet-500/12 text-violet-600',
    tags: ['Pinia', 'Persist'],
  },
  {
    title: 'Vue Router + Guards',
    description:
      'Roteamento client-side com guards de autenticação, lazy loading e scroll behavior.',
    icon: IconRouter,
    iconClass: 'bg-blue-500/12 text-blue-600',
    tags: ['Vue Router', 'Guards'],
  },
  {
    title: 'i18n Integrado',
    description:
      'Suporte a múltiplos idiomas com Vue I18n. Arquivos de tradução em JSON para pt-BR e en-US.',
    icon: IconI18n,
    iconClass: 'bg-primary-500/12 text-primary-600',
    tags: ['Vue I18n', 'pt-BR', 'en-US'],
  },
  {
    title: 'Auth JWT + API',
    description: 'Autenticação completa com JWT, interceptors Axios e backend mock configurável.',
    icon: IconAuth,
    iconClass: 'bg-rose-500/12 text-rose-600',
    tags: ['JWT', 'Axios', 'Mock API'],
  },
];
</script>
