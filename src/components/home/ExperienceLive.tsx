import { SocialWidget } from '@/components/widgets/SocialWidget';
import { WideWidget } from '@/components/widgets/WideWidget';
import { FaXTwitter, FaInstagram, FaDribbble, FaLinkedinIn, FaYoutube, FaGithub, FaTwitch, FaDiscord, FaMedium } from "react-icons/fa6";

export function ExperienceLive() {
  return (
    <section className="py-16 md:py-32 relative overflow-hidden">
      {/* Ambient glowing backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] bg-primary/5 dark:bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="reveal text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.04em] text-slate-900 dark:text-slate-100 mb-6">
            See it in <span className="text-primary italic">action.</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto text-balance">
            Your brand is unique. Plynk flexes to match your vibe, beautifully combining your socials, videos, and projects into one stunning grid.
          </p>
        </div>
        
        <div className="reveal-scale max-w-4xl mx-auto relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {/* Hero-style Bento Box for Sarah Jenkins */}
                  {/* Profile Bio Card - Large 2x2 */}
                  <div className="col-span-2 row-span-2 aspect-square bg-linear-to-br from-slate-900 to-slate-800 rounded-4xl sm:rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-white/5 flex flex-col items-center justify-center transition-transform duration-500 hover:scale-[1.02] overflow-hidden relative group cursor-pointer text-center">
                    {/* Background Detail */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent)] pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="size-24 sm:size-28 rounded-full border-2 border-white/20 p-1 mb-8 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt="Avatar" className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWyvuALISSYK-dcrYVvg6Gi04CRvCX0vwjcC1OH9z3l7Zp1tgNdFcbJhLr7cz7oeSwc1sXSkEAQbJwZjiDlVFEB9haHM-ZmWM2MzBUFIzZiTYlMcOANulNfqNuyB5eCoO4LO513Oicz9VgTynNRjyQI0wXjTL2vZdb4B_Al2AFCjokr-6CznrS64-JaGnMtLAbbl6ik2OXiW-1bAOGEr0gems6j4yKey_0yD6ecP2uRu0Eeg55Ccwv6YAY_blQpqZqxSIUuSwkh_TZ" />
                        <div className="absolute -bottom-1 -right-1 bg-primary px-1 py-1 rounded-full flex items-center justify-center border-2 border-slate-900">
                          <span className="material-symbols-outlined text-white text-[12px] font-black">verified</span>
                        </div>
                      </div>
                      
                      <h3 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tighter">Sarah Jenkins</h3>
                      <p className="text-sm sm:text-lg text-white/60 leading-relaxed font-medium max-w-[200px] mx-auto">Product Designer & Photographer based in NYC.</p>
                      
                      <div className="mt-8 flex gap-2">
                        <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] sm:text-xs font-bold text-white/40 uppercase tracking-widest border border-white/5">Photography</span>
                        <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] sm:text-xs font-bold text-white/40 uppercase tracking-widest border border-white/5">Design</span>
                      </div>
                    </div>
                  </div>

                  {/* Twitter / X Card - 1x1 */}
                  <SocialWidget
                    platform="Twitter"
                    username="@sarahclicks"
                    icon={<FaXTwitter size={42} />}
                    containerClass="bg-[#000000] dark:bg-black"
                  />

                  {/* Instagram Card - 1x1 */}
                  <SocialWidget
                    platform="Instagram"
                    username="@sarahjenkins"
                    icon={<FaInstagram size={42} />}
                    containerClass="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]"
                  />

                  {/* Dribbble Card - 1x1 */}
                  <SocialWidget
                    platform="Dribbble"
                    username="@sarah_ui"
                    icon={<FaDribbble size={42} />}
                    containerClass="bg-[#ea4c89]"
                  />

                  {/* LinkedIn Card - 1x1 */}
                  <SocialWidget
                    platform="LinkedIn"
                    username="@sarah-jenkins"
                    icon={<FaLinkedinIn size={42} />}
                    containerClass="bg-gradient-to-br from-[#4A8BF5] to-[#0a66c2]"
                  />

                  {/* YouTube Card - 2x1 (Wide) */}
                  <WideWidget
                    title="YouTube Channel"
                    icon={<FaYoutube size={20} className="text-white" />}
                    containerClass="bg-red-500/10 dark:bg-red-500/20 shadow-sm border border-red-500/20 hover:shadow-xl hover:shadow-red-500/20"
                    arrowClass="text-red-500/60"
                    iconContainerClass="bg-red-600"
                    iconColorClass="text-white"
                    textClass="text-red-600 dark:text-red-400"
                  />
                  
                  {/* GitHub Card - 2x1 (Wide) */}
                  <WideWidget
                    title="GitHub Profile"
                    icon={<FaGithub size={20} className="text-white dark:text-slate-900" />}
                    containerClass="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl"
                    arrowClass="text-slate-500 dark:text-slate-400"
                    iconContainerClass="bg-slate-900 dark:bg-slate-100"
                    iconColorClass="text-white dark:text-slate-900"
                    textClass="text-slate-900 dark:text-slate-100 group-hover:text-primary"
                  />

                  {/* Twitch Card - 1x1 */}
                  <SocialWidget
                    platform="Twitch"
                    username="@sarahtv"
                    icon={<FaTwitch size={42} />}
                    containerClass="bg-[#9146FF]"
                  />

                  {/* Discord Card - 1x1 */}
                  <SocialWidget
                    platform="Discord"
                    username="sarah_community"
                    icon={<FaDiscord size={42} />}
                    containerClass="bg-[#5865F2]"
                  />

                  {/* Medium Card - 2x1 */}
                  <WideWidget
                    title="Read on Medium"
                    icon={<FaMedium size={20} className="text-white dark:text-slate-900" />}
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
    </section>
  );
}

