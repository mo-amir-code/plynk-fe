import { WIDGET_TYPE_CONFIG, SOCIAL_PLATFORMS } from "@/components/dashboard/widgets/widget-config";
import { useEffect, useRef, useState } from "react";
import type { AddWidgetModalProps, AddWidgetOption } from "@/types/components/dashboard/your-identity";
import { Search, X, Plus } from "lucide-react";

export const ADD_WIDGET_OPTIONS: AddWidgetOption[] = SOCIAL_PLATFORMS.map((type) => ({
  type,
  label: WIDGET_TYPE_CONFIG[type].label,
  hint: WIDGET_TYPE_CONFIG[type].hint,
  defaultHandle: WIDGET_TYPE_CONFIG[type].defaultHandle,
}));

export function AddWidgetModal({
  isOpen,
  onClose,
  onAdd,
  searchQuery,
  setSearchQuery,
}: AddWidgetModalProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
        setSelectedIndex(0);
      }, 50);
    }
  }, [isOpen]);

  const filteredOptions = ADD_WIDGET_OPTIONS.filter((option) => {
    const search = searchQuery.trim().toLowerCase();
    if (!search) return true;
    return option.label.toLowerCase().includes(search) || option.hint.toLowerCase().includes(search);
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const cols = window.innerWidth >= 640 ? 2 : 1;
    const maxIndex = filteredOptions.length - 1;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + cols, maxIndex));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - cols, 0));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, maxIndex));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions[selectedIndex]) {
        onAdd(filteredOptions[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close add widget modal"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300"
      />
      
      <div className="relative z-10 w-full max-w-2xl bg-[#020617] rounded-[2rem] border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-500 ease-out">
        {/* Top Accent Light Leak */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
        
        {/* Header Section */}
        <div className="px-8 pt-8 pb-6 bg-linear-to-b from-white/5 to-transparent border-b border-white/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight leading-none">Add Widget</h2>
              <p className="mt-2 text-[10px] font-bold capitalize tracking-[0.1em] text-slate-500">Choose a social platform to add with default settings.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer shadow-inner"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          <div className="mt-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-primary" size={16} />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search widgets (e.g. Instagram, YouTube)"
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/5 outline-none text-sm text-white placeholder:text-slate-600 transition-all focus:border-primary/30 focus:shadow-[0_0_20px_rgba(255,77,0,0.1)]"
              />
            </div>
          </div>
        </div>

        {/* Option Grid */}
        <div className="px-8 py-8 flex-1 max-h-[50vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredOptions.map((option, index) => (
              <button
                key={option.type}
                type="button"
                onClick={() => onAdd(option)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`text-left rounded-2xl border transition-all p-5 flex items-center gap-4 group ${selectedIndex === index
                    ? 'border-primary/50 bg-primary/10 shadow-[0_10px_30px_-10px_rgba(255,77,0,0.2)] cursor-pointer'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10'
                  }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-white tracking-tight">{option.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed font-medium line-clamp-1">{option.hint}</p>
                </div>
                <div className={`size-10 rounded-xl border flex items-center justify-center transition-all ${selectedIndex === index ?  'border-primary text-white scale-100 shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 group-hover:scale-105'}`}>
                   <Plus size={18} strokeWidth={3} />
                </div>
              </button>
            ))}
          </div>

          {filteredOptions.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
              <div className="size-16 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-600">
                 <Search size={32} strokeWidth={1} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">No widgets found for this search.</p>
                <p className="mt-1 text-[11px] text-slate-500 capitalize tracking-wide leading-loose">Adjust your parameters or search query</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer Hint */}
        <div className="px-8 py-5 bg-white/[0.02] border-t border-white/5 flex items-center justify-center">
           <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-600 flex items-center gap-2">
             <span className="inline-flex gap-1">
               <span className="px-1.5 py-0.5 rounded-md border border-white/10 bg-white/5">↑</span>
               <span className="px-1.5 py-0.5 rounded-md border border-white/10 bg-white/5">↓</span>
             </span>
             Navigate with keyboard
           </p>
        </div>
      </div>
    </div>
  );
}

