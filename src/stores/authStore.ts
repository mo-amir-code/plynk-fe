import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthUser {
  id: string;
  email: string;
  username?: string | null;
  fullName?: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: AuthUser | null) => void;
}

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,

        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Mock successful login
            const mockUser: AuthUser = {
              id: "1",
              email,
              username: email.split("@")[0],
              fullName: "User Name",
            };

            set({
              user: mockUser,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Login failed",
              isLoading: false,
            });
            throw error;
          }
        },

        signup: async (email: string, password: string, fullName: string) => {
          set({ isLoading: true, error: null });
          try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Mock successful signup
            const mockUser: AuthUser = {
              id: "1",
              email,
              username: "", // To be claimed during onboarding
              fullName,
            };

            set({
              user: mockUser,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Signup failed",
              isLoading: false,
            });
            throw error;
          }
        },

        logout: () => {
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        },

        clearError: () => {
          set({ error: null });
        },

        setUser: (user: AuthUser | null) => {
          set({
            user,
            isAuthenticated: !!user,
          });
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);

export default useAuthStore;
