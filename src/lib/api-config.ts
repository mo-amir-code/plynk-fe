/**
 * Centralized API Configuration
 * All API endpoints and configuration are defined here
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api/v1",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

/**
 * API Endpoints
 * Organized by feature/resource
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    CHECK_USERNAME: (username: string) => `/auth/check-username/${username}`,
    CLAIM_USERNAME: "/auth/claim-username",
  },
  USERS: {
    ME: "/users/me",
    PROFILE: "/users/me",
  },
  PAGE: {
    ME: "/page/me",
    GET_BY_SLUG: (slug: string) => `/page/${slug}`,
    CREATE: "/page",
    UPDATE: (id: string) => `/page/${id}`,
    SYNC: "/page/sync",
  },
  WIDGET: {
    CREATE: "/widget",
    UPDATE: (id: string) => `/widget/${id}`,
    DELETE: (id: string) => `/widget/${id}`,
  },
} as const;

/**
 * Query Keys for TanStack Query
 * Organized hierarchically for better cache management
 */
export const QUERY_KEYS = {
  AUTH: {
    ALL: ["auth"] as const,
    CHECK_USERNAME: (username: string) => [...QUERY_KEYS.AUTH.ALL, "check-username", username] as const,
  },
  USERS: {
    ALL: ["users"] as const,
    ME: ["users", "me"] as const,
    PROFILE: ["users", "profile"] as const,
  },
  PAGE: {
    ALL: ["page"] as const,
    ME: ["page", "me"] as const,
    BY_SLUG: (slug: string) => ["page", slug] as const,
  },
  WIDGET: {
    ALL: ["widget"] as const,
  },
} as const;
