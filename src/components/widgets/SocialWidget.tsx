import React from 'react';
import type { SocialWidgetProps } from "@/types/components/widgets";

export function SocialWidget({
  platform,
  icon,
  url = '#',
  containerClass = 'bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 hover:shadow-2xl',
  overlayClass,
  arrowClass = 'text-slate-400 dark:text-slate-500',
  iconContainerClass = 'bg-slate-900 dark:bg-slate-100',
  iconColorClass = 'text-white dark:text-slate-900',
  iconCustomStyle,
  textClass = 'group-hover:text-primary'
}: SocialWidgetProps) {
  return (
    <a href={url} className={`group relative col-span-1 row-span-1 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center transition-all duration-500 hover:scale-105 hover:-translate-y-1 cursor-pointer min-h-[120px] sm:min-h-[140px] overflow-hidden ${containerClass}`}>
      {overlayClass && (
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${overlayClass}`} />
      )}
      <div className="absolute top-4 sm:top-5 right-4 sm:right-5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
        <span className={`material-symbols-outlined text-sm sm:text-base ${arrowClass}`}>arrow_outward</span>
      </div>
      <div className={`size-10 sm:size-12 rounded-full flex items-center justify-center mb-2 shadow-md group-hover:scale-110 transition-transform duration-500 ${iconContainerClass}`} style={iconCustomStyle}>
        {typeof icon === 'string' ? (
          <span className={`material-symbols-outlined text-[20px] sm:text-[24px] leading-none ${iconColorClass}`}>{icon}</span>
        ) : icon}
      </div>
      <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest relative z-10 transition-colors duration-300 text-slate-900 dark:text-slate-100 ${textClass}`}>
        {platform}
      </span>
    </a>
  );
}
