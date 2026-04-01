'use client';

import { SocialPlatform, WIDGET_TYPE_CONFIG, SOCIAL_PLATFORMS } from "@/components/dashboard/widgets/widget-config";
import { useEffect, useRef, useState } from "react";

export type AddWidgetOption = {
  type: SocialPlatform;
  label: string;
  hint: string;
  defaultHandle: string;
};

export const ADD_WIDGET_OPTIONS: AddWidgetOption[] = SOCIAL_PLATFORMS.map((type) => ({
  type,
  label: WIDGET_TYPE_CONFIG[type].label,
  hint: WIDGET_TYPE_CONFIG[type].hint,
  defaultHandle: WIDGET_TYPE_CONFIG[type].defaultHandle,
}));

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (option: AddWidgetOption) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

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
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
          >
            <span className="material-symbols-outlined text-[20px] leading-none">close</span>
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 focus-within:ring-2 focus-within:ring-primary/50 transition-shadow">
            <span className="material-symbols-outlined text-[18px] text-slate-400">search</span>
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search widgets"
              className="w-full bg-transparent outline-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[54vh] overflow-auto pr-1">
          {filteredOptions.map((option, index) => (
            <button
              key={option.type}
              type="button"
              onClick={() => onAdd(option)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`text-left rounded-2xl border transition-colors px-4 py-3 ${selectedIndex === index
                  ? 'border-primary/60 bg-primary/5 dark:bg-primary/10 ring-1 ring-primary/30'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary/40'
                }`}
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
          {filteredOptions.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
              No widgets found for this search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
