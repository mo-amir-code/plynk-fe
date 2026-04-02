import type { DashboardSocialWidgetData } from "@/components/dashboard/widgets/SocialWidget";

export type ApiResponse<T> = {
  success: boolean;
  code: number;
  message: string;
  result: T;
};

export type PublicPageInfo = {
  slug: string;
  title: string;
};

export type PublicThemeStyleConfig = {
  activeWallpaper: string;
  activeFont: string;
  frostIntensity: number;
  surfaceTint: number;
};

export type PublicThemeResult = {
  page: PublicPageInfo;
  styleConfig: PublicThemeStyleConfig;
};

export type PublicWidgetApiItem = {
  id: string;
  type: DashboardSocialWidgetData["type"];
  config?: {
    data?: {
      handle?: string;
      customName?: string;
    };
  };
  startCol: number;
  startRow: number;
  colSize: number;
  rowSize: number;
};

export type PublicWidgetsResult = {
  widgets: PublicWidgetApiItem[];
};
