export interface AuthUser {
  id: string;
  email: string;
  username?: string | null;
  fullName?: string;
  profileImage?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  signup: (user: AuthUser) => void;
  logout: () => void;
  clearError: () => void;
  setUser: (user: AuthUser | null) => void;
}
