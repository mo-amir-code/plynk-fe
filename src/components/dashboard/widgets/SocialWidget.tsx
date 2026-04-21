import { PlatformIcon } from "./PlatformIcon";
import { Pencil, Trash2 } from "lucide-react";
import { WIDGET_TYPE_CONFIG } from "./widget-config";
import type { DashboardSocialWidgetProps } from "@/types/components/dashboard/widgets";

function getIconTileSize(area: number): string {
  if (area >= 36) return "size-20";
  if (area >= 18) return "size-16";
  if (area >= 9) return "size-12";
  if (area >= 4) return "size-11";
  return "size-10";
}

function getIconSize(area: number): string {
  if (area >= 36) return "text-5xl";
  if (area >= 18) return "text-4xl";
  if (area >= 9) return "text-2xl";
  if (area >= 4) return "text-xl";
  return "text-lg";
}

function getTitleSize(area: number): string {
  if (area >= 36) return "text-2xl";
  if (area >= 18) return "text-xl";
  if (area >= 9) return "text-lg";
  if (area >= 4) return "text-base";
  return "text-xs";
}

function getSubtitleSize(area: number): string {
  if (area >= 36) return "text-sm";
  if (area >= 18) return "text-xs";
  if (area >= 9) return "text-[11px]";
  if (area >= 4) return "text-[10px]";
  return "text-[8px]";
}

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

