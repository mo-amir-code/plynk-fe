export function ComponentLibrary() {
  return (
    <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="reveal flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6 mb-10 sm:mb-16">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 text-slate-900 dark:text-slate-100">An Extensible Component Library</h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Leverage our comprehensive suite of native integrations and bespoke widgets to construct a highly personalized digital ecosystem.</p>
          </div>
          <button className="shrink-0 px-5 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200">
            Explore Component Library
          </button>
        </div>
        {/* Custom Built Showcase */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {/* Profile Piece 1 */}
          <div className="reveal col-span-2 row-span-2 relative group rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800 delay-100">
             <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-8">
                <span className="text-white font-black text-2xl mb-2">Portfolio</span>
                <p className="text-slate-200 text-sm">Visual Identity & Motion</p>
             </div>
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img alt="Portrait" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974&auto=format&fit=crop" />
          </div>

          {/* Twitter */}
          <div className="reveal card-hover bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 border border-slate-100 dark:border-slate-700 shadow-sm delay-200 min-h-[180px]">
            <div className="size-14 rounded-full bg-slate-900 dark:bg-slate-100 flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-3xl text-white dark:text-slate-900">close</span>
            </div>
            <span className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Twitter</span>
          </div>

          {/* Dribbble */}
          <div className="reveal card-hover bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 border border-slate-100 dark:border-slate-700 shadow-sm delay-300 min-h-[180px]">
            <div className="size-14 rounded-full bg-[#ea4c89] flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-3xl text-white">sports_basketball</span>
            </div>
            <span className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Dribbble</span>
          </div>

          {/* Spotify-style Now Playing */}
          <div className="reveal col-span-2 bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 flex items-center gap-6 border border-slate-100 dark:border-slate-700 shadow-sm delay-400">
             <div className="size-20 rounded-2xl bg-slate-900 overflow-hidden shrink-0 shadow-lg relative group">
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white text-3xl">play_circle</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="Album Art" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop" />
             </div>
             <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="size-2 rounded-full bg-[#1db954] animate-pulse" />
                  <span className="text-[10px] font-black text-[#1db954] uppercase tracking-widest">Now Playing</span>
                </div>
                <h4 className="font-black text-xl text-slate-900 dark:text-slate-100 truncate">Midnight City</h4>
                <p className="text-sm text-slate-500 truncate">M83 • Hurry Up, We&apos;re Dreaming</p>
             </div>
             <div className="hidden sm:flex items-end gap-1 h-12">
                {[4,7,5,8,6,9,5].map((h, i) => (
                  <div key={i} className="w-1.5 bg-[#1db954] rounded-full animate-[bounce_1.5s_infinite]" style={{ height: `${h * 15}%`, animationDelay: `${i * 0.1}s` }} />
                ))}
             </div>
          </div>

          {/* Instagram */}
          <div className="reveal card-hover bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 border border-slate-100 dark:border-slate-700 shadow-sm delay-500 min-h-[180px]">
            <div className="size-14 rounded-full flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}>
              <span className="material-symbols-outlined text-3xl text-white">photo_camera</span>
            </div>
            <span className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Instagram</span>
          </div>
        </div>
      </div>
    </section>
  );
}
