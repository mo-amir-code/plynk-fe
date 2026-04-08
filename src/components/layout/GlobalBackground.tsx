"use client";

import { useEffect, useRef } from "react";

export function GlobalBackground() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let animationFrameId: number;
    const handleScroll = () => {
      if (parallaxRef.current) {
        // Deep drift based on scroll
        parallaxRef.current.style.transform = `translateY(${window.scrollY * -0.2}px)`;
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#fafafa] dark:bg-black">
      {/* Vercel/Linear Style Premium Noise Texture Overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.06] mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      {/* Enterprise Dot Matrix */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.06)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_1px,transparent_1px)]" 
        style={{ backgroundSize: '48px 48px' }} 
      />
      {/* Radial soft mask so grid only appears in the center focus area */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#fafafa_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />

      {/* Extreme fidelity mesh gradient orbs */}
      <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute top-[30%] -right-[20%] w-[70vw] h-[70vw] bg-rose-500/10 dark:bg-rose-500/15 rounded-full blur-[180px] animate-pulse" style={{ animationDuration: '14s' }} />
      <div className="absolute -bottom-[20%] left-[10%] w-[50vw] h-[50vw] bg-orange-500/10 dark:bg-orange-500/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '12s' }} />

      {/* Massive Architectural Parallax Elements */}
      <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
        {/* Subtle glowing rings and hollow architectures */}
        <div className="absolute top-[10%] left-[2%] w-[800px] h-[800px] border border-slate-900/5 dark:border-white/5 rounded-full" />
        <div className="absolute top-[25%] right-[5%] w-[600px] h-[600px] border border-slate-900/5 dark:border-white/5 rounded-full" />
        
        <div className="absolute top-[60%] left-[10%] w-[400px] h-[400px] border-[3px] border-primary/5 dark:border-primary/10 rounded-[4rem] rotate-45" />
        <div className="absolute top-[80%] right-[15%] w-[500px] h-[500px] border border-blue-500/10 dark:border-blue-500/10 rounded-full" />
      </div>
    </div>
  );
}
