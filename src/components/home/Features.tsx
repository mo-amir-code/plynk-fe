import { featuresList } from "@/data/site-data";

export function Features() {
  return (
    <section className="py-16 sm:py-24 bg-slate-50 dark:bg-background-dark/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="reveal text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 tracking-tight text-slate-900 dark:text-white">Engineered for Expression</h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">Move beyond static lists. Plynk provides a robust, component-driven architecture to dynamically represent your brand identity.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
          {featuresList.map((card, i) => (
            <div key={i} className={`reveal card-hover p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 delay-${(i + 1) * 100}`}>
              <div className={`size-11 sm:size-12 rounded-2xl ${card.bg} flex items-center justify-center mb-5 sm:mb-6`}>
                <span className="material-symbols-outlined text-xl sm:text-2xl leading-none">{card.icon}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-slate-900 dark:text-slate-100">{card.title}</h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
