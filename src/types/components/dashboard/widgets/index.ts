import type React from "react";

export type SocialPlatform =
  | "instagram"
  | "facebook"
  | "youtube"
  | "twitter"
  | "tiktok"
  | "linkedin"
  | "github"
  | "dribbble";

export type WidgetTypeConfig = {
  label: string;
  hint: string;
  defaultHandle: string;
  background: string;
  url: (handle: string) => string;
};

export interface DashboardSocialWidgetData {
  id: string;
  type: SocialPlatform;
  handle: string;
  startCol: number;
  startRow: number;
  colSize: number;
  rowSize: number;
}

export interface DashboardSocialWidgetProps {
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
  forceShowLabel?: boolean;
}
