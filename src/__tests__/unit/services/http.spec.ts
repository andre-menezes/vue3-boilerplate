import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import http from '@/services/instance';

const pushMock = vi.hoisted(() => vi.fn());

// Mock do router
vi.mock('@/router', () => ({
  default: {
    push: pushMock,
  },
}));

describe('HTTP Service', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    pushMock.mockClear();
  });

  it('deve ser uma instância de axios', () => {
    expect(http).toBeDefined();
    expect(http.get).toBeDefined();
    expect(http.post).toBeDefined();
  });

  it('deve ter baseURL configurada', () => {
    expect(http.defaults.baseURL).toBe('http://localhost:3000');
  });

  it('deve enviar Content-Type como application/json em requisições com body', async () => {
    let contentType: unknown;

    await http.post(
      '/test',
      { foo: 'bar' },
      {
        adapter: async (config) => {
          contentType = config.headers.get('Content-Type');

          return {
            data: {},
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          };
        },
      }
    );

    expect(contentType).toBe('application/json');
  });

  it('deve enviar cookies em requisições com credentials ativadas', async () => {
    const authStore = useAuthStore();
    let withCredentials: unknown;
    let authorization: unknown;

    authStore.token = 'jwt-token';

    await http.get('/users', {
      adapter: async (config) => {
        withCredentials = config.withCredentials;
        authorization = config.headers.get('Authorization');

        return {
          data: [],
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        };
      },
    });

    expect(withCredentials).toBe(true);
    expect(authorization).toBeUndefined();
  });

  it('não deve enviar Authorization quando não há token', async () => {
    let authorization: unknown;

    await http.get('/users', {
      adapter: async (config) => {
        authorization = config.headers.get('Authorization');

        return {
          data: [],
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        };
      },
    });

    expect(authorization).toBeUndefined();
  });

  it('deve limpar autenticação e redirecionar para Login em resposta 401', async () => {
    const authStore = useAuthStore();

    authStore.user = {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    };
    authStore.token = 'expired-token';

    await expect(
      http.get('/users', {
        adapter: async (config) => {
          return Promise.reject({
            response: { status: 401 },
            config,
          });
        },
      })
    ).rejects.toMatchObject({
      response: { status: 401 },
    });

    expect(authStore.user).toBeNull();
    expect(authStore.token).toBeNull();
    expect(pushMock).toHaveBeenCalledWith({ name: 'Login' });
  });
});
