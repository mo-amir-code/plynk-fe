import type { ApiResponse, PublicThemeResult, PublicWidgetsResult } from "@/types/common";

export interface PublicPageClientPageData {
  slug?: string;
  title?: string;
  widgets?: unknown[];
  [key: string]: unknown;
}

export interface PublicPageClientProps {
  pageData: PublicPageClientPageData;
  themeResponse?: ApiResponse<PublicThemeResult>;
  widgetsResponse?: ApiResponse<PublicWidgetsResult>;
}
