"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { X, Palette, Check, RefreshCcw, Save, Eye, Pencil, Shield, Globe, Lock } from "lucide-react";
import {
  DashboardSocialWidget,
} from "@/components/dashboard/widgets/SocialWidget";
import { SOCIAL_PLATFORMS } from "@/components/dashboard/widgets/widget-config";
import { AddWidgetModal } from "./AddWidgetModal";
import { EditWidgetModal } from "./EditWidgetModal";
import { WallpaperUploadModal } from "./WallpaperUploadModal";
import useAuthStore from "@/stores/authStore";
import { useCreateTheme, useDeleteTheme, useGetCustomThemes, useGetDefaultThemes, useGetMyPage, useSyncPage, useUpdateTheme } from "@/hooks/usePage";
import { SuccessModal } from "./SuccessModal";
import { BRAND_NAME, STORAGE_KEYS, getPublicProfileDisplay } from "@/config/app-config";
import type { DashboardSocialWidgetData, SocialPlatform } from "@/types/components/dashboard/widgets";
import type {
  AddWidgetOption,
  MobilePlacement,
  ResizeDirection,
  StyleConfig,
  SyncStatus,
  ThemeConfig,
} from "@/types/components/dashboard/your-identity";

export const WALLPAPERS: string[] = [
  "linear-gradient(135deg, #6E85F0, #614CF5)",
  "linear-gradient(135deg, #FFD28A, #FFA366)",
  "linear-gradient(135deg, #82DBFF, #489EFF)",
  "linear-gradient(135deg, #FFB6C1, #FF8DA1)",
  "linear-gradient(135deg, #CDD0FF, #9BB0FF)",
  "linear-gradient(135deg, #18D1FF, #0099FF)",
  "linear-gradient(135deg, #5EE689, #25CC97)",
  "linear-gradient(135deg, #FFB966, #FF6600)",
];

export const FONTS = [
  { id: "modern", name: "Modern", family: "Manrope, sans-serif" },
  { id: "classic", name: "Classic", family: "'Playfair Display', serif" },
  { id: "technical", name: "Technical", family: "'JetBrains Mono', monospace" },
];


const DUMMY_API_FONT_STYLES = FONTS;
const DEFAULT_WALLPAPER_BACKGROUND = WALLPAPERS[0] || "linear-gradient(135deg, #6E85F0, #614CF5)";
const THEME_WALLPAPER_COUNT = 7;
const MAX_WALLPAPER_OPTIONS = 11;
const MAX_CUSTOM_WALLPAPERS = MAX_WALLPAPER_OPTIONS - THEME_WALLPAPER_COUNT;

