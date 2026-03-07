export function Hero() {
  return (
    <header className="relative overflow-hidden pt-14 pb-20 md:pt-24 md:pb-32">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-blob" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-orange-300/10 rounded-full blur-[100px] animate-blob delay-300" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Text */}
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="animate-fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Now with AI-Powered Layouts
          </div>
          <h1 className="animate-fade-up delay-100 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.08] tracking-tight text-slate-900 dark:text-slate-100">
            Your Digital Identity,<br/>
            <span className="gradient-text">Architected with Widgets</span>
          </h1>
          <p className="animate-fade-up delay-200 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
            mokU is the definitive platform for creators and professionals to curate their digital presence. Build dynamic, interactive link hubs seamlessly.
          </p>
          <div className="animate-fade-up delay-300 flex flex-wrap gap-3 sm:gap-4">
            <button className="btn-primary px-7 sm:px-8 py-3.5 sm:py-4 bg-primary text-white rounded-xl text-base sm:text-lg font-bold shadow-xl shadow-primary/30">
              Get Started
            </button>
            <button className="px-7 sm:px-8 py-3.5 sm:py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-base sm:text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200">
              View Demo
            </button>
          </div>
          {/* Social proof */}
          <div className="animate-fade-up delay-400 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["#6366f1", "#ec5b13", "#10b981", "#f59e0b"].map((c, i) => (
                <div key={i} className="size-8 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: c }}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-bold text-slate-900 dark:text-slate-100">50,000+</span> creators already on mokU
            </p>
          </div>
        </div>

        {/* Premium Bento Box */}
        <div className="relative animate-scale-in delay-200 animate-float mt-8 lg:mt-0 w-full max-w-[340px] sm:max-w-[480px] lg:max-w-[540px] mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 sm:grid-rows-4 gap-3 sm:gap-4 sm:aspect-square">
            {/* Profile Bio Card - Large on Desktop, Wide on Mobile */}
            <div className="col-span-2 row-span-1 sm:row-span-2 min-h-[160px] sm:min-h-0 bg-gradient-to-br from-[#2a1310] to-[#120805] rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-7 shadow-2xl border border-white/5 flex flex-col justify-between transition-transform duration-500 hover:scale-[1.02] overflow-hidden relative group cursor-pointer">
              <div className="absolute top-0 right-0 p-4 opacity-50"><span className="material-symbols-outlined text-white/50 text-xl">verified</span></div>
              <div className="size-12 sm:size-16 rounded-full border-2 border-white/20 overflow-hidden shadow-lg mb-3 sm:mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="User portrait" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-1">Hi, I&apos;m Alex.</h3>
                <p className="text-[10px] sm:text-sm text-white/70 leading-relaxed font-medium">Product Designer & Digital Artist based in SF.</p>
              </div>
            </div>

            {/* Twitter/X Card - 1x1 */}
            <div className="col-span-1 row-span-1 aspect-square sm:aspect-auto bg-white dark:bg-slate-800 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center shadow-xl border border-slate-100 dark:border-slate-700 transition-transform duration-500 hover:scale-105 cursor-pointer">
              <div className="size-10 sm:size-12 rounded-full bg-slate-900 dark:bg-slate-100 flex items-center justify-center mb-1.5 sm:mb-2 shadow-md">
                <span className="material-symbols-outlined text-[20px] sm:text-[24px] text-white dark:text-slate-900 leading-none">close</span>
              </div>
              <span className="text-[8px] sm:text-[10px] md:text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Twitter</span>
            </div>

            {/* Dribbble Card - 1x1 */}
            <div className="col-span-1 row-span-1 aspect-square sm:aspect-auto bg-white dark:bg-slate-800 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center shadow-xl border border-slate-100 dark:border-slate-700 transition-transform duration-500 hover:scale-105 cursor-pointer">
              <div className="size-10 sm:size-12 rounded-full bg-[#ea4c89] flex items-center justify-center mb-1.5 sm:mb-2 shadow-md">
                <span className="material-symbols-outlined text-[20px] sm:text-[24px] text-white leading-none">sports_basketball</span>
              </div>
              <span className="text-[8px] sm:text-[10px] md:text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Dribbble</span>
            </div>

            {/* LinkedIn Card - 1x1 */}
            <div className="col-span-1 row-span-1 aspect-square sm:aspect-auto bg-white dark:bg-slate-800 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center shadow-xl border border-slate-100 dark:border-slate-700 transition-transform duration-500 hover:scale-105 cursor-pointer">
              <div className="size-10 sm:size-12 rounded-full bg-[#0a66c2] flex items-center justify-center mb-1.5 sm:mb-2 shadow-md">
                <span className="material-symbols-outlined text-[20px] sm:text-[24px] text-white leading-none">work</span>
              </div>
              <span className="text-[8px] sm:text-[10px] md:text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">LinkedIn</span>
            </div>

            {/* Instagram Card - 1x1 */}
            <div className="col-span-1 row-span-1 aspect-square sm:aspect-auto bg-white dark:bg-slate-800 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center shadow-xl border border-slate-100 dark:border-slate-700 transition-transform duration-500 hover:scale-105 cursor-pointer">
              <div className="size-10 sm:size-12 rounded-full flex items-center justify-center mb-1.5 sm:mb-2 shadow-md" style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}>
                <span className="material-symbols-outlined text-[20px] sm:text-[24px] text-white leading-none">photo_camera</span>
              </div>
              <span className="text-[8px] sm:text-[10px] md:text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Instagram</span>
            </div>

            {/* Portfolio / Visual Card - 2x2 */}
            <div className="col-span-2 row-span-1 sm:row-span-2 min-h-[150px] sm:min-h-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-7 shadow-2xl border border-slate-700/50 flex flex-col justify-end transition-transform duration-500 hover:scale-[1.02] overflow-hidden relative group cursor-pointer text-left">
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Abstract Art" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay transition-transform duration-700 group-hover:scale-110" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop" />
              <div className="relative z-20">
                <span className="inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 bg-white/10 backdrop-blur-md rounded-lg text-[8px] sm:text-[10px] font-black text-white/90 uppercase tracking-wider mb-1 sm:mb-2">Case Study</span>
                <h3 className="text-base sm:text-lg md:text-2xl font-black text-white leading-tight">FinTech App Redesign</h3>
              </div>
            </div>

            {/* Music Player Card - Wide 2x1 */}
            <div className="col-span-2 row-span-1 min-h-[85px] sm:min-h-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] p-3 sm:p-4 flex items-center gap-3 sm:gap-4 shadow-xl border border-white dark:border-slate-700 transition-transform duration-500 hover:scale-[1.02] cursor-pointer">
              <div className="size-10 sm:size-14 rounded-xl sm:rounded-2xl bg-slate-900 overflow-hidden shrink-0 shadow-md relative group/play">
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/play:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white text-[20px] sm:text-[24px]">play_arrow</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
                {[3,7,4,8,5].map((h, i) => (
                  <div key={i} className="w-1 sm:w-1.5 bg-[#1db954]/80 rounded-full animate-[bounce_1.5s_infinite]" style={{ height: `${h * 12}%`, animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>

            {/* Portfolio Icon - 1x1 */}
            <div className="col-span-1 row-span-1 aspect-square sm:aspect-auto bg-white dark:bg-slate-800 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center shadow-xl border border-slate-100 dark:border-slate-700 transition-transform duration-500 hover:scale-105 cursor-pointer">
              <div className="size-10 sm:size-12 rounded-full bg-primary/10 flex items-center justify-center mb-1.5 sm:mb-2 shadow-sm text-primary">
                <span className="material-symbols-outlined text-[20px] sm:text-[24px] leading-none">public</span>
              </div>
              <span className="text-[8px] sm:text-[10px] md:text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Portfolio</span>
            </div>

            {/* Made with Glass - 1x1 */}
            <div className="col-span-1 row-span-1 aspect-square sm:aspect-auto bg-primary/5 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center border border-primary/20 transition-transform duration-500 hover:scale-105 cursor-pointer">
              <span className="material-symbols-outlined text-primary text-[20px] sm:text-[24px] mb-0.5 sm:mb-1">widgets</span>
              <span className="text-[6px] sm:text-[8px] md:text-[10px] font-black text-primary/80 uppercase tracking-widest">Built With</span>
              <span className="text-[8px] sm:text-[10px] md:text-xs font-black text-primary uppercase tracking-widest">mokU</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
