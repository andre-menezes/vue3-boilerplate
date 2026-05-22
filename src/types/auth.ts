interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
}

interface AuthResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload extends LoginPayload {
  name: string;
  role?: 'admin' | 'user';
}

type UserWithoutPassword = Omit<User, 'password'>;
type UserRole = User['role'];

interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

type UpdateUserPayload = Partial<CreateUserPayload>;

export type {
  User,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  UserWithoutPassword,
  UserRole,
  CreateUserPayload,
  UpdateUserPayload,
};
