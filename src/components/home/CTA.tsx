import Link from "next/link";

export function CTA() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6">
      <div className="reveal max-w-5xl mx-auto glass rounded-[2.5rem] sm:rounded-[4rem] p-10 sm:p-20 text-center relative overflow-hidden shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(0,0,0,0.05),0_24px_48px_rgba(0,0,0,0.1)] dark:shadow-[0_1px_1px_rgba(0,0,0,0.5),0_4px_6px_rgba(0,0,0,0.5),0_24px_48px_rgba(0,0,0,0.6)] border border-slate-200 dark:border-white/10 bg-linear-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 group">
        {/* Subtle Static Highlight */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
        
        <div className="absolute -bottom-10 -right-10 w-40 sm:w-64 h-40 sm:h-64 bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-[-0.05em] text-slate-900 dark:text-slate-100 leading-[1.05]">
            Create your plynk.in <span className="text-primary italic">today.</span>
          </h2>
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Join the next generation of creators. Build your organic, widget-based profile and share your whole world with one link.
          </p>
          <Link href="/auth/signup" className="inline-block relative group/btn overflow-hidden px-10 py-5 bg-linear-to-b from-primary/95 to-primary/80 hover:brightness-105 text-white/95 rounded-full text-lg sm:text-xl font-bold shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.05)] ring-1 ring-white/20 transition-all duration-300 cursor-pointer active:scale-[0.98]">
            {/* Bright Shine effect for the button only */}
            <div className="absolute inset-0 w-1/2 h-full bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-[200%] transition-transform duration-[1.2s] ease-in-out pointer-events-none" />
            Claim your link now
          </Link>
        </div>
      </div>
    </section>
  );
}
