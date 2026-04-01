/**
 * Auth Hooks - Protection and Query Hooks
 * Combines route protection with TanStack Query API hooks
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import useAuthStore from '@/stores/authStore';
import { api } from '@/lib/api-client';
import { API_ENDPOINTS, QUERY_KEYS } from '@/lib/api-config';
import { AuthResponse } from '@/types/auth';

const COOKIE_NAME = 'auth_token';

/**
 * Hook to protect routes that require authentication
 * Redirects to sign-in page if user is not authenticated
 */
export function useProtectedRoute(redirectTo = '/auth/signin') {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // Wait for hydration before checking auth
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated, isLoading };
}

/**
 * Hook to redirect authenticated users away from auth pages
 */
export function useRedirectIfAuthenticated(redirectTo = '/dashboard') {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated, isLoading };
}

/**
 * Hook: useLogin
 * Mutation hook for user login
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const result = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
      if (result?.token) {
        document.cookie = `${COOKIE_NAME}=${result.token}; path=/; max-age=${60 * 60 * 24 * 7}`;
      }
      return result;
    },
  });
};

/**
 * Hook: useSignup
 * Mutation hook for user registration
 */
export const useSignup = () => {
  return useMutation({
    mutationFn: async (data: { email: string; password: string; fullName: string }) => {
      const result = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
      if (result?.token) {
        document.cookie = `${COOKIE_NAME}=${result.token}; path=/; max-age=${60 * 60 * 24 * 7}`;
      }
      return result;
    },
  });
};

/**
 * Hook: useCheckUsername
 * Query hook to check username availability
 */
export const useCheckUsername = (username: string | null) => {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH.CHECK_USERNAME(username || ''),
    queryFn: async () => {
      if (!username) return null;
      return await api.get<{ isAvailable: boolean }>(
        API_ENDPOINTS.AUTH.CHECK_USERNAME(username)
      );
    },
    enabled: !!username,
    staleTime: 1000 * 60,
  });
};

/**
 * Hook: useClaimUsername
 * Mutation hook to claim a username
 */
export const useClaimUsername = () => {
  return useMutation({
    mutationFn: async (username: string) => {
      const result = await api.patch<AuthResponse>(
        API_ENDPOINTS.AUTH.CLAIM_USERNAME,
        { username }
      );
      if (result?.token) {
        document.cookie = `${COOKIE_NAME}=${result.token}; path=/; max-age=${60 * 60 * 24 * 7}`;
      }
      return result;
    },
  });
};

/**
 * Hook: useLogout
 * Mutation hook for user logout
 */
export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    },
  });
};
