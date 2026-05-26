import { describe, expect, it, vi } from 'vitest';
import http from '@/services/http';
import { authService } from '@/services/auth';

vi.mock('@/services/http', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Auth Service', () => {
  it('deve fazer login com endpoint e payload corretos', async () => {
    const response = {
      user: { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' as const },
      accessToken: 'jwt-token',
    };

    vi.mocked(http.post).mockResolvedValueOnce({ data: response });

    await expect(authService.login('admin@example.com', '123456')).resolves.toEqual(response);
    expect(http.post).toHaveBeenCalledWith('/login', {
      email: 'admin@example.com',
      password: '123456',
    });
  });

  it('deve registrar usuário com role padrão user', async () => {
    const response = {
      user: { id: '2', name: 'Regular User', email: 'user@example.com', role: 'user' as const },
      accessToken: 'register-token',
    };

    vi.mocked(http.post).mockResolvedValueOnce({ data: response });

    await expect(authService.register('user@example.com', '123456', 'Regular User')).resolves.toEqual(
      response
    );
    expect(http.post).toHaveBeenCalledWith('/register', {
      email: 'user@example.com',
      password: '123456',
      name: 'Regular User',
      role: 'user',
    });
  });

  it('deve retornar lista de usuários', async () => {
    const users = [{ id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' as const }];

    vi.mocked(http.get).mockResolvedValueOnce({ data: users });

    await expect(authService.getUsers()).resolves.toEqual(users);
    expect(http.get).toHaveBeenCalledWith('/users');
  });

  it('deve buscar usuário por id string', async () => {
    const user = { id: '550e8400', name: 'Admin User', email: 'admin@example.com', role: 'admin' as const };

    vi.mocked(http.get).mockResolvedValueOnce({ data: user });

    await expect(authService.getUserById('550e8400')).resolves.toEqual(user);
    expect(http.get).toHaveBeenCalledWith('/users/550e8400');
  });

  it('deve buscar perfil autenticado', async () => {
    const user = { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' as const };

    vi.mocked(http.get).mockResolvedValueOnce({ data: user });

    await expect(authService.getProfile()).resolves.toEqual(user);
    expect(http.get).toHaveBeenCalledWith('/profile');
  });

  it('deve atualizar perfil autenticado', async () => {
    const payload = { name: 'Admin Updated', email: 'admin.updated@example.com' };
    const response = {
      id: '1',
      name: 'Admin Updated',
      email: 'admin.updated@example.com',
      role: 'admin' as const,
    };

    vi.mocked(http.patch).mockResolvedValueOnce({ data: response });

    await expect(authService.updateProfile(payload)).resolves.toEqual(response);
    expect(http.patch).toHaveBeenCalledWith('/profile', payload);
  });

  it('deve criar usuário com endpoint e payload corretos', async () => {
    const payload = {
      name: 'New User',
      email: 'new@example.com',
      password: '123456',
      role: 'user' as const,
    };
    const response = {
      id: '3',
      name: 'New User',
      email: 'new@example.com',
      role: 'user' as const,
    };

    vi.mocked(http.post).mockResolvedValueOnce({ data: response });

    await expect(authService.createUser(payload)).resolves.toEqual(response);
    expect(http.post).toHaveBeenCalledWith('/users', payload);
  });

  it('deve atualizar usuário com patch e retornar response.data', async () => {
    const payload = {
      name: 'Updated User',
      role: 'admin' as const,
    };
    const response = {
      id: '3',
      name: 'Updated User',
      email: 'new@example.com',
      role: 'admin' as const,
    };

    vi.mocked(http.patch).mockResolvedValueOnce({ data: response });

    await expect(authService.updateUser('3', payload)).resolves.toEqual(response);
    expect(http.patch).toHaveBeenCalledWith('/users/3', payload);
  });

  it('deve remover usuário pelo endpoint correto', async () => {
    vi.mocked(http.delete).mockResolvedValueOnce({ data: undefined });

    await expect(authService.deleteUser('3')).resolves.toBeUndefined();
    expect(http.delete).toHaveBeenCalledWith('/users/3');
  });

  it('deve buscar logs de auditoria', async () => {
    const logs = [
      {
        id: 'log-1',
        action: 'user.create' as const,
        actor: { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' as const },
        target: { id: '2', name: 'Regular User', email: 'user@example.com', role: 'user' as const },
        summary: 'user@example.com foi criado',
        createdAt: '2026-05-26T10:00:00.000Z',
      },
    ];

    vi.mocked(http.get).mockResolvedValueOnce({ data: logs });

    await expect(authService.getAuditLogs()).resolves.toEqual(logs);
    expect(http.get).toHaveBeenCalledWith('/audit-logs');
  });
});
