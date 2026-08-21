interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
}

interface AuthResponse {
  user: Omit<User, 'password'>;
  accessToken?: string;
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
type UpdateProfilePayload = Partial<Pick<CreateUserPayload, 'name' | 'email' | 'password'>>;

interface AuditLog {
  id: string;
  action: 'profile.update' | 'user.create' | 'user.update' | 'user.delete';
  actor: UserWithoutPassword | null;
  target: UserWithoutPassword | null;
  summary: string;
  createdAt: string;
}

export type {
  User,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  UserWithoutPassword,
  UserRole,
  CreateUserPayload,
  UpdateUserPayload,
  UpdateProfilePayload,
  AuditLog,
};
