"use client";

import { useEffect, useRef, useState } from "react";
import {
  DashboardSocialWidget,
  DashboardSocialWidgetData,
  SocialPlatform,
} from "@/components/dashboard/widgets/SocialWidget";

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
    style: "gradient",
  }
];

const MAX_PACK_ROWS = 60;
type ResizeDirection = "right" | "bottom" | "corner";

type AddWidgetOption = {
  type: SocialPlatform;
  label: string;
  hint: string;
  defaultHandle: string;
};

const ADD_WIDGET_OPTIONS: AddWidgetOption[] = [
  { type: "instagram", label: "Instagram", hint: "Photos & reels", defaultHandle: "yourname" },
  { type: "facebook", label: "Facebook", hint: "Pages & profiles", defaultHandle: "yourname" },
  { type: "youtube", label: "YouTube", hint: "Channels & videos", defaultHandle: "YourChannel" },
  { type: "twitter", label: "X / Twitter", hint: "Short updates", defaultHandle: "your_handle" },
  { type: "tiktok", label: "TikTok", hint: "Short-form content", defaultHandle: "yourname" },
  { type: "linkedin", label: "LinkedIn", hint: "Professional profile", defaultHandle: "yourname" },
  { type: "github", label: "GitHub", hint: "Projects & repos", defaultHandle: "yourname" },
  { type: "dribbble", label: "Dribbble", hint: "Design showcase", defaultHandle: "yourname" },
];

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

export default function YourIdentityPage() {
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
  const [editName, setEditName] = useState("");
  const [editHandle, setEditHandle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isPreview) return;
    setDraggingId(null);
    setResizing(null);
    setDropPreview(null);
    setIsAddModalOpen(false);
    setEditingWidgetId(null);
  }, [isPreview]);

  // Row height = cell size so that colSize == rowSize → same physical px
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

  const buildReflowedLayout = (
    current: DashboardSocialWidgetData[],
    draggedWidgetId: string,
    preview: { startCol: number; startRow: number; colSize: number; rowSize: number },
  ) => {
    const dragged = current.find((w) => w.id === draggedWidgetId);
    if (!dragged) return current;

    const others = current.filter((w) => w.id !== draggedWidgetId);
    const placed: DashboardSocialWidgetData[] = [
      {
        ...dragged,
        startCol: preview.startCol,
        startRow: preview.startRow,
        colSize: preview.colSize,
        rowSize: preview.rowSize,
      },
    ];

    for (const widget of others) {
      const fit = findFirstFit(widget, placed);
      placed.push({
        ...widget,
        startCol: fit.startCol,
        startRow: fit.startRow,
      });
    }

    const placedById = new Map(placed.map((w) => [w.id, w]));
    return current.map((w) => placedById.get(w.id) ?? w);
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
    const nextLayout = buildReflowedLayout(currentLayout, draggingId, preview);
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

        return buildReflowedLayout(prev, resizing.id, {
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
  const filteredAddWidgetOptions = ADD_WIDGET_OPTIONS.filter((option) => {
    const search = addSearch.trim().toLowerCase();
    if (!search) return true;
    return option.label.toLowerCase().includes(search) || option.hint.toLowerCase().includes(search);
  });

  const openEditModal = (widget: DashboardSocialWidgetData) => {
    setEditingWidgetId(widget.id);
    setEditName(widget.customName ?? "");
    setEditHandle(widget.handle);
  };

  const closeEditModal = () => {
    setEditingWidgetId(null);
    setEditName("");
    setEditHandle("");
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
        style: "gradient",
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

    const trimmedName = editName.trim();

    setWidgets((prev) =>
      prev.map((widget) =>
        widget.id === editingWidgetId
          ? {
            ...widget,
            customName: trimmedName || undefined,
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
      await new Promise((resolve) => setTimeout(resolve, 600));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Enhanced Page header */}
      <div className="mb-8 sm:mb-10">
        <div className="flex flex-col gap-3 mb-2">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Your Identity
            </h1>
            <button
              type="button"
              onClick={() => setIsPreview((prev) => !prev)}
              className={`shrink-0 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs sm:text-sm font-bold border transition-colors ${isPreview
                  ? "bg-primary text-white border-primary"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
                }`}
            >
              <span className="material-symbols-outlined text-[16px] leading-none">
                {isPreview ? "visibility" : "edit"}
              </span>
              {isPreview ? "Preview On" : "Edit Mode"}
            </button>
          </div>
          <p className="text-base sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            {isPreview
              ? "Preview mode: widgets are view-only with links enabled."
              : "Edit mode: drag, resize, and rearrange widgets (links disabled)."}
          </p>
          {!isPreview && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="material-symbols-outlined text-[18px] leading-none">add_circle</span>
                Add Widgets
              </button>
              <button
                type="button"
                onClick={submitWidgets}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-4 py-2 text-sm font-semibold shadow-sm hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                <span className="material-symbols-outlined text-[18px] leading-none">check_circle</span>
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          )}
        </div>
      </div>

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
                  alwaysShowLabel: true,
                }}
                motionOffset={layoutOffsets[w.id]}
                layoutMotionEnabled={layoutMotionEnabled}
                disableLink={!isPreview}
                showEditButton={!isPreview}
                onEditClick={() => openEditModal(w)}
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
          />
        ))}
      </div>

      {!isPreview && isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close add widget modal"
            onClick={() => {
              setIsAddModalOpen(false);
              setAddSearch("");
            }}
            className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">Add Widget</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Choose a social platform to add with default settings.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setAddSearch("");
                }}
                className="rounded-lg p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
              >
                <span className="material-symbols-outlined text-[20px] leading-none">close</span>
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3 py-2">
                <span className="material-symbols-outlined text-[18px] text-slate-400">search</span>
                <input
                  value={addSearch}
                  onChange={(event) => setAddSearch(event.target.value)}
                  placeholder="Search widgets"
                  className="w-full bg-transparent outline-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[54vh] overflow-auto pr-1">
              {filteredAddWidgetOptions.map((option) => (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => addWidget(option)}
                  className="text-left rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 hover:border-primary/60 hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{option.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{option.hint}</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">add</span>
                  </div>
                </button>
              ))}
              {filteredAddWidgetOptions.length === 0 && (
                <div className="col-span-full rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                  No widgets found for this search.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!isPreview && editingWidgetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close edit widget modal"
            onClick={closeEditModal}
            className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Edit Widget</h2>
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-lg p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
              >
                <span className="material-symbols-outlined text-[20px] leading-none">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Display Name</span>
                <input
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  placeholder="Custom widget name"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-primary/70"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Handle</span>
                <input
                  value={editHandle}
                  onChange={(event) => setEditHandle(event.target.value)}
                  placeholder="username"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-primary/70"
                />
              </label>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveWidgetEdits}
                disabled={!editHandle.trim()}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
