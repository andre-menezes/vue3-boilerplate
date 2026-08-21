import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProfileView from '@/pages/ProfileView.vue';

const updateProfileMock = vi.hoisted(() => vi.fn());
const authStore = vi.hoisted(() => ({
  isAdmin: false,
  isLoading: false,
  user: {
    id: '1',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user' as const,
  },
  updateProfile: updateProfileMock,
}));

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => authStore,
}));

function mountProfileView() {
  return mount(ProfileView, {
    global: {
      stubs: {
        AppFooter: true,
        AppNavbar: true,
        RouterLink: true,
      },
    },
  });
}

describe('ProfileView', () => {
  beforeEach(() => {
    updateProfileMock.mockReset();
    authStore.isAdmin = false;
    authStore.isLoading = false;
    authStore.user = {
      id: '1',
      name: 'Regular User',
      email: 'user@example.com',
      role: 'user',
    };
  });

  it('preenche formulário com usuário autenticado', () => {
    const wrapper = mountProfileView();

    expect((wrapper.get('input[name="name"]').element as HTMLInputElement).value).toBe(
      'Regular User'
    );
    expect((wrapper.get('input[name="email"]').element as HTMLInputElement).value).toBe(
      'user@example.com'
    );
  });

  it('atualiza perfil sem enviar senha vazia', async () => {
    updateProfileMock.mockResolvedValueOnce(undefined);
    const wrapper = mountProfileView();

    await wrapper.get('input[name="name"]').setValue('Regular Updated');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(updateProfileMock).toHaveBeenCalledWith({
      name: 'Regular Updated',
      email: 'user@example.com',
    });
    expect(wrapper.get('[role="status"]').text()).toContain('Perfil atualizado com sucesso.');
  });

  it('exibe erro quando atualização falha', async () => {
    updateProfileMock.mockRejectedValueOnce(new Error('Request failed'));
    const wrapper = mountProfileView();

    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(wrapper.get('[role="alert"]').text()).toContain(
      'Não foi possível atualizar o perfil. Tente novamente.'
    );
  });
});
