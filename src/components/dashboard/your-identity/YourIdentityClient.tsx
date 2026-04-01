"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { X, Palette, Check, RefreshCcw, Save, Eye, Pencil, Shield, Globe, Lock } from "lucide-react";
import {
  DashboardSocialWidget,
  DashboardSocialWidgetData,
} from "@/components/dashboard/widgets/SocialWidget";
import { SOCIAL_PLATFORMS, SocialPlatform } from "@/components/dashboard/widgets/widget-config";
import { AddWidgetModal, AddWidgetOption } from "./AddWidgetModal";
import { EditWidgetModal } from "./EditWidgetModal";
import useAuthStore from "@/stores/authStore";
import { getMyPage, syncPage } from "../../../../actions/page";
import { SuccessModal } from "./SuccessModal";

export type Wallpaper = {
  id: string;
  background: string;
};

export const WALLPAPERS: Wallpaper[] = [
  { id: "wp1", background: "linear-gradient(135deg, #6E85F0, #614CF5)" },
  { id: "wp2", background: "linear-gradient(135deg, #FFD28A, #FFA366)" },
  { id: "wp3", background: "linear-gradient(135deg, #82DBFF, #489EFF)" },
  { id: "wp4", background: "linear-gradient(135deg, #FFB6C1, #FF8DA1)" },
  { id: "wp5", background: "linear-gradient(135deg, #CDD0FF, #9BB0FF)" },
  { id: "wp6", background: "linear-gradient(135deg, #18D1FF, #0099FF)" },
  { id: "wp7", background: "linear-gradient(135deg, #5EE689, #25CC97)" },
  { id: "wp8", background: "linear-gradient(135deg, #FFB966, #FF6600)" },
];

export const FONTS = [
  { id: "modern", name: "Modern", family: "Manrope, sans-serif" },
  { id: "classic", name: "Classic", family: "'Playfair Display', serif" },
  { id: "technical", name: "Technical", family: "'JetBrains Mono', monospace" },
];

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
  }
];

