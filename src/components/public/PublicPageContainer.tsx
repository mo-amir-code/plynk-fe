"use client";

import { PublicPageClient } from "@/components/public/PublicPageClient";
import { useGetPageBySlug } from "@/hooks/usePage";
import type { PublicPageClientPageData } from "@/types/components/public";

export function PublicPageContainer({ slug }: { slug: string }) {
  const pageQuery = useGetPageBySlug(slug);

  const isLoading = pageQuery.isLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-200">
          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Loading profile...
        </div>
      </div>
    );
  }

  const pageFromQuery =
    pageQuery.data && typeof pageQuery.data === "object"
      ? (pageQuery.data as Record<string, unknown>)
      : null;

  const resolvedPageData: PublicPageClientPageData | null = pageFromQuery
    ? {
      ...pageFromQuery,
      username: String(pageFromQuery.username ?? pageFromQuery.slug ?? slug),
      title: String(pageFromQuery.title ?? pageFromQuery.username ?? pageFromQuery.slug ?? slug),
    }
    : null;

  const isNotFound = !resolvedPageData && pageQuery.isError;

  if (isNotFound) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-white px-6 text-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Page not found</h1>
          <p className="mt-2 text-sm text-slate-400">This profile is unavailable or private.</p>
        </div>
      </div>
    );
  }

  return (
    <PublicPageClient
      pageData={resolvedPageData ?? { username: slug, title: slug }}
    />
  );
}
