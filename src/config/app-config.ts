import type { AppThemeMode } from "@/types/config";

const normalizeOrigin = (origin: string) => origin.replace(/\/$/, "");

const fallbackOrigin = "http://localhost:3000";

const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || fallbackOrigin;

export const APP_ORIGIN = normalizeOrigin(configuredOrigin);

export const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || (() => {
  try {
    return new URL(APP_ORIGIN).host;
  } catch {
    return "localhost:3000";
  }
})();

export const BRAND_NAME = "plynk.in";
export const BRAND_NAME_UPPER = "PLYNK.IN";

export const APP_THEME_STORAGE_KEY = "theme";

export function getStoredThemeMode(): AppThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.localStorage.getItem(APP_THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
}

export function setStoredThemeMode(mode: AppThemeMode) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(APP_THEME_STORAGE_KEY, mode);
  }
}

export function applyThemeModeToDocument(mode: AppThemeMode) {
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }
}

export const STORAGE_KEYS = {
  themeByUser: (userId: string) => `plynk_theme_${userId}`,
  widgetsByUser: (userId: string) => `plynk_widgets_${userId}`,
  legacyTheme: "plynk_theme",
  legacyWidgets: "plynk_widgets",
} as const;

export function getPublicProfilePath(username: string) {
  return `/${username}`;
}

export function getPublicProfileUrl(username: string) {
  return `${APP_ORIGIN}${getPublicProfilePath(username)}`;
}

export function getPublicProfileDisplay(username: string) {
  return `${APP_DOMAIN}/${username}`;
}
