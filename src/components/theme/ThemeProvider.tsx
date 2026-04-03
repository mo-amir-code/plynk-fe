"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  APP_THEME_STORAGE_KEY,
  applyThemeModeToDocument,
  getStoredThemeMode,
  setStoredThemeMode,
  type AppThemeMode,
} from "@/config/app-config";

type ThemeContextValue = {
  theme: AppThemeMode;
  mounted: boolean;
  setTheme: (mode: AppThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AppThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initialTheme = getStoredThemeMode();
    setThemeState(initialTheme);
    applyThemeModeToDocument(initialTheme);
    setMounted(true);

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== APP_THEME_STORAGE_KEY) return;
      const nextTheme = getStoredThemeMode();
      setThemeState(nextTheme);
      applyThemeModeToDocument(nextTheme);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const setTheme = useCallback((mode: AppThemeMode) => {
    setThemeState(mode);
    setStoredThemeMode(mode);
    applyThemeModeToDocument(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({ theme, mounted, setTheme, toggleTheme }),
    [mounted, setTheme, theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }

  return context;
}