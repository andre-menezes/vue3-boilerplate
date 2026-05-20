<template>
  <div class="flex min-h-screen">
    <!-- ── Left panel — decorative ──────────────────────────────────── -->
    <aside
      class="relative hidden w-120 shrink-0 flex-col overflow-hidden bg-linear-to-br from-primary-500 via-primary-600 to-primary-700 lg:flex"
      aria-hidden="true"
    >
      <!-- Radial glows -->
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute left-[10%] top-[10%] h-64 w-64 rounded-full bg-white/8 blur-3xl" />
        <div
          class="absolute bottom-[10%] right-[10%] h-64 w-64 rounded-full bg-primary-400/30 blur-3xl"
        />
      </div>

      <div class="relative z-10 flex h-full flex-col p-10">
        <!-- Logo -->
        <div class="flex items-center gap-2.5">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white backdrop-blur-sm"
          >
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M2 4L16 28L30 4H24.5L16 18.5L7.5 4H2Z" fill="#7E60F4"></path>
                <path
                  d="M7.5 4L16 18.5L24.5 4H19.5L16.0653 10.0126L12.5 4H7.5Z"
                  fill="#3730A3"
                ></path>
              </g>
            </svg>
          </div>
          <span class="text-[1.0625rem] font-bold text-white">Vue3 Boilerplate</span>
        </div>

        <!-- Copy -->
        <div class="mt-auto pb-12">
          <h2 class="mb-3 text-[1.875rem] font-bold leading-[1.2] tracking-[-0.03em] text-white">
            A plataforma que o seu<br />negócio merece.
          </h2>
          <p class="mb-8 text-[0.9375rem] leading-relaxed text-white/80">
            Simples, segura e pronta para qualquer escala.
          </p>
          <ul class="flex flex-col gap-3">
            <li
              v-for="feature in features"
              :key="feature"
              class="flex items-center gap-2.5 text-sm text-white/85"
            >
              <span
                class="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-white/15"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7L5.5 10.5L12 4"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              {{ feature }}
            </li>
          </ul>
        </div>

        <!-- Illustration -->
        <div class="mt-auto overflow-hidden rounded-xl p-4 pb-0 backdrop-blur-sm">
          <img
            :src="loginImg"
            alt=""
            class="block h-auto w-full rounded-t-lg"
            width="400"
            height="400"
          />
        </div>
      </div>
    </aside>

    <!-- ── Right panel — form ────────────────────────────────────────── -->
    <main class="flex flex-1 items-center justify-center bg-slate-50 px-6 py-8">
      <div class="flex w-full max-w-100 flex-col gap-8" style="animation: var(--animate-slide-up)">
        <!-- Mobile logo -->
        <div class="flex items-center gap-2 lg:hidden">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M2 4L16 28L30 4H24.5L16 18.5L7.5 4H2Z" fill="#7E60F4"></path>
              <path
                d="M7.5 4L16 18.5L24.5 4H19.5L16.0653 10.0126L12.5 4H7.5Z"
                fill="#3730A3"
              ></path>
            </g>
          </svg>
          <span class="text-base font-bold tracking-tight text-slate-800">Vue3 Boilerplate</span>
        </div>

        <!-- Heading -->
        <div class="flex flex-col gap-1.5">
          <h1 class="text-[1.625rem] font-bold tracking-tight text-slate-900">
            {{ isRegisterMode ? 'Criar conta' : 'Bem-vindo de volta' }}
          </h1>
          <p class="text-[0.9375rem] text-slate-500">
            {{
              isRegisterMode
                ? 'Preencha os dados para criar a sua conta.'
                : 'Entre com suas credenciais para continuar.'
            }}
          </p>
        </div>

        <!-- Form -->
        <form
          class="flex flex-col gap-4.5"
          @submit.prevent="isRegisterMode ? handleRegister() : handleLogin()"
        >
          <!-- Name (register only) -->
          <div
            v-if="isRegisterMode"
            class="flex flex-col gap-1.5"
            style="animation: var(--animate-fade-in)"
          >
            <label for="name" class="block text-[0.8125rem] font-medium text-slate-600"
              >Nome completo</label
            >
            <input
              id="name"
              v-model.trim="form.name"
              type="text"
              required
              placeholder="João Silva"
              :disabled="isLoading"
              autocomplete="name"
              class="input-field"
            />
          </div>

          <!-- Email -->
          <div class="flex flex-col gap-1.5">
            <label for="email" class="block text-[0.8125rem] font-medium text-slate-600"
              >E-mail</label
            >
            <input
              id="email"
              v-model.trim="form.email"
              type="email"
              required
              placeholder="voce@exemplo.com"
              :disabled="isLoading"
              autocomplete="email"
              class="input-field"
            />
          </div>

          <!-- Password -->
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between">
              <label for="password" class="block text-[0.8125rem] font-medium text-slate-600"
                >Senha</label
              >
              <a
                v-if="!isRegisterMode"
                href="#"
                class="text-[0.8125rem] font-medium text-primary-500 transition-colors hover:text-primary-600"
                tabindex="-1"
              >
                Esqueceu a senha?
              </a>
            </div>
            <input
              id="password"
              v-model.trim="form.password"
              type="password"
              required
              placeholder="••••••••"
              :disabled="isLoading"
              autocomplete="current-password"
              class="input-field"
            />
          </div>

          <!-- Error -->
          <transition name="fade">
            <div
              v-if="error"
              class="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700"
              role="alert"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="mt-px shrink-0">
                <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" />
                <path
                  d="M8 5v3.5M8 11h.01"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
              {{ error }}
            </div>
          </transition>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isLoading"
            class="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              v-if="isLoading"
              class="spin"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="currentColor"
                stroke-width="2"
                stroke-dasharray="28"
                stroke-dashoffset="10"
                stroke-linecap="round"
              />
            </svg>
            <span>{{ submitLabel }}</span>
          </button>

          <!-- Toggle -->
          <p class="m-0 text-center text-sm text-slate-500">
            {{ isRegisterMode ? 'Já tem uma conta?' : 'Não tem uma conta?' }}
            <button
              type="button"
              class="ml-1 cursor-pointer border-none bg-transparent p-0 font-semibold text-primary-500 transition-colors hover:text-primary-600 hover:underline"
              style="font-family: inherit; font-size: inherit"
              @click="toggleMode"
            >
              {{ isRegisterMode ? 'Entrar' : 'Criar conta' }}
            </button>
          </p>
        </form>

        <!-- Demo hint -->
        <div
          v-if="!isRegisterMode"
          class="flex items-center justify-center gap-2.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 shadow-[0_1px_2px_rgb(0_0_0/0.04)]"
        >
          <span
            class="rounded-[3px] bg-primary-500/8 px-1.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-primary-500"
            >Demo</span
          >
          <span class="font-mono text-[0.8125rem] text-slate-500">admin@example.com · 123456</span>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import loginImg from '@/assets/login-illustration.svg';

