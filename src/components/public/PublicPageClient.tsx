"use client";

import React from "react";
import Link from "next/link";
import { DashboardSocialWidget } from "@/components/dashboard/widgets/SocialWidget";
import { WALLPAPERS, FONTS } from "../dashboard/your-identity/YourIdentityClient";
import type { DashboardSocialWidgetData } from "@/types/components/dashboard/widgets";
import type { PublicPageClientProps } from "@/types/components/public";

// Helper functions for wallpaper handling
function isImageWallpaper(value: string) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return false;

  return (
    normalized.startsWith("url(") ||
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("data:image/") ||
    normalized.startsWith("blob:") ||
    normalized.startsWith("/")
  );
}

function getWallpaperStyle(wallpaper: string) {
  if (wallpaper.trim().startsWith("url(")) {
    return { background: wallpaper };
  }

  if (isImageWallpaper(wallpaper)) {
    return {
      backgroundImage: `url("${wallpaper}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }

  return { background: wallpaper };
}

const GRID_COLS = 12;
const MOBILE_GRID_COLS = 6;
const SMALL_SCREEN_BREAKPOINT = 600;
const GAP_PX = 12;
const MAX_PACK_ROWS = 60;

function toSafePositiveInt(value: unknown, fallback: number) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return fallback;
  return Math.floor(num);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function normalizeSpan(value: number) {
  return Math.ceil(value / 3) * 3;
}

export function PublicPageClient({ pageData }: PublicPageClientProps) {
  const rawStyleConfig =
    (pageData?.theme && typeof pageData.theme === "object"
      ? pageData.theme.styleConfig
      : null) ||
    ((pageData as any)?.themeConfig?.styleConfig ?? (pageData as any)?.themeConfig ?? null);

  const styleConfig = rawStyleConfig && typeof rawStyleConfig === "object"
    ? (rawStyleConfig as Record<string, unknown>)
    : null;

  const widgetStyleMap = styleConfig?.widgets && typeof styleConfig.widgets === "object"
    ? (styleConfig.widgets as Record<string, Record<string, unknown>>)
    : {};

  const activeWallpaperValue = String(styleConfig?.wallpaper ?? styleConfig?.activeWallpaper ?? "wp1");
  const activeWallpaper = (() => {
    const normalized = activeWallpaperValue.trim();
    const legacyWallpaperMatch = /^wp(\d+)$/i.exec(normalized);

    if (legacyWallpaperMatch) {
      const index = Number(legacyWallpaperMatch[1]) - 1;
      return WALLPAPERS[index] || WALLPAPERS[0];
    }

    return normalized || WALLPAPERS[0];
  })();
  const activeFontId = String(styleConfig?.fontStyle ?? styleConfig?.activeFont ?? "modern");
  const activeFont = FONTS.find((font) => font.id === activeFontId) || FONTS[0];
  const themeCfg = {
    frostIntensity: Number(styleConfig?.frostIntensity ?? 24),
    surfaceTint: Number(styleConfig?.surfaceTint ?? 65),
    roundness: Number(styleConfig?.roundness ?? 8),
  };

  const gridRef = React.useRef<HTMLDivElement>(null);
  const [cellPx, setCellPx] = React.useState<number | null>(null);
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const effectiveGridCols = isSmallScreen ? MOBILE_GRID_COLS : GRID_COLS;

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${SMALL_SCREEN_BREAKPOINT - 1}px)`);

    const updateIsSmallScreen = () => {
      setIsSmallScreen(mediaQuery.matches);
    };

    updateIsSmallScreen();
    mediaQuery.addEventListener("change", updateIsSmallScreen);

    return () => {
      mediaQuery.removeEventListener("change", updateIsSmallScreen);
    };
  }, []);

  const apiWidgets = Array.isArray(pageData?.widgets)
      ? pageData.widgets
      : [];

  const baseWidgets: DashboardSocialWidgetData[] = apiWidgets.map((widget: any, index: number) => {
    const baseColSize = Math.max(1, Math.min(toSafePositiveInt(widget?.colSize, 3), GRID_COLS));
    const rowSize = Math.max(1, Math.min(toSafePositiveInt(widget?.rowSize, 3), MAX_PACK_ROWS));

    const fallbackStartCol = 1;
    const fallbackStartRow = 1 + index * 3;

    const startColRaw = Number.isFinite(Number(widget?.startCol))
      ? Number(widget?.startCol)
      : fallbackStartCol;

    const startRowRaw = Number.isFinite(Number(widget?.startRow))
      ? Number(widget?.startRow)
      : fallbackStartRow;

    const colSize = clamp(baseColSize, 1, GRID_COLS);
    const startCol = clamp(toSafePositiveInt(startColRaw, fallbackStartCol), 1, GRID_COLS - colSize + 1);
    const startRow = Math.max(1, Math.min(toSafePositiveInt(startRowRaw, fallbackStartRow), MAX_PACK_ROWS - rowSize + 1));

    const config = widget?.config && typeof widget.config === "object" ? widget.config : undefined;

    return {
      id: String(widget?.id ?? `widget-${index}`),
      pageId: widget?.pageId ? String(widget.pageId) : undefined,
      type: String(widget?.type ?? "instagram").toLowerCase() as DashboardSocialWidgetData["type"],
      handle: String(widget?.handle ?? ""),
      fullURL: widget?.fullURL ? String(widget.fullURL) : undefined,
      startCol,
      startRow,
      colSize,
      rowSize,
      icon: widget?.icon ? String(widget.icon) : undefined,
      config,
    };
  });

  const widgets = React.useMemo<DashboardSocialWidgetData[]>(() => {
    if (!isSmallScreen) {
      return baseWidgets;
    }

    const occupiedCells = new Set<string>();

    const sortedWidgets = [...baseWidgets].sort((firstWidget, secondWidget) => {
      if (firstWidget.startRow !== secondWidget.startRow) {
        return firstWidget.startRow - secondWidget.startRow;
      }
      if (firstWidget.startCol !== secondWidget.startCol) {
        return firstWidget.startCol - secondWidget.startCol;
      }
      return firstWidget.id.localeCompare(secondWidget.id);
    });

    const canPlaceAt = (startRow: number, startCol: number, rowSize: number, colSize: number) => {
      if (startCol + colSize - 1 > MOBILE_GRID_COLS) {
        return false;
      }

      for (let row = startRow; row < startRow + rowSize; row += 1) {
        for (let col = startCol; col < startCol + colSize; col += 1) {
          if (occupiedCells.has(`${row}:${col}`)) {
            return false;
          }
        }
      }

      return true;
    };

    const markPlacement = (startRow: number, startCol: number, rowSize: number, colSize: number) => {
      for (let row = startRow; row < startRow + rowSize; row += 1) {
        for (let col = startCol; col < startCol + colSize; col += 1) {
          occupiedCells.add(`${row}:${col}`);
        }
      }
    };

    return sortedWidgets.map((widget) => {
      const mobileColSize = clamp(normalizeSpan(widget.colSize), 3, MOBILE_GRID_COLS);
      const mobileRowSize = clamp(normalizeSpan(widget.rowSize), 3, MAX_PACK_ROWS);
      let placedStartRow = 1;
      let placedStartCol = 1;
      let didPlace = false;

      for (let row = 1; row <= MAX_PACK_ROWS - mobileRowSize + 1 && !didPlace; row += 1) {
        for (let col = 1; col <= MOBILE_GRID_COLS - mobileColSize + 1; col += 1) {
          if (canPlaceAt(row, col, mobileRowSize, mobileColSize)) {
            placedStartRow = row;
            placedStartCol = col;
            markPlacement(row, col, mobileRowSize, mobileColSize);
            didPlace = true;
            break;
          }
        }
      }

      return {
        ...widget,
        startCol: placedStartCol,
        startRow: placedStartRow,
        colSize: mobileColSize,
        rowSize: mobileRowSize,
      };
    });
  }, [baseWidgets, isSmallScreen]);

  React.useEffect(() => {
    setCellPx(null);
    const el = gridRef.current;
    if (!el) return;
    const compute = () => {
      const w = el.getBoundingClientRect().width;
      const cell = (w - (effectiveGridCols - 1) * GAP_PX) / effectiveGridCols;
      setCellPx(Math.max(cell, 20));
    };
    compute();
    const observer = new ResizeObserver(compute);
    observer.observe(el);
    return () => observer.disconnect();
  }, [effectiveGridCols]);

  const totalRows = Math.max(...widgets.map((w) => w.startRow + w.rowSize - 1), 6);
  const pageSlug = String(pageData?.username || pageData?.slug || "user");
  const pageTitle = String(pageData?.fullName || pageSlug);
  const profileHandle = `@${pageSlug}`;
  const profileInitial = pageTitle.charAt(0).toUpperCase();

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-x-hidden px-4 py-6 sm:px-6 sm:py-10 lg:px-8"
      style={getWallpaperStyle(activeWallpaper)}
    >


      <div className="pointer-events-none absolute inset-0 bg-slate-950/25" />
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-200 px-4 flex-1 flex flex-col sm:px-6 lg:px-8">
        {/* Centered Profile Bar */}
        <div className="mb-10 flex justify-center sm:mb-12">
          <div className="flex w-fit min-w-52 items-center gap-3 rounded-full border border-white/20 bg-white/10 px-3 py-2 shadow-md shadow-black/20 backdrop-blur-md transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-lg hover:shadow-black/25 sm:min-w-72 sm:px-5 sm:py-3 lg:min-w-80">
            <div className="flex size-10 items-center justify-center rounded-full bg-linear-to-br from-blue-400 to-blue-600 text-sm font-black text-white shadow-md ring-2 ring-white/20 transition-all duration-300 ease-out hover:scale-105 sm:size-12 sm:text-base overflow-hidden">
              {pageData.profileImage ? (
                <img src={pageData.profileImage} alt={pageTitle} className="w-full h-full object-cover" />
              ) : (
                profileInitial
              )}
            </div>
            <div className="min-w-0 pr-1 leading-tight">
              <p className="truncate text-base font-semibold text-white sm:text-lg capitalize">{pageTitle}</p>
              <p className="truncate text-xs text-white/60 sm:text-sm">{profileHandle}</p>
            </div>
          </div>
        </div>

        <div
          ref={gridRef}
          className="grid w-full"
          style={{
            gridTemplateColumns: `repeat(${effectiveGridCols}, 1fr)`,
            gridTemplateRows: cellPx !== null ? `repeat(${totalRows}, ${cellPx}px)` : undefined,
            gap: `${GAP_PX}px`,
            visibility: cellPx !== null ? "visible" : "hidden",
          }}
        >
          {cellPx !== null && widgets.map((widget) => (
            (() => {
              const widgetStyleRaw = widgetStyleMap[widget.id];
              const widgetStyle =
                widgetStyleRaw && typeof widgetStyleRaw === "object"
                  ? (widgetStyleRaw as Record<string, unknown>)
                  : {};
              const widgetFontId = typeof widgetStyle.fontStyle === "string" ? widgetStyle.fontStyle : activeFontId;
              const widgetFont = FONTS.find((font) => font.id === widgetFontId) || activeFont;
              const roundness = widgetStyle.roundness;
              const widgetWallpaper = typeof widgetStyle.wallpaper === "string" ? widgetStyle.wallpaper : undefined;
              const widgetWallpaperOpacity = Number.isFinite(Number(widgetStyle.wallpaperOpacity))
                ? Number(widgetStyle.wallpaperOpacity)
                : undefined;

              const cornerRoundness = roundness && typeof roundness === "object"
                ? {
                    topLeft: Number((roundness as Record<string, unknown>).topLeft ?? themeCfg.roundness),
                    topRight: Number((roundness as Record<string, unknown>).topRight ?? themeCfg.roundness),
                    bottomLeft: Number((roundness as Record<string, unknown>).bottomLeft ?? themeCfg.roundness),
                    bottomRight: Number((roundness as Record<string, unknown>).bottomRight ?? themeCfg.roundness),
                  }
                : undefined;

              return (
            <DashboardSocialWidget
              key={widget.id}
              data={widget}
              disableLink={false}
              showEditButton={false}
              frostIntensity={themeCfg.frostIntensity}
              surfaceTint={themeCfg.surfaceTint}
              roundness={themeCfg.roundness}
              fontFamily={widgetFont.family}
              widgetWallpaper={widgetWallpaper}
              widgetWallpaperOpacity={widgetWallpaperOpacity}
              cornerRoundness={cornerRoundness}
              disableTransitions
            />
              );
            })()
          ))}
        </div>

        {/* Bottom CTA / Branding - Pushed to bottom with mt-auto */}
        <div className="mt-auto mb-8 pt-12 flex flex-col items-center text-center">
           <Link
             href="/"
             className="group flex flex-col items-center gap-2 hover:opacity-100 opacity-70 transition-opacity"
           >
             <div className="flex items-center gap-1 text-xs sm:text-sm font-medium text-white/50 tracking-wider transition-colors group-hover:text-white/90 lowercase">
               <span>Powered by</span>
               <img src="/logo.svg" alt="" className="size-4 opacity-70 group-hover:opacity-100 transition-opacity drop-shadow-sm" />
               <span className="font-bold text-white/80 group-hover:text-white transition-colors">Plynk</span>
             </div>
           </Link>

           <div className="mt-4 flex items-center justify-center gap-3 text-[10px] sm:text-xs font-medium text-white/30">
             <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
             <span className="size-1 rounded-full bg-white/10" />
             <Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
             <span className="size-1 rounded-full bg-white/10" />
             <Link href="/contact" className="hover:text-white/60 transition-colors">Report</Link>
           </div>
        </div>
      </div>
    </div>
  );
}
