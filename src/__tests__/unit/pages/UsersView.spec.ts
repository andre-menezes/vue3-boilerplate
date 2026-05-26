import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UsersView from '@/pages/UsersView.vue';
import { authService } from '@/services/auth';

vi.mock('@/services/auth', () => ({
  authService: {
    getUsers: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  },
}));

function mountUsersView() {
  return mount(UsersView, {
    global: {
      stubs: {
        AppFooter: true,
        AppNavbar: true,
        RouterLink: true,
      },
    },
  });
}

describe('UsersView', () => {
  beforeEach(() => {
    vi.mocked(authService.getUsers).mockReset();
    vi.mocked(authService.createUser).mockReset();
    vi.mocked(authService.updateUser).mockReset();
    vi.mocked(authService.deleteUser).mockReset();
    vi.restoreAllMocks();
  });

  it('carrega e renderiza lista de usuários', async () => {
    vi.mocked(authService.getUsers).mockResolvedValueOnce([
      { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
      { id: '2', name: 'Regular User', email: 'user@example.com', role: 'user' },
    ]);

    const wrapper = mountUsersView();
    await flushPromises();

    expect(wrapper.text()).toContain('Admin User');
    expect(wrapper.text()).toContain('Regular User');
    expect(authService.getUsers).toHaveBeenCalledTimes(1);
  });

  it('exibe estado vazio quando não há usuários', async () => {
    vi.mocked(authService.getUsers).mockResolvedValueOnce([]);

    const wrapper = mountUsersView();
    await flushPromises();

    expect(wrapper.text()).toContain('Nenhum usuário cadastrado.');
  });

  it('cria usuário e recarrega a lista', async () => {
    vi.mocked(authService.getUsers)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        { id: '3', name: 'New User', email: 'new@example.com', role: 'user' },
      ]);
    vi.mocked(authService.createUser).mockResolvedValueOnce({
      id: '3',
      name: 'New User',
      email: 'new@example.com',
      role: 'user',
    });

    const wrapper = mountUsersView();
    await flushPromises();

    await wrapper.get('input[name="name"]').setValue('New User');
    await wrapper.get('input[name="email"]').setValue('new@example.com');
    await wrapper.get('input[name="password"]').setValue('123456');
    await wrapper.get('select[name="role"]').setValue('user');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(authService.createUser).toHaveBeenCalledWith({
      name: 'New User',
      email: 'new@example.com',
      password: '123456',
      role: 'user',
    });
    expect(authService.getUsers).toHaveBeenCalledTimes(2);
    expect(wrapper.text()).toContain('New User');
  });

  it('edita usuário sem enviar password vazio', async () => {
    vi.mocked(authService.getUsers)
      .mockResolvedValueOnce([
        { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
      ])
      .mockResolvedValueOnce([
        { id: '1', name: 'Admin Updated', email: 'admin@example.com', role: 'admin' },
      ]);
    vi.mocked(authService.updateUser).mockResolvedValueOnce({
      id: '1',
      name: 'Admin Updated',
      email: 'admin@example.com',
      role: 'admin',
    });

    const wrapper = mountUsersView();
    await flushPromises();

    await wrapper.get('button[aria-label="Editar Admin User"]').trigger('click');
    await wrapper.get('input[name="name"]').setValue('Admin Updated');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(authService.updateUser).toHaveBeenCalledWith('1', {
      name: 'Admin Updated',
      email: 'admin@example.com',
      role: 'admin',
    });
    expect(wrapper.text()).toContain('Admin Updated');
  });

  it('remove usuário após confirmação', async () => {
    vi.spyOn(window, 'confirm').mockReturnValueOnce(true);
    vi.mocked(authService.getUsers)
      .mockResolvedValueOnce([
        { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
      ])
      .mockResolvedValueOnce([]);
    vi.mocked(authService.deleteUser).mockResolvedValueOnce(undefined);

    const wrapper = mountUsersView();
    await flushPromises();

    await wrapper.get('button[aria-label="Remover Admin User"]').trigger('click');
    await flushPromises();

    expect(window.confirm).toHaveBeenCalledWith('Remover Admin User?');
    expect(authService.deleteUser).toHaveBeenCalledWith('1');
    expect(wrapper.text()).toContain('Nenhum usuário cadastrado.');
  });

  it('exibe erro quando carregamento falha', async () => {
    vi.mocked(authService.getUsers).mockRejectedValueOnce(new Error('Request failed'));

    const wrapper = mountUsersView();
    await flushPromises();

    expect(wrapper.get('[role="alert"]').text()).toContain(
      'Não foi possível carregar usuários. Tente novamente.'
    );
  });
});
