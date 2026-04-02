"use client";

import React from "react";
import { DashboardSocialWidget, DashboardSocialWidgetData } from "@/components/dashboard/widgets/SocialWidget";
import { WALLPAPERS, FONTS } from "../dashboard/your-identity/YourIdentityClient";
import type { ApiResponse, PublicThemeResult, PublicWidgetsResult } from "@/types/public-page";
import { APP_DOMAIN, APP_ORIGIN, BRAND_NAME_UPPER } from "@/config/app-config";

const GRID_COLS = 12;
const GAP_PX = 12;
const MAX_PACK_ROWS = 60;

function toSafePositiveInt(value: unknown, fallback: number) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return fallback;
  return Math.floor(num);
}

interface PublicPageClientProps {
  pageData: any;
  themeResponse?: ApiResponse<PublicThemeResult>;
  widgetsResponse?: ApiResponse<PublicWidgetsResult>;
}

export function PublicPageClient({ pageData, themeResponse, widgetsResponse }: PublicPageClientProps) {
  const styleConfig = themeResponse?.result?.styleConfig;
  const activeWallpaper = WALLPAPERS.find((wallpaper) => wallpaper.id === styleConfig?.activeWallpaper) || WALLPAPERS[0];
  const activeFont = FONTS.find((font) => font.id === styleConfig?.activeFont) || FONTS[0];
  const themeCfg = {
    frostIntensity: styleConfig?.frostIntensity ?? 24,
    surfaceTint: styleConfig?.surfaceTint ?? 65,
  };

  const apiWidgets = Array.isArray(widgetsResponse?.result?.widgets)
    ? widgetsResponse?.result?.widgets
    : Array.isArray(pageData?.widgets)
      ? pageData.widgets
      : [];

  const widgets: DashboardSocialWidgetData[] = apiWidgets.map((widget: any, index: number) => {
    const colSize = Math.max(1, Math.min(toSafePositiveInt(widget?.colSize, 3), GRID_COLS));
    const rowSize = Math.max(1, Math.min(toSafePositiveInt(widget?.rowSize, 3), MAX_PACK_ROWS));

    const fallbackStartCol = 1;
    const fallbackStartRow = 1 + index * 3;

    const startColRaw = Number.isFinite(Number(widget?.startCol))
      ? Number(widget?.startCol)
      : fallbackStartCol;

    const startRowRaw = Number.isFinite(Number(widget?.startRow))
      ? Number(widget?.startRow)
      : fallbackStartRow;

    const startCol = Math.max(1, Math.min(toSafePositiveInt(startColRaw, fallbackStartCol), GRID_COLS - colSize + 1));
    const startRow = Math.max(1, Math.min(toSafePositiveInt(startRowRaw, fallbackStartRow), MAX_PACK_ROWS - rowSize + 1));

    return {
      id: String(widget?.id ?? `widget-${index}`),
      type: String(widget?.type ?? "instagram").toLowerCase() as DashboardSocialWidgetData["type"],
      handle: widget?.config?.data?.handle || widget?.config?.handle || widget?.handle || "",
      startCol,
      startRow,
      colSize,
      rowSize,
    };
  });

  const gridRef = React.useRef<HTMLDivElement>(null);
  const [cellPx, setCellPx] = React.useState(96);

  React.useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const compute = () => {
      const w = el.getBoundingClientRect().width;
      const cell = (w - (GRID_COLS - 1) * GAP_PX) / GRID_COLS;
      setCellPx(Math.max(cell, 20));
    };
    compute();
    const observer = new ResizeObserver(compute);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const totalRows = Math.max(...widgets.map((w) => w.startRow + w.rowSize - 1), 6);
  const pageSlug = String(themeResponse?.result?.page?.slug || pageData?.slug || "user");
  const pageTitle = String(themeResponse?.result?.page?.title || pageData?.title || pageSlug);

  return (
    <div
      className="relative min-h-screen overflow-x-hidden px-4 py-6 sm:px-6 sm:py-10 lg:px-8"
      style={{
        background: activeWallpaper.background,
        fontFamily: activeFont.family,
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-slate-950/25" />
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-200 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center animate-in fade-in duration-700">
          <div className="mb-4 flex size-20 items-center justify-center rounded-full border-2 border-white/30 bg-white/15 shadow-xl sm:size-24">
            <span className="text-2xl font-black text-white sm:text-3xl">
              {pageSlug.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl lg:text-3xl">{pageTitle}</h1>
          <p className="mt-1 text-xs font-semibold text-white/75 sm:text-sm">{APP_DOMAIN}/{pageSlug}</p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90 sm:text-xs">
            <span className="material-symbols-outlined text-[14px]">visibility</span>
            Public profile
          </div>
        </div>

        <div
          ref={gridRef}
          className="mt-8 grid w-full animate-in fade-in duration-1000 delay-150"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${totalRows}, ${cellPx}px)`,
            gap: `${GAP_PX}px`,
          }}
        >
          {widgets.map((widget) => (
            <DashboardSocialWidget
              key={widget.id}
              data={widget}
              disableLink={false}
              showEditButton={false}
              frostIntensity={themeCfg.frostIntensity}
              surfaceTint={themeCfg.surfaceTint}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={APP_ORIGIN}
            className="text-[10px] font-black tracking-widest text-white/70 uppercase transition hover:text-white"
          >
            Powered by {BRAND_NAME_UPPER}
          </a>
        </div>
      </div>
    </div>
  );
}
