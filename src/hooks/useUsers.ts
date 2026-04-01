/**
 * User API Hooks
 * Custom hooks for user operations using TanStack Query
 */

import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS, QUERY_KEYS } from "@/lib/api-config";
import { User } from "@/types/auth";

/**
 * Hook: useGetMe
 * Query hook to fetch current user profile
 */
export const useGetMe = () => {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.ME,
    queryFn: async () => await api.get<User>(API_ENDPOINTS.USERS.ME),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook: useUpdateProfile
 * Mutation hook to update user profile
 */
export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (data: { fullName?: string; username?: string }) => {
      return await api.patch<User>(API_ENDPOINTS.USERS.PROFILE, data);
    },
  });
};