function getWidgetWallpaperStyle(wallpaper: string) {
  if (wallpaper.trim().startsWith("url(")) {
    return {
      background: wallpaper,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
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

export function DashboardSocialWidget({
  data,
  draggable,
  onDragStart,
  onDragEnd,
  isDragging,
  motionOffset,
  layoutMotionEnabled,
  showResizeHandles,
  isResizing,
  onResizeStart,
  disableLink,
  showEditButton,
  onEditClick,
  onDeleteClick,
  frostIntensity = 24,
  surfaceTint = 65,
  roundness = 16,
  forceShowLabel = false,
  fontFamily = "inherit",
  disableTransitions = false,
  widgetWallpaper,
  widgetWallpaperOpacity = 58,
  cornerRoundness,
  isSelected = false,
  onSelect,
}: DashboardSocialWidgetProps) {
  const { type, handle, startCol, startRow, colSize, rowSize, widgetBackground } = data;
  const resolvedFontFamily = widgetBackground?.fontFamily || fontFamily;
  const resolvedWidgetWallpaper = widgetBackground?.wallpaper || widgetWallpaper;
  const widgetBackgroundWallpaperOpacity =
    typeof widgetBackground?.wallpaperOpacity === "number" && Number.isFinite(widgetBackground.wallpaperOpacity)
      ? widgetBackground.wallpaperOpacity
      : undefined;
  const fallbackWidgetWallpaperOpacity =
    typeof widgetWallpaperOpacity === "number" && Number.isFinite(widgetWallpaperOpacity)
      ? widgetWallpaperOpacity
      : 58;
  const resolvedWidgetWallpaperOpacity = Math.max(
    0,
    Math.min(100, widgetBackgroundWallpaperOpacity ?? fallbackWidgetWallpaperOpacity),
  );
  const resolvedCornerRoundness = widgetBackground?.cornerRoundness || cornerRoundness;
  const cfg = WIDGET_TYPE_CONFIG[type];
  const area = colSize * rowSize;
  const iconTileSize = getIconTileSize(area);
  const iconSize = getIconSize(area);
  const titleSize = getTitleSize(area);
  const subtitleSize = getSubtitleSize(area);
  const href = cfg.url(handle.trim());
  const displayName = cfg.label;
  const subtitle = cfg.hint.toUpperCase();
  const isCompactCard = forceShowLabel || (colSize === 1 && rowSize === 1);
  const resolvedTopLeftRadius = resolvedCornerRoundness?.topLeft ?? roundness;
  const resolvedTopRightRadius = resolvedCornerRoundness?.topRight ?? roundness;
  const resolvedBottomLeftRadius = resolvedCornerRoundness?.bottomLeft ?? roundness;
  const resolvedBottomRightRadius = resolvedCornerRoundness?.bottomRight ?? roundness;

  // console.log('URL generated for widget:', { type, handle, href });

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        if (disableLink) {
          event.preventDefault();
        }
        onSelect?.();
      }}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`group relative block overflow-hidden ${disableTransitions ? "" : "transition-all duration-200"} transform-gpu shadow-lg sm:shadow-xl sm:hover:shadow-2xl sm:hover:ring-2 sm:hover:ring-white/60 dark:sm:hover:ring-white/30 w-full h-full bg-slate-100/85 dark:bg-slate-800/85 border border-white/55 dark:border-white/10 ${draggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
        } ${isDragging ? "opacity-60 scale-95" : ""} ${isResizing ? "ring-2 ring-primary/60" : ""} ${isSelected ? "ring-2 ring-primary/80" : ""}`}
      style={{
        gridColumn: `${startCol} / span ${colSize}`,
        gridRow: `${startRow} / span ${rowSize}`,
        borderTopLeftRadius: `${resolvedTopLeftRadius}px`,
        borderTopRightRadius: `${resolvedTopRightRadius}px`,
        borderBottomLeftRadius: `${resolvedBottomLeftRadius}px`,
        borderBottomRightRadius: `${resolvedBottomRightRadius}px`,
        fontFamily: resolvedFontFamily,
        transform: motionOffset
          ? `translate3d(${motionOffset.x}px, ${motionOffset.y}px, 0)`
          : undefined,
        transitionProperty: motionOffset || layoutMotionEnabled ? "transform, opacity" : undefined,
        transitionDuration: motionOffset ? "0ms" : layoutMotionEnabled ? "650ms" : undefined,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: motionOffset ? "transform" : undefined,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: frostIntensity > 0 ? `blur(${frostIntensity}px)` : "none",
          WebkitBackdropFilter: frostIntensity > 0 ? `blur(${frostIntensity}px)` : "none",
          backgroundColor: "rgba(255, 255, 255, 0.02)",
        }}
      />

      <div
        className="absolute inset-0 transition-opacity duration-200 pointer-events-none"
        style={{
          opacity: Math.min(surfaceTint / 140, 0.65),
          background: "linear-gradient(165deg, rgba(255, 255, 255, 0.55) 0%, rgba(241, 245, 249, 0.86) 100%)",
        }}
      />

      <div className="absolute inset-0 bg-white/35 dark:bg-slate-900/18 pointer-events-none" />
      <div className="absolute inset-0 bg-black/0 sm:group-hover:bg-black/5 transition-colors duration-500 z-5" />

      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {widgetBackground ? (
        widgetBackground.type === "color" ? (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundColor: widgetBackground.source,
              opacity: 0.6,
            }}
          />
        ) : (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url('${widgetBackground.source}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundAttachment: widgetBackground.type === "video" ? "fixed" : "scroll",
              opacity: widgetBackground.type === "video" ? 0.7 : 0.5,
            }}
          />
        )
      ) : ""}

      {resolvedWidgetWallpaper ? (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            ...getWidgetWallpaperStyle(resolvedWidgetWallpaper),
            opacity: resolvedWidgetWallpaperOpacity / 100,
          }}
        />
      ) : ""}

      {showEditButton && (
        <button
          type="button"
          aria-label={`Edit ${displayName}`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onEditClick?.();
          }}
          className="cursor-pointer absolute top-2 left-2 z-40 size-6 rounded-full bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700/80 shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        >
          <Pencil size={10} strokeWidth={2.5} />
        </button>
      )}
      {showEditButton && (
        <button
          type="button"
          aria-label={`Delete ${displayName}`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onDeleteClick?.();
          }}
          className="cursor-pointer absolute top-2 right-2 z-40 size-6 rounded-full bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700/80 shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        >
          <Trash2 size={10} strokeWidth={2.5} />
        </button>
      )}

      <div className={`relative z-10 w-full h-full ${isCompactCard ? "p-3" : "p-4 sm:p-5"}`}>
        <div className="h-full flex flex-col justify-between">
          <div>
            <div
              className={`${iconTileSize} rounded-2xl text-white flex items-center justify-center shadow-md`}
              style={{ background: cfg.background }}
            >
              <PlatformIcon platform={type} className={iconSize} />
            </div>
          </div>

          <div className="text-left">
            <p className={`${titleSize} font-extrabold text-slate-900 dark:text-slate-100 leading-none truncate`}>
              {displayName}
            </p>
            <p className={`${subtitleSize} mt-1 font-semibold tracking-wide text-slate-500 dark:text-slate-300 uppercase truncate`}>
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {!isCompactCard && showResizeHandles && (
        <>
          <button
            type="button"
            aria-label="Resize width"
            onPointerDown={(event) => onResizeStart?.("right", event)}
            className="hidden sm:block absolute top-1/2 -translate-y-1/2 right-1 z-30 w-2.5 h-14 rounded-full bg-white/70 border border-white/70 shadow-sm cursor-ew-resize"
          />
          <button
            type="button"
            aria-label="Resize height"
            onPointerDown={(event) => onResizeStart?.("bottom", event)}
            className="hidden sm:block absolute left-1/2 -translate-x-1/2 bottom-1 z-30 h-2.5 w-14 rounded-full bg-white/70 border border-white/70 shadow-sm cursor-ns-resize"
          />
          <button
            type="button"
            aria-label="Resize width and height"
            onPointerDown={(event) => onResizeStart?.("corner", event)}
            className="hidden sm:block absolute right-1 bottom-1 z-30 size-4 rounded-md bg-white/85 border border-white/80 shadow-sm cursor-nwse-resize"
          />
        </>
      )}
    </a>
  );
}
