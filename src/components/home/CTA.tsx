export function CTA() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="reveal max-w-5xl mx-auto glass rounded-3xl sm:rounded-[3rem] p-8 sm:p-12 md:p-20 text-center relative overflow-hidden shadow-xl border border-primary/20 bg-primary/5">
        <div className="absolute -top-10 -left-10 w-32 sm:w-40 h-32 sm:h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-32 sm:w-40 h-32 sm:h-40 bg-primary/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-[-0.04em] text-slate-900 dark:text-slate-100 leading-tight">
            Create your plynk.in <span className="text-primary italic">today.</span>
          </h2>
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto font-medium">
            Join the next generation of creators. Build your organic, widget-based profile and share your whole world with one link.
          </p>
          <a href="/auth/signup" className="inline-block btn-primary px-10 sm:px-12 py-4 sm:py-5 bg-primary text-white rounded-full text-lg sm:text-xl font-bold shadow-2xl shadow-primary/40 transition-transform hover:scale-105">
            Claim your link now
          </a>
        </div>
      </div>
    </section>
  );
}
