import Link from "next/link";
import { PlatformIcon } from "@/components/dashboard/widgets/PlatformIcon";
import { FaXTwitter, FaInstagram, FaDribbble, FaLinkedinIn } from "react-icons/fa6";

export function Hero() {
  return (
    <header className="relative overflow-hidden pt-14 pb-20 md:pt-24 md:pb-32">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-blob" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-orange-300/10 rounded-full blur-[100px] animate-blob delay-300" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-10 items-center">
        {/* Text */}
        <div className="flex flex-col gap-6 md:gap-8">
          <h1 className="animate-fade-up delay-100 text-5xl sm:text-5xl md:text-6xl lg:text-[4.2rem] xl:text-7xl font-black leading-[1.08] tracking-tight text-slate-900 dark:text-slate-100">
            Showcase your world, <br />
            <span className="gradient-text">Exactly your way.</span>
          </h1>
          <p className="animate-fade-up delay-200 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-[500px]">
            Ditch the boring lists. Snap your socials, videos, and projects into a stunning, interactive widget grid in minutes.
          </p>
          <div className="animate-fade-up delay-300 flex flex-wrap gap-4">
            <Link href="/auth/signup" className="inline-block btn-primary px-8 sm:px-12 py-3 sm:py-5 bg-primary text-white rounded-full text-lg sm:text-xl font-bold shadow-2xl shadow-primary/30 transition-transform hover:scale-105 cursor-pointer">
              Get Started
            </Link>
          </div>

          <div className="animate-fade-up delay-400 flex items-center gap-3">
            <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
              Design your digital space in <span className="text-slate-900 dark:text-slate-100 font-bold">under 2 minutes.</span>
            </p>
          </div>
        </div>

        {/* Premium Bento Box */}
        <div className="relative animate-scale-in delay-200 animate-float mt-8 lg:mt-0 w-full max-w-[340px] sm:max-w-[480px] lg:max-w-[540px] mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 sm:grid-rows-4 gap-3 sm:gap-4 sm:aspect-square">
            {/* Profile Bio Card - Large on Desktop, Wide on Mobile */}
            <div className="col-span-2 row-span-1 sm:row-span-2 min-h-[160px] sm:min-h-0 bg-gradient-to-br from-[#2a1310] to-[#120805] rounded-[2rem] sm:rounded-4xl p-5 sm:p-7 shadow-2xl border border-white/5 flex flex-col justify-between transition-transform duration-500 hover:scale-[1.02] overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-50"><span className="material-symbols-outlined text-white/50 text-xl">verified</span></div>
              <div className="size-12 sm:size-16 rounded-full border-2 border-white/20 overflow-hidden shadow-lg mb-3 sm:mb-4">
                <img alt="User portrait" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-1">Hi, I&apos;m Alex.</h3>
                <p className="text-[10px] sm:text-sm text-white/70 leading-relaxed font-medium">Product Designer & Digital Artist based in SF.</p>
              </div>
            </div>

            {/* Twitter/X Card - 1x1 */}
            <div className="col-span-1 row-span-1 aspect-square sm:aspect-auto border border-white/10 dark:border-white/5 bg-[#000000] rounded-[2rem] sm:rounded-4xl flex flex-col items-center justify-center shadow-xl transition-all duration-300 hover:scale-[1.03] overflow-hidden group relative cursor-pointer">
              <div className="absolute inset-0 bg-linear-to-b from-white/20 to-transparent pointer-events-none" />
              <div className="relative z-10 size-12 sm:size-16 rounded-full flex items-center justify-center shadow-xl backdrop-blur-md border border-white/20 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 bg-white/20 dark:bg-white/10">
                <FaXTwitter className="text-[24px] sm:text-[30px] text-white" />
              </div>
              <div className="absolute bottom-2 sm:bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-20">
                <span className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-md">Twitter</span>
              </div>
            </div>

            {/* Dribbble Card - 1x1 */}
            <div className=" col-span-1 row-span-1 aspect-square sm:aspect-auto border border-white/10 dark:border-white/5 bg-[#ea4c89] rounded-[2rem] sm:rounded-4xl flex flex-col items-center justify-center shadow-xl transition-all duration-300 hover:scale-[1.03] overflow-hidden group relative cursor-pointer">
              <div className="absolute inset-0 bg-linear-to-b from-white/20 to-transparent pointer-events-none" />
              <div className="relative z-10 size-12 sm:size-16 rounded-full flex items-center justify-center shadow-xl backdrop-blur-md border border-white/20 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 bg-white/20 dark:bg-white/10">
                <FaDribbble className="text-[24px] sm:text-[30px] text-white" />
              </div>
              <div className="absolute bottom-2 sm:bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-20">
                <span className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-md">Dribbble</span>
              </div>
            </div>

            {/* LinkedIn Card - 1x1 */}
            <div className="col-span-1 row-span-1 aspect-square sm:aspect-auto border border-white/10 dark:border-white/5 bg-linear-to-br from-[#4A8BF5] to-[#0a66c2] rounded-[2rem] sm:rounded-4xl flex flex-col items-center justify-center shadow-xl transition-all duration-300 hover:scale-[1.03] overflow-hidden group relative cursor-pointer">
              <div className="absolute inset-0 bg-linear-to-b from-white/20 to-transparent pointer-events-none" />
              <div className="relative z-10 size-12 sm:size-16 rounded-full flex items-center justify-center shadow-xl backdrop-blur-md border border-white/20 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 bg-white/20 dark:bg-white/10">
                <FaLinkedinIn className="text-[24px] sm:text-[30px] text-white" />
              </div>
              <div className="absolute bottom-2 sm:bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-20">
                <span className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-md">LinkedIn</span>
              </div>
            </div>

            {/* Instagram Card - 1x1 */}
            <div className="col-span-1 row-span-1 aspect-square sm:aspect-auto border border-white/10 dark:border-white/5 bg-linear-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-[2rem] sm:rounded-4xl flex flex-col items-center justify-center shadow-xl transition-all duration-300 hover:scale-[1.03] overflow-hidden group relative cursor-pointer">
              <div className="absolute inset-0 bg-linear-to-b from-white/20 to-transparent pointer-events-none" />
              <div className="relative z-10 size-12 sm:size-16 rounded-full flex items-center justify-center shadow-xl backdrop-blur-md border border-white/20 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 bg-white/20 dark:bg-white/10">
                <FaInstagram className="text-[24px] sm:text-[30px] text-white" />
              </div>
              <div className="absolute bottom-2 sm:bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-20">
                <span className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-md">Instagram</span>
              </div>
            </div>

            {/* Latest Video Card - 2x2 */}
            <div className="col-span-2 row-span-1 sm:row-span-2 min-h-[150px] sm:min-h-0 bg-linear-to-br from-slate-800 to-slate-900 rounded-[2rem] sm:rounded-4xl p-5 sm:p-7 shadow-2xl border border-slate-700/50 flex flex-col justify-end transition-transform duration-500 hover:scale-[1.02] overflow-hidden relative group text-left cursor-pointer">
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              <img alt="Abstract Art" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop" />
              <div className="relative z-20">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/90 backdrop-blur-md rounded-lg text-[8px] sm:text-[10px] font-black text-white uppercase tracking-wider mb-2 shadow-lg">
                  <span className="material-symbols-outlined text-[12px] leading-none">play_arrow</span>
                  NEW VIDEO
                </span>
                <h3 className="text-base sm:text-lg md:text-2xl font-black text-white leading-tight drop-shadow-md">Behind the scenes: My 2024 Studio Build</h3>
              </div>
            </div>

            {/* Music Player Card - Wide 2x1 */}
            <div className="col-span-2 row-span-1 min-h-[85px] sm:min-h-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-[2rem] sm:rounded-4xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 shadow-xl border border-white dark:border-slate-700 transition-transform duration-500 hover:scale-[1.02]">
              <div className="size-10 sm:size-14 rounded-xl sm:rounded-2xl bg-slate-900 overflow-hidden shrink-0 shadow-md relative group/play">
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/play:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white text-[20px] sm:text-[24px]">play_arrow</span>
                </div>
                <img alt="Album" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
                  <span className="size-1.5 sm:size-2 rounded-full bg-[#1db954] animate-pulse" />
                  <span className="text-[7px] sm:text-[9px] font-black text-[#1db954] uppercase tracking-widest">Now Playing</span>
                </div>
                <h4 className="font-bold text-[11px] sm:text-sm md:text-base text-slate-900 dark:text-slate-100 truncate leading-tight">Midnight City</h4>
                <p className="text-[8px] sm:text-[10px] md:text-xs text-slate-500 truncate mt-0.5">M83 • Hurry Up, We&apos;re Dreaming</p>
              </div>
              <div className="hidden sm:flex items-end gap-0.5 sm:gap-1 h-6 sm:h-8 mr-2 shrink-0">
                {[3, 7, 4, 8, 5].map((h, i) => (
                  <div key={i} className="w-1 sm:w-1.5 bg-[#1db954]/80 rounded-full animate-[bounce_1.5s_infinite]" style={{ height: `${h * 12}%`, animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>

            {/* Portfolio Icon - 1x1 */}
            <div className="col-span-1 row-span-1 aspect-square sm:aspect-auto bg-slate-100 dark:bg-slate-800 rounded-[2rem] sm:rounded-4xl flex flex-col items-center justify-center shadow-xl border border-slate-200 dark:border-slate-700 transition-transform duration-500 hover:scale-[1.03] group cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-b from-white/40 to-transparent pointer-events-none" />
              <div className="relative z-10 size-12 sm:size-14 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center mb-1.5 sm:mb-2 shadow-inner text-primary transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1">
                <span className="material-symbols-outlined text-[24px] sm:text-[28px] leading-none drop-shadow-md">public</span>
              </div>
              <span className="text-[8px] sm:text-[10px] md:text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest transition-transform duration-500 group-hover:translate-y-1 opacity-100 group-hover:opacity-0">Portfolio</span>
              
              <div className="absolute bottom-2 sm:bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-20">
                <span className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-wider">Explore</span>
              </div>
            </div>

            {/* Made with Glass - 1x1 */}
            <div className="col-span-1 row-span-1 aspect-square sm:aspect-auto bg-primary text-white rounded-[2rem] sm:rounded-4xl flex flex-col items-center justify-center shadow-xl border border-primary/20 transition-transform duration-500 hover:scale-[1.03] group cursor-pointer overflow-hidden relative">
              <div className="absolute inset-0 bg-linear-to-b from-white/30 to-transparent pointer-events-none" />
              <div className="relative z-10 size-12 sm:size-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-1.5 sm:mb-2 border border-white/20 shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1">
                <span className="material-symbols-outlined text-white text-[24px] sm:text-[28px]">widgets</span>
              </div>
              <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black text-white/80 uppercase tracking-widest transition-opacity duration-300 group-hover:opacity-0 mb-0.5">Built With</span>
              <span className="text-[9px] sm:text-[10px] md:text-[12px] font-black text-white uppercase tracking-widest transition-opacity duration-300 group-hover:opacity-0">PLYNK</span>

              <div className="absolute bottom-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-20">
                <span className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-md">Get Yours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
