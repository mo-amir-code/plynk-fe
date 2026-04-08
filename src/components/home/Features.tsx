import { featuresList } from "@/data/site-data";

export function Features() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="reveal text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-[-0.04em] text-slate-900 dark:text-white leading-tight">Your whole world, <br className="hidden sm:block" /><span className="gradient-text italic">on one canvas.</span></h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 font-medium">Say goodbye to boring lists. Plynk uses beautiful, interactive widgets to showcase your true creative identity.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {featuresList.map((card, i) => (
            <div key={i} className={`reveal group p-8 sm:p-10 bg-white dark:bg-slate-800 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-700 delay-${(i + 1) * 100} transition-all duration-300 hover:scale-[1.03] hover:shadow-xl dark:hover:shadow-primary/5`}>
              <div className={`size-14 sm:size-16 rounded-full ${card.bg} flex items-center justify-center mb-6 sm:mb-8 transition-transform duration-300 group-hover:-translate-y-1`}>
                <span className="material-symbols-outlined text-2xl sm:text-3xl leading-none">{card.icon}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-3 text-slate-900 dark:text-slate-100 tracking-tight">{card.title}</h3>
              <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
