import { PlatformIcon } from "./PlatformIcon";
import { Pencil, Trash2 } from "lucide-react";

export type SocialPlatform =
  | "instagram"
  | "facebook"
  | "youtube"
  | "twitter"
  | "tiktok"
  | "linkedin"
  | "github"
  | "dribbble";

export type WidgetStyle = "gradient" | "minimal" | "dark" | "glass";

export interface DashboardSocialWidgetData {
  id: string;
  type: SocialPlatform;
  customName?: string;
  handle: string;
  startCol: number;
  startRow: number;
  colSize: number;
  rowSize: number;
  style?: WidgetStyle; // stored for future use — not applied yet
  alwaysShowLabel?: boolean;
}

/* ─── Platform config ─── */
/* ─── Platform config — icons match the landing page ─── */
type PlatformCfg = {
  label: string;
  gradient: string;
  url: (h: string) => string;
};

const PLATFORM_CONFIG: Record<SocialPlatform, PlatformCfg> = {
  instagram: {
    label: "Instagram",
    gradient: "from-[#f09433] via-[#dc2743] to-[#bc1888]",
    url: (h) => `https://instagram.com/${h}`,
    /* No inline style needed — devicon handles the icon, gradient bg covers it */
  },
  facebook: {
    label: "Facebook",
    gradient: "from-blue-600 to-blue-500",
    url: (h) => `https://facebook.com/${h}`,
  },
  youtube: {
    label: "YouTube",
    gradient: "from-red-600 to-red-500",
    url: (h) => `https://youtube.com/@${h}`,
  },
  twitter: {
    label: "X / Twitter",
    gradient: "from-slate-900 to-slate-800",
    url: (h) => `https://x.com/${h}`,
  },
  tiktok: {
    label: "TikTok",
    gradient: "from-slate-900 via-slate-800 to-slate-900",
    url: (h) => `https://tiktok.com/@${h}`,
  },
  linkedin: {
    label: "LinkedIn",
    gradient: "from-[#0A66C2] to-blue-600",
    url: (h) => `https://linkedin.com/in/${h}`,
  },
  github: {
    label: "GitHub",
    gradient: "from-slate-800 to-slate-700",
    url: (h) => `https://github.com/${h}`,
  },
  dribbble: {
    label: "Dribbble",
    gradient: "from-[#ea4c89] to-pink-500",
    url: (h) => `https://dribbble.com/${h}`,
  },
};

/* ─── Scale icon container + text size based on widget area ─── */
function getContainerSize(colSize: number, rowSize: number): string {
  const area = colSize * rowSize;
  if (area >= 36) return "size-48";  // 192px (huge)
  if (area >= 18) return "size-36";  // 144px
  if (area >= 9) return "size-28";  // 112px
  if (area >= 4) return "size-20";  // 80px
  return "size-16";                 // 64px
}

function getIconTextSize(colSize: number, rowSize: number): string {
  const area = colSize * rowSize;
  if (area >= 36) return "text-[80px]";
  if (area >= 18) return "text-[64px]";
  if (area >= 9) return "text-[48px]";
  if (area >= 4) return "text-[36px]";
  return "text-[28px]";
}

