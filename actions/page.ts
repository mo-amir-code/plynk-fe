"use server";

import { api } from "@/lib/api-client";
import type { ApiResponse, PublicThemeResult, PublicWidgetsResult } from "@/types/public-page";

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

export async function getMyPage() {
  try {
    return await api.get("/page/me");
  } catch (error) {
    return null;
  }
}

export async function createPage(data: { themeId: string; title: string }) {
  return await api.post("/page", data);
}

export async function updatePage(id: string, data: any) {
  return await api.patch(`/page/${id}`, data);
}

export async function createWidget(data: any) {
  return await api.post("/widget", data);
}

export async function updateWidget(id: string, data: any) {
  return await api.patch(`/widget/${id}`, data);
}

export async function deleteWidget(id: string) {
  return await api.delete(`/widget/${id}`);
}

export async function syncPage(data: { themeConfig?: any; widgets?: any[]; isPublished?: boolean }) {
  return await api.post("/page/sync", data);
}

export async function getPageByUsername(username: string) {
  try {
    return await api.get(`/page/${username}`);
  } catch (error) {
    return null;
  }
}

export async function getPublicThemeBySlug(slug: string): Promise<ApiResponse<PublicThemeResult>> {
  const endpoint = `/public/theme/${slug}`;

  try {
    // TODO: replace with real API call when endpoint is ready.
    // const result = await api.get(endpoint);
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
  } catch (error) {
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
}

export async function getPublicWidgetsBySlug(slug: string): Promise<ApiResponse<PublicWidgetsResult>> {
  const endpoint = `/public/widgets/${slug}`;

  try {
    // TODO: replace with real API call when endpoint is ready.
    // const result = await api.get(endpoint);
    const result: PublicWidgetsResult = {
      widgets: [
        {
          id: "public-w1",
          type: "instagram",
          config: { data: { handle: "johndoe" } },
          startCol: 1,
          startRow: 1,
          colSize: 3,
          rowSize: 3,
        },
        {
          id: "public-w2",
          type: "youtube",
          config: { data: { handle: "yourchannel" } },
          startCol: 4,
          startRow: 1,
          colSize: 3,
          rowSize: 3,
        },
        {
          id: "public-w3",
          type: "twitter",
          config: { data: { handle: "john_handle" } },
          startCol: 7,
          startRow: 1,
          colSize: 3,
          rowSize: 3,
        },
        {
          id: "public-w4",
          type: "tiktok",
          config: { data: { handle: "johndoe" } },
          startCol: 10,
          startRow: 1,
          colSize: 3,
          rowSize: 3,
        },
        {
          id: "public-w5",
          type: "dribbble",
          config: { data: { handle: "johndoe" } },
          startCol: 1,
          startRow: 4,
          colSize: 3,
          rowSize: 3,
        }
      ]
    };

    return buildApiResponse(200, result, `Dummy response from ${endpoint}`);
  } catch (error) {
    return buildApiResponse(500, { widgets: [] });
  }
}
