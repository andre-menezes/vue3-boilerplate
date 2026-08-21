import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { authService } from '@/services/auth';

// Mock do authService
vi.mock('@/services/auth', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    updateProfile: vi.fn(),
    getUsers: vi.fn(),
    getUserById: vi.fn(),
    getProfile: vi.fn(),
  },
}));

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('deve inicializar com estado vazio', () => {
    const store = useAuthStore();
    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('deve computar isAuthenticated corretamente', () => {
    const store = useAuthStore();
    expect(store.isAuthenticated).toBe(false);

    store.token = 'test-token';
    expect(store.isAuthenticated).toBe(true);

    store.token = null;
    expect(store.isAuthenticated).toBe(false);
  });

  it('deve computar isAdmin pelo papel do usuário', () => {
    const store = useAuthStore();
    expect(store.isAdmin).toBe(false);

    store.user = {
      id: '1',
      name: 'Regular User',
      email: 'user@example.com',
      role: 'user',
    };
    expect(store.isAdmin).toBe(false);

    store.user = {
      id: '2',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    };
    expect(store.isAdmin).toBe(true);
  });

  it('deve computar fullName do usuário', () => {
    const store = useAuthStore();
    expect(store.fullName).toBe('');

    store.user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
    };
    expect(store.fullName).toBe('John Doe');
  });

  it('deve limpar erro com clearError()', () => {
    const store = useAuthStore();
    store.error = 'Some error';
    expect(store.error).not.toBeNull();

    store.clearError();
    expect(store.error).toBeNull();
  });

  it('deve limpar estado com logout()', async () => {
    const store = useAuthStore();
    store.user = { id: '1', name: 'John', email: 'john@example.com', role: 'user' };
    store.token = 'test-token';
    store.error = 'Some error';

    vi.mocked(authService.logout).mockResolvedValue();
    await store.logout();

    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.error).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });

  it('deve preservar o token persistido ao restaurar a sessão', async () => {
    const store = useAuthStore();
    const user = {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin' as const,
    };

    store.token = 'persisted-token';
    vi.mocked(authService.getProfile).mockResolvedValue(user);

    await store.restoreSession();

    expect(store.user).toEqual(user);
    expect(store.token).toBe('persisted-token');
    expect(store.isAuthenticated).toBe(true);
  });

  it('deve ler o token persistido do localStorage quando o store ainda está vazio', async () => {
    const user = {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin' as const,
    };

    localStorage.setItem(
      'auth',
      JSON.stringify({
        user,
        token: 'persisted-token-from-storage',
      })
    );

    const store = useAuthStore();
    vi.mocked(authService.getProfile).mockResolvedValue(user);

    await store.restoreSession();

    expect(store.user).toEqual(user);
    expect(store.token).toBe('persisted-token-from-storage');
    expect(store.isAuthenticated).toBe(true);
  });

  it('deve autenticar e preencher estado ao fazer login com sucesso', async () => {
    const store = useAuthStore();
    const user = {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin' as const,
    };

    vi.mocked(authService.login).mockResolvedValue({
      user,
      accessToken: 'jwt-token',
    });

    await store.login('admin@example.com', '123456');

    expect(authService.login).toHaveBeenCalledWith('admin@example.com', '123456');
    expect(store.user).toEqual(user);
    expect(store.token).toBe('jwt-token');
    expect(store.isAuthenticated).toBe(true);
    expect(store.error).toBeNull();
    expect(store.isLoading).toBe(false);
  });

  it('deve salvar erro e finalizar loading quando login falha', async () => {
    const store = useAuthStore();
    const error = new Error('Email ou senha inválidos');

    vi.mocked(authService.login).mockRejectedValue(error);

    await expect(store.login('invalid@example.com', 'wrongpassword')).rejects.toThrow(
      'Email ou senha inválidos'
    );

    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.error).toBe('Email ou senha inválidos');
    expect(store.isLoading).toBe(false);
  });

  it('deve registrar usuário e preencher estado ao criar conta com sucesso', async () => {
    const store = useAuthStore();
    const user = {
      id: '2',
      name: 'Regular User',
      email: 'user@example.com',
      role: 'user' as const,
    };

    vi.mocked(authService.register).mockResolvedValue({
      user,
      accessToken: 'register-token',
    });

    await store.register('user@example.com', '123456', 'Regular User');

    expect(authService.register).toHaveBeenCalledWith(
      'user@example.com',
      '123456',
      'Regular User'
    );
    expect(store.user).toEqual(user);
    expect(store.token).toBe('register-token');
    expect(store.isAuthenticated).toBe(true);
    expect(store.error).toBeNull();
    expect(store.isLoading).toBe(false);
  });

  it('deve atualizar perfil e sincronizar usuário autenticado', async () => {
    const store = useAuthStore();
    store.user = {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    };

    const updatedUser = {
      id: '1',
      name: 'Admin Updated',
      email: 'admin.updated@example.com',
      role: 'admin' as const,
    };

    vi.mocked(authService.updateProfile).mockResolvedValue(updatedUser);

    await store.updateProfile({ name: 'Admin Updated', email: 'admin.updated@example.com' });

    expect(authService.updateProfile).toHaveBeenCalledWith({
      name: 'Admin Updated',
      email: 'admin.updated@example.com',
    });
    expect(store.user).toEqual(updatedUser);
    expect(store.error).toBeNull();
    expect(store.isLoading).toBe(false);
  });

  it('deve salvar erro e finalizar loading quando cadastro falha', async () => {
    const store = useAuthStore();
    const error = new Error('Usuário com este email já existe');

    vi.mocked(authService.register).mockRejectedValue(error);

    await expect(store.register('user@example.com', '123456', 'Regular User')).rejects.toThrow(
      'Usuário com este email já existe'
    );

    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.error).toBe('Usuário com este email já existe');
    expect(store.isLoading).toBe(false);
  });
});
