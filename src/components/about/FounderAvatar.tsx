"use client";

import { useState } from "react";

interface FounderAvatarProps {
  src: string;
  alt: string;
  fallback: string;
  className?: string;
  initialsClassName?: string;
}

export function FounderAvatar({ src, alt, fallback, className = "", initialsClassName = "" }: FounderAvatarProps) {
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!error ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setError(true)}
        />
      ) : (
        <div className={`absolute inset-0 flex items-center justify-center font-black ${initialsClassName}`}>
          {fallback}
        </div>
      )}
    </div>
  );
}
