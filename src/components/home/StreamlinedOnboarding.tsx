import { onboardingSteps } from "@/data/site-data";

export function StreamlinedOnboarding() {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="reveal text-center text-2xl sm:text-3xl font-bold mb-12 sm:mb-16 tracking-tight text-slate-900 dark:text-slate-100">Streamlined Onboarding</h2>
        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12 text-center">
          <div className="hidden sm:block absolute top-8 left-1/4 right-1/4 h-px border-t-2 border-dashed border-slate-200 dark:border-slate-800 -z-10" />
          {onboardingSteps.map((step, i) => (
            <div key={i} className={`reveal flex flex-col items-center delay-${(i + 1) * 200}`}>
              <div className="size-14 sm:size-16 rounded-full bg-primary text-white flex items-center justify-center text-xl sm:text-2xl font-bold mb-5 sm:mb-6 ring-8 ring-primary/5 shadow-lg shadow-primary/20 transition-transform duration-300 hover:scale-110">
                {step.n}
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">{step.title}</h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-[260px] mx-auto">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
