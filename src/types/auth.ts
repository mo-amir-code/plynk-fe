export type UserRole = "ADMIN" | "USER";

export interface User {
  id: string;
  email: string;
  fullName: string;
  username: string | null;
  role: UserRole;
  tnc: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
