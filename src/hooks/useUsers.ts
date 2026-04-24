/**
 * User API Hooks
 * Custom hooks for user operations using TanStack Query
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS, QUERY_KEYS } from "@/lib/api-config";
import type { User } from "@/types/common";

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { fullName?: string; username?: string }) => {
      return await api.patch<User>(API_ENDPOINTS.USERS.PROFILE, data);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ALL }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE.ALL }),
      ]);
    },
  });
};

/**
 * Hook: useUpdateAvatar
 * Mutation hook to update user profile image
 */
export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return await api.patch<User>(API_ENDPOINTS.USERS.AVATAR, formData);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ALL }),
      ]);
    },
  });
};

/**
 * Hook: useRemoveAvatar
 * Mutation hook to remove user profile image
 */
export const useRemoveAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await api.delete<User>(API_ENDPOINTS.USERS.AVATAR);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ALL }),
      ]);
    },
  });
};
