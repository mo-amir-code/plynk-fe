/**
 * Page API Hooks
 * Custom hooks for page operations using TanStack Query
 */

import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS, QUERY_KEYS } from "@/lib/api-config";

/**
 * Hook: useGetMyPage
 * Query hook to fetch current user's page
 */
export const useGetMyPage = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PAGE.ME,
    queryFn: async () => await api.get(API_ENDPOINTS.PAGE.ME),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook: useGetPageBySlug
 * Query hook to fetch page by slug
 */
export const useGetPageBySlug = (slug: string | null) => {
  return useQuery({
    queryKey: QUERY_KEYS.PAGE.BY_SLUG(slug || ""),
    queryFn: async () => {
      if (!slug) return null;
      return await api.get(API_ENDPOINTS.PAGE.GET_BY_SLUG(slug));
    },
    enabled: !!slug,
  });
};

/**
 * Hook: useCreatePage
 * Mutation hook to create a new page
 */
export const useCreatePage = () => {
  return useMutation({
    mutationFn: async (data: { slug: string; title: string }) => {
      return await api.post(API_ENDPOINTS.PAGE.CREATE, data);
    },
  });
};

/**
 * Hook: useUpdatePage
 * Mutation hook to update a page
 */
export const useUpdatePage = () => {
  return useMutation({
    mutationFn: async (data: { id: string; [key: string]: any }) => {
      const { id, ...rest } = data;
      return await api.patch(API_ENDPOINTS.PAGE.UPDATE(id), rest);
    },
  });
};

/**
 * Hook: useSyncPage
 * Mutation hook to sync page (themeConfig, widgets, published status)
 */
export const useSyncPage = () => {
  return useMutation({
    mutationFn: async (data: { themeConfig?: any; widgets?: any[]; isPublished?: boolean }) => {
      return await api.post(API_ENDPOINTS.PAGE.SYNC, data);
    },
  });
};

/**
 * Hook: useCreateWidget
 * Mutation hook to create a new widget
 */
export const useCreateWidget = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      return await api.post(API_ENDPOINTS.WIDGET.CREATE, data);
    },
  });
};

/**
 * Hook: useUpdateWidget
 * Mutation hook to update a widget
 */
export const useUpdateWidget = () => {
  return useMutation({
    mutationFn: async (data: { id: string; [key: string]: any }) => {
      const { id, ...rest } = data;
      return await api.patch(API_ENDPOINTS.WIDGET.UPDATE(id), rest);
    },
  });
};

/**
 * Hook: useDeleteWidget
 * Mutation hook to delete a widget
 */
export const useDeleteWidget = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(API_ENDPOINTS.WIDGET.DELETE(id));
    },
  });
};
