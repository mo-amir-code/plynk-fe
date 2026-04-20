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
    LOGOUT: "/auth/logout",
    GOOGLE: "/auth/google",
    CHECK_USERNAME: (username: string) => `/auth/check-username/${username}`,
    CLAIM_USERNAME: "/auth/claim-username",
    VERIFY_OTP: "/auth/verify-otp",
    RESEND_OTP: "/auth/resend-otp",
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
    CREATE: "/widgets",
    UPDATE: (id: string) => `/widget/${id}`,
    DELETE: (id: string) => `/widget/${id}`,
  },
  THEME: {
    CREATE: "/themes",
    DEFAULT: "/themes/default",
    CUSTOM: "/themes/custom",
    UPDATE: (id: string) => `/themes/${id}`,
    DELETE: (id: string) => `/themes/${id}`,
  },
  ASSET: {
    DEFAULT: "/assets/default",
    USER: "/assets/user",
    UPLOAD: "/assets/upload",
  },
} as const;

/**
 * Query Keys for TanStack Query
 * Organized hierarchically for better cache management
 */
export const QUERY_KEYS = {
  AUTH: {
    ALL: ["auth"] as const,
    STATUS: ["auth", "status"] as const,
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
    PUBLIC_THEME: (slug: string) => ["page", "public-theme", slug] as const,
    PUBLIC_WIDGETS: (slug: string) => ["page", "public-widgets", slug] as const,
  },
  WIDGET: {
    ALL: ["widget"] as const,
  },
  THEME: {
    ALL: ["theme"] as const,
    DEFAULTS: ["theme", "default"] as const,
    CUSTOM: ["theme", "custom"] as const,
  },
  ASSET: {
    ALL: ["asset"] as const,
    DEFAULT: ["asset", "default"] as const,
    USER: ["asset", "user"] as const,
  },
} as const;
