"use client";

import Link from "next/link";
import { PublicPageClient } from "@/components/public/PublicPageClient";
import { useGetPageBySlug } from "@/hooks/usePage";
import type { PublicPageClientPageData } from "@/types/components/public";

export function PublicPageContainer({ slug }: { slug: string }) {
  const pageQuery = useGetPageBySlug(slug);

  const isLoading = pageQuery.isLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white relative overflow-hidden">
        {/* Background Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="size-10 border-2 border-white/10 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-400 animate-pulse">Loading identity...</p>
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
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white px-6 text-center relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-blob delay-300" />

        <div className="relative z-10 max-w-xl animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8">
            Profile Unavailable
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6">
            Lost in <br /> 
            <span className="gradient-text italic">the Void.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 font-medium leading-relaxed mb-10 max-w-sm mx-auto">
            This profile doesn't exist yet or has been set to private. 
            Maybe it's your turn to claim it?
          </p>
          
          <div className="flex flex-row gap-3 items-center justify-center">
            <Link 
              href="/"
              className="px-5 py-3 sm:px-8 sm:py-4 bg-primary text-white rounded-full font-black text-xs sm:text-sm tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 transition-transform"
            >
              Return Home
            </Link>
            <Link 
              href="/auth/signup"
              className="px-5 py-3 sm:px-8 sm:py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full font-black text-xs sm:text-sm tracking-widest transition-all"
            >
              Claim this URL
            </Link>
          </div>
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
