import React from 'react';
import type { SocialWidgetProps } from "@/types/components/widgets";

export function SocialWidget({
  platform,
  icon,
  url = '#',
  username = '@johndoe',
  containerClass = 'bg-slate-100 dark:bg-slate-800',
  overlayClass, // Kept for API compatibility, but we rely on container gradients mostly now
  arrowClass, // Unused in this design
  iconContainerClass = 'bg-white/20 dark:bg-white/10',
  iconColorClass = 'text-white',
  iconCustomStyle,
  textClass = ''
}: SocialWidgetProps) {
  return (
    <a 
      href={url} 
      onClick={(e) => { if(url === '#') e.preventDefault(); }}
      className={`group relative col-span-1 row-span-1 aspect-square rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 cursor-pointer overflow-hidden shadow-lg ${containerClass}`}
    >
      {/* Light Reflection / Glass Sheen Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

      {/* The Central Glassmorphic Circle */}
      <div 
        className={`relative z-10 size-[84px] sm:size-[96px] rounded-full flex items-center justify-center shadow-xl backdrop-blur-md border border-white/20 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 ${iconContainerClass}`} 
        style={iconCustomStyle}
      >
        {typeof icon === 'string' ? (
          <i className={`${icon} text-[36px] sm:text-[42px] leading-none ${iconColorClass}`} />
        ) : (
          <div className={`${iconColorClass} flex items-center justify-center`}>{icon}</div>
        )}
      </div>

      {/* The Floating @Username Pill (Shown on Hover) */}
      <div className={`absolute bottom-4 mx-auto flex flex-col items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-xl rounded-2xl px-5 py-2 border border-white/10 shadow-lg transform transition-all duration-500 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 z-20 ${textClass}`}>
        <span className="text-xs sm:text-sm font-bold text-white tracking-wide leading-tight">
          {platform}
        </span>
        <span className="text-[10px] sm:text-xs text-white/70 font-medium">
          {username}
        </span>
      </div>
    </a>
  );
}