const router = useRouter();
const authStore = useAuthStore();

const isRegisterMode = ref(false);
const isLoading = ref(false);
const error = ref<string | null>(null);

const form = ref({ name: '', email: '', password: '' });

const submitLabel = computed(() => {
  if (isLoading.value) return isRegisterMode.value ? 'Criando conta...' : 'Entrando...';
  return isRegisterMode.value ? 'Criar conta' : 'Entrar';
});

const features = [
  'Autenticação segura com JWT',
  'Interface moderna e responsiva',
  'Internacionalização integrada',
  'Pronto para produção',
];

function toggleMode() {
  isRegisterMode.value = !isRegisterMode.value;
  error.value = null;
  form.value = { name: '', email: '', password: '' };
}

async function handleLogin() {
  isLoading.value = true;
  error.value = null;
  try {
    await authStore.login(form.value.email, form.value.password);
    router.push({ name: 'Home' });
  } catch {
    error.value = 'Email ou senha inválidos';
  } finally {
    isLoading.value = false;
  }
}

async function handleRegister() {
  isLoading.value = true;
  error.value = null;
  try {
    await authStore.register(form.value.email, form.value.password, form.value.name);
    router.push({ name: 'Home' });
  } catch {
    error.value = 'Erro ao criar conta. Tente outro e-mail.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* Input field — grouped here because the :focus/:hover/:disabled
   pseudo-selectors are cleaner in CSS than in long Tailwind strings. */
.input-field {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  font-family: inherit;
  color: var(--color-slate-900);
  background: var(--color-surface);
  border: 1px solid var(--color-slate-300);
  border-radius: var(--radius-md);
  outline: none;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}

.input-field::placeholder {
  color: var(--color-slate-400);
}

.input-field:hover:not(:disabled) {
  border-color: var(--color-primary-300);
}

.input-field:focus {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgb(var(--rgb-primary) / 0.12);
}

.input-field:disabled {
  background: var(--color-slate-100);
  color: var(--color-slate-400);
  cursor: not-allowed;
}

/* Spinner */
.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Alert transition */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
