<template>
  <div class="flex min-h-screen flex-col bg-slate-50">
    <AppNavbar>
      <RouterLink
        :to="{ name: 'Home' }"
        class="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >Início</RouterLink
      >
      <RouterLink
        :to="{ name: 'Users' }"
        class="rounded-lg px-3 py-1.5 text-sm font-medium text-primary-500 bg-primary-500/6 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >Usuários</RouterLink
      >
    </AppNavbar>

    <main class="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-6 py-8">
      <header class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm font-semibold text-primary-600">Administração</p>
          <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">
            Gerenciamento de usuários
          </h1>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Consulte, crie, edite e remova usuários usando a API mock protegida por JWT.
          </p>
        </div>

        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="isSaving"
          @click="startCreate"
        >
          <s-icon name="AddCircle" />
          Novo usuário
        </button>
      </header>

      <p
        v-if="error"
        role="alert"
        class="rounded-lg border border-danger-600/20 bg-danger-600/8 px-4 py-3 text-sm font-medium text-danger-600"
      >
        {{ error }}
      </p>

      <p
        v-if="successMessage"
        role="status"
        class="rounded-lg border border-emerald-600/20 bg-emerald-600/8 px-4 py-3 text-sm font-medium text-emerald-700"
      >
        {{ successMessage }}
      </p>

      <section class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card">
          <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 class="text-base font-bold text-slate-900">Usuários</h2>
            <button
              type="button"
              class="flex gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="isLoading"
              @click="loadUsers"
            >
              <s-icon name="Refresh" />
              Atualizar
            </button>
          </div>

          <div class="grid grid-cols-1 gap-3 border-b border-slate-200 px-5 py-4 sm:grid-cols-2">
            <label class="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
              Buscar
              <input
                v-model="searchTerm"
                class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-primary-500"
                type="search"
                placeholder="Nome ou email"
                @input="currentPage = 1"
              />
            </label>

            <label class="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
              Role
              <select
                v-model="roleFilter"
                class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-primary-500"
                @change="currentPage = 1"
              >
                <option value="all">Todos</option>
                <option value="admin">admin</option>
                <option value="user">user</option>
              </select>
            </label>
          </div>

          <div v-if="isLoading" class="px-5 py-12 text-center text-sm font-medium text-slate-500">
            Carregando usuários...
          </div>

          <div
            v-else-if="users.length === 0"
            class="px-5 py-12 text-center text-sm font-medium text-slate-500"
          >
            Nenhum usuário cadastrado.
          </div>

          <div
            v-else-if="filteredUsers.length === 0"
            class="px-5 py-12 text-center text-sm font-medium text-slate-500"
          >
            Nenhum usuário encontrado com os filtros atuais.
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead class="bg-slate-50 text-xs font-bold uppercase text-slate-400">
                <tr>
                  <th class="px-5 py-3">Nome</th>
                  <th class="px-5 py-3">Email</th>
                  <th class="px-5 py-3">Role</th>
                  <th class="px-5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="user in paginatedUsers" :key="user.id" class="text-slate-700">
                  <td class="px-5 py-4 font-semibold text-slate-900">{{ user.name }}</td>
                  <td class="px-5 py-4">{{ user.email }}</td>
                  <td class="px-5 py-4">
                    <span
                      class="inline-flex rounded-full bg-primary-500/10 px-2 py-0.5 text-xs font-semibold text-primary-600"
                    >
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-5 py-4">
                    <div class="flex justify-end gap-2">
                      <button
                        type="button"
                        class="flex gap-2 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                        :aria-label="`Editar ${user.name}`"
                        @click="startEdit(user)"
                      >
                        <s-icon name="Pen" />
                        Editar
                      </button>
                      <button
                        type="button"
                        class="flex gap-2 rounded-md border border-danger-600/25 px-2.5 py-1.5 text-xs font-semibold text-danger-600 transition-colors hover:bg-danger-600/5"
                        :aria-label="`Remover ${user.name}`"
                        @click="deleteUser(user)"
                      >
                        <s-icon name="TrashBinTrash" />
                        Remover
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div
              class="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"
            >
              <span>
                Página {{ currentPage }} de {{ totalPages }} · {{ filteredUsers.length }} usuário(s)
              </span>
              <div class="flex gap-2">
                <button
                  type="button"
                  class="flex gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="currentPage === 1"
                  @click="currentPage -= 1"
                >
                  <s-icon name="ArrowLeft" />
                  Anterior
                </button>
                <button
                  type="button"
                  class="flex gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="currentPage === totalPages"
                  @click="currentPage += 1"
                >
                  Próxima
                  <s-icon name="ArrowRight" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside class="flex flex-col gap-6">
          <form
            class="rounded-lg border border-slate-200 bg-white p-5 shadow-card"
            @submit.prevent="submitForm"
          >
            <h2 class="text-base font-bold text-slate-900">
              {{ selectedUserId ? 'Editar usuário' : 'Novo usuário' }}
            </h2>

            <div class="mt-5 flex flex-col gap-4">
              <label class="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
                Nome
                <input
                  v-model="form.name"
                  class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-primary-500 disabled:bg-slate-100"
                  name="name"
                  type="text"
                  required
                  :disabled="isSaving"
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
                  :disabled="isSaving"
                />
              </label>

              <label class="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
                Senha
                <input
                  v-model="form.password"
                  class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-primary-500 disabled:bg-slate-100"
                  name="password"
                  type="password"
                  :required="!selectedUserId"
                  :placeholder="selectedUserId ? 'Deixe em branco para manter' : ''"
                  :disabled="isSaving"
                />
              </label>

              <label class="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
                Role
                <select
                  v-model="form.role"
                  class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-primary-500 disabled:bg-slate-100"
                  name="role"
                  :disabled="isSaving"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </label>
            </div>

            <div class="mt-6 flex gap-2">
              <button
                type="submit"
                class="inline-flex flex-1 items-center justify-center rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="isSaving"
              >
                {{
                  isSaving ? 'Salvando...' : selectedUserId ? 'Salvar alterações' : 'Criar usuário'
                }}
              </button>
              <button
                type="button"
                class="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="isSaving"
                @click="resetForm"
              >
                Limpar
              </button>
            </div>
          </form>

          <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
            <div class="flex items-center justify-between gap-3">
              <h2 class="text-base font-bold text-slate-900">Auditoria recente</h2>
              <button
                type="button"
                class="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="isLoadingAudit"
                @click="loadAuditLogs"
              >
                Atualizar
              </button>
            </div>

            <div v-if="isLoadingAudit" class="mt-5 text-sm font-medium text-slate-500">
              Carregando auditoria...
            </div>
            <div v-else-if="auditLogs.length === 0" class="mt-5 text-sm font-medium text-slate-500">
              Nenhuma atividade registrada.
            </div>
            <ol v-else class="mt-5 flex flex-col gap-3">
              <li
                v-for="log in auditLogs.slice(0, 6)"
                :key="log.id"
                class="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
              >
                <p class="text-sm font-semibold text-slate-800">{{ log.summary }}</p>
                <p class="mt-1 text-xs text-slate-400">
                  {{ formatDate(log.createdAt) }} · {{ log.actor?.email ?? 'system' }}
                </p>
              </li>
            </ol>
          </section>
        </aside>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AppFooter from '@/components/AppFooter.vue';
