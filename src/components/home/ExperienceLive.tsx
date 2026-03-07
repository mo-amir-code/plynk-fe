export function ExperienceLive() {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="reveal text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 mb-3">Experience it live</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">Uncompromising design, engineered for maximum conversion. This is your future mokU profile.</p>
        </div>
        <div className="reveal-scale bg-white dark:bg-slate-800 rounded-[2rem] sm:rounded-[3rem] p-1 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="bg-background-light dark:bg-background-dark rounded-[1.8rem] sm:rounded-[2.8rem] overflow-hidden">
            <div className="relative p-6 sm:p-12">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {/* Hero-style Bento Box for Sarah Jenkins */}
                  {/* Profile Bio Card - Large 2x2 */}
                  <div className="col-span-2 row-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-xl border border-white/5 flex flex-col justify-between transition-transform duration-500 hover:scale-[1.02] overflow-hidden relative group cursor-pointer text-left min-h-[220px]">
                    <div className="absolute top-0 right-0 p-5 opacity-50"><span className="material-symbols-outlined text-white/50 text-2xl">verified</span></div>
                    <div className="size-16 sm:size-20 rounded-full border-2 border-white/20 overflow-hidden shadow-lg mb-4 sm:mb-6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWyvuALISSYK-dcrYVvg6Gi04CRvCX0vwjcC1OH9z3l7Zp1tgNdFcbJhLr7cz7oeSwc1sXSkEAQbJwZjiDlVFEB9haHM-ZmWM2MzBUFIzZiTYlMcOANulNfqNuyB5eCoO4LO513Oicz9VgTynNRjyQI0wXjTL2vZdb4B_Al2AFCjokr-6CznrS64-JaGnMtLAbbl6ik2OXiW-1bAOGEr0gems6j4yKey_0yD6ecP2uRu0Eeg55Ccwv6YAY_blQpqZqxSIUuSwkh_TZ" />
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">Sarah Jenkins</h3>
                      <p className="text-sm md:text-base text-white/70 leading-relaxed font-medium">Product Designer &amp; Photographer based in NYC.</p>
                    </div>
                  </div>

                  {/* Twitter / X Card - 1x1 */}
                  <div className="group relative col-span-1 row-span-1 bg-white dark:bg-slate-800 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center shadow-xl border border-slate-100 dark:border-slate-700 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-1 cursor-pointer min-h-[120px] sm:min-h-[140px] overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/5 dark:bg-slate-100/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-4 sm:top-5 right-4 sm:right-5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-sm sm:text-base">arrow_outward</span>
                    </div>
                    <div className="size-10 sm:size-12 rounded-full bg-slate-900 dark:bg-slate-100 flex items-center justify-center mb-2 shadow-md group-hover:scale-110 transition-transform duration-500">
                      <span className="material-symbols-outlined text-[20px] sm:text-[24px] text-white dark:text-slate-900 leading-none">close</span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest relative z-10 group-hover:text-primary transition-colors duration-300">Twitter</span>
                  </div>

                  {/* Instagram Card - 1x1 */}
                  <div className="group relative col-span-1 row-span-1 bg-white dark:bg-slate-800 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center shadow-xl border border-slate-100 dark:border-slate-700 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-1 cursor-pointer min-h-[120px] sm:min-h-[140px] overflow-hidden">
                    <div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-4 sm:top-5 right-4 sm:right-5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      <span className="material-symbols-outlined text-pink-400 text-sm sm:text-base">arrow_outward</span>
                    </div>
                    <div className="size-10 sm:size-12 rounded-full flex items-center justify-center mb-2 shadow-md group-hover:scale-110 transition-transform duration-500" style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}>
                      <span className="material-symbols-outlined text-[20px] sm:text-[24px] text-white leading-none">photo_camera</span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest relative z-10 group-hover:text-pink-500 transition-colors duration-300">Instagram</span>
                  </div>

                  {/* Dribbble Card - 1x1 */}
                  <div className="group relative col-span-1 row-span-1 bg-white dark:bg-slate-800 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center shadow-xl border border-slate-100 dark:border-slate-700 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-1 cursor-pointer min-h-[120px] sm:min-h-[140px] overflow-hidden">
                    <div className="absolute inset-0 bg-[#ea4c89]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-4 sm:top-5 right-4 sm:right-5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      <span className="material-symbols-outlined text-[#ea4c89]/60 text-sm sm:text-base">arrow_outward</span>
                    </div>
                    <div className="size-10 sm:size-12 rounded-full bg-[#ea4c89] flex items-center justify-center mb-2 shadow-md group-hover:scale-110 transition-transform duration-500">
                      <span className="material-symbols-outlined text-[20px] sm:text-[24px] text-white leading-none">sports_basketball</span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest relative z-10 group-hover:text-[#ea4c89] transition-colors duration-300">Dribbble</span>
                  </div>

                  {/* LinkedIn Card - 1x1 */}
                  <div className="group relative col-span-1 row-span-1 bg-white dark:bg-slate-800 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center shadow-xl border border-slate-100 dark:border-slate-700 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-1 cursor-pointer min-h-[120px] sm:min-h-[140px] overflow-hidden">
                    <div className="absolute inset-0 bg-[#0a66c2]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-4 sm:top-5 right-4 sm:right-5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      <span className="material-symbols-outlined text-[#0a66c2]/60 text-sm sm:text-base">arrow_outward</span>
                    </div>
                    <div className="size-10 sm:size-12 rounded-full bg-[#0a66c2] flex items-center justify-center mb-2 shadow-md group-hover:scale-110 transition-transform duration-500">
                      <span className="material-symbols-outlined text-[20px] sm:text-[24px] text-white leading-none">work</span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest relative z-10 group-hover:text-[#0a66c2] transition-colors duration-300">LinkedIn</span>
                  </div>

                  {/* YouTube Card - 2x1 (Wide) */}
                  <div className="group relative col-span-2 row-span-1 bg-red-500/10 dark:bg-red-500/20 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center gap-3 sm:gap-4 shadow-sm border border-red-500/20 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl hover:shadow-red-500/20 cursor-pointer min-h-[100px] sm:min-h-[120px] overflow-hidden">
                    <div className="absolute top-1/2 -mt-2 sm:-mt-3 right-6 sm:right-8 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                      <span className="material-symbols-outlined text-red-500/60 text-xl sm:text-2xl">arrow_forward</span>
                    </div>
                    <div className="relative z-10 flex items-center gap-3 sm:gap-4 group-hover:-translate-x-3 sm:group-hover:-translate-x-4 transition-transform duration-500">
                      <div className="size-10 sm:size-12 rounded-full bg-red-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-500">
                        <span className="material-symbols-outlined text-[20px] sm:text-[24px] text-white leading-none">play_arrow</span>
                      </div>
                      <span className="text-sm sm:text-base font-black text-red-600 dark:text-red-400 uppercase tracking-widest">YouTube Channel</span>
                    </div>
                  </div>
                  
                  {/* GitHub Card - 2x1 (Wide) */}
                  <div className="group relative col-span-2 row-span-1 bg-slate-100 dark:bg-slate-800 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center gap-3 sm:gap-4 shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl cursor-pointer min-h-[100px] sm:min-h-[120px] overflow-hidden">
                    <div className="absolute top-1/2 -mt-2 sm:-mt-3 right-6 sm:right-8 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                      <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-xl sm:text-2xl">arrow_forward</span>
                    </div>
                    <div className="relative z-10 flex items-center gap-3 sm:gap-4 group-hover:-translate-x-3 sm:group-hover:-translate-x-4 transition-transform duration-500">
                      <div className="size-10 sm:size-12 rounded-full bg-slate-900 dark:bg-slate-100 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-500">
                        <span className="material-symbols-outlined text-[20px] sm:text-[24px] text-white dark:text-slate-900 leading-none">code</span>
                      </div>
                      <span className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest group-hover:text-primary transition-colors duration-300">GitHub Profile</span>
                    </div>
                  </div>

                  {/* Twitch Card - 1x1 */}
                  <div className="group relative col-span-1 row-span-1 bg-[#9146FF]/10 dark:bg-[#9146FF]/20 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center shadow-sm border border-[#9146FF]/20 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-[#9146FF]/20 hover:-translate-y-1 cursor-pointer min-h-[120px] sm:min-h-[140px] overflow-hidden">
                    <div className="absolute top-4 sm:top-5 right-4 sm:right-5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      <span className="material-symbols-outlined text-[#9146FF] text-sm sm:text-base">arrow_outward</span>
                    </div>
                    <div className="size-10 sm:size-12 rounded-full bg-[#9146FF] flex items-center justify-center mb-2 shadow-md group-hover:scale-110 transition-transform duration-500">
                      <span className="material-symbols-outlined text-[20px] sm:text-[24px] text-white leading-none">videogame_asset</span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-black text-[#9146FF] uppercase tracking-widest relative z-10 transition-colors duration-300">Twitch</span>
                  </div>

                  {/* Discord Card - 1x1 */}
                  <div className="group relative col-span-1 row-span-1 bg-[#5865F2]/10 dark:bg-[#5865F2]/20 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center shadow-sm border border-[#5865F2]/20 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-[#5865F2]/20 hover:-translate-y-1 cursor-pointer min-h-[120px] sm:min-h-[140px] overflow-hidden">
                    <div className="absolute top-4 sm:top-5 right-4 sm:right-5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      <span className="material-symbols-outlined text-[#5865F2] text-sm sm:text-base">arrow_outward</span>
                    </div>
                    <div className="size-10 sm:size-12 rounded-full bg-[#5865F2] flex items-center justify-center mb-2 shadow-md group-hover:scale-110 transition-transform duration-500">
                      <span className="material-symbols-outlined text-[20px] sm:text-[24px] text-white leading-none">forum</span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-black text-[#5865F2] uppercase tracking-widest relative z-10 transition-colors duration-300">Discord</span>
                  </div>

                  {/* Medium Card - 2x1 */}
                  <div className="group relative col-span-2 row-span-1 bg-white dark:bg-slate-800 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center gap-3 sm:gap-4 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1 cursor-pointer min-h-[100px] sm:min-h-[120px] overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/5 dark:bg-slate-100/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-1/2 -mt-2 sm:-mt-3 right-6 sm:right-8 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                      <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-xl sm:text-2xl">arrow_forward</span>
                    </div>
                    <div className="relative z-10 flex items-center gap-3 sm:gap-4 group-hover:-translate-x-3 sm:group-hover:-translate-x-4 transition-transform duration-500">
                      <div className="size-10 sm:size-12 rounded-full bg-slate-900 dark:bg-slate-100 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-500">
                        <span className="material-symbols-outlined text-[20px] sm:text-[24px] text-white dark:text-slate-900 leading-none">article</span>
                      </div>
                      <span className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest group-hover:text-primary transition-colors duration-300">Read on Medium</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
