import { SocialWidget } from '@/components/widgets/SocialWidget';

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
          <SocialWidget
            platform="Twitter"
            icon="close"
            containerClass="reveal delay-200 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 min-h-[180px] hover:shadow-xl"
            overlayClass="bg-slate-900/5 dark:bg-slate-100/5"
            textClass="group-hover:text-primary"
          />

          {/* Dribbble */}
          <SocialWidget
            platform="Dribbble"
            icon="sports_basketball"
            containerClass="reveal delay-300 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 min-h-[180px] hover:shadow-xl"
            overlayClass="bg-[#ea4c89]/5"
            arrowClass="text-[#ea4c89]/60"
            iconContainerClass="bg-[#ea4c89]"
            iconColorClass="text-white"
            textClass="group-hover:text-[#ea4c89]"
          />

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
          <SocialWidget
            platform="Instagram"
            icon="photo_camera"
            containerClass="reveal delay-500 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 min-h-[180px] hover:shadow-xl"
            overlayClass="bg-pink-500/5"
            arrowClass="text-pink-400"
            iconContainerClass=""
            iconColorClass="text-white"
            iconCustomStyle={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
            textClass="group-hover:text-pink-500"
          />
        </div>
      </div>
    </section>
  );
}
