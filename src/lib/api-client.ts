import { API_CONFIG } from "@/lib/api-config";
import type { ApiResponse } from "@/types/common";
import type { FetchOptions } from "@/types/lib";

async function getAuthToken() {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/(^|;)\s*auth_token\s*=\s*([^;]+)/);
    return match ? match[2] : undefined;
  }

  return undefined;
}

class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function request<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { params, headers, ...rest } = options;
  let url = endpoint.startsWith("http") ? endpoint : `${API_CONFIG.BASE_URL}${endpoint}`;

  console.log(`URL called: ${url} with options:`, options);

  if (params) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) =>
      search.append(key, String(value)),
    );
    url += `?${search.toString()}`;
  }

  const token = await getAuthToken();

  const isFormData = rest.body instanceof FormData;

  const config: RequestInit = {
    ...rest,
    credentials: "include",
    headers: {
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  let response: Response;
  let json: ApiResponse<T> | null = null;

  try {
    response = await fetch(url, config);
    json = await response.json().catch(() => null);
  } catch (error) {
    throw new ApiError(
      error instanceof Error ? error.message : "Network error",
      500,
    );
  }

  if (!response.ok || !json?.success) {
    const status = json?.code || response.status;
    const message = json?.message || "Request failed";

    // Global 401 handler: if unauthorized and on the client side, redirect to login
    if (status === 401 && typeof window !== "undefined") {
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.href = "/auth/signin";
    }

    throw new ApiError(message, status, json);
  }

  return json.result;
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
