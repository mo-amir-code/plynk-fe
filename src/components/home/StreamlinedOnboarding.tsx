import { onboardingSteps } from "@/data/site-data";

export function StreamlinedOnboarding() {
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="reveal text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.04em] text-slate-900 dark:text-slate-100">
            Zero to launched in <span className="text-primary italic">minutes.</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {onboardingSteps.map((step, i) => (
            <div key={i} className={`reveal relative p-8 sm:p-10 rounded-[3rem] bg-white dark:bg-slate-800/80 shadow-sm border border-slate-100 dark:border-slate-700/80 overflow-hidden group transition-all duration-500 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-primary/5 delay-${(i + 1) * 100}`}>
              {/* Massive Editorial Number */}
              <div className="absolute -top-6 -right-6 text-[180px] font-black text-slate-50 dark:text-slate-700/30 leading-none select-none group-hover:text-primary/5 dark:group-hover:text-primary/10 transition-colors duration-500 z-0">
                {step.n}
              </div>
              
              <div className="relative z-10 flex flex-col h-full justify-end pt-20">
                <h3 className="text-xl sm:text-2xl font-black mb-3 text-slate-900 dark:text-slate-100 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
