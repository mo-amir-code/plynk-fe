/**
 * Page API Hooks
 * Custom hooks for page operations using TanStack Query
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS, QUERY_KEYS } from "@/lib/api-config";
import type { ApiResponse, PublicThemeResult, PublicWidgetsResult } from "@/types/common";
import type { ThemeConfig } from "@/types/components/dashboard/your-identity";
import type { ThemeType } from "@/types/components/dashboard/your-identity";

const HttpMessage: Record<number, string> = {
  200: "OK",
  400: "Bad Request",
  404: "Not Found",
  500: "Internal Server Error",
};

function buildApiResponse<T>(code: number, result: T, message?: string): ApiResponse<T> {
  return {
    success: code < 400,
    code,
    message: message || HttpMessage[code] || "Something went wrong",
    result,
  };
}

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
 * Hook: useGetDefaultThemes
 * Query hook to fetch default themes
 */
export const useGetDefaultThemes = () => {
  return useQuery({
    queryKey: QUERY_KEYS.THEME.DEFAULTS,
    queryFn: async (): Promise<ThemeConfig[]> => {

      const result = await api.get<ThemeConfig[]>(API_ENDPOINTS.THEME.DEFAULT);

      return result;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook: useGetCustomThemes
 * Query hook to fetch user's custom themes
 */
export const useGetCustomThemes = () => {
  return useQuery({
    queryKey: QUERY_KEYS.THEME.CUSTOM,
    queryFn: async (): Promise<ThemeConfig[]> => {
      const result = await api.get<ThemeConfig[]>(API_ENDPOINTS.THEME.CUSTOM);
      return result;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook: useCreateTheme
 * Mutation hook to create a new custom theme
 */
export const useCreateTheme = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; description: string; type: ThemeType; styleConfig: ThemeConfig["styleConfig"] }) => {
      return await api.post<ThemeConfig>(API_ENDPOINTS.THEME.CREATE, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.THEME.ALL });
    },
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { slug: string; title: string }) => {
      return await api.post(API_ENDPOINTS.PAGE.CREATE, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE.ALL });
    },
  });
};

/**
 * Hook: useUpdatePage
 * Mutation hook to update a page
 */
export const useUpdatePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; [key: string]: any }) => {
      const { id, ...rest } = data;
      return await api.patch(API_ENDPOINTS.PAGE.UPDATE(id), rest);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE.ALL });
    },
  });
};

/**
 * Hook: useSyncPage
 * Mutation hook to sync page (themeConfig, widgets, published status)
 */
export const useSyncPage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { themeId?: string; themeConfig?: any; widgets?: any[]; isPublished?: boolean }) => {
      return await api.post(API_ENDPOINTS.PAGE.SYNC, data);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE.ALL }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WIDGET.ALL }),
      ]);
    },
  });
};

/**
 * Hook: useCreateWidget
 * Mutation hook to create a new widget
 */
export const useCreateWidget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      return await api.post(API_ENDPOINTS.WIDGET.CREATE, data);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WIDGET.ALL }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE.ALL }),
      ]);
    },
  });
};

/**
 * Hook: useUpdateWidget
 * Mutation hook to update a widget
 */
export const useUpdateWidget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; [key: string]: any }) => {
      const { id, ...rest } = data;
      return await api.patch(API_ENDPOINTS.WIDGET.UPDATE(id), rest);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WIDGET.ALL }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE.ALL }),
      ]);
    },
  });
};

/**
 * Hook: useDeleteWidget
 * Mutation hook to delete a widget
 */
export const useDeleteWidget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(API_ENDPOINTS.WIDGET.DELETE(id));
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WIDGET.ALL }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE.ALL }),
      ]);
    },
  });
};

export const useGetPublicThemeBySlug = (slug: string | null) => {
  return useQuery({
    queryKey: QUERY_KEYS.PAGE.PUBLIC_THEME(slug || ""),
    queryFn: async (): Promise<ApiResponse<PublicThemeResult>> => {
      if (!slug) {
        return buildApiResponse(400, {
          page: { slug: "", title: "" },
          styleConfig: {
            activeWallpaper: "wp1",
            activeFont: "modern",
            frostIntensity: 24,
            surfaceTint: 65,
          },
        }, "Missing slug");
      }

      const endpoint = `/public/theme/${slug}`;

      try {
        const result: PublicThemeResult = {
          page: {
            slug,
            title: "Creator Profile",
          },
          styleConfig: {
            activeWallpaper: "wp1",
            activeFont: "modern",
            frostIntensity: 24,
            surfaceTint: 65,
          },
        };

        return buildApiResponse(200, result, `Dummy response from ${endpoint}`);
      } catch {
        return buildApiResponse(500, {
          page: { slug, title: slug },
          styleConfig: {
            activeWallpaper: "wp1",
            activeFont: "modern",
            frostIntensity: 24,
            surfaceTint: 65,
          },
        });
      }
    },
    enabled: !!slug,
  });
};

export const useGetPublicWidgetsBySlug = (slug: string | null) => {
  return useQuery({
    queryKey: QUERY_KEYS.PAGE.PUBLIC_WIDGETS(slug || ""),
    queryFn: async (): Promise<ApiResponse<PublicWidgetsResult>> => {
      if (!slug) {
        return buildApiResponse(400, { widgets: [] }, "Missing slug");
      }

      const endpoint = API_ENDPOINTS.PAGE.GET_BY_SLUG(slug);

      try {
        const result = (await api.get(endpoint)) as PublicWidgetsResult;
        return buildApiResponse(200, result, `Response from ${endpoint}`);
      } catch {
        return buildApiResponse(500, { widgets: [] });
      }
    },
    enabled: !!slug,
  });
};
