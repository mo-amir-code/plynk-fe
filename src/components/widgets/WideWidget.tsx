import React from 'react';

export interface WideWidgetProps {
  title: string;
  icon: string | React.ReactNode;
  url?: string;
  containerClass?: string;
  overlayClass?: string;
  arrowClass?: string;
  iconContainerClass?: string;
  iconColorClass?: string;
  iconCustomStyle?: React.CSSProperties;
  textClass?: string;
}

export function WideWidget({
  title,
  icon,
  url = '#',
  containerClass = 'bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl',
  overlayClass,
  arrowClass = 'text-slate-500 dark:text-slate-400',
  iconContainerClass = 'bg-slate-900 dark:bg-slate-100',
  iconColorClass = 'text-white dark:text-slate-900',
  iconCustomStyle,
  textClass = 'group-hover:text-primary text-slate-900 dark:text-slate-100'
}: WideWidgetProps) {
  return (
    <a href={url} className={`group relative col-span-2 row-span-1 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center gap-3 sm:gap-4 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer min-h-[100px] sm:min-h-[120px] overflow-hidden ${containerClass}`}>
      {overlayClass && (
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${overlayClass}`} />
      )}
      <div className="absolute top-1/2 -mt-2 sm:-mt-3 right-6 sm:right-8 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
        <span className={`material-symbols-outlined text-xl sm:text-2xl ${arrowClass}`}>arrow_forward</span>
      </div>
      <div className="relative z-10 flex items-center gap-3 sm:gap-4 group-hover:-translate-x-3 sm:group-hover:-translate-x-4 transition-transform duration-500">
        <div className={`size-10 sm:size-12 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-500 ${iconContainerClass}`} style={iconCustomStyle}>
          {typeof icon === 'string' ? (
             <span className={`material-symbols-outlined text-[20px] sm:text-[24px] leading-none ${iconColorClass}`}>{icon}</span>
          ) : icon}
        </div>
        <span className={`text-sm sm:text-base font-black uppercase tracking-widest transition-colors duration-300 ${textClass}`}>
          {title}
        </span>
      </div>
    </a>
  );
}
