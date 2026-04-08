import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { AuthState, AuthUser } from "@/types/stores";

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,

        login: async (user: AuthUser) => {
          set({ isLoading: true, error: null });
          try {

            set({
              user: user,
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

        signup: async (user: AuthUser) => {
          set({ isLoading: true, error: null });
          try {

            set({
              user: user,
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
