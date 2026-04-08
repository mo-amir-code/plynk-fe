import { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollReveal } from "@/components/layout/ScrollReveal";
import { FounderAvatar } from "@/components/about/FounderAvatar";
import { Users, Code, PenTool, Sparkles, Zap, Shield, Globe, Award, Linkedin } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Plynk",
  description: "Meet the founders of Plynk. Amir and Shubham are on a mission to redefine digital identity for the modern creator.",
};

export default function AboutPage() {
  return (
    <>
      <ScrollReveal />
      <Navbar />
      
      <main className="pt-16 md:pt-24 pb-16 md:pb-24 px-4 sm:px-6">
        
        {/* --- Hero Section --- */}
        <section className="max-w-7xl mx-auto pt-10 sm:pt-16 pb-16 sm:pb-20 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 sm:mb-8 tracking-tighter text-slate-900 dark:text-white animate-fade-in-up leading-[1.1]">
            Making the web <br />
            <span className="gradient-text italic">beautiful again.</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100 italic">
            "Plynk was born out of a simple frustration: the tools we use to share our work shouldn't be more boring than the work itself."
          </p>
        </section>

        {/* --- The Problem vs Solution --- */}
        <section className="max-w-7xl mx-auto mb-24 sm:mb-32 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="glass rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-10 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-white/5 reveal">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 uppercase tracking-wider">The Old Way</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">Static, uninspired lists of blue links that look like everyone else's.</p>
            <div className="space-y-3 opacity-50 grayscale">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-full h-10 sm:h-12 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" />
              ))}
            </div>
          </div>
          <div className="glass rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-10 border border-primary/30 bg-primary/5 shadow-2xl shadow-primary/10 reveal relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 uppercase tracking-wider">The Plynk Way</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium mb-8">A living, breathing bento-canvas that showcases your content.</p>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="col-span-2 h-16 sm:h-20 rounded-2xl bg-primary/20 border border-primary/30" />
              <div className="col-span-1 h-16 sm:h-20 rounded-2xl bg-blue-500/20 border border-blue-500/30" />
              <div className="col-span-1 h-10 sm:h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30" />
              <div className="col-span-2 h-10 sm:h-12 rounded-2xl bg-slate-800/20 border border-slate-700/30" />
            </div>
          </div>
        </section>

        {/* --- Founding Story Section --- */}
        <section className="max-w-5xl mx-auto mb-24 sm:mb-32 reveal">
          <div className="flex flex-col md:flex-row gap-12 sm:gap-16 items-center">
            <div className="flex-1 space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
                Our Origin
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Two friends. <br className="hidden sm:block" />One shared vision.
              </h2>
              <div className="space-y-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                <p>
                  Amir and Shubham met in college with a shared curiosity for the creative web. We realized that while content creation had evolved, the way we represent ourselves online had stayed stagnant.
                </p>
                <p>
                  What started as late-night brainstorming sessions between college friends soon grew into a mission. We began collaborating on weekends, redesigning what an "Online Hub" should look like—a blend of high-end aesthetics and zero-code simplicity.
                </p>
              </div>
            </div>
            <div className="flex-1 w-full max-w-[320px] md:max-w-none mx-auto relative mt-8 md:mt-0">
              <div className="absolute -inset-10 bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                <FounderAvatar 
                  src="/amir.jpg" 
                  alt="Amir" 
                  fallback="A" 
                  className="aspect-square rounded-[1.5rem] sm:rounded-[2rem] bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 border border-white/10 shadow-sm"
                  initialsClassName="text-3xl sm:text-4xl font-black text-slate-400 dark:text-slate-600"
                />
                <FounderAvatar 
                  src="/shubham.png" 
                  alt="Shubham" 
                  fallback="S" 
                  className="aspect-square rounded-[1.5rem] sm:rounded-[2rem] bg-linear-to-br from-primary/80 to-primary border border-white/10 shadow-xl translate-y-6 sm:translate-y-8"
                  initialsClassName="text-3xl sm:text-4xl font-black text-white"
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- Values Section --- */}
        <section className="max-w-7xl mx-auto mb-24 sm:mb-32">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest opacity-50">Our Core Principles</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: <Zap className="w-5 h-5" />, title: "Speed", desc: "Built with Next.js 15+ for sub-second load times." },
              { icon: <Shield className="w-5 h-5" />, title: "Privacy", desc: "No tracker injection. Your data stays yours." },
              { icon: <Globe className="w-5 h-5" />, title: "Globe Scale", desc: "Optimized delivery for a worldwide audience." },
              { icon: <Award className="w-5 h-5" />, title: "Premium", desc: "Design-first approach in every single pixel." }
            ].map((v, i) => (
              <div key={i} className="glass rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-white/5 bg-white/20 dark:bg-white/5 reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                  {v.icon}
                </div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">{v.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- The Founders --- */}
        <section className="max-w-7xl mx-auto mb-24 sm:mb-32 px-2 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            
            {/* Amir */}
            <div className=" glass rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-12 border border-slate-200 dark:border-white/5 bg-white/20 dark:bg-white/10 reveal group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 sm:p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                <PenTool size={160} />
              </div>
              <div className="relative z-10 flex items-center gap-6 mb-8">
                <FounderAvatar 
                  src="/amir.jpg" 
                  alt="Amir" 
                  fallback="A" 
                  className="size-16 sm:size-20 rounded-2xl bg-slate-200 dark:bg-slate-800 border-2 border-primary/20 shrink-0"
                  initialsClassName="text-xl font-bold text-slate-400"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white truncate">Amir</h3>
                    <Link 
                      href="https://www.linkedin.com/in/mo-amir/" 
                      target="_blank" 
                      className="p-2 sm:p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all cursor-pointer relative z-20 shrink-0"
                    >
                      <Linkedin size={18} className="sm:size-5" />
                    </Link>
                  </div>
                  <p className="text-primary font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] italic">Product Design & Strategy</p>
                </div>
              </div>
              <p className="relative z-10 text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-sm">
                Amir leads the visual and conceptual direction of Plynk. He believes that every pixel should serve a purpose, obsessing over the micro-interactions that make a digital home feel alive.
              </p>
            </div>

            {/* Shubham */}
            <div className=" glass rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-12 border border-slate-200 dark:border-white/5 bg-white/20 dark:bg-white/10 reveal group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 sm:p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                <Code size={160} />
              </div>
              <div className="relative z-10 flex items-center gap-6 mb-8">
                <FounderAvatar 
                  src="/shubham.png" 
                  alt="Shubham" 
                  fallback="S" 
                  className="size-16 sm:size-20 rounded-2xl bg-slate-200 dark:bg-slate-800 border-2 border-primary/20 shrink-0"
                  initialsClassName="text-xl font-bold text-white"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white truncate">Shubham</h3>
                    <Link 
                      href="https://www.linkedin.com/in/shubhamkumar0711/" 
                      target="_blank" 
                      className="p-2 sm:p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all cursor-pointer relative z-20 shrink-0"
                    >
                      <Linkedin size={18} className="sm:size-5" />
                    </Link>
                  </div>
                  <p className="text-primary font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] italic">Engineering & Product Vision</p>
                </div>
              </div>
              <p className="relative z-10 text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-sm">
                Shubham is the architect behind the Plynk core. He focuses on building the high-performance foundations that allow creators to express themselves with absolute freedom, ensuring the tech always stays out of the way of the art.
              </p>
            </div>

          </div>
        </section>

        {/* --- Final CTA --- */}
        <section className="max-w-5xl mx-auto text-center reveal">
          <div className="relative overflow-hidden rounded-[2.5rem] sm:rounded-[4rem] p-10 sm:p-24 border border-primary/20 shadow-2xl shadow-primary/20 bg-linear-to-br from-slate-900 to-black dark:from-white dark:to-slate-100">
            <div className="absolute top-0 left-0 w-full h-full bg-primary/5 dark:bg-primary/10 pointer-events-none" />
            <h2 className="relative z-10 text-3xl sm:text-6xl font-black text-white dark:text-slate-900 mb-8 sm:mb-10 tracking-tighter leading-tight">
              Start your <br className="sm:hidden" /> journey today.
            </h2>
            <Link href="/auth/signup" className="relative z-10 group inline-flex items-center gap-3 rounded-full bg-primary px-8 sm:px-12 py-3.5 sm:py-5 text-lg sm:text-xl font-black text-white shadow-2xl shadow-primary/40 hover:-translate-y-1 transition-all active:scale-95 cursor-pointer">
              <span>Get Started</span>
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 group-hover:fill-current transition-all" />
            </Link>
          </div>
        </section>

      </main>
      
      <Footer />
    </>
  );
}
