import { SocialWidget } from '@/components/widgets/SocialWidget';
import { WideWidget } from '@/components/widgets/WideWidget';

export function ExperienceLive() {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="reveal text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 mb-3">Experience it live</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">Uncompromising design, engineered for maximum conversion. This is your future Plynk profile.</p>
        </div>
        <div className="reveal-scale bg-white dark:bg-slate-700 rounded-[2rem] sm:rounded-[3rem] p-[0.5px] shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="bg-background-light dark:bg-background-dark/80 rounded-[1.8rem] sm:rounded-[2.8rem] overflow-hidden">
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
                  <SocialWidget
                    platform="Twitter"
                    icon="close"
                    overlayClass="bg-slate-900/5 dark:bg-slate-100/5"
                    textClass="group-hover:text-primary"
                  />

                  {/* Instagram Card - 1x1 */}
                  <SocialWidget
                    platform="Instagram"
                    icon="photo_camera"
                    overlayClass="bg-pink-500/5"
                    arrowClass="text-pink-400"
                    iconContainerClass=""
                    iconColorClass="text-white"
                    iconCustomStyle={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
                    textClass="group-hover:text-pink-500"
                  />

                  {/* Dribbble Card - 1x1 */}
                  <SocialWidget
                    platform="Dribbble"
                    icon="sports_basketball"
                    overlayClass="bg-[#ea4c89]/5"
                    arrowClass="text-[#ea4c89]/60"
                    iconContainerClass="bg-[#ea4c89]"
                    iconColorClass="text-white"
                    textClass="group-hover:text-[#ea4c89]"
                  />

                  {/* LinkedIn Card - 1x1 */}
                  <SocialWidget
                    platform="LinkedIn"
                    icon="work"
                    overlayClass="bg-[#0a66c2]/5"
                    arrowClass="text-[#0a66c2]/60"
                    iconContainerClass="bg-[#0a66c2]"
                    iconColorClass="text-white"
                    textClass="group-hover:text-[#0a66c2]"
                  />

                  {/* YouTube Card - 2x1 (Wide) */}
                  <WideWidget
                    title="YouTube Channel"
                    icon="play_arrow"
                    containerClass="bg-red-500/10 dark:bg-red-500/20 shadow-sm border border-red-500/20 hover:shadow-xl hover:shadow-red-500/20"
                    arrowClass="text-red-500/60"
                    iconContainerClass="bg-red-600"
                    iconColorClass="text-white"
                    textClass="text-red-600 dark:text-red-400"
                  />
                  
                  {/* GitHub Card - 2x1 (Wide) */}
                  <WideWidget
                    title="GitHub Profile"
                    icon="code"
                    containerClass="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl"
                    arrowClass="text-slate-500 dark:text-slate-400"
                    iconContainerClass="bg-slate-900 dark:bg-slate-100"
                    iconColorClass="text-white dark:text-slate-900"
                    textClass="text-slate-900 dark:text-slate-100 group-hover:text-primary"
                  />

                  {/* Twitch Card - 1x1 */}
                  <SocialWidget
                    platform="Twitch"
                    icon="videogame_asset"
                    containerClass="bg-[#9146FF]/10 dark:bg-[#9146FF]/20 shadow-sm border border-[#9146FF]/20 hover:shadow-xl hover:shadow-[#9146FF]/20"
                    arrowClass="text-[#9146FF]"
                    iconContainerClass="bg-[#9146FF]"
                    iconColorClass="text-white"
                    textClass="!text-[#9146FF]"
                  />

                  {/* Discord Card - 1x1 */}
                  <SocialWidget
                    platform="Discord"
                    icon="forum"
                    containerClass="bg-[#5865F2]/10 dark:bg-[#5865F2]/20 shadow-sm border border-[#5865F2]/20 hover:shadow-xl hover:shadow-[#5865F2]/20"
                    arrowClass="text-[#5865F2]"
                    iconContainerClass="bg-[#5865F2]"
                    iconColorClass="text-white"
                    textClass="!text-[#5865F2]"
                  />

                  {/* Medium Card - 2x1 */}
                  <WideWidget
                    title="Read on Medium"
                    icon="article"
                    containerClass="bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl"
                    overlayClass="bg-slate-900/5 dark:bg-slate-100/5"
                    arrowClass="text-slate-500 dark:text-slate-400"
                    iconContainerClass="bg-slate-900 dark:bg-slate-100"
                    iconColorClass="text-white dark:text-slate-900"
                    textClass="text-slate-900 dark:text-slate-100 group-hover:text-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

