"use client";

import React from "react";
import { DashboardSocialWidget, DashboardSocialWidgetData } from "@/components/dashboard/widgets/SocialWidget";
import { WALLPAPERS, FONTS } from "../dashboard/your-identity/YourIdentityClient";

const GRID_COLS = 12;
const GAP_PX = 12;

interface PublicPageClientProps {
  pageData: any;
}

export function PublicPageClient({ pageData }: PublicPageClientProps) {
  // 1. RULE: Start with defaults, then hydrate theme
  const [activeWallpaper, setActiveWallpaper] = React.useState(WALLPAPERS[0]);
  const [activeFont, setActiveFont] = React.useState(FONTS[0]);
  const [themeCfg, setThemeCfg] = React.useState({
    frostIntensity: 24,
    surfaceTint: 65
  });

  const widgets: DashboardSocialWidgetData[] = pageData.widgets.map((w: any) => ({
    id: w.id,
    type: w.type.toLowerCase(),
    handle: w.config?.data?.handle || "",
    customName: w.config?.data?.customName || "",
    startCol: w.x + 1,
    startRow: w.y + 1,
    colSize: w.width,
    rowSize: w.height,
  }));

  React.useEffect(() => {
    if (pageData.theme?.styleConfig) {
      const cfg = pageData.theme.styleConfig;
      const wp = WALLPAPERS.find(v => v.id === cfg.activeWallpaper) || WALLPAPERS[0];
      const font = FONTS.find(v => v.id === cfg.activeFont) || FONTS[0];
      
      setActiveWallpaper(wp);
      setActiveFont(font);
      setThemeCfg({
        frostIntensity: cfg.frostIntensity ?? 24,
        surfaceTint: cfg.surfaceTint ?? 65
      });
    }
  }, [pageData.theme]);

  // 2. RULE: Same architecture (12 cols, same cell size hook)
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [cellPx, setCellPx] = React.useState(96); // Same fallback as Editor

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

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center py-12 px-4 sm:px-6 relative overflow-x-hidden transition-all duration-1000"
      style={{ 
        background: activeWallpaper.background,
        fontFamily: activeFont.family 
      }}
    >
      <div className="w-full max-w-[800px] z-10 flex flex-col">
        {/* Simplified Header - Match Editor Perspective */}
        <div className="flex flex-col items-center mb-10 text-center animate-in fade-in duration-700">
          <div className="size-20 rounded-full border-2 border-white/20 shadow-xl overflow-hidden mb-4 bg-white/10 backdrop-blur-md flex items-center justify-center">
             <span className="text-2xl font-black text-white">
                {pageData.slug.charAt(0).toUpperCase()}
             </span>
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">
            {pageData.title}
          </h1>
          <p className="text-white/60 font-medium text-xs mt-1">
            moku.com/{pageData.slug}
          </p>
        </div>

        {/* 12-Column Grid — Exact Replica of DashboardSocialWidget behavior */}
        <div 
          ref={gridRef}
          className="w-full grid animate-in fade-in duration-1000 delay-150"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${totalRows}, ${cellPx}px)`,
            gap: `${GAP_PX}px`,
          }}
        >
          {widgets.map((w) => (
            <DashboardSocialWidget
              key={w.id}
              data={w}
              disableLink={false}
              showEditButton={false}
              frostIntensity={themeCfg.frostIntensity}
              surfaceTint={themeCfg.surfaceTint}
            />
          ))}
        </div>

        {/* Minimal Footer */}
        <div className="mt-20 mb-10 text-center opacity-40 hover:opacity-100 transition-opacity">
           <a href="https://moku.com" className="text-[10px] font-black tracking-widest text-white uppercase">
              Powered by MOKU
           </a>
        </div>
      </div>
    </div>
  );
}
