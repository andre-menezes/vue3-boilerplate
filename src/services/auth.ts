import http from './instance';
import type {
  AuditLog,
  AuthResponse,
  CreateUserPayload,
  UpdateProfilePayload,
  UpdateUserPayload,
  UserWithoutPassword,
} from '@app-types/auth';

const unwrapResponseData = <T>(value: T | { data: T }): T => {
  if (value && typeof value === 'object' && 'data' in value) {
    return (value as { data: T }).data;
  }

  return value as T;
};

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await http.post<AuthResponse | { data: AuthResponse }>('/login', {
      email,
      password,
    });

    return unwrapResponseData(response);
  },

  async logout(): Promise<void> {
    await http.post<void>('/logout');
  },

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await http.post<AuthResponse | { data: AuthResponse }>('/register', {
      email,
      password,
      name,
      role: 'user',
    });

    return unwrapResponseData(response);
  },

  async getUsers(): Promise<UserWithoutPassword[]> {
    const response = await http.get<UserWithoutPassword[] | { data: UserWithoutPassword[] }>(
      '/users'
    );
    return unwrapResponseData(response);
  },

  async getUserById(id: string): Promise<UserWithoutPassword> {
    const response = await http.get<UserWithoutPassword | { data: UserWithoutPassword }>(
      `/users/${id}`
    );
    return unwrapResponseData(response);
  },

  async getProfile(): Promise<UserWithoutPassword> {
    const response = await http.get<UserWithoutPassword | { data: UserWithoutPassword }>(
      '/profile'
    );
    return unwrapResponseData(response);
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<UserWithoutPassword> {
    const response = await http.patch<UserWithoutPassword | { data: UserWithoutPassword }>(
      '/profile',
      payload as unknown as Record<string, unknown>
    );

    return unwrapResponseData(response);
  },

  async createUser(payload: CreateUserPayload): Promise<UserWithoutPassword> {
    const response = await http.post<UserWithoutPassword | { data: UserWithoutPassword }>(
      '/users',
      payload as unknown as Record<string, unknown>
    );

    return unwrapResponseData(response);
  },

  async updateUser(id: string, payload: UpdateUserPayload): Promise<UserWithoutPassword> {
    const response = await http.patch<UserWithoutPassword | { data: UserWithoutPassword }>(
      `/users/${id}`,
      payload as unknown as Record<string, unknown>
    );

    return unwrapResponseData(response);
  },

  async deleteUser(id: string): Promise<void> {
    const response = await http.delete<void | { data: void }>(`/users/${id}`);
    return unwrapResponseData(response);
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const response = await http.get<AuditLog[] | { data: AuditLog[] }>('/audit-logs');
    return unwrapResponseData(response);
  },
};
