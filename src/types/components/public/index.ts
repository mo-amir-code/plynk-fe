export interface PublicPageClientPageData {
  username?: string;
  slug?: string;
  title?: string;
  theme?: {
    styleConfig?: Record<string, unknown>;
  };
  widgets?: unknown[];
  [key: string]: unknown;
}

export interface PublicPageClientProps {
  pageData: PublicPageClientPageData;
}
