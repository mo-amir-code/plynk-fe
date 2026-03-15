import { SocialPlatform } from "@/components/dashboard/widgets/SocialWidget";

export type AddWidgetOption = {
  type: SocialPlatform;
  label: string;
  hint: string;
  defaultHandle: string;
};

export const ADD_WIDGET_OPTIONS: AddWidgetOption[] = [
  { type: "instagram", label: "Instagram", hint: "Photos & reels", defaultHandle: "yourname" },
  { type: "facebook", label: "Facebook", hint: "Pages & profiles", defaultHandle: "yourname" },
  { type: "youtube", label: "YouTube", hint: "Channels & videos", defaultHandle: "YourChannel" },
  { type: "twitter", label: "X / Twitter", hint: "Short updates", defaultHandle: "your_handle" },
  { type: "tiktok", label: "TikTok", hint: "Short-form content", defaultHandle: "yourname" },
  { type: "linkedin", label: "LinkedIn", hint: "Professional profile", defaultHandle: "yourname" },
  { type: "github", label: "GitHub", hint: "Projects & repos", defaultHandle: "yourname" },
  { type: "dribbble", label: "Dribbble", hint: "Design showcase", defaultHandle: "yourname" },
];

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
  if (!isOpen) return null;

  const filteredOptions = ADD_WIDGET_OPTIONS.filter((option) => {
    const search = searchQuery.trim().toLowerCase();
    if (!search) return true;
    return option.label.toLowerCase().includes(search) || option.hint.toLowerCase().includes(search);
  });

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
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3 py-2">
            <span className="material-symbols-outlined text-[18px] text-slate-400">search</span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search widgets"
              className="w-full bg-transparent outline-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[54vh] overflow-auto pr-1">
          {filteredOptions.map((option) => (
            <button
              key={option.type}
              type="button"
              onClick={() => onAdd(option)}
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
