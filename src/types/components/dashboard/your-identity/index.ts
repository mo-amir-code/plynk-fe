import type { SocialPlatform } from "@/types/components/dashboard/widgets";

export type AddWidgetOption = {
  type: SocialPlatform;
  label: string;
  hint: string;
  defaultHandle: string;
};

export interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (option: AddWidgetOption) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export interface EditWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  editHandle: string;
  setEditHandle: (val: string) => void;
  onSave: () => void;
}

export type WallpaperUploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectFile: (file: File | null) => void;
  onUpload: () => void;
  selectedFile: File | null;
  previewUrl: string | null;
  isUploading: boolean;
};

export type Wallpaper = {
  id: string;
  background: string;
};

export type ThemeConfig = {
  id: string;
  name: string;
  frostIntensity: number;
  surfaceTint: number;
  fontStyle: string;
  wallpaper: string;
};

export type ResizeDirection = "right" | "bottom" | "corner";

export type MobilePlacement = {
  index: number;
  startRow: number;
  startCol: number;
  rowSpan: number;
  colSpan: number;
};

export type SyncStatus = "idle" | "saving" | "saved" | "error";

export interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}