import AppNavbar from '@/components/AppNavbar.vue';
import { authService } from '@/services/auth';
import type {
  AuditLog,
  CreateUserPayload,
  UpdateUserPayload,
  UserRole,
  UserWithoutPassword,
} from '@/types/auth';

const users = ref<UserWithoutPassword[]>([]);
const auditLogs = ref<AuditLog[]>([]);
const isLoading = ref(false);
const isLoadingAudit = ref(false);
const isSaving = ref(false);
const error = ref('');
const successMessage = ref('');
const selectedUserId = ref<string | undefined>();
const searchTerm = ref('');
const roleFilter = ref<'all' | UserRole>('all');
const currentPage = ref(1);
const pageSize = 5;
const form = ref({
  name: '',
  email: '',
  password: '',
  role: 'user' as UserRole,
});

const filteredUsers = computed(() => {
  const normalizedSearch = searchTerm.value.trim().toLowerCase();

  return users.value.filter((user) => {
    const matchesSearch =
      !normalizedSearch ||
      user.name.toLowerCase().includes(normalizedSearch) ||
      user.email.toLowerCase().includes(normalizedSearch);
    const matchesRole = roleFilter.value === 'all' || user.role === roleFilter.value;

    return matchesSearch && matchesRole;
  });
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / pageSize)));

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredUsers.value.slice(start, start + pageSize);
});

function getErrorMessage(action: string) {
  return `Não foi possível ${action}. Tente novamente.`;
}

function resetForm() {
  selectedUserId.value = undefined;
  form.value = {
    name: '',
    email: '',
    password: '',
    role: 'user',
  };
}

function startCreate() {
  error.value = '';
  successMessage.value = '';
  resetForm();
}

function startEdit(user: UserWithoutPassword) {
  error.value = '';
  successMessage.value = '';
  selectedUserId.value = user.id;
  form.value = {
    name: user.name,
    email: user.email,
    password: '',
    role: user.role,
  };
}

async function loadUsers() {
  isLoading.value = true;
  error.value = '';

  try {
    users.value = await authService.getUsers();
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
  } catch {
    error.value = getErrorMessage('carregar usuários');
  } finally {
    isLoading.value = false;
  }
}

async function loadAuditLogs() {
  isLoadingAudit.value = true;

  try {
    auditLogs.value = await authService.getAuditLogs();
  } catch {
    error.value = getErrorMessage('carregar auditoria');
  } finally {
    isLoadingAudit.value = false;
  }
}

async function submitForm() {
  isSaving.value = true;
  error.value = '';
  successMessage.value = '';

  try {
    const wasEditing = !!selectedUserId.value;

    if (selectedUserId.value) {
      const payload: UpdateUserPayload = {
        name: form.value.name,
        email: form.value.email,
        role: form.value.role,
      };

      if (form.value.password) {
        payload.password = form.value.password;
      }

      await authService.updateUser(selectedUserId.value, payload);
    } else {
      const payload: CreateUserPayload = {
        name: form.value.name,
        email: form.value.email,
        password: form.value.password,
        role: form.value.role,
      };

      await authService.createUser(payload);
    }

    resetForm();
    await loadUsers();
    await loadAuditLogs();
    successMessage.value = wasEditing
      ? 'Usuário atualizado com sucesso.'
      : 'Usuário criado com sucesso.';
  } catch {
    error.value = getErrorMessage(selectedUserId.value ? 'salvar usuário' : 'criar usuário');
  } finally {
    isSaving.value = false;
  }
}

async function deleteUser(user: UserWithoutPassword) {
  if (!user.id || !window.confirm(`Remover ${user.name}?`)) {
    return;
  }

  isSaving.value = true;
  error.value = '';
  successMessage.value = '';

  try {
    await authService.deleteUser(user.id);
    await loadUsers();
    await loadAuditLogs();
    if (selectedUserId.value === user.id) {
      resetForm();
    }
    successMessage.value = 'Usuário removido com sucesso.';
  } catch {
    error.value = getErrorMessage('remover usuário');
  } finally {
    isSaving.value = false;
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

onMounted(() => {
  void loadUsers();
  void loadAuditLogs();
});
</script>
