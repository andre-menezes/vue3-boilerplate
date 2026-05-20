import http from './http';
import type { User, AuthResponse } from '@app-types/auth';

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

  async getUsers(): Promise<User[]> {
    const response = await http.get<User[]>('/users');
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await http.get<User>(`/users/${id}`);
    return response.data;
  },
};