/* ─── Component ─── */
interface Props {
  data: DashboardSocialWidgetData;
  draggable?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
  motionOffset?: { x: number; y: number };
  layoutMotionEnabled?: boolean;
  showResizeHandles?: boolean;
  isResizing?: boolean;
  onResizeStart?: (
    direction: "right" | "bottom" | "corner",
    event: React.PointerEvent<HTMLButtonElement>,
  ) => void;
  disableLink?: boolean;
  showEditButton?: boolean;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  frostIntensity?: number;
  surfaceTint?: number;
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
}: Props) {
  const { type, customName, handle, startCol, startRow, colSize, rowSize } = data;
  const cfg = PLATFORM_CONFIG[type];
  const area = colSize * rowSize;
  const containerSize = getContainerSize(colSize, rowSize);
  const iconTextSize = getIconTextSize(colSize, rowSize);
  const href = cfg.url(handle);
  const displayName = customName?.trim() || cfg.label;
  const isMobileWidget = data.alwaysShowLabel ?? (colSize === 1 && rowSize === 1);
  const desktopHoverLiftClass =
    area >= 18
      ? "sm:group-hover:-translate-y-10"
      : area >= 9
        ? "sm:group-hover:-translate-y-8"
        : "sm:group-hover:-translate-y-6";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        if (disableLink) {
          event.preventDefault();
        }
      }}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`group relative block overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-4xl transition-all duration-200 transform-gpu shadow-lg sm:shadow-xl sm:hover:shadow-2xl sm:hover:ring-2 sm:hover:ring-white/60 dark:sm:hover:ring-white/30 w-full h-full ${draggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
        } ${isDragging ? "opacity-60 scale-95" : ""} ${isResizing ? "ring-2 ring-primary/60" : ""}`}
      style={{
        gridColumn: `${startCol} / span ${colSize}`,
        gridRow: `${startRow} / span ${rowSize}`,
        transform: motionOffset
          ? `translate3d(${motionOffset.x}px, ${motionOffset.y}px, 0)`
          : undefined,
        transitionProperty: motionOffset || layoutMotionEnabled ? "transform, opacity" : undefined,
        transitionDuration: motionOffset ? "0ms" : layoutMotionEnabled ? "650ms" : undefined,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: motionOffset ? "transform" : undefined,
      }}
    >
      {/* Deepest layer: Glass Backdrop */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: frostIntensity > 0 ? `blur(${frostIntensity}px)` : "none",
          WebkitBackdropFilter: frostIntensity > 0 ? `blur(${frostIntensity}px)` : "none",
          backgroundColor: "rgba(255, 255, 255, 0.03)",
        }}
      />

      {/* Gradient background */}
      <div 
        className={`absolute inset-0 bg-linear-to-br ${cfg.gradient} transition-opacity duration-200 pointer-events-none`} 
        style={{ opacity: surfaceTint / 100 }}
      />

      {/* Overlay on hover for depth — desktop only */}
      <div className="absolute inset-0 bg-black/0 sm:group-hover:bg-black/10 transition-colors duration-500 z-5" />

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

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

      {isMobileWidget ? (
        // Mobile layout - flex with always visible content
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-between p-3 gap-2">
          {/* Icon container */}
          <div className="flex-1 flex items-center justify-center w-full">
            <div
              className={`${containerSize} rounded-full bg-white/20 flex items-center justify-center shadow-lg transition-all duration-300 border border-white/30`}
            >
              <PlatformIcon platform={type} className={`${iconTextSize} text-white drop-shadow-lg`} />
            </div>
          </div>

          {/* Text content - always visible on mobile */}
          <div className="flex flex-col items-center justify-center gap-0.5 px-1 text-center w-full">
            <span className="font-black text-white leading-tight truncate max-w-full drop-shadow-lg text-[9px] sm:text-xs">
              {displayName}
            </span>
            <span className="text-white/80 font-semibold truncate max-w-full drop-shadow-md text-[7px] sm:text-[8px]">
              @{handle}
            </span>
          </div>
        </div>
      ) : (
        // Desktop layout - centered icon with stable internal reveal
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {/* Icon container - Stationary for stability */}
          <div
            className={`${containerSize} rounded-full bg-white/20 flex items-center justify-center shadow-lg sm:shadow-xl sm:group-hover:shadow-2xl sm:group-hover:bg-white/30 transition-all duration-500 border border-white/30 sm:group-hover:border-white/50 sm:group-hover:scale-105`}
          >
            <PlatformIcon platform={type} className={`${iconTextSize} text-white drop-shadow-lg`} />
          </div>
 
          {/* Text content - Stable reveal slide-up (Stationary parent) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center justify-center rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 py-1.5 px-4 gap-0 opacity-0 sm:group-hover:opacity-100 translate-y-2 sm:group-hover:translate-y-0 transition-all duration-500 text-center min-w-[120px] max-w-[85%] pointer-events-none shadow-2xl">
            <span className={`font-bold text-white leading-tight truncate max-w-full drop-shadow-lg ${area >= 4 ? "text-xs sm:text-sm" : "text-[10px] sm:text-xs"
              }`}>
              {displayName}
            </span>
            <span className={`text-white/60 font-medium truncate max-w-full drop-shadow-md ${area >= 4 ? "text-[10px] sm:text-[11px]" : "text-[8px] sm:text-[10px]"
              }`}>
              @{handle}
            </span>
          </div>
        </div>
      )}

      {!isMobileWidget && showResizeHandles && (
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
