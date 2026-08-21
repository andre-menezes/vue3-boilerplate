<template>
  <div class="flex min-h-screen flex-col bg-slate-50">
    <AppNavbar>
      <RouterLink
        :to="{ name: 'Home' }"
        class="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >Início</RouterLink
      >
      <RouterLink
        v-if="authStore.isAdmin"
        :to="{ name: 'Users' }"
        class="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >Usuários</RouterLink
      >
    </AppNavbar>

    <main class="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-8">
      <header>
        <p class="text-sm font-semibold text-primary-600">Minha conta</p>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">Perfil</h1>
        <p class="mt-2 text-sm leading-6 text-slate-500">
          Atualize seus dados básicos. A senha é opcional e só muda quando preenchida.
        </p>
      </header>

      <p
        v-if="message"
        role="status"
        class="rounded-lg border border-emerald-600/20 bg-emerald-600/8 px-4 py-3 text-sm font-medium text-emerald-700"
      >
        {{ message }}
      </p>

      <p
        v-if="error"
        role="alert"
        class="rounded-lg border border-danger-600/20 bg-danger-600/8 px-4 py-3 text-sm font-medium text-danger-600"
      >
        {{ error }}
      </p>

      <form
        class="rounded-lg border border-slate-200 bg-white p-5 shadow-card"
        @submit.prevent="submitForm"
      >
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label class="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
            Nome
            <input
              v-model="form.name"
              class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-primary-500 disabled:bg-slate-100"
              name="name"
              type="text"
              required
              :disabled="authStore.isLoading"
            />
          </label>

          <label class="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
            Email
            <input
              v-model="form.email"
              class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-primary-500 disabled:bg-slate-100"
              name="email"
              type="email"
              required
              :disabled="authStore.isLoading"
            />
          </label>
        </div>

        <label class="mt-4 flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
          Nova senha
          <input
            v-model="form.password"
            class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-primary-500 disabled:bg-slate-100"
            name="password"
            type="password"
            placeholder="Deixe em branco para manter"
            :disabled="authStore.isLoading"
          />
        </label>

        <div class="mt-6 flex justify-end">
          <button
            type="submit"
            class="inline-flex items-center justify-center rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="authStore.isLoading"
          >
            {{ authStore.isLoading ? 'Salvando...' : 'Salvar perfil' }}
          </button>
        </div>
      </form>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import AppFooter from '@/components/AppFooter.vue';
import AppNavbar from '@/components/AppNavbar.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const message = ref('');
const error = ref('');
const form = ref({
  name: '',
  email: '',
  password: '',
});

watchEffect(() => {
  form.value.name = authStore.user?.name ?? '';
  form.value.email = authStore.user?.email ?? '';
});

async function submitForm() {
  message.value = '';
  error.value = '';

  try {
    await authStore.updateProfile({
      name: form.value.name,
      email: form.value.email,
      ...(form.value.password ? { password: form.value.password } : {}),
    });
    form.value.password = '';
    message.value = 'Perfil atualizado com sucesso.';
  } catch {
    error.value = 'Não foi possível atualizar o perfil. Tente novamente.';
  }
}
</script>
