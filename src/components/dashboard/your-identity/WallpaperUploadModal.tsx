"use client";

import { ChangeEvent, useRef } from "react";
import { Check, RefreshCcw, Upload, X } from "lucide-react";
import { toast } from "sonner";
import type { WallpaperUploadModalProps } from "@/types/components/dashboard/your-identity";

export function WallpaperUploadModal({
  isOpen,
  onClose,
  onSelectFile,
  onUpload,
  selectedFile,
  previewUrl,
  isUploading,
}: WallpaperUploadModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      event.target.value = "";
      return;
    }

    onSelectFile(file);
  };

  const close = () => {
    onSelectFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-65 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close wallpaper upload modal"
        onClick={close}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-white/10 bg-white/95 dark:bg-slate-950/95 shadow-[0_30px_90px_-25px_rgba(15,23,42,0.6)] dark:shadow-[0_30px_90px_-25px_rgba(0,0,0,0.8)]">
        <div className="h-1.5 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-cyan-400" />

        <div className="p-6 sm:p-7 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center">
                <Upload size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">Upload Asset</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Select an image and we&apos;ll add it to your assets.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={close}
              className="size-9 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-center transition-all"
            >
              <X size={16} strokeWidth={3} />
            </button>
          </div>

          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="group relative w-full overflow-hidden rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/60 p-4 text-left transition-all hover:border-blue-400 dark:hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-500/5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div
                className="relative h-36 sm:h-32 w-full sm:w-44 overflow-hidden rounded-2xl border border-white/70 dark:border-slate-700 shadow-sm"
                style={{
                  background: previewUrl
                    ? `url("${previewUrl}") center/cover no-repeat`
                    : "linear-gradient(135deg, rgba(59,130,246,0.95), rgba(79,70,229,0.92))",
                }}
              >
                {!previewUrl && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/95">
                    <span className="material-symbols-outlined text-[30px]">photo_library</span>
                    <span className="text-[11px] font-black uppercase tracking-[0.22em]">Choose asset</span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Click to pick an asset</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">PNG, JPG, WebP, or GIF.</p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                  {selectedFile ? (
                    <>
                      <span className="block font-bold text-slate-700 dark:text-slate-200">Selected asset</span>
                      <span className="block mt-1 break-all">{selectedFile.name}</span>
                    </>
                  ) : (
                    <span>No file selected yet.</span>
                  )}
                </div>
              </div>
            </div>
          </button>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={close}
              className="px-4 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onUpload}
              disabled={!selectedFile || isUploading}
              className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-linear-to-r from-blue-500 to-indigo-500 text-sm font-black text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isUploading ? <RefreshCcw size={16} className="animate-spin" /> : <Check size={16} strokeWidth={3} />}
              {isUploading ? "Uploading..." : "Upload Asset"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
