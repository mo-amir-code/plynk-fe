/**
 * Auth Hooks - Protection and Query Hooks
 * Combines route protection with TanStack Query API hooks
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '@/stores/authStore';
import { api } from '@/lib/api-client';
import { API_ENDPOINTS, QUERY_KEYS } from '@/lib/api-config';
import type { AuthResponse } from '@/types/common';

const COOKIE_NAME = 'auth_token';

function hasAuthCookie() {
  if (typeof document === 'undefined') return false;
  return document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .some((cookie) => cookie.startsWith(`${COOKIE_NAME}=`));
}

function setAuthCookie(token: string) {
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
}

function clearAuthCookie() {
  document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      return await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    },
    onSuccess: async (result) => {
      if (result?.token) {
        setAuthCookie(result.token);
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ALL }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE.ALL }),
      ]);
    },
  });
};

/**
 * Hook: useSignup
 * Mutation hook for user registration
 */
export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; password: string; fullName: string; tnc: boolean }) => {
      return await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    },
    onSuccess: async (result) => {
      if (result?.token) {
        setAuthCookie(result.token);
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ALL }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE.ALL }),
      ]);
    },
  });
};

export const useAuthStatus = () => {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH.STATUS,
    queryFn: async () => hasAuthCookie(),
    staleTime: 1000 * 60,
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (username: string) => {
      return await api.patch<AuthResponse>(
        API_ENDPOINTS.AUTH.CLAIM_USERNAME,
        { username }
      );
    },
    onSuccess: async (result) => {
      if (result?.token) {
        setAuthCookie(result.token);
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ALL }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE.ALL }),
      ]);
    },
  });
};

/**
 * Hook: useLogout
 * Mutation hook for user logout
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await api.post<unknown>(API_ENDPOINTS.AUTH.LOGOUT);
    },
    onSuccess: async () => {
      clearAuthCookie();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ALL }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE.ALL }),
      ]);
      queryClient.removeQueries({ queryKey: QUERY_KEYS.USERS.ALL });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.PAGE.ALL });
    },
    onError: () => {
      clearAuthCookie();
    },
  });
};
