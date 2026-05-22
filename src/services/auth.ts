import http from './http';
import type {
  AuthResponse,
  CreateUserPayload,
  UpdateUserPayload,
  UserWithoutPassword,
} from '@app-types/auth';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>('/login', {
      email,
      password,
    });
    return response.data;
  },

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>('/register', {
      email,
      password,
      name,
      role: 'user',
    });
    return response.data;
  },

  async getUsers(): Promise<UserWithoutPassword[]> {
    const response = await http.get<UserWithoutPassword[]>('/users');
    return response.data;
  },

  async getUserById(id: string): Promise<UserWithoutPassword> {
    const response = await http.get<UserWithoutPassword>(`/users/${id}`);
    return response.data;
  },

  async createUser(payload: CreateUserPayload): Promise<UserWithoutPassword> {
    const response = await http.post<UserWithoutPassword>('/users', payload);
    return response.data;
  },

  async updateUser(id: string, payload: UpdateUserPayload): Promise<UserWithoutPassword> {
    const response = await http.patch<UserWithoutPassword>(`/users/${id}`, payload);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    const response = await http.delete<void>(`/users/${id}`);
    return response.data;
  },
};
