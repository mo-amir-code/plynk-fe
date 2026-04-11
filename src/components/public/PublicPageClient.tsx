"use client";

import React from "react";
import { DashboardSocialWidget } from "@/components/dashboard/widgets/SocialWidget";
import { WALLPAPERS, FONTS } from "../dashboard/your-identity/YourIdentityClient";
import type { DashboardSocialWidgetData } from "@/types/components/dashboard/widgets";
import type { PublicPageClientProps } from "@/types/components/public";

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
  const [cellPx, setCellPx] = React.useState(96);
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);
  const effectiveGridCols = isSmallScreen ? MOBILE_GRID_COLS : GRID_COLS;

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

  console.log("Active Wallpaper:", activeWallpaper);

  return (
    <div
      className="relative min-h-screen overflow-x-hidden px-4 py-6 sm:px-6 sm:py-10 lg:px-8"
      style={{
        background: activeWallpaper,
        fontFamily: activeFont.family,
        transition: "background 240ms ease, color 240ms ease",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-slate-950/25" />
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-200 px-4 sm:px-6 lg:px-8">
        {/* Centered Profile Bar */}
        <div className="mb-10 flex justify-center animate-in fade-in duration-700 sm:mb-12">
          <div className="flex w-fit min-w-52 items-center gap-3 rounded-full border border-white/20 bg-white/10 px-3 py-2 shadow-md shadow-black/20 backdrop-blur-md transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-lg hover:shadow-black/25 sm:min-w-72 sm:px-5 sm:py-3 lg:min-w-80">
            <div className="flex size-10 items-center justify-center rounded-full bg-linear-to-br from-blue-400 to-blue-600 text-sm font-black text-white shadow-md ring-2 ring-white/20 transition-all duration-300 ease-out hover:scale-105 sm:size-12 sm:text-base">
              {profileInitial}
            </div>
            <div className="min-w-0 pr-1 leading-tight">
              <p className="truncate text-base font-semibold text-white sm:text-lg">{pageTitle}</p>
              <p className="truncate text-xs text-white/60 sm:text-sm">{profileHandle}</p>
            </div>
          </div>
        </div>

        <div
          ref={gridRef}
          className="grid w-full animate-in fade-in duration-1000 delay-150"
          style={{
            gridTemplateColumns: `repeat(${effectiveGridCols}, 1fr)`,
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
              roundness={themeCfg.roundness}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
