export function CTA() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="reveal max-w-5xl mx-auto glass rounded-3xl sm:rounded-[3rem] p-8 sm:p-12 md:p-20 text-center relative overflow-hidden shadow-2xl border border-primary/20 bg-primary/5">
        <div className="absolute -top-10 -left-10 w-32 sm:w-40 h-32 sm:h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-32 sm:w-40 h-32 sm:h-40 bg-primary/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 tracking-tight text-slate-900 dark:text-slate-100">
            Create Your Plynk Page Today
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Build your personal widget-based profile and share everything with one link. Join 50k+ creators already using Plynk.
          </p>
          <a href="/auth/signup" className="inline-block btn-primary px-8 sm:px-10 py-4 sm:py-5 bg-primary text-white rounded-xl sm:rounded-2xl text-lg sm:text-xl font-bold shadow-2xl shadow-primary/40">
            Claim your link now
          </a>
        </div>
      </div>
    </section>
  );
}
