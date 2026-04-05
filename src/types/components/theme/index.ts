import type React from "react";
import type { AppThemeMode } from "@/types/config";

export type ThemeContextValue = {
  theme: AppThemeMode;
  mounted: boolean;
  setTheme: (mode: AppThemeMode) => void;
  toggleTheme: () => void;
};

export interface ThemeProviderProps {
  children: React.ReactNode;
}
