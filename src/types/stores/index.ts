export interface AuthUser {
  id: string;
  email: string;
  username?: string | null;
  fullName?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: AuthUser | null) => void;
}