function resolveWallpaperBackground(value: string | undefined | null) {
  if (!value) return DEFAULT_WALLPAPER_BACKGROUND;
  const presetByLegacyId = /^wp(\d+)$/.exec(value.trim().toLowerCase());
  if (presetByLegacyId) {
    const idx = Number(presetByLegacyId[1]) - 1;
    return WALLPAPERS[idx] || value;
  }

  return value;
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

function getWallpaperStyle(wallpaper: string) {
  const value = resolveWallpaperBackground(wallpaper);

  if (value.trim().startsWith("url(")) {
    return { background: value };
  }

  if (isImageWallpaper(value)) {
    return {
      backgroundImage: `url("${value}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }

  return { background: value };
}

/* ─────────────────────────────────────────
   Widget data — id, type, handle,
   startCol / startRow / colSize / rowSize
   (all on the 12-column grid)
   When colSize == rowSize the widget renders as a perfect square.
   style: "gradient" | "minimal" | "dark" | "glass"
   ───────────────────────────────────────── */

const GRID_COLS = 12;
const GAP_PX = 12; // matches gap-3 (0.75rem = 12px)

const initialWidgets: DashboardSocialWidgetData[] = [
  {
    id: "w1",
    type: "instagram",
    handle: "johndoe",
    startCol: 1,
    startRow: 1,
    colSize: 3,
    rowSize: 3,
    pageId: undefined,
    fullURL: undefined,
    icon: undefined,
  }
];

const MAX_PACK_ROWS = 60;

const SUPPORTED_WIDGET_TYPES: SocialPlatform[] = [...SOCIAL_PLATFORMS];

function toSafePositiveInt(value: unknown, fallback: number) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return fallback;
  return Math.floor(num);
}

function normalizeWidget(rawWidget: any, index: number): DashboardSocialWidgetData {
  const fallbackColSize = 3;
  const fallbackRowSize = 3;

  const colSize = Math.max(1, Math.min(toSafePositiveInt(rawWidget?.colSize, fallbackColSize), GRID_COLS));
  const rowSize = Math.max(1, Math.min(toSafePositiveInt(rawWidget?.rowSize, fallbackRowSize), MAX_PACK_ROWS));

  const fallbackStartCol = 1;
  const fallbackStartRow = 1 + index * fallbackRowSize;

  const safeStartCol = toSafePositiveInt(rawWidget?.startCol, fallbackStartCol);
  const safeStartRow = toSafePositiveInt(rawWidget?.startRow, fallbackStartRow);

  const startCol = Math.max(1, Math.min(safeStartCol, GRID_COLS - colSize + 1));
  const startRow = Math.max(1, safeStartRow);

  const rawType = typeof rawWidget?.type === "string" ? rawWidget.type.toLowerCase() : "instagram";
  const type: SocialPlatform = SUPPORTED_WIDGET_TYPES.includes(rawType as SocialPlatform)
    ? (rawType as SocialPlatform)
    : "instagram";

  const handle = typeof rawWidget?.handle === "string" ? rawWidget.handle : "";
  const pageId = typeof rawWidget?.pageId === "string" ? rawWidget.pageId : undefined;
  const fullURL = typeof rawWidget?.fullURL === "string" ? rawWidget.fullURL : undefined;
  const icon = typeof rawWidget?.icon === "string" ? rawWidget.icon : undefined;

  return {
    id: typeof rawWidget?.id === "string" && rawWidget.id.trim() ? rawWidget.id : `w${index + 1}`,
    pageId,
    type,
    handle,
    fullURL,
    startCol,
    startRow,
    colSize,
    rowSize,
    icon,
  };
}

function normalizeWidgets(rawWidgets: unknown): DashboardSocialWidgetData[] {
  if (!Array.isArray(rawWidgets) || rawWidgets.length === 0) {
    return initialWidgets;
  }

  const normalized = rawWidgets.map((widget, index) => normalizeWidget(widget, index));
  const usedIds = new Set<string>();

  return normalized.map((widget, index) => {
    if (!usedIds.has(widget.id)) {
      usedIds.add(widget.id);
      return widget;
    }

    const deduped = { ...widget, id: `${widget.id}-${index + 1}` };
    usedIds.add(deduped.id);
    return deduped;
  });
}


function getMobileSpan(size: number) {
  return size >= 6 ? 2 : 1;
}

function computeMobilePlacements(layout: DashboardSocialWidgetData[]): MobilePlacement[] {
  const occupied = new Set<string>();
  const placements: MobilePlacement[] = [];

  const canFit = (startRow: number, startCol: number, rowSpan: number, colSpan: number) => {
    if (startCol + colSpan - 1 > 2) return false;
    for (let row = startRow; row < startRow + rowSpan; row += 1) {
      for (let col = startCol; col < startCol + colSpan; col += 1) {
        if (occupied.has(`${row}-${col}`)) return false;
      }
    }
    return true;
  };

  const occupy = (startRow: number, startCol: number, rowSpan: number, colSpan: number) => {
    for (let row = startRow; row < startRow + rowSpan; row += 1) {
      for (let col = startCol; col < startCol + colSpan; col += 1) {
        occupied.add(`${row}-${col}`);
      }
    }
  };

  layout.forEach((widget, index) => {
    const colSpan = getMobileSpan(widget.colSize);
    const rowSpan = getMobileSpan(widget.rowSize);

    for (let row = 1; row <= MAX_PACK_ROWS; row += 1) {
      let placed = false;
      for (let col = 1; col <= 2 - colSpan + 1; col += 1) {
        if (!canFit(row, col, rowSpan, colSpan)) continue;
        occupy(row, col, rowSpan, colSpan);
        placements.push({
          index,
          startRow: row,
          startCol: col,
          rowSpan,
          colSpan,
        });
        placed = true;
        break;
      }
      if (placed) break;
    }
  });

  return placements;
}

function rangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart <= bEnd && bStart <= aEnd;
}

function getMobileNeighborIndex(
  currentIndex: number,
  direction: "left" | "right" | "up" | "down",
  placements: MobilePlacement[],
) {
  const current = placements.find((item) => item.index === currentIndex);
  if (!current) return null;

  const currentLeft = current.startCol;
  const currentRight = current.startCol + current.colSpan - 1;
  const currentTop = current.startRow;
  const currentBottom = current.startRow + current.rowSpan - 1;

  const candidates = placements.filter((item) => item.index !== currentIndex);

  const filtered = candidates.filter((item) => {
    const left = item.startCol;
    const right = item.startCol + item.colSpan - 1;
    const top = item.startRow;
    const bottom = item.startRow + item.rowSpan - 1;

    if (direction === "left") {
      return right < currentLeft && rangesOverlap(top, bottom, currentTop, currentBottom);
    }
    if (direction === "right") {
      return left > currentRight && rangesOverlap(top, bottom, currentTop, currentBottom);
    }
    if (direction === "up") {
      return bottom < currentTop && rangesOverlap(left, right, currentLeft, currentRight);
    }
    return top > currentBottom && rangesOverlap(left, right, currentLeft, currentRight);
  });

  if (filtered.length === 0) return null;

  filtered.sort((a, b) => {
    const aLeft = a.startCol;
    const aRight = a.startCol + a.colSpan - 1;
    const aTop = a.startRow;
    const aBottom = a.startRow + a.rowSpan - 1;
    const bLeft = b.startCol;
    const bRight = b.startCol + b.colSpan - 1;
    const bTop = b.startRow;
    const bBottom = b.startRow + b.rowSpan - 1;

    const aDistance =
      direction === "left"
        ? currentLeft - aRight
        : direction === "right"
          ? aLeft - currentRight
          : direction === "up"
            ? currentTop - aBottom
            : aTop - currentBottom;

    const bDistance =
      direction === "left"
        ? currentLeft - bRight
        : direction === "right"
          ? bLeft - currentRight
          : direction === "up"
            ? currentTop - bBottom
            : bTop - currentBottom;

    if (aDistance !== bDistance) return aDistance - bDistance;
    return a.index - b.index;
  });

  return filtered[0].index;
}

/* ─── Derive unit cell size so colSize == rowSize → perfect square ─── */
function useSquareCellSize(gridCols: number, gapPx: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [cellPx, setCellPx] = useState(96); // fallback

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const compute = () => {
      const w = el.getBoundingClientRect().width;
      // width = gridCols * cell + (gridCols - 1) * gap
      const cell = (w - (gridCols - 1) * gapPx) / gridCols;
      setCellPx(Math.max(cell, 40));
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [gridCols, gapPx]);

  return { ref, cellPx };
}

export function YourIdentityClient() {
  const { user } = useAuthStore();
  const getMyPageQuery = useGetMyPage();
  const getDefaultThemesQuery = useGetDefaultThemes();
  const getCustomThemesQuery = useGetCustomThemes();
  const createThemeMutation = useCreateTheme();
  const updateThemeMutation = useUpdateTheme();
  const deleteThemeMutation = useDeleteTheme();
  const syncPageMutation = useSyncPage();
  const userId = user?.id || "guest";
  const { ref, cellPx } = useSquareCellSize(GRID_COLS, GAP_PX);
  const mobileGridRef = useRef<HTMLDivElement>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [widgets, setWidgets] = useState<DashboardSocialWidgetData[]>(initialWidgets);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [resizing, setResizing] = useState<{
    id: string;
    direction: ResizeDirection;
    startX: number;
    startY: number;
    startColSize: number;
    startRowSize: number;
    startCol: number;
    startRow: number;
  } | null>(null);
  const [layoutOffsets, setLayoutOffsets] = useState<Record<string, { x: number; y: number }>>({});
  const [layoutMotionEnabled, setLayoutMotionEnabled] = useState(false);
  const [dropPreview, setDropPreview] = useState<{
    startCol: number;
    startRow: number;
    colSize: number;
    rowSize: number;
  } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addSearch, setAddSearch] = useState("");
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);
  const [editHandle, setEditHandle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeWallpaper, setActiveWallpaper] = useState(DEFAULT_WALLPAPER_BACKGROUND);
  const [frostIntensity, setFrostIntensity] = useState(24);
  const [surfaceTint, setSurfaceTint] = useState(65);
  const [activeFont, setActiveFont] = useState("modern");
  const [activeRoundness, setActiveRoundness] = useState(16);
  const [customThemes, setCustomThemes] = useState<ThemeConfig[]>([]);
  const [selectedDefaultThemeId, setSelectedDefaultThemeId] = useState<string | null>(null);
  const [selectedCustomThemeId, setSelectedCustomThemeId] = useState<string | null>(null);
  const [isCustomThemeModalOpen, setIsCustomThemeModalOpen] = useState(false);
  const [customThemeName, setCustomThemeName] = useState("");
  const [isEditCustomThemeModalOpen, setIsEditCustomThemeModalOpen] = useState(false);
  const [editingCustomThemeId, setEditingCustomThemeId] = useState<string | null>(null);
  const [editingCustomThemeName, setEditingCustomThemeName] = useState("");
  const [wallpaperOptions, setWallpaperOptions] = useState<string[]>(WALLPAPERS);
  const [isWallpaperUploadModalOpen, setIsWallpaperUploadModalOpen] = useState(false);
  const [selectedWallpaperFile, setSelectedWallpaperFile] = useState<File | null>(null);
  const [selectedWallpaperPreview, setSelectedWallpaperPreview] = useState<string | null>(null);
  const [isWallpaperUploading, setIsWallpaperUploading] = useState(false);
  const [customWallpapers, setCustomWallpapers] = useState<string[]>([]);
  const [customWallpaperColor, setCustomWallpaperColor] = useState("#6E85F0");
  const [customWallpaperValue, setCustomWallpaperValue] = useState("");
  const [isCustomWallpaperPopupOpen, setIsCustomWallpaperPopupOpen] = useState(false);
  const [isThemeStudioOpen, setIsThemeStudioOpen] = useState(true);
  const [wasThemeStudioOpen, setWasThemeStudioOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [localSaveStatus, setLocalSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const localSaveStatusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const customPromptShownRef = useRef(false);
  const WALLPAPER_UPLOAD_API = "/api/upload/wallpaper";

  const defaultThemes = (getDefaultThemesQuery.data?.length
    ? getDefaultThemesQuery.data
    : []
  ).map((theme) => ({
    ...theme,
    styleConfig: {
      ...theme.styleConfig,
      wallpaper: resolveWallpaperBackground(theme.styleConfig.wallpaper),
    },
  }));

  const apiCustomThemes = (getCustomThemesQuery.data?.length
    ? getCustomThemesQuery.data
    : []
  ).map((theme) => ({
    ...theme,
    styleConfig: {
      ...theme.styleConfig,
      wallpaper: resolveWallpaperBackground(theme.styleConfig.wallpaper),
    },
  }));

  useEffect(() => {
    if (!userId || typeof window === "undefined") return;

    const storageKey = STORAGE_KEYS.customWallpapersByUser(userId);
    const savedCustomWallpapers = localStorage.getItem(storageKey);

    if (!savedCustomWallpapers) {
      setCustomWallpapers([]);
      return;
    }

    try {
      const parsed = JSON.parse(savedCustomWallpapers);

      if (!Array.isArray(parsed)) {
        setCustomWallpapers([]);
        return;
      }

      const normalized = parsed
        .filter((wallpaper): wallpaper is string => typeof wallpaper === "string")
        .map((wallpaper) => resolveWallpaperBackground(wallpaper).trim())
        .filter(Boolean);

      const unique = Array.from(new Set(normalized));
      const limited = unique.length > MAX_CUSTOM_WALLPAPERS
        ? unique.slice(unique.length - MAX_CUSTOM_WALLPAPERS)
        : unique;

      setCustomWallpapers(limited);
    } catch {
      setCustomWallpapers([]);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId || typeof window === "undefined") return;
    const storageKey = STORAGE_KEYS.customWallpapersByUser(userId);
    localStorage.setItem(storageKey, JSON.stringify(customWallpapers));
  }, [userId, customWallpapers]);

  useEffect(() => {
    const wallpapersFromThemes = [...defaultThemes, ...apiCustomThemes]
      .map((theme) => resolveWallpaperBackground(theme.styleConfig?.wallpaper))
      .filter((wallpaper) => {
        const normalized = wallpaper?.trim().toLowerCase();
        if (!normalized) return false;
        if (isImageWallpaper(normalized)) return false;
        return (
          normalized.startsWith("#") ||
          normalized.startsWith("rgb(") ||
          normalized.startsWith("rgba(") ||
          normalized.startsWith("hsl(") ||
          normalized.startsWith("hsla(") ||
          normalized.startsWith("linear-gradient(") ||
          normalized.startsWith("radial-gradient(")
        );
      });

    const uniqueThemeWallpapers = Array.from(new Set(wallpapersFromThemes));

    const fallbackThemeWallpapers = WALLPAPERS
      .map((wallpaper) => resolveWallpaperBackground(wallpaper))
      .filter((wallpaper) => {
        const normalized = wallpaper?.trim().toLowerCase();
        if (!normalized) return false;
        return !isImageWallpaper(normalized);
      });

    const pickedThemeWallpapers = [...uniqueThemeWallpapers, ...fallbackThemeWallpapers]
      .map((wallpaper) => resolveWallpaperBackground(wallpaper).trim())
      .filter(Boolean);

    const normalizedThemeWallpapers = Array.from(new Set(pickedThemeWallpapers)).slice(0, THEME_WALLPAPER_COUNT);

    const normalizedCustomWallpapers = customWallpapers
      .map((wallpaper) => resolveWallpaperBackground(wallpaper).trim())
      .filter(Boolean)
      .filter((wallpaper) => !normalizedThemeWallpapers.includes(wallpaper));

    const limitedCustomWallpapers = normalizedCustomWallpapers.length > MAX_CUSTOM_WALLPAPERS
      ? normalizedCustomWallpapers.slice(normalizedCustomWallpapers.length - MAX_CUSTOM_WALLPAPERS)
      : normalizedCustomWallpapers;

    const finalWallpapers = [...normalizedThemeWallpapers, ...limitedCustomWallpapers];

    if (finalWallpapers.length === 0) {
      setWallpaperOptions(WALLPAPERS.slice(0, THEME_WALLPAPER_COUNT));
      return;
    }

    setWallpaperOptions((prev) => {
      if (
        prev.length === finalWallpapers.length &&
        prev.every((wallpaper, index) => wallpaper === finalWallpapers[index])
      ) {
        return prev;
      }

      return finalWallpapers;
    });
  }, [defaultThemes, apiCustomThemes, customWallpapers]);

  const wallpaperChoices = wallpaperOptions.slice(0, MAX_WALLPAPER_OPTIONS);

  const toRoundnessNumber = (value: unknown) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = parseInt(value, 10);
      return Number.isFinite(parsed) ? parsed : 16;
    }
    return 16;
  };

  const doesThemeMatchStyleConfig = (theme: ThemeConfig, styleConfig: any) => {
    if (!styleConfig) return false;

    const themeWallpaper = resolveWallpaperBackground(theme.styleConfig?.wallpaper);
    const pageWallpaper = resolveWallpaperBackground(styleConfig?.wallpaper);

    return (
      themeWallpaper === pageWallpaper &&
      Number(theme.styleConfig?.frostIntensity) === Number(styleConfig?.frostIntensity) &&
      Number(theme.styleConfig?.surfaceTint) === Number(styleConfig?.surfaceTint) &&
      (theme.styleConfig?.fontStyle || "") === (styleConfig?.fontStyle || "") &&
      toRoundnessNumber(theme.styleConfig?.roundness) === toRoundnessNumber(styleConfig?.roundness)
    );
  };

  const extractPageStyleConfig = (pageData: any) => {
    const candidates = [
      pageData?.styleConfig,
      pageData?.themeConfig?.styleConfig,
      pageData?.theme?.styleConfig?.styleConfig,
      pageData?.theme?.styleConfig,
      pageData?.themeConfig,
      pageData?.theme,
    ];

    for (const candidate of candidates) {
      if (!candidate || typeof candidate !== "object") continue;

      const nested = candidate?.styleConfig;
      if (nested && typeof nested === "object") {
        if (
          nested.wallpaper !== undefined ||
          nested.frostIntensity !== undefined ||
          nested.surfaceTint !== undefined ||
          nested.fontStyle !== undefined ||
          nested.roundness !== undefined
        ) {
          return nested;
        }
      }

      if (
        candidate.wallpaper !== undefined ||
        candidate.frostIntensity !== undefined ||
        candidate.surfaceTint !== undefined ||
        candidate.fontStyle !== undefined ||
        candidate.roundness !== undefined
      ) {
        return candidate;
      }
    }

    return null;
  };

  const applyThemeConfig = (theme: ThemeConfig, source: "default" | "custom") => {
    const { wallpaper, frostIntensity, surfaceTint, fontStyle, roundness } = theme.styleConfig;
    const normalizedWallpaper = resolveWallpaperBackground(wallpaper);

    setActiveWallpaper(normalizedWallpaper);
    setFrostIntensity(frostIntensity);
    setSurfaceTint(surfaceTint);
    setActiveFont(fontStyle);
    setActiveRoundness(typeof roundness === 'string' ? parseInt(roundness) : roundness || 16);

    if (source === "default") {
      setSelectedDefaultThemeId(theme.id);
      setSelectedCustomThemeId(null);
      customPromptShownRef.current = false;
    } else {
      setSelectedCustomThemeId(theme.id);
      setSelectedDefaultThemeId(null);
      customPromptShownRef.current = true;
    }
  };

  useEffect(() => {
    if (!selectedWallpaperFile) {
      setSelectedWallpaperPreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(selectedWallpaperFile);
    setSelectedWallpaperPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedWallpaperFile]);

  const openWallpaperUploadModal = () => {
    setSelectedWallpaperFile(null);
    setSelectedWallpaperPreview(null);
    setIsWallpaperUploadModalOpen(true);
  };

  const closeWallpaperUploadModal = () => {
    setIsWallpaperUploadModalOpen(false);
    setSelectedWallpaperFile(null);
    setSelectedWallpaperPreview(null);
  };

  const uploadWallpaper = async () => {
    if (!selectedWallpaperFile) {
      toast.error("Choose an image first");
      return;
    }

    setIsWallpaperUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedWallpaperFile);

      const response = await fetch(WALLPAPER_UPLOAD_API, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      const uploadedUrl = result?.url || result?.data?.url || result?.imageUrl || result?.result?.url;

      if (!uploadedUrl) {
        throw new Error("Upload response did not include a URL");
      }

      const uploadedWallpaper = uploadedUrl as string;

      setCustomWallpapers((prev) => {
        const normalized = resolveWallpaperBackground(uploadedWallpaper).trim();
        const deduped = prev.filter((wallpaper) => wallpaper !== normalized);
        const next = [...deduped, normalized];
        return next.length > MAX_CUSTOM_WALLPAPERS
          ? next.slice(next.length - MAX_CUSTOM_WALLPAPERS)
          : next;
      });
      setActiveWallpaper(uploadedWallpaper);
      toast.success("Wallpaper uploaded successfully");
      closeWallpaperUploadModal();
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload wallpaper");
    } finally {
      setIsWallpaperUploading(false);
    }
  };

  const handleThemeValueCustomization = () => {
    if (selectedDefaultThemeId && !customPromptShownRef.current) {
      customPromptShownRef.current = true;
      setIsCustomThemeModalOpen(true);
      setCustomThemeName("");
      setSelectedDefaultThemeId(null);
      return;
    }
  };

  const saveCustomTheme = async () => {
    const trimmedName = customThemeName.trim();
    if (!trimmedName) {
      toast.error("Please enter a theme name");
      return;
    }

    try {
      const createdTheme = await createThemeMutation.mutateAsync({
        name: trimmedName,
        description: `Custom theme: ${trimmedName}`,
        type: "LINKS",
        styleConfig: {
          frostIntensity,
          surfaceTint,
          fontStyle: activeFont,
          wallpaper: activeWallpaper,
          roundness: activeRoundness,
          widgets: {},
        },
      });

      const normalizedTheme: ThemeConfig = {
        ...createdTheme,
        styleConfig: {
          ...createdTheme.styleConfig,
          wallpaper: resolveWallpaperBackground(createdTheme.styleConfig?.wallpaper),
        },
      };

      setCustomThemes((prev) => {
        const deduped = prev.filter((theme) => theme.id !== normalizedTheme.id);
        return [normalizedTheme, ...deduped];
      });
      setSelectedCustomThemeId(normalizedTheme.id);
      setSelectedDefaultThemeId(null);
      setIsCustomThemeModalOpen(false);
      setCustomThemeName("");
      toast.success("Custom theme saved");
    } catch (error: any) {
      toast.error(error?.message || "Failed to create theme");
    }
  };

  const closeCustomThemeModal = () => {
    setIsCustomThemeModalOpen(false);
    setCustomThemeName("");
  };

  const openEditCustomThemeModal = (theme: ThemeConfig) => {
    setEditingCustomThemeId(theme.id);
    setEditingCustomThemeName(theme.name);
    setIsEditCustomThemeModalOpen(true);
  };

  const closeEditCustomThemeModal = () => {
    setIsEditCustomThemeModalOpen(false);
    setEditingCustomThemeId(null);
    setEditingCustomThemeName("");
  };

  const saveCustomThemeName = async () => {
    if (!editingCustomThemeId) return;

    const trimmedName = editingCustomThemeName.trim();
    if (!trimmedName) {
      toast.error("Please enter a theme name");
      return;
    }

    try {
      const updatedTheme = await updateThemeMutation.mutateAsync({
        id: editingCustomThemeId,
        name: trimmedName,
      });

      setCustomThemes((prev) =>
        prev.map((theme) =>
          theme.id === editingCustomThemeId
            ? {
                ...theme,
                ...updatedTheme,
                styleConfig: {
                  ...theme.styleConfig,
                  ...updatedTheme.styleConfig,
                  wallpaper: resolveWallpaperBackground(updatedTheme.styleConfig?.wallpaper || theme.styleConfig?.wallpaper),
                },
              }
            : theme,
        ),
      );

      closeEditCustomThemeModal();
      toast.success("Theme name updated");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update theme name");
    }
  };

  const deleteCustomTheme = async (themeId: string) => {
    if (selectedCustomThemeId === themeId) {
      toast.error("Cannot delete selected customized theme");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this customized theme?");
    if (!confirmed) return;

    try {
      await deleteThemeMutation.mutateAsync(themeId);
      setCustomThemes((prev) => prev.filter((theme) => theme.id !== themeId));
      toast.success("Customized theme deleted");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete theme");
    }
  };

  const handleWallpaperChange = (wallpaperBackground: string) => {
    if (wallpaperBackground === activeWallpaper) return;
    setActiveWallpaper(wallpaperBackground);
    handleThemeValueCustomization();
  };

  const applyCustomWallpaper = () => {
    const candidate = (customWallpaperValue.trim() || customWallpaperColor).trim();

    if (!candidate) {
      toast.error("Please enter a valid color or gradient");
      return;
    }

    const normalizedCandidate = resolveWallpaperBackground(candidate);

    setCustomWallpapers((prev) => {
      const deduped = prev.filter((wallpaper) => wallpaper !== normalizedCandidate);
      const next = [...deduped, normalizedCandidate];
      return next.length > MAX_CUSTOM_WALLPAPERS
        ? next.slice(next.length - MAX_CUSTOM_WALLPAPERS)
        : next;
    });
    handleWallpaperChange(normalizedCandidate);
    setIsCustomWallpaperPopupOpen(false);
  };

  const handleFrostIntensityChange = (value: number) => {
    if (value === frostIntensity) return;
    setFrostIntensity(value);
    handleThemeValueCustomization();
  };

  const handleSurfaceTintChange = (value: number) => {
    if (value === surfaceTint) return;
    setSurfaceTint(value);
    handleThemeValueCustomization();
  };

  const handleFontStyleChange = (fontId: string) => {
    if (fontId === activeFont) return;
    setActiveFont(fontId);
    handleThemeValueCustomization();
  };

  const handleRoundnessChange = (value: number) => {
    if (value === activeRoundness) return;
    setActiveRoundness(value);
    handleThemeValueCustomization();
  };

  useEffect(() => {
    if (!selectedCustomThemeId) return;

    setCustomThemes((prev) => {
      let changed = false;

      const next = prev.map((theme) => {
        if (theme.id !== selectedCustomThemeId) return theme;

        const { wallpaper: themeWallpaper, frostIntensity: themeFrost, surfaceTint: themeTint, fontStyle: themeFont, roundness: themeRoundness } = theme.styleConfig;

        if (
          themeWallpaper === activeWallpaper &&
          themeFrost === frostIntensity &&
          themeTint === surfaceTint &&
          themeFont === activeFont &&
          (typeof themeRoundness === 'string' ? parseInt(themeRoundness) : themeRoundness) === activeRoundness
        ) {
          return theme;
        }

        changed = true;
        return {
          ...theme,
          styleConfig: {
            ...theme.styleConfig,
            wallpaper: activeWallpaper,
            frostIntensity,
            surfaceTint,
            fontStyle: activeFont,
            roundness: activeRoundness,
          },
        };
      });

      return changed ? next : prev;
    });
  }, [selectedCustomThemeId, activeWallpaper, frostIntensity, surfaceTint, activeFont, activeRoundness]);

  // 1. Initial state load from localStorage
  useEffect(() => {
    if (isInitialized) return;

    if (getMyPageQuery.isLoading) return;
    if (getDefaultThemesQuery.isLoading) return;
    if (getCustomThemesQuery.isLoading) return;

    const loadInitialState = () => {
      const pageData = getMyPageQuery.data as any;
      const hasApiCustomThemes = apiCustomThemes.length > 0;

      if (hasApiCustomThemes) {
        setCustomThemes(apiCustomThemes);
      }

      if (pageData) {

        // 1. Theme Sync
        const cfg = extractPageStyleConfig(pageData);
        if (cfg) {
          if (cfg.wallpaper) {
            const normalizedWallpaper = resolveWallpaperBackground(cfg.wallpaper);
            setActiveWallpaper(normalizedWallpaper);
          }
          if (cfg.frostIntensity !== undefined) setFrostIntensity(cfg.frostIntensity);
          if (cfg.surfaceTint !== undefined) setSurfaceTint(cfg.surfaceTint);
          if (cfg.fontStyle) setActiveFont(cfg.fontStyle);
          if (cfg.roundness !== undefined) setActiveRoundness(toRoundnessNumber(cfg.roundness));

          const pageTheme = pageData.themeConfig || pageData.theme;
          const pageThemeId =
            typeof pageData?.themeId === "string"
              ? pageData.themeId
              : typeof pageTheme?.id === "string"
                ? pageTheme.id
                : null;

          let matchedCustomTheme: ThemeConfig | undefined;
          let matchedDefaultTheme: ThemeConfig | undefined;

          if (pageThemeId) {
            matchedCustomTheme = apiCustomThemes.find((theme) => theme.id === pageThemeId);
            matchedDefaultTheme = defaultThemes.find((theme) => theme.id === pageThemeId);
          }

          if (!matchedCustomTheme) {
            matchedCustomTheme = apiCustomThemes.find((theme) => doesThemeMatchStyleConfig(theme, cfg));
          }

          if (!matchedDefaultTheme) {
            matchedDefaultTheme = defaultThemes.find((theme) => doesThemeMatchStyleConfig(theme, cfg));
          }

          if (matchedCustomTheme) {
            setSelectedCustomThemeId(matchedCustomTheme.id);
            setSelectedDefaultThemeId(null);
            customPromptShownRef.current = true;
          } else if (matchedDefaultTheme) {
            setSelectedDefaultThemeId(matchedDefaultTheme.id);
            setSelectedCustomThemeId(null);
            customPromptShownRef.current = false;
          } else {
            setSelectedCustomThemeId(null);
            setSelectedDefaultThemeId(null);
            customPromptShownRef.current = false;
          }
        }

        // 1.5 State check
        if (pageData.isPublished !== undefined) setIsPublished(pageData.isPublished);

        // 2. Widgets Sync
        if (Array.isArray(pageData.widgets) && pageData.widgets.length > 0) {
          const mappedWidgets = normalizeWidgets(pageData.widgets.map((w: any) => ({
            id: w.id,
            pageId: w.pageId,
            type: w.type,
            handle: w.handle,
            fullURL: w.fullURL,
            startCol: Number(w.startCol),
            startRow: Number(w.startRow),
            colSize: w.colSize,
            rowSize: w.rowSize,
            icon: w.icon,
          })));
          setWidgets(mappedWidgets);
        } else {
          setWidgets(initialWidgets);
        }
      } else {
        // Fallback to localStorage if no API data or not logged in
        const themeKey = STORAGE_KEYS.themeByUser(userId);
        const widgetsKey = STORAGE_KEYS.widgetsByUser(userId);

        const savedTheme = localStorage.getItem(themeKey);
        const savedWidgets = localStorage.getItem(widgetsKey);

        if (savedTheme) {
          try {
            const parsed = JSON.parse(savedTheme);
            if (parsed.activeWallpaper) {
              const normalizedWallpaper = resolveWallpaperBackground(parsed.activeWallpaper);
              setActiveWallpaper(normalizedWallpaper);
            }
            if (parsed.frostIntensity !== undefined) setFrostIntensity(parsed.frostIntensity);
            if (parsed.surfaceTint !== undefined) setSurfaceTint(parsed.surfaceTint);
            if (parsed.activeFont) setActiveFont(parsed.activeFont);
            if (!hasApiCustomThemes && Array.isArray(parsed.customThemes)) {
              const normalizedCustomThemes = parsed.customThemes.map((theme: ThemeConfig) => ({
                ...theme,
                styleConfig: {
                  ...theme.styleConfig,
                  wallpaper: resolveWallpaperBackground(theme.styleConfig?.wallpaper),
                },
              }));

              setCustomThemes(normalizedCustomThemes);
            }
            if (parsed.selectedDefaultThemeId) setSelectedDefaultThemeId(parsed.selectedDefaultThemeId);
            if (parsed.selectedCustomThemeId) setSelectedCustomThemeId(parsed.selectedCustomThemeId);
          } catch (e) { }
        }

        if (savedWidgets) {
          try {
            const parsed = JSON.parse(savedWidgets);
            setWidgets(normalizeWidgets(parsed));
          } catch (e) { }
        } else {
          setWidgets(initialWidgets);
        }
      }
      setIsInitialized(true);
    };

    loadInitialState();
  }, [userId, getMyPageQuery.data, getMyPageQuery.isLoading, getDefaultThemesQuery.isLoading, getCustomThemesQuery.isLoading, defaultThemes, apiCustomThemes, isInitialized]);

  // 2. Auto-save to localStorage only (DB sync happens only on explicit submit/update)
  useEffect(() => {
    if (!isInitialized || !userId) return;

    const normalizedWidgets = normalizeWidgets(widgets);
    const normalizedString = JSON.stringify(normalizedWidgets);
    const currentString = JSON.stringify(widgets);

    if (normalizedString !== currentString) {
      setWidgets(normalizedWidgets);
      return;
    }

    const themeConfig = {
      activeWallpaper,
      frostIntensity,
      surfaceTint,
      activeFont,
      customThemes,
      selectedDefaultThemeId,
      selectedCustomThemeId,
    };

    const themeKey = STORAGE_KEYS.themeByUser(userId);
    const widgetsKey = STORAGE_KEYS.widgetsByUser(userId);

    if (localSaveStatusTimeoutRef.current) {
      clearTimeout(localSaveStatusTimeoutRef.current);
    }

    setLocalSaveStatus("saving");
    localStorage.setItem(themeKey, JSON.stringify(themeConfig));
    localStorage.setItem(widgetsKey, normalizedString);

    localSaveStatusTimeoutRef.current = setTimeout(() => {
      setLocalSaveStatus("saved");

      localSaveStatusTimeoutRef.current = setTimeout(() => {
        setLocalSaveStatus("idle");
      }, 1800);
    }, 220);

    return () => {
      if (localSaveStatusTimeoutRef.current) {
        clearTimeout(localSaveStatusTimeoutRef.current);
      }
    };
  }, [widgets, activeWallpaper, frostIntensity, surfaceTint, activeFont, customThemes, selectedDefaultThemeId, selectedCustomThemeId, isInitialized]);

  useEffect(() => {
    if (!isPreview) return;
    setDraggingId(null);
    setResizing(null);
    setDropPreview(null);
    setIsAddModalOpen(false);
    setEditingWidgetId(null);
  }, [isPreview]);

  // Row height = cell size so that colSize == rowSize → perfect square
  const rowHeight = cellPx;
  const totalRows = Math.max(
    ...widgets.map((w) => w.startRow + w.rowSize - 1),
    dropPreview ? dropPreview.startRow + dropPreview.rowSize - 1 : 1,
  );

  const clampColStart = (col: number, colSize: number) =>
    Math.max(1, Math.min(col, GRID_COLS - colSize + 1));

  const canPlaceAt = (
    widget: DashboardSocialWidgetData,
    startCol: number,
    startRow: number,
    placed: DashboardSocialWidgetData[],
  ) => {
    if (startCol < 1 || startRow < 1) return false;
    if (startCol + widget.colSize - 1 > GRID_COLS) return false;

    const candidate = {
      ...widget,
      startCol,
      startRow,
    };

    return placed.every((other) => {
      const cRight = candidate.startCol + candidate.colSize - 1;
      const cBottom = candidate.startRow + candidate.rowSize - 1;
      const oRight = other.startCol + other.colSize - 1;
      const oBottom = other.startRow + other.rowSize - 1;

      return cRight < other.startCol || oRight < candidate.startCol || cBottom < other.startRow || oBottom < candidate.startRow;
    });
  };

  const findFirstFit = (
    widget: DashboardSocialWidgetData,
    placed: DashboardSocialWidgetData[],
  ) => {
    for (let row = 1; row <= MAX_PACK_ROWS; row += 1) {
      for (let col = 1; col <= GRID_COLS - widget.colSize + 1; col += 1) {
        if (canPlaceAt(widget, col, row, placed)) {
          return { startCol: col, startRow: row };
        }
      }
    }
    return { startCol: 1, startRow: 1 };
  };

  const widgetsOverlap = (a: DashboardSocialWidgetData, b: DashboardSocialWidgetData) => {
    const aRight = a.startCol + a.colSize - 1;
    const aBottom = a.startRow + a.rowSize - 1;
    const bRight = b.startCol + b.colSize - 1;
    const bBottom = b.startRow + b.rowSize - 1;

    return !(aRight < b.startCol || bRight < a.startCol || aBottom < b.startRow || bBottom < a.startRow);
  };

  const canPlaceWithBlockers = (
    widget: DashboardSocialWidgetData,
    blockers: DashboardSocialWidgetData[],
  ) => {
    if (widget.startCol < 1 || widget.startRow < 1) return false;
    if (widget.startCol + widget.colSize - 1 > GRID_COLS) return false;
    if (widget.startRow + widget.rowSize - 1 > MAX_PACK_ROWS) return false;

    return blockers.every((other) => !widgetsOverlap(widget, other));
  };

  const findClosestAxisPlacement = (
    widget: DashboardSocialWidgetData,
    blockers: DashboardSocialWidgetData[],
    axis: "horizontal" | "vertical",
  ) => {
    const maxColStart = GRID_COLS - widget.colSize + 1;
    const maxRowStart = MAX_PACK_ROWS - widget.rowSize + 1;

    if (axis === "horizontal") {
      const maxStep = Math.max(widget.startCol - 1, maxColStart - widget.startCol);

      for (let step = 0; step <= maxStep; step += 1) {
        const candidates = step === 0 ? [widget.startCol] : [widget.startCol + step, widget.startCol - step];

        for (const col of candidates) {
          if (col < 1 || col > maxColStart) continue;
          const candidate = { ...widget, startCol: col };
          if (canPlaceWithBlockers(candidate, blockers)) {
            return { candidate, steps: Math.abs(col - widget.startCol) };
          }
        }
      }

      return null;
    }

    const maxStep = Math.max(widget.startRow - 1, maxRowStart - widget.startRow);

    for (let step = 0; step <= maxStep; step += 1) {
      const candidates = step === 0 ? [widget.startRow] : [widget.startRow + step, widget.startRow - step];

      for (const row of candidates) {
        if (row < 1 || row > maxRowStart) continue;
        const candidate = { ...widget, startRow: row };
        if (canPlaceWithBlockers(candidate, blockers)) {
          return { candidate, steps: Math.abs(row - widget.startRow) };
        }
      }
    }

    return null;
  };

  const findClosestAnyPlacement = (
    widget: DashboardSocialWidgetData,
    blockers: DashboardSocialWidgetData[],
  ) => {
    let best: { candidate: DashboardSocialWidgetData; distance: number } | null = null;

    for (let row = 1; row <= MAX_PACK_ROWS - widget.rowSize + 1; row += 1) {
      for (let col = 1; col <= GRID_COLS - widget.colSize + 1; col += 1) {
        const candidate = { ...widget, startCol: col, startRow: row };
        if (!canPlaceWithBlockers(candidate, blockers)) continue;

        const distance = Math.abs(col - widget.startCol) + Math.abs(row - widget.startRow);
        if (!best || distance < best.distance) {
          best = { candidate, distance };
        }
      }
    }

    return best?.candidate ?? null;
  };

  const buildSingleWidgetPlacementLayout = (
    current: DashboardSocialWidgetData[],
    draggedWidgetId: string,
    preview: { startCol: number; startRow: number; colSize: number; rowSize: number },
  ) => {
    const dragged = current.find((w) => w.id === draggedWidgetId);
    if (!dragged) return current;

    const moved: DashboardSocialWidgetData = {
      ...dragged,
      startCol: preview.startCol,
      startRow: preview.startRow,
      colSize: preview.colSize,
      rowSize: preview.rowSize,
    };

    const blockers = current.filter((w) => w.id !== draggedWidgetId);

    let resolved = canPlaceWithBlockers(moved, blockers) ? moved : null;

    if (!resolved) {
      const horizontal = findClosestAxisPlacement(moved, blockers, "horizontal");
      const vertical = findClosestAxisPlacement(moved, blockers, "vertical");

      if (horizontal && vertical) {
        resolved = horizontal.steps <= vertical.steps ? horizontal.candidate : vertical.candidate;
      } else if (horizontal) {
        resolved = horizontal.candidate;
      } else if (vertical) {
        resolved = vertical.candidate;
      }
    }

    if (!resolved) {
      resolved = findClosestAnyPlacement(moved, blockers);
    }

    if (!resolved) return current;

    return current.map((widget) =>
      widget.id === draggedWidgetId
        ? resolved
        : widget,
    );
  };

  const getPointerGridPosition = (clientX: number, clientY: number) => {
    const grid = ref.current;
    const dragged = widgets.find((w) => w.id === draggingId);
    if (!grid || !dragged) return null;

    const rect = grid.getBoundingClientRect();
    const unit = cellPx + GAP_PX;
    const rawCol = Math.floor((clientX - rect.left) / unit) + 1;
    const rawRow = Math.floor((clientY - rect.top) / unit) + 1;

    return {
      startCol: clampColStart(rawCol, dragged.colSize),
      startRow: Math.max(1, rawRow),
      colSize: dragged.colSize,
      rowSize: dragged.rowSize,
    };
  };

  const handleDesktopDragStart = (id: string) => {
    if (resizing) return;
    setDraggingId(id);
  };

  const handleDesktopDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!draggingId) return;

    const preview = getPointerGridPosition(event.clientX, event.clientY);
    if (!preview) return;
    setDropPreview(preview);
  };

  const handleDesktopDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!draggingId) return;

    const preview = getPointerGridPosition(event.clientX, event.clientY);
    if (!preview) {
      setDraggingId(null);
      setDropPreview(null);
      return;
    }

    const currentLayout = widgets;
    const nextLayout = buildSingleWidgetPlacementLayout(currentLayout, draggingId, preview);
    const unit = cellPx + GAP_PX;
    const offsets: Record<string, { x: number; y: number }> = {};
    const nextById = new Map(nextLayout.map((w) => [w.id, w]));

    for (const prevWidget of currentLayout) {
      const nextWidget = nextById.get(prevWidget.id);
      if (!nextWidget) continue;

      const prevX = (prevWidget.startCol - 1) * unit;
      const prevY = (prevWidget.startRow - 1) * unit;
      const nextX = (nextWidget.startCol - 1) * unit;
      const nextY = (nextWidget.startRow - 1) * unit;

      const x = prevX - nextX;
      const y = prevY - nextY;

      if (x !== 0 || y !== 0) {
        offsets[prevWidget.id] = { x, y };
      }
    }

    setLayoutMotionEnabled(false);
    setLayoutOffsets(offsets);
    setWidgets(nextLayout);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setLayoutMotionEnabled(true);
        setLayoutOffsets({});
      });
    });

    setDraggingId(null);
    setDropPreview(null);
  };

  const handleDesktopDragEnd = () => {
    setDraggingId(null);
    setDropPreview(null);
  };

  const handleResizeStart = (
    id: string,
    direction: ResizeDirection,
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const widget = widgets.find((item) => item.id === id);
    if (!widget) return;

    setDraggingId(null);
    setDropPreview(null);
    setResizing({
      id,
      direction,
      startX: event.clientX,
      startY: event.clientY,
      startColSize: widget.colSize,
      startRowSize: widget.rowSize,
      startCol: widget.startCol,
      startRow: widget.startRow,
    });
  };

  useEffect(() => {
    if (!resizing) return;

    const unit = cellPx + GAP_PX;

    const onPointerMove = (event: PointerEvent) => {
      setWidgets((prev) => {
        const base = prev.find((item) => item.id === resizing.id);
        if (!base) return prev;

        const deltaX = event.clientX - resizing.startX;
        const deltaY = event.clientY - resizing.startY;

        const colStepDelta =
          deltaX >= 0
            ? Math.floor(deltaX / unit)
            : Math.ceil(deltaX / unit);
        const rowStepDelta =
          deltaY >= 0
            ? Math.floor(deltaY / unit)
            : Math.ceil(deltaY / unit);

        let nextColSize = resizing.startColSize;
        let nextRowSize = resizing.startRowSize;

        if (resizing.direction === "right" || resizing.direction === "corner") {
          nextColSize = resizing.startColSize + colStepDelta;
        }

        if (resizing.direction === "bottom" || resizing.direction === "corner") {
          nextRowSize = resizing.startRowSize + rowStepDelta;
        }

        const maxColSize = GRID_COLS - resizing.startCol + 1;
        const maxRowSize = MAX_PACK_ROWS - resizing.startRow + 1;

        nextColSize = Math.max(1, Math.min(nextColSize, maxColSize));
        nextRowSize = Math.max(1, Math.min(nextRowSize, maxRowSize));

        if (nextColSize === base.colSize && nextRowSize === base.rowSize) {
          return prev;
        }

        return buildSingleWidgetPlacementLayout(prev, resizing.id, {
          startCol: resizing.startCol,
          startRow: resizing.startRow,
          colSize: nextColSize,
          rowSize: nextRowSize,
        });
      });
    };

    const onPointerUp = () => {
      setResizing(null);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [resizing, cellPx]);

  const animateToLayout = (
    currentLayout: DashboardSocialWidgetData[],
    nextLayout: DashboardSocialWidgetData[],
  ) => {
    const unit = cellPx + GAP_PX;
    const offsets: Record<string, { x: number; y: number }> = {};
    const nextById = new Map(nextLayout.map((w) => [w.id, w]));

    for (const prevWidget of currentLayout) {
      const nextWidget = nextById.get(prevWidget.id);
      if (!nextWidget) continue;

      const prevX = (prevWidget.startCol - 1) * unit;
      const prevY = (prevWidget.startRow - 1) * unit;
      const nextX = (nextWidget.startCol - 1) * unit;
      const nextY = (nextWidget.startRow - 1) * unit;

      const x = prevX - nextX;
      const y = prevY - nextY;

      if (x !== 0 || y !== 0) {
        offsets[prevWidget.id] = { x, y };
      }
    }

    setLayoutMotionEnabled(false);
    setLayoutOffsets(offsets);
    setWidgets(nextLayout);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setLayoutMotionEnabled(true);
        setLayoutOffsets({});
      });
    });
  };

  const animateMobileToLayout = (
    currentLayout: DashboardSocialWidgetData[],
    nextLayout: DashboardSocialWidgetData[],
  ) => {
    const mobileGapPx = 16; // gap-4
    const mobileRowPx = 128; // gridAutoRows
    const gridWidth = mobileGridRef.current?.getBoundingClientRect().width ?? 0;
    const mobileCellPx = gridWidth > 0 ? (gridWidth - mobileGapPx) / 2 : 0;

    if (mobileCellPx <= 0) {
      setWidgets(nextLayout);
      return;
    }

    const prevPlacements = computeMobilePlacements(currentLayout);
    const nextPlacements = computeMobilePlacements(nextLayout);

    const prevById = new Map(
      prevPlacements.map((placement) => [currentLayout[placement.index].id, placement]),
    );
    const nextById = new Map(
      nextPlacements.map((placement) => [nextLayout[placement.index].id, placement]),
    );

    const offsets: Record<string, { x: number; y: number }> = {};

    for (const widget of currentLayout) {
      const prevPlacement = prevById.get(widget.id);
      const nextPlacement = nextById.get(widget.id);
      if (!prevPlacement || !nextPlacement) continue;

      const prevX = (prevPlacement.startCol - 1) * (mobileCellPx + mobileGapPx);
      const prevY = (prevPlacement.startRow - 1) * (mobileRowPx + mobileGapPx);
      const nextX = (nextPlacement.startCol - 1) * (mobileCellPx + mobileGapPx);
      const nextY = (nextPlacement.startRow - 1) * (mobileRowPx + mobileGapPx);

      const x = prevX - nextX;
      const y = prevY - nextY;

      if (x !== 0 || y !== 0) {
        offsets[widget.id] = { x, y };
      }
    }

    setLayoutMotionEnabled(false);
    setLayoutOffsets(offsets);
    setWidgets(nextLayout);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setLayoutMotionEnabled(true);
        setLayoutOffsets({});
      });
    });
  };

  const moveMobileWidget = (currentIndex: number, direction: "left" | "right" | "up" | "down") => {
    const placements = computeMobilePlacements(widgets);
    const targetIndex = getMobileNeighborIndex(currentIndex, direction, placements);
    if (targetIndex === null) return;

    const nextLayout = [...widgets];
    [nextLayout[currentIndex], nextLayout[targetIndex]] = [nextLayout[targetIndex], nextLayout[currentIndex]];
    animateMobileToLayout(widgets, nextLayout);
  };

  const getMobileResizeCapabilities = (widget: DashboardSocialWidgetData) => {
    const colSpan = getMobileSpan(widget.colSize);
    const rowSpan = getMobileSpan(widget.rowSize);
    const maxColSize = GRID_COLS - widget.startCol + 1;
    const maxRowSize = MAX_PACK_ROWS - widget.startRow + 1;

    const canGrowWidth = colSpan === 1 && maxColSize >= 6;
    const canGrowHeight = rowSpan === 1 && maxRowSize >= 6;
    const canGrow = canGrowWidth || canGrowHeight;
    const canShrink = colSpan === 2 || rowSpan === 2;

    return {
      canGrow,
      canShrink,
      canGrowWidth,
      canGrowHeight,
      colSpan,
      rowSpan,
      maxColSize,
      maxRowSize,
    };
  };

  const resizeMobileWidget = (index: number, mode: "increase" | "decrease") => {
    const widget = widgets[index];
    if (!widget) return;

    const {
      canGrow,
      canShrink,
      canGrowWidth,
      canGrowHeight,
      colSpan,
      rowSpan,
      maxColSize,
      maxRowSize,
    } = getMobileResizeCapabilities(widget);

    if (mode === "increase" && !canGrow) return;
    if (mode === "decrease" && !canShrink) return;

    let nextColSize = widget.colSize;
    let nextRowSize = widget.rowSize;

    if (mode === "increase") {
      if (canGrowWidth) {
        nextColSize = Math.min(6, maxColSize);
      } else if (canGrowHeight) {
        nextRowSize = Math.min(6, maxRowSize);
      }
    } else {
      if (rowSpan === 2) {
        nextRowSize = 3;
      } else if (colSpan === 2) {
        nextColSize = 3;
      }
    }

    if (nextColSize === widget.colSize && nextRowSize === widget.rowSize) return;

    const nextLayout = [...widgets];
    nextLayout[index] = {
      ...widget,
      colSize: nextColSize,
      rowSize: nextRowSize,
    };

    animateMobileToLayout(widgets, nextLayout);
  };

  const mobilePlacements = computeMobilePlacements(widgets);


  const openEditModal = (widget: DashboardSocialWidgetData) => {
    setEditingWidgetId(widget.id);
    setEditHandle(widget.handle);
  };

  const closeEditModal = () => {
    setEditingWidgetId(null);
    setEditHandle("");
  };

  const deleteWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  };

  const addWidget = (option: AddWidgetOption) => {
    setWidgets((prev) => {
      const nextIdNum =
        prev
          .map((widget) => {
            const match = /^w(\d+)$/.exec(widget.id);
            return match ? Number(match[1]) : 0;
          })
          .reduce((max, num) => Math.max(max, num), 0) + 1;

      const template: DashboardSocialWidgetData = {
        id: `w${nextIdNum}`,
        type: option.type,
        handle: option.defaultHandle,
        colSize: 3,
        rowSize: 3,
        startCol: 1,
        startRow: 1,
        pageId: undefined,
        fullURL: undefined,
        icon: undefined,
      };

      const nextPos = findFirstFit(template, prev);
      return [...prev, { ...template, ...nextPos }];
    });

    setIsAddModalOpen(false);
    setAddSearch("");
  };

  const saveWidgetEdits = () => {
    if (!editingWidgetId) return;

    const trimmedHandle = editHandle.trim();
    if (!trimmedHandle) return;

    setWidgets((prev) =>
      prev.map((widget) =>
        widget.id === editingWidgetId
          ? {
            ...widget,
            handle: trimmedHandle,
          }
          : widget,
      ),
    );

    closeEditModal();
  };

  const submitWidgets = async () => {
    const widgetsMissingHandle = widgets.filter((widget) => !widget.handle.trim());
    if (widgetsMissingHandle.length > 0) {
      const missingWidgetsText = widgetsMissingHandle
        .map((widget) => `${widget.type} (${widget.id})`)
        .join(", ");

      toast.error(`Missing handle for: ${missingWidgetsText}`);
      return;
    }

    setIsSubmitting(true);
    setSyncStatus("saving");

    const isUpdatingLivePage = isPublished;

    try {
      const selectedDefaultTheme = defaultThemes.find((theme) => theme.id === selectedDefaultThemeId);
      const selectedCustomTheme = customThemes.find((theme) => theme.id === selectedCustomThemeId);
      const selectedThemeId = selectedCustomTheme?.id || selectedDefaultTheme?.id || undefined;

      // 1. Theme Config Payload - style config only (no theme metadata)
      const themeConfigPayload: StyleConfig = {
        frostIntensity,
        surfaceTint,
        fontStyle: activeFont,
        wallpaper: activeWallpaper,
        roundness: activeRoundness,
        widgets: {},
      };

      // 2. Widget Payload (Flat structure per API spec)
      const widgetsPayload = widgets.map(w => ({
        pageId: w.pageId,
        type: w.type,
        handle: w.handle,
        fullURL: w.fullURL,
        startCol: w.startCol,
        startRow: w.startRow,
        colSize: w.colSize,
        rowSize: w.rowSize,
        icon: w.icon,
      }));

      const syncData = {
        themeId: selectedThemeId,
        themeConfig: themeConfigPayload,
        isPublished: true, // Crucial: Explicitly publish on Submit
        widgets: widgetsPayload
      };

      await syncPageMutation.mutateAsync(syncData);

      setSyncStatus("saved");
      setIsPublished(true);
      if (isUpdatingLivePage) {
        toast.success("Page updated successfully");
      } else {
        setIsSuccessModalOpen(true);
      }
      console.group(`Submitting ${BRAND_NAME} Page State`);
      console.log('1️⃣ THEME_JSON (style_config) ->', themeConfigPayload);
      console.log('2️⃣ PUBLIC_STATUS ->', true);
      console.log('3️⃣ WIDGETS_JSON (layout + data)->', widgetsPayload);
      console.groupEnd();
    } catch (err) {
      setSyncStatus("error");
      toast.error("Failed to publish your page");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePublishStatus = async () => {
    const nextIsPublished = !isPublished;
    const selectedThemeId = selectedCustomThemeId || selectedDefaultThemeId || undefined;

    setIsStatusUpdating(true);
    setSyncStatus("saving");

    try {
      await syncPageMutation.mutateAsync({
        themeId: selectedThemeId,
        isPublished: nextIsPublished,
      });
      setIsPublished(nextIsPublished);
      setSyncStatus("saved");
      toast.success(nextIsPublished ? "Page Published Live!" : "Page set to Private Draft", {
        icon: nextIsPublished
          ? <Check className="text-emerald-500" size={16} />
          : <Lock className="text-amber-500" size={16} />,
      });
    } catch {
      setSyncStatus("error");
      toast.error("Failed to update page visibility");
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const activeBackground = resolveWallpaperBackground(activeWallpaper);
  const currentFont = DUMMY_API_FONT_STYLES.find(f => f.id === activeFont)?.family || 'inherit';
  const widgetsMissingHandle = widgets.filter((widget) => !widget.handle.trim());
  const hasMissingWidgetHandles = widgetsMissingHandle.length > 0;
  const submitButtonLabel = isPublished ? "Update" : "Submit";
  const submitButtonLoadingLabel = isPublished ? "Updating..." : "Submitting...";

  return (
    <div
      className={`min-h-screen transition-all duration-700 relative flex flex-col items-center overflow-x-hidden ${isInitialized ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: activeBackground, fontFamily: currentFont }}
    >
      {/* Premium Cloud Sync Status Indicator - Relocated to Top Right */}
      <div className={`fixed top-10 right-8 z-60 pointer-events-none transition-all duration-500 ease-in-out flex flex-row items-center gap-3 ${isPreview ? "opacity-0 scale-90 translate-x-4" :
        syncStatus === "saving" || syncStatus === "saved" || syncStatus === "error" || localSaveStatus !== "idle"
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-4"
        }`}>
        {/* Privacy Status Badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-lg backdrop-blur-xl transition-all duration-700 bg-white/95 dark:bg-slate-900/90 ${isPublished
          ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/10"
          : "border-amber-500/30 text-amber-600 dark:text-amber-400 shadow-amber-500/10"
          }`}>
          <div className={`size-2 rounded-full ${isPublished ? "bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"}`} />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">
            {isPublished ? `Live on ${BRAND_NAME}` : "Private Draft"}
          </span>
        </div>

        {localSaveStatus !== "idle" && (
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 dark:bg-black/60 backdrop-blur-xl border border-white/10 shadow-xl">
            <div className="relative flex items-center justify-center">
              {localSaveStatus === "saving" && (
                <div className="size-3.5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
              )}
              {localSaveStatus === "saved" && (
                <Save size={14} className="text-cyan-300" />
              )}
            </div>
            <span className="text-[11px] font-bold tracking-wide text-white/90 drop-shadow-sm">
              {localSaveStatus === "saving" && "Saving locally..."}
              {localSaveStatus === "saved" && "Saved locally"}
            </span>
          </div>
        )}

        {(syncStatus === "saving" || syncStatus === "saved" || syncStatus === "error") && (
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 dark:bg-black/60 backdrop-blur-xl border border-white/10 shadow-xl">
            <div className="relative flex items-center justify-center">
              {syncStatus === "saving" && (
                <div className="size-3.5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
              )}
              {syncStatus === "saved" && (
                <span className="material-symbols-outlined text-[16px] text-emerald-400">cloud_done</span>
              )}
              {syncStatus === "error" && (
                <span className="material-symbols-outlined text-[16px] text-red-400">cloud_off</span>
              )}
            </div>
            <span className="text-[11px] font-bold tracking-wide text-white/90 drop-shadow-sm">
              {syncStatus === "saving" && "Syncing..."}
              {syncStatus === "saved" && "Synced"}
              {syncStatus === "error" && "Offline"}
            </span>
          </div>
        )}
      </div>

      <div
        className={`w-full max-w-200 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-32 flex flex-col flex-1 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isThemeStudioOpen ? 'lg:-translate-x-45' : 'translate-x-0'
          }`}
      >
        {!isPreview && (
          <div className="flex justify-center mb-8 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-slate-900/10 dark:bg-black/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-white/90 text-xs sm:text-sm font-medium border border-white/10 shadow-sm">
              <span className="material-symbols-outlined text-[16px]">drag_indicator</span>
              Drag and drop to rearrange
            </div>
          </div>
        )}

        {/* Mobile card grid — 2 columns with size-aware spans */}
        <div
          ref={mobileGridRef}
          className="grid grid-cols-2 gap-4 sm:hidden"
          style={{ gridAutoRows: "128px" }}
        >
          {widgets.map((w, index) => {
            const placement = mobilePlacements.find((item) => item.index === index);
            if (!placement) return null;

            const canMoveLeft = getMobileNeighborIndex(index, "left", mobilePlacements) !== null;
            const canMoveRight = getMobileNeighborIndex(index, "right", mobilePlacements) !== null;
            const canMoveUp = getMobileNeighborIndex(index, "up", mobilePlacements) !== null;
            const canMoveDown = getMobileNeighborIndex(index, "down", mobilePlacements) !== null;

            return (
              <div
                key={w.id}
                className="relative"
                style={{
                  gridColumn: `span ${placement.colSpan}`,
                  gridRow: `span ${placement.rowSpan}`,
                }}
              >
                <button
                  type="button"
                  aria-label={`Move ${w.type} widget left`}
                  onClick={() => moveMobileWidget(index, "left")}
                  disabled={!canMoveLeft}
                  hidden={isPreview}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-30 size-7 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700/80 shadow-md flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px] leading-none">chevron_left</span>
                </button>

                <button
                  type="button"
                  aria-label={`Move ${w.type} widget right`}
                  onClick={() => moveMobileWidget(index, "right")}
                  disabled={!canMoveRight}
                  hidden={isPreview}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-30 size-7 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700/80 shadow-md flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px] leading-none">chevron_right</span>
                </button>

                <button
                  type="button"
                  aria-label={`Move ${w.type} widget up`}
                  onClick={() => moveMobileWidget(index, "up")}
                  disabled={!canMoveUp}
                  hidden={isPreview}
                  className="absolute top-2 left-1/2 -translate-x-1/2 z-30 size-7 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700/80 shadow-md flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px] leading-none">expand_less</span>
                </button>

                <button
                  type="button"
                  aria-label={`Move ${w.type} widget down`}
                  onClick={() => moveMobileWidget(index, "down")}
                  disabled={!canMoveDown}
                  hidden={isPreview}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 size-7 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700/80 shadow-md flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px] leading-none">expand_more</span>
                </button>

                <DashboardSocialWidget
                  data={{
                    ...w,
                    startCol: 1,
                    startRow: 1,
                    colSize: placement.colSpan,
                    rowSize: placement.rowSpan,
                  }}
                  motionOffset={layoutOffsets[w.id]}
                  layoutMotionEnabled={layoutMotionEnabled}
                  forceShowLabel
                  disableLink={!isPreview}
                  showEditButton={!isPreview}
                  onEditClick={() => openEditModal(w)}
                  onDeleteClick={() => deleteWidget(w.id)}
                  frostIntensity={frostIntensity}
                  surfaceTint={surfaceTint}
                  roundness={activeRoundness}
                />
              </div>
            );
          })}
        </div>

        {/* Desktop grid — row height == column width so equal colSize/rowSize = square */}
        <div
          ref={ref}
          className="hidden sm:grid"
          onDragOver={isPreview ? undefined : handleDesktopDragOver}
          onDrop={isPreview ? undefined : handleDesktopDrop}
          onDragLeave={isPreview ? undefined : () => setDropPreview(null)}
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${totalRows}, ${rowHeight}px)`,
            gap: `${GAP_PX}px`,
          }}
        >
          {!isPreview && dropPreview && (
            <div
              className="rounded-3xl border-2 border-dashed border-primary/50 bg-primary/10 flex items-center justify-center text-primary/80 text-xs font-semibold pointer-events-none transition-all duration-200"
              style={{
                gridColumn: `${dropPreview.startCol} / span ${dropPreview.colSize}`,
                gridRow: `${dropPreview.startRow} / span ${dropPreview.rowSize}`,
              }}
            >
              Drop here
            </div>
          )}
          {widgets.map((w) => (
            <DashboardSocialWidget
              key={w.id}
              data={w}
              draggable={!isPreview && !resizing}
              onDragStart={() => handleDesktopDragStart(w.id)}
              onDragEnd={handleDesktopDragEnd}
              isDragging={draggingId === w.id}
              motionOffset={layoutOffsets[w.id]}
              layoutMotionEnabled={layoutMotionEnabled}
              showResizeHandles={!isPreview}
              isResizing={resizing?.id === w.id}
              onResizeStart={isPreview ? undefined : (direction, event) => handleResizeStart(w.id, direction, event)}
              disableLink={!isPreview}
              showEditButton={!isPreview}
              onEditClick={() => openEditModal(w)}
              onDeleteClick={() => deleteWidget(w.id)}
              frostIntensity={frostIntensity}
              surfaceTint={surfaceTint}
              roundness={activeRoundness}
            />
          ))}
        </div>

      </div>

      {/* Floating Action Dock */}
      <div className="fixed bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 z-45 flex items-center gap-1 sm:gap-2 p-2 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
        <button
          type="button"
          onClick={() => setIsThemeStudioOpen(true)}
          className="cursor-pointer inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold transition-all hover:scale-105 active:scale-95 bg-linear-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30 ring-1 ring-blue-500/20"
        >
          <span className="material-symbols-outlined text-[18px] leading-none">palette</span>
          <span className="hidden sm:inline">Theme</span>
        </button>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          disabled={isPreview}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold transition-all text-slate-700 dark:text-white ${isPreview ? 'opacity-40 cursor-not-allowed hidden sm:flex' : 'hover:scale-105 active:scale-95 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer'}`}
        >
          <span className="material-symbols-outlined text-[18px] leading-none">add_circle</span>
          <span className="hidden sm:inline">Add Widget</span>
        </button>

        <div className="w-px h-6 bg-slate-200 dark:bg-white/20 mx-1"></div>

        <button
          type="button"
          onClick={() => {
            if (!isPreview) {
              setWasThemeStudioOpen(isThemeStudioOpen);
              setIsThemeStudioOpen(false);
            } else if (wasThemeStudioOpen) {
              setIsThemeStudioOpen(true);
            }
            setIsPreview((prev) => !prev);
          }}
          className={`cursor-pointer inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold transition-all hover:scale-105 active:scale-95 ${isPreview
            ? "bg-slate-900 text-white dark:bg-white dark:text-blue-600 shadow-md"
            : "text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
            }`}
        >
          {isPreview ? <Pencil size={18} /> : <Eye size={18} />}
          {isPreview ? "Edit Mode" : "Preview"}
        </button>

        {hasMissingWidgetHandles && !isPreview && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-500/12 dark:text-amber-300 border border-amber-200/80 dark:border-amber-500/30 text-[11px] font-bold">
            <Lock size={12} />
            Missing handles in {widgetsMissingHandle.length} widget{widgetsMissingHandle.length > 1 ? "s" : ""}
          </div>
        )}

        <button
          type="button"
          onClick={submitWidgets}
          disabled={isSubmitting || isPreview}
          className={`cursor-pointer inline-flex items-center gap-2 rounded-full bg-blue-500 text-white px-5 py-2.5 text-xs sm:text-sm font-black shadow-lg shadow-blue-500/30 transition-all ml-1 ${isSubmitting || isPreview ? 'opacity-40 cursor-not-allowed hidden sm:flex' : 'hover:scale-105 hover:bg-blue-600 active:scale-95'}`}
        >
          {isSubmitting ? <RefreshCcw size={16} className="animate-spin" /> : <Check size={18} strokeWidth={3} />}
          {isSubmitting ? submitButtonLoadingLabel : submitButtonLabel}
        </button>
      </div>

      {/* Theme Studio Floating Panel */}
      {isThemeStudioOpen && (
        <div
          className="fixed top-20 bottom-6 right-4 w-[min(92vw,388px)] bg-white/92 dark:bg-slate-950/90 backdrop-blur-2xl rounded-[28px] shadow-[0_28px_70px_-20px_rgba(37,99,235,0.35)] dark:shadow-[0_28px_70px_-20px_rgba(0,0,0,0.75)] z-50 flex flex-col overflow-hidden border border-blue-100/80 dark:border-blue-400/10 ring-1 ring-white/40 dark:ring-white/5 animate-in fade-in slide-in-from-right-full duration-500 ease-out"
          style={{ fontFamily: 'Manrope, sans-serif' }}
        >
          <div className="h-1.5 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-cyan-400" />
          {/* Header */}
          <div className="px-6 py-5 flex items-start justify-between gap-4 border-b border-slate-100/70 dark:border-white/5 bg-linear-to-b from-blue-50/70 to-white/70 dark:from-white/5 dark:to-slate-950/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30">
                <Palette size={18} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">Theme Studio</h2>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-blue-200/70 dark:border-blue-400/20 bg-blue-50/80 dark:bg-blue-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">
                  <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                  Live appearance
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsThemeStudioOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 outline-none size-9 flex items-center justify-center shrink-0 rounded-full hover:bg-white dark:hover:bg-slate-900 transition-all border border-slate-200/60 dark:border-white/10 shadow-sm hover:shadow-md"
            >
              <X size={16} strokeWidth={3} />
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar divide-y divide-slate-200/70 dark:divide-slate-800/80">
            {/* Default Themes */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-50 fill-mode-both px-6 py-6 first:pt-6">
              <h3 className="text-[10px] font-black tracking-[0.18em] text-slate-700 dark:text-slate-300 uppercase mb-4 flex items-center gap-3">
                Default Themes
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
              </h3>
              <div className="space-y-2.5 max-h-64 overflow-auto">
                {defaultThemes.map((theme) => {
                  const { wallpaper, fontStyle } = theme.styleConfig;
                  const isActive = selectedDefaultThemeId === theme.id;

                  return (
                    <button
                      key={theme.id}
                      onClick={() => applyThemeConfig(theme, "default")}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${isActive
                        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 shadow-sm"
                        : "border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white/70 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-800/70"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="size-7 rounded-full border border-white/30 shadow-sm" style={getWallpaperStyle(wallpaper)} />
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{theme.name}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-500">{fontStyle}</span>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${isActive ? 'bg-blue-500 border-blue-500 transform scale-100' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transform scale-90'
                        }`}>
                        {isActive && <Check size={12} className="text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customized Themes */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100 fill-mode-both px-6 py-6">
              <h3 className="text-[10px] font-black tracking-[0.18em] text-slate-700 dark:text-slate-300 uppercase mb-4 flex items-center gap-3">
                Customized Themes
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
              </h3>

              {customThemes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300/80 dark:border-slate-700 px-4 py-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/60 dark:bg-slate-900/40">
                  No customized theme yet. Select a default theme and edit values to create one.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {customThemes.map((theme) => {
                    const { wallpaper, fontStyle } = theme.styleConfig;
                    const isActive = selectedCustomThemeId === theme.id;

                    return (
                      <div
                        key={theme.id}
                        className={`w-full p-2.5 rounded-2xl border transition-all duration-200 ${isActive
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 shadow-sm"
                          : "border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70"
                          }`}
                      >
                        <button
                          type="button"
                          onClick={() => applyThemeConfig(theme, "custom")}
                          className="w-full flex items-center justify-between px-1 py-1"
                        >
                          <div className="flex items-center gap-3">
                            <span className="size-7 rounded-full border border-white/30 shadow-sm" style={getWallpaperStyle(wallpaper)} />
                            <div className="flex flex-col items-start">
                              <span className="text-sm font-bold text-slate-900 dark:text-white">{theme.name}</span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-500">{fontStyle}</span>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${isActive ? 'bg-blue-500 border-blue-500 transform scale-100' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transform scale-90'
                            }`}>
                            {isActive && <Check size={12} className="text-white" />}
                          </div>
                        </button>

                        <div className="mt-2 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditCustomThemeModal(theme)}
                            className="h-7 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1"
                          >
                            <Pencil size={11} />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCustomTheme(theme.id)}
                            className="h-7 px-2.5 rounded-lg border border-red-200 dark:border-red-500/40 text-[11px] font-bold text-red-600 dark:text-red-400 hover:bg-red-50/70 dark:hover:bg-red-500/10 flex items-center gap-1"
                          >
                            <X size={11} />
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Wallpaper */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75 fill-mode-both px-6 py-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black tracking-[0.18em] text-slate-700 dark:text-slate-300 uppercase">Wallpaper</h3>
                <button
                  type="button"
                  onClick={openWallpaperUploadModal}
                  className="text-xs font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Upload
                </button>
              </div>
              <div className="relative grid grid-cols-4 gap-3 content-start">
                {wallpaperChoices.map((wp, index) => (
                  <button
                    key={`${wp}-${index}`}
                    onClick={() => handleWallpaperChange(wp)}
                    className={`relative aspect-square rounded-full flex items-center justify-center transition-all duration-300 ${activeWallpaper === wp ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 scale-100 shadow-md' : 'hover:scale-[1.08] opacity-90 hover:opacity-100 shadow-sm'
                      }`}
                    style={getWallpaperStyle(wp)}
                  >
                    {activeWallpaper === wp && (
                      <span className="material-symbols-outlined text-white text-[18px] animate-in zoom-in-50 duration-200">check</span>
                    )}
                  </button>
                ))}

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCustomWallpaperPopupOpen((prev) => !prev)}
                    className="relative aspect-square w-full rounded-full p-0.5 transition-all duration-300 hover:scale-[1.08] shadow-sm"
                    style={{ background: "conic-gradient(from 210deg, #22c55e, #3b82f6, #a855f7, #ec4899, #f59e0b, #22c55e)" }}
                    aria-label="Open custom color picker"
                  >
                    <span className="absolute inset-1 rounded-full bg-white dark:bg-slate-950 flex items-center justify-center text-xl font-semibold text-fuchsia-500 dark:text-fuchsia-400">
                      +
                    </span>
                  </button>
                </div>

                {isCustomWallpaperPopupOpen && (
                  <div className="col-span-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-3 shadow-xl">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customWallpaperColor}
                        onChange={(event) => {
                          const value = event.target.value;
                          setCustomWallpaperColor(value);
                          if (!customWallpaperValue.trim() || customWallpaperValue.trim().startsWith("#")) {
                            setCustomWallpaperValue(value);
                          }
                        }}
                        className="h-9 w-11 rounded-lg border border-slate-300/80 dark:border-slate-600 bg-transparent cursor-pointer"
                        aria-label="Pick wallpaper color"
                      />
                      <input
                        type="text"
                        value={customWallpaperValue}
                        onChange={(event) => setCustomWallpaperValue(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            applyCustomWallpaper();
                          }
                        }}
                        placeholder="Color code or gradient"
                        className="h-9 flex-1 rounded-lg border border-slate-300/80 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 text-xs text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                      />
                    </div>

                    <div className="mt-2.5 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCustomWallpaperPopupOpen(false)}
                        className="h-8 rounded-lg border border-slate-300/80 dark:border-slate-600 px-3 text-xs font-semibold text-slate-600 dark:text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={applyCustomWallpaper}
                        className="h-8 rounded-lg bg-blue-500 hover:bg-blue-600 px-3 text-xs font-bold text-white"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Glass Material */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150 fill-mode-both px-6 py-6">
              <h3 className="text-[10px] font-black tracking-[0.18em] text-slate-700 dark:text-slate-300 uppercase mb-5 flex items-center gap-3">
                Glass Material
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
              </h3>

              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-3.5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 font-medium">
                      <span className="material-symbols-outlined text-[16px] text-slate-400 dark:text-slate-500">blur_on</span>
                      Frost Intensity
                    </span>
                    <span className="text-xs font-bold text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-0.5 rounded-md">{frostIntensity}px</span>
                  </div>
                  <input
                    type="range"
                    min="0" max="100"
                    value={frostIntensity}
                    onChange={(e) => handleFrostIntensityChange(Number(e.target.value))}
                    className="w-full appearance-none bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-95 transition-all"
                  />
                </div>

                <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-3.5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 font-medium">
                      <span className="material-symbols-outlined text-[16px] text-slate-400 dark:text-slate-500">water_drop</span>
                      Surface Tint
                    </span>
                    <span className="text-xs font-bold text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-0.5 rounded-md">{surfaceTint}%</span>
                  </div>
                  <input
                    type="range"
                    min="0" max="100"
                    value={surfaceTint}
                    onChange={(e) => handleSurfaceTintChange(Number(e.target.value))}
                    className="w-full appearance-none bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-95 transition-all"
                  />
                </div>

                <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-3.5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 font-medium">
                      <span className="material-symbols-outlined text-[16px] text-slate-400 dark:text-slate-500">rounded_corner</span>
                      Roundness
                    </span>
                    <span className="text-xs font-bold text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-0.5 rounded-md">{activeRoundness}px</span>
                  </div>
                  <input
                    type="range"
                    min="0" max="32"
                    value={activeRoundness}
                    onChange={(e) => handleRoundnessChange(Number(e.target.value))}
                    className="w-full appearance-none bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-95 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-200 fill-mode-both px-6 py-6">
              <h3 className="text-[10px] font-black tracking-[0.18em] text-slate-700 dark:text-slate-300 uppercase mb-4 flex items-center gap-3">
                Typography
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
              </h3>
              <div className="space-y-2.5">
                {DUMMY_API_FONT_STYLES.map(font => (
                  <button
                    key={font.id}
                    onClick={() => handleFontStyleChange(font.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${activeFont === font.id ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 shadow-sm' : 'border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white/70 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-800/70'
                      }`}
                  >
                    <div className="flex flex-col items-start gap-1">
                      <span className={`text-[15px] font-bold ${activeFont === font.id ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-300'}`} style={{ fontFamily: font.family }}>{font.name}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-500 uppercase tracking-wide" style={{ fontFamily: font.family }}>{font.family.split(',')[0].replace(/['"]/g, '')}</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${activeFont === font.id ? 'bg-blue-500 border-blue-500 transform scale-100' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transform scale-90'
                      }`}>
                      {activeFont === font.id && <Check size={12} className="text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy & Publication */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-300 fill-mode-both px-6 py-6 last:pb-6">
              <h3 className="text-[10px] font-black tracking-[0.18em] text-slate-700 dark:text-slate-300 uppercase mb-5 flex items-center gap-3">
                Privacy & Publication
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
              </h3>

              <div className="bg-slate-50 dark:bg-white/5 rounded-[20px] p-5 border border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${isPublished ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {isPublished ? <Globe size={18} /> : <Lock size={18} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {isPublished ? "Page is Public" : "Private Draft"}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed font-medium">
                        {isPublished
                          ? "Anyone with your link can see your profile."
                          : "Only you can see your profile page."}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={togglePublishStatus}
                    disabled={isStatusUpdating}
                    className={`relative w-10 h-6 shrink-0 rounded-full transition-colors duration-300 outline-none focus:ring-2 focus:ring-blue-500/50 ${isPublished ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                      } ${isStatusUpdating ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className={`absolute top-1 left-1 size-4 rounded-full bg-white shadow-sm transition-all duration-300 ease-in-out ${isPublished ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                  </button>
                </div>

                {isPublished && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(getPublicProfileDisplay(user?.username || "username"));
                        toast.success("Public link copied!");
                      }}
                      className="w-full py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm cursor-pointer"
                    >
                      <Save size={12} />
                      Copy Public Link
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <WallpaperUploadModal
        isOpen={isWallpaperUploadModalOpen}
        onClose={closeWallpaperUploadModal}
        onSelectFile={setSelectedWallpaperFile}
        onUpload={uploadWallpaper}
        selectedFile={selectedWallpaperFile}
        previewUrl={selectedWallpaperPreview}
        isUploading={isWallpaperUploading}
      />

      {isCustomThemeModalOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close custom theme naming modal"
            onClick={closeCustomThemeModal}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Save Customized Theme</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                You edited a default theme. Give your customized theme a name.
              </p>
            </div>

            <input
              value={customThemeName}
              onChange={(e) => setCustomThemeName(e.target.value)}
              placeholder="Theme name"
              className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/40"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeCustomThemeModal}
                className="px-3.5 h-9 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Later
              </button>
              <button
                type="button"
                onClick={saveCustomTheme}
                className="px-3.5 h-9 rounded-xl bg-blue-500 text-white text-xs font-bold hover:bg-blue-600"
              >
                Save Theme
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditCustomThemeModalOpen && (
        <div className="fixed inset-0 z-71 flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close edit custom theme modal"
            onClick={closeEditCustomThemeModal}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Edit Customized Theme</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Update your customized theme name.
              </p>
            </div>

            <input
              value={editingCustomThemeName}
              onChange={(e) => setEditingCustomThemeName(e.target.value)}
              placeholder="Theme name"
              className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/40"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeEditCustomThemeModal}
                className="px-3.5 h-9 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveCustomThemeName}
                className="px-3.5 h-9 rounded-xl bg-blue-500 text-white text-xs font-bold hover:bg-blue-600"
              >
                Save Name
              </button>
            </div>
          </div>
        </div>
      )}

      {!isPreview && (
        <AddWidgetModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setAddSearch("");
          }}
          onAdd={addWidget}
          searchQuery={addSearch}
          setSearchQuery={setAddSearch}
        />
      )}

      {!isPreview && (
        <EditWidgetModal
          isOpen={!!editingWidgetId}
          onClose={closeEditModal}
          editHandle={editHandle}
          setEditHandle={setEditHandle}
          onSave={saveWidgetEdits}
        />
      )}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        username={user?.username || "username"}
      />
    </div>
  );
}
