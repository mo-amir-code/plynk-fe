import Link from "next/link";
import { Home, Search, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#0A0C10]">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] size-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] size-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse decoration-1000" />
      
      {/* Main Content Card */}
      <div className="z-10 w-full max-w-md px-6 text-center animate-in fade-in zoom-in-95 duration-1000 ease-out">
        <div className="relative inline-flex items-center justify-center p-6 rounded-[32px] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl mb-8 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="size-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6 shadow-inner">
               <AlertCircle size={40} className="text-white/20 animate-pulse" strokeWidth={1.5} />
            </div>
            <h1 className="text-8xl font-black tracking-tighter text-white/90 drop-shadow-2xl">
              404
            </h1>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4">
          Lost in the Cloud?
        </h2>
        <p className="text-slate-400 font-medium text-sm sm:text-base leading-relaxed mb-10 max-w-[320px] mx-auto">
          The page you're looking for doesn't exist or has been moved to a private space.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
          >
            <Home size={18} />
            Take Me Home
          </Link>
          <Link 
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-sm transition-all active:scale-95 backdrop-blur-md"
          >
            <Search size={18} strokeWidth={2.5} />
            Explore Plynk
          </Link>
        </div>

        {/* Brand Link */}
        <div className="mt-20 opacity-30">
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white">
            PLYNK PLATFORM
          </span>
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px' 
        }}
      />
    </div>
  );
}
