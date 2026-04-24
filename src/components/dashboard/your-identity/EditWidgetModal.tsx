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

  /* ─── shared input style ─── */
  const inputCls =
    "w-full h-12 px-4 rounded-2xl outline-none text-sm font-medium transition-all " +
    "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 " +
    "dark:bg-white/5 dark:border-white/5 dark:text-white dark:placeholder:text-slate-700 dark:focus:border-primary/30 dark:focus:ring-0 dark:focus:shadow-[0_0_20px_rgba(255,77,0,0.1)]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close edit widget modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 dark:bg-slate-950/60 backdrop-blur-md transition-opacity duration-300"
      />

      <div className="relative z-10 w-full max-w-sm bg-white dark:bg-[#020617] rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-500 ease-out max-h-[90vh] overflow-y-auto">
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

        {/* Header */}
        <div className="px-8 pt-8 pb-6 bg-linear-to-b from-slate-50 dark:from-white/5 to-transparent border-b border-slate-100 dark:border-white/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">Edit Widget</h2>
              <p className="mt-2 text-[10px] font-bold capitalize tracking-[0.1em] text-slate-500">Configure Widget Details</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="size-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all cursor-pointer"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Fields */}
        <div className="px-8 py-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1">
              {isCustomWidget ? "Custom URL" : "Network Handle"}
            </label>
            <input
              value={editHandle}
              onChange={(event) => setEditHandle(cleanHandle(event.target.value))}
              placeholder={isCustomWidget ? "e.g., https://example.com" : "Enter username only"}
              className={inputCls}
            />
            <p className="text-[9px] text-slate-400 font-medium ml-1">
              {isCustomWidget
                ? "Enter the complete URL for your custom link (e.g., https://example.com)."
                : "Avoid entering full links. Just enter the username (e.g. 'johndoe')."}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1">Title</label>
            <input
              value={editTitle}
              onChange={(event) => setEditTitle(event.target.value)}
              placeholder="e.g., Instagram, GitHub, YouTube"
              className={inputCls}
            />
            <p className="text-[9px] text-slate-400 font-medium ml-1">The main title displayed on the widget.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1">Subtitle</label>
            <input
              value={editSubTitle}
              onChange={(event) => setEditSubTitle(event.target.value)}
              placeholder="e.g., Photos & reels, Projects & repos"
              className={inputCls}
            />
            <p className="text-[9px] text-slate-400 font-medium ml-1">The subtitle displayed below the title.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 rounded-xl border border-slate-200 dark:border-white/5 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
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