const MAX_PACK_ROWS = 60;
type ResizeDirection = "right" | "bottom" | "corner";

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

  return {
    id: typeof rawWidget?.id === "string" && rawWidget.id.trim() ? rawWidget.id : `w${index + 1}`,
    type,
    handle,
    startCol,
    startRow,
    colSize,
    rowSize,
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

type MobilePlacement = {
  index: number;
  startRow: number;
  startCol: number;
  rowSpan: number;
  colSpan: number;
};

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

  const [activeWallpaper, setActiveWallpaper] = useState("wp1");
  const [frostIntensity, setFrostIntensity] = useState(24);
  const [surfaceTint, setSurfaceTint] = useState(65);
  const [activeFont, setActiveFont] = useState("modern");
  const [isThemeStudioOpen, setIsThemeStudioOpen] = useState(true);
  const [wasThemeStudioOpen, setWasThemeStudioOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initial state load from localStorage
  useEffect(() => {
    const loadInitialState = async () => {
      // First try to load from API
      const apiPage = await getMyPage() as any;

      if (apiPage) {
        const pageData = apiPage;

        // 1. Theme Sync
        if (pageData.theme?.styleConfig) {
          const cfg = pageData.theme.styleConfig;
          if (cfg.activeWallpaper) setActiveWallpaper(cfg.activeWallpaper);
          if (cfg.frostIntensity !== undefined) setFrostIntensity(cfg.frostIntensity);
          if (cfg.surfaceTint !== undefined) setSurfaceTint(cfg.surfaceTint);
          if (cfg.activeFont) setActiveFont(cfg.activeFont);
        }

        // 1.5 State check
        if (pageData.isPublished !== undefined) setIsPublished(pageData.isPublished);

        // 2. Widgets Sync
        if (Array.isArray(pageData.widgets) && pageData.widgets.length > 0) {
          const mappedWidgets = normalizeWidgets(pageData.widgets.map((w: any) => ({
            id: w.id,
            type: w.type,
            handle: w.config?.data?.handle,
            startCol: Number(w.x) + 1,
            startRow: Number(w.y) + 1,
            colSize: w.width,
            rowSize: w.height,
          })));
          setWidgets(mappedWidgets);
        } else {
          setWidgets(initialWidgets);
        }
      } else {
        // Fallback to localStorage if no API data or not logged in
        const themeKey = `moku_theme_${userId}`;
        const widgetsKey = `moku_widgets_${userId}`;

        const savedTheme = localStorage.getItem(themeKey);
        const savedWidgets = localStorage.getItem(widgetsKey);

        if (savedTheme) {
          try {
            const parsed = JSON.parse(savedTheme);
            if (parsed.activeWallpaper) setActiveWallpaper(parsed.activeWallpaper);
            if (parsed.frostIntensity !== undefined) setFrostIntensity(parsed.frostIntensity);
            if (parsed.surfaceTint !== undefined) setSurfaceTint(parsed.surfaceTint);
            if (parsed.activeFont) setActiveFont(parsed.activeFont);
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
  }, [userId]);

  // 2. Auto-save to localStorage and debounce API simulation
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
    };

    const themeKey = `moku_theme_${userId}`;
    const widgetsKey = `moku_widgets_${userId}`;

    localStorage.setItem(themeKey, JSON.stringify(themeConfig));
    localStorage.setItem(widgetsKey, normalizedString);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    // Set status to idle if no changes for a bit, OR keep showing 'saved'
    // Let's set it to saving as soon as a change is detected (and timeout starts)
    setSyncStatus("saving");

    saveTimeoutRef.current = setTimeout(async () => {
      const syncData = {
        themeConfig,
        isPublished, // Maintain current status during autosave
        widgets: normalizedWidgets.map(w => ({
          type: w.type.toUpperCase(),
          x: w.startCol - 1,
          y: w.startRow - 1,
          width: w.colSize,
          height: w.rowSize,
          config: {
            data: {
              handle: w.handle,
            }
          }
        }))
      };

      try {
        await syncPage(syncData);
        setSyncStatus("saved");
        console.log("✅ Sync: Successfully saved to DB");
      } catch (error) {
        setSyncStatus("error");
        console.error("❌ Sync: Failed to save to DB", error);
      }
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [widgets, activeWallpaper, frostIntensity, surfaceTint, activeFont, isInitialized, isPublished]);

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
    setIsSubmitting(true);
    try {
      // 1. Separate Theme Payload (Page + Styling options)
      const themePayload = {
        page: {
          background: activeWallpaper,
          font: activeFont
        },
        widget: {
          frostIntensity: frostIntensity,
          surfaceTint: surfaceTint,
          // Placeholder for base widget overrides
        },
        widgets: {
          // Placeholder for specific widget type overrides
        }
      };

      // 2. Separate Layout + Data Payload (No styling included!)
      const widgetsPayload = widgets.map(w => ({
        id: w.id,
        type: w.type,
        x: w.startCol,
        y: w.startRow,
        width: w.colSize,
        height: w.rowSize,
        config: {
          handle: w.handle,
        }
      }));

      const syncData = {
        themeConfig: themePayload,
        isPublished: true, // Crucial: Explicitly publish on Submit
        widgets: widgetsPayload
      };

      await syncPage(syncData);

      setSyncStatus("saved");
      setIsPublished(true);
      setIsSuccessModalOpen(true);
      console.group('Submitting Moku Page State');
      console.log('1️⃣ THEME_JSON (style_config) ->', themePayload);
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

  const activeBackground = WALLPAPERS.find(w => w.id === activeWallpaper)?.background || WALLPAPERS[0].background;
  const currentFont = FONTS.find(f => f.id === activeFont)?.family || 'inherit';

  return (
    <div
      className={`min-h-screen transition-all duration-700 relative flex flex-col items-center overflow-x-hidden ${isInitialized ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: activeBackground, fontFamily: currentFont }}
    >
      {/* Premium Cloud Sync Status Indicator - Relocated to Top Right */}
      <div className={`fixed top-10 right-8 z-60 pointer-events-none transition-all duration-500 ease-in-out flex flex-row items-center gap-3 ${isPreview ? "opacity-0 scale-90 translate-x-4" :
          syncStatus === "saving" ? "opacity-100 translate-x-0" :
            syncStatus === "saved" ? "opacity-90 translate-x-0" :
              syncStatus === "error" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        }`}>
        {/* Privacy Status Badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-lg backdrop-blur-xl transition-all duration-700 bg-white/95 dark:bg-slate-900/90 ${isPublished
            ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/10"
            : "border-amber-500/30 text-amber-600 dark:text-amber-400 shadow-amber-500/10"
          }`}>
          <div className={`size-2 rounded-full ${isPublished ? "bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"}`} />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">
            {isPublished ? "Live on Moku" : "Private Draft"}
          </span>
        </div>

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
      </div>

      <div
        className={`w-full max-w-[800px] px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-32 flex flex-col flex-1 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isThemeStudioOpen ? 'lg:-translate-x-[180px]' : 'translate-x-0'
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
            />
          ))}
        </div>

      </div>

      {/* Floating Action Dock */}
      <div className="fixed bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 z-[45] flex items-center gap-1 sm:gap-2 p-2 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
        <button
          type="button"
          onClick={() => setIsThemeStudioOpen(true)}
          className="cursor-pointer inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold transition-all hover:scale-105 active:scale-95 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
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

        <button
          type="button"
          onClick={submitWidgets}
          disabled={isSubmitting || isPreview}
          className={`cursor-pointer inline-flex items-center gap-2 rounded-full bg-blue-500 text-white px-5 py-2.5 text-xs sm:text-sm font-black shadow-lg shadow-blue-500/30 transition-all ml-1 ${isSubmitting || isPreview ? 'opacity-40 cursor-not-allowed hidden sm:flex' : 'hover:scale-105 hover:bg-blue-600 active:scale-95'}`}
        >
          {isSubmitting ? <RefreshCcw size={16} className="animate-spin" /> : <Check size={18} strokeWidth={3} />}
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>

      {/* Theme Studio Floating Panel */}
      {isThemeStudioOpen && (
        <div className="fixed top-24 right-6 w-[340px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[24px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] z-50 flex flex-col overflow-hidden border border-slate-100 dark:border-white/5 animate-in fade-in slide-in-from-right-full duration-500 ease-out" style={{ fontFamily: 'Manrope, sans-serif' }}>
          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100/50 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <Palette size={18} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">Theme Studio</h2>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mt-1">Customize Vibe</p>
              </div>
            </div>
            <button
              onClick={() => setIsThemeStudioOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 outline-none size-8 flex items-center justify-center shrink-0 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-sm hover:shadow-md"
            >
              <X size={16} strokeWidth={3} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(100vh-300px)] lg:max-h-[calc(100vh-220px)] space-y-8 custom-scrollbar">
            {/* Wallpaper */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75 fill-mode-both">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-bold tracking-[0.1em] text-slate-800 dark:text-slate-300 uppercase">Wallpaper</h3>
                <button className="text-xs font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">Upload</button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {WALLPAPERS.map(wp => (
                  <button
                    key={wp.id}
                    onClick={() => setActiveWallpaper(wp.id)}
                    className={`relative aspect-square rounded-full flex items-center justify-center transition-all duration-300 ${activeWallpaper === wp.id ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 scale-100 shadow-md' : 'hover:scale-[1.08] opacity-90 hover:opacity-100 shadow-sm'
                      }`}
                    style={{ background: wp.background }}
                  >
                    {activeWallpaper === wp.id && (
                      <span className="material-symbols-outlined text-white text-[18px] animate-in zoom-in-50 duration-200">check</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Glass Material */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150 fill-mode-both">
              <h3 className="text-[11px] font-bold tracking-[0.1em] text-slate-800 dark:text-slate-300 uppercase mb-5 flex items-center gap-3">
                Glass Material
                <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1"></div>
              </h3>

              <div className="space-y-6">
                <div>
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
                    onChange={(e) => setFrostIntensity(Number(e.target.value))}
                    className="w-full appearance-none bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-95 transition-all"
                  />
                </div>

                <div>
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
                    onChange={(e) => setSurfaceTint(Number(e.target.value))}
                    className="w-full appearance-none bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-95 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-200 fill-mode-both">
              <h3 className="text-[11px] font-bold tracking-widest text-slate-800 dark:text-slate-300 uppercase mb-4 flex items-center gap-3">
                Typography
                <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1"></div>
              </h3>
              <div className="space-y-2.5">
                {FONTS.map(font => (
                  <button
                    key={font.id}
                    onClick={() => setActiveFont(font.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-[16px] border transition-all duration-200 ${activeFont === font.id ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-500/10 shadow-sm' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50'
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
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-300 fill-mode-both">
              <h3 className="text-[11px] font-bold tracking-widest text-slate-800 dark:text-slate-300 uppercase mb-5 flex items-center gap-3">
                Privacy & Publication
                <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1"></div>
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
                    onClick={() => {
                      setIsPublished(!isPublished);
                      toast.success(isPublished ? "Page set to Private Draft" : "Page Published Live!", {
                        icon: isPublished ? <Lock className="text-amber-500" size={16} /> : <Check className="text-emerald-500" size={16} />
                      });
                    }}
                    className={`relative w-10 h-6 shrink-0 rounded-full transition-colors duration-300 outline-none focus:ring-2 focus:ring-blue-500/50 ${isPublished ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                  >
                    <div className={`absolute top-1 left-1 size-4 rounded-full bg-white shadow-sm transition-all duration-300 ease-in-out ${isPublished ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                  </button>
                </div>

                {isPublished && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`moku.com/${user?.username}`);
                        toast.success("Public link copied!");
                      }}
                      className="w-full py-2.5 rounded-[12px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm cursor-pointer"
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
