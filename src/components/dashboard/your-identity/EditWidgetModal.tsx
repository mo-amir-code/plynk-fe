import type { EditWidgetModalProps } from "@/types/components/dashboard/your-identity";
import { X, Save } from "lucide-react";

export function EditWidgetModal({
  isOpen,
  onClose,
  editHandle,
  setEditHandle,
  editTitle,
  setEditTitle,
  editSubTitle,
  setEditSubTitle,
  widgetType,
  onSave,
}: EditWidgetModalProps) {
  if (!isOpen) return null;

  const isCustomWidget = widgetType === "custom";

  const cleanHandle = (value: string) => {
    // For custom widgets, allow full URLs without cleaning
    if (isCustomWidget) {
      return value.trim();
    }

    let cleaned = value.trim();
    
    if (cleaned.includes('/') || cleaned.includes('www.') || cleaned.includes('http')) {
      try {
        const parts = cleaned.split('/');
        const significantParts = parts.filter(p => p && !p.includes('.') && !p.includes(':'));
        if (significantParts.length > 0) {
          cleaned = significantParts[significantParts.length - 1];
        } else {
          cleaned = parts[parts.length - 1];
        }
        
        cleaned = cleaned.replace(/^@/, '');
        cleaned = cleaned.split('.')[0];
      } catch (e) {
      }
    } else {
      cleaned = cleaned.replace(/^@/, '');
    }
    
    return cleaned;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close edit widget modal"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300"
      />
      
      <div className="relative z-10 w-full max-w-sm bg-[#020617] rounded-[2.5rem] border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-500 ease-out max-h-[90vh] overflow-y-auto">
        {/* Top Accent Light Leak */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
        
        {/* Header Section */}
        <div className="px-8 pt-8 pb-6 bg-linear-to-b from-white/5 to-transparent border-b border-white/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight leading-none">Edit Widget</h2>
              <p className="mt-2 text-[10px] font-bold capitalize tracking-[0.1em] text-slate-500">Configure Widget Details</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="size-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="px-8 py-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1">
              {isCustomWidget ? "Custom URL" : "Network Handle"}
            </label>
            <div className="relative group">
               <input
                value={editHandle}
                onChange={(event) => setEditHandle(cleanHandle(event.target.value))}
                placeholder={isCustomWidget ? "e.g., https://example.com" : "Enter username only"}
                className="w-full h-12 px-4 rounded-2xl bg-white/5 border border-white/5 outline-none text-sm text-white placeholder:text-slate-700 transition-all focus:border-primary/30 focus:shadow-[0_0_20px_rgba(255,77,0,0.1)]"
              />
            </div>
            <p className="text-[9px] text-slate-600 font-medium ml-1">
              {isCustomWidget 
                ? "Enter the complete URL for your custom link (e.g., https://example.com)."
                : "Avoid entering full links. Just enter the username (e.g. 'johndoe')."
              }
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1">
              Title
            </label>
            <div className="relative group">
              <input
                value={editTitle}
                onChange={(event) => setEditTitle(event.target.value)}
                placeholder="e.g., Instagram, GitHub, YouTube"
                className="w-full h-12 px-4 rounded-2xl bg-white/5 border border-white/5 outline-none text-sm text-white placeholder:text-slate-700 transition-all focus:border-primary/30 focus:shadow-[0_0_20px_rgba(255,77,0,0.1)]"
              />
            </div>
            <p className="text-[9px] text-slate-600 font-medium ml-1">The main title displayed on the widget.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1">
              Subtitle
            </label>
            <div className="relative group">
              <input
                value={editSubTitle}
                onChange={(event) => setEditSubTitle(event.target.value)}
                placeholder="e.g., Photos & reels, Projects & repos"
                className="w-full h-12 px-4 rounded-2xl bg-white/5 border border-white/5 outline-none text-sm text-white placeholder:text-slate-700 transition-all focus:border-primary/30 focus:shadow-[0_0_20px_rgba(255,77,0,0.1)]"
              />
            </div>
            <p className="text-[9px] text-slate-600 font-medium ml-1">The subtitle displayed below the title.</p>
          </div>
        </div>

        <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 rounded-xl border border-white/5 text-[11px] font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!editHandle.trim()}
            className="h-10 px-6 rounded-xl bg-primary text-white text-[11px] font-bold capitalize tracking-wide cursor-pointer shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <Save size={14} strokeWidth={3} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
