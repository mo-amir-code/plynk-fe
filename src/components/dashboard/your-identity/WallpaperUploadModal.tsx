"use client";

import { ChangeEvent, useRef } from "react";
import { Check, Palette, RefreshCcw, Upload, X } from "lucide-react";
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

    if (!file.type.startsWith("image/") && file.type !== "image/svg+xml") {
      toast.error("Please select a valid image file (JPEG, PNG, SVG, or WebP)");
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
    <div className="fixed inset-0 z-65 flex items-center justify-center px-4 overflow-hidden">
      {/* Heavy Backdrop for Focus */}
      <button
        type="button"
        aria-label="Close wallpaper upload modal"
        onClick={close}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500"
      />

      {/* Modal Container - Obsidian Tech Theme */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/5 bg-[#020617] shadow-[0_48px_100px_-24px_rgba(0,0,0,1)] animate-in fade-in slide-in-from-bottom-12 duration-500 ease-out">
        
        {/* Elite Edge Highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="p-8 sm:p-10 space-y-8">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shadow-inner overflow-hidden relative">
                <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                <Upload size={24} className="text-primary relative z-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Upload Asset</h3>
                <p className="mt-1 text-[10px] font-black tracking-widest text-slate-500">Select an image and we&apos;ll add it to your assets.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={close}
              className="size-10 rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          <input 
            ref={inputRef} 
            type="file" 
            accept=".jpeg,.jpg,.png,.svg,.webp" 
            className="hidden" 
            onChange={handleFileChange} 
          />

          {/* Interactive Asset Canvas */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="group relative w-full overflow-hidden rounded-[2rem] bg-slate-900/50 border border-white/5 p-5 text-left transition-all hover:bg-slate-900/80 hover:border-primary/20 active:opacity-90 cursor-pointer"
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {/* Preview Layer */}
              <div
                className="relative h-44 sm:h-36 w-full sm:w-52 overflow-hidden rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center bg-slate-950"
              >
                {previewUrl ? (
                    <div 
                        className="absolute inset-0 bg-center bg-cover bg-no-repeat transition-transform duration-1000" 
                        style={{ backgroundImage: `url("${previewUrl}")` }} 
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 text-slate-600">
                        <Palette size={28} strokeWidth={1.5} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Choose Asset</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Meta Section */}
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-sm font-bold text-white">Click to select asset</p>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">Supports JPEG, JPG, PNG, SVG, and WebP up to 5MB.</p>
                </div>

                <div className="rounded-xl border border-white/5 bg-black/40 px-4 py-3 text-[11px] font-bold tracking-tight">
                  {selectedFile ? (
                    <div className="flex items-center gap-2">
                      <Check className="text-emerald-500" size={14} />
                      <span className="text-white truncate max-w-[150px]">{selectedFile.name}</span>
                    </div>
                  ) : (
                    <span className="text-slate-600 italic">No asset selected yet...</span>
                  )}
                </div>
              </div>
            </div>
          </button>

          {/* Action Layer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={close}
              className="px-6 h-12 rounded-2xl text-[11px] font-medium capitalize tracking-widest text-slate-500 hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onUpload}
              disabled={!selectedFile || isUploading}
              className="inline-flex items-center gap-3 px-8 h-12 rounded-xl bg-primary text-white text-sm font-medium capitalize transition-all hover:brightness-110 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_10px_30px_-10px_rgba(255,77,0,0.4)]"
            >
              {isUploading ? <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload size={16} strokeWidth={2.5} />}
              {isUploading ? "Uploading..." : "Upload Asset"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
