export type UserRole = "ADMIN" | "EDITOR";

export interface User {
  id: string;
  email: string;
  fullName?: string;
  username?: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
