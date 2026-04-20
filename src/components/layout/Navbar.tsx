"use client";

import { useEffect, useState } from "react";
import { navLinks } from "@/data/site-data";
import Link from "next/link";
import { ArrowRight, Moon, Sun } from "lucide-react";
import { useAuthStatus } from "@/hooks/useAuth";
import { useAppTheme } from "@/components/theme/ThemeProvider";

function ThemeToggle() {
  const { theme, mounted, toggleTheme } = useAppTheme();

  if (!mounted) return <div className="size-10" />;

  return (
    <button
      onClick={toggleTheme}
      className="relative size-10 flex items-center justify-center rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 transition-all duration-300 group overflow-hidden cursor-pointer"
      aria-label="Toggle theme"
    >
      <div className="relative size-5 overflow-hidden">
        {/* Sun Icon */}
        <div className={`absolute inset-0 transition-all duration-500 ease-spring ${
          theme === 'dark' ? 'translate-y-8 opacity-0 rotate-45' : 'translate-y-0 opacity-100 rotate-0'
        }`}>
          <Sun size={20} className="text-primary" />
        </div>
        {/* Moon Icon */}
        <div className={`absolute inset-0 transition-all duration-500 ease-spring ${
          theme === 'dark' ? 'translate-y-0 opacity-100 rotate-0' : '-translate-y-8 opacity-0 -rotate-45'
        }`}>
          <Moon size={20} className="text-blue-400" />
        </div>
      </div>
    </button>
  );
}

function useScrolledNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return scrolled;
}

export function Navbar() {
  const scrolled = useScrolledNav();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: isAuth = false } = useAuthStatus();

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${scrolled
        ? "border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-black/5"
        : "border-transparent"
        } bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="size-9 rounded-lg overflow-hidden">
              <img src="/logo.svg" alt="plynk logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold tracking-[-0.03em] text-slate-900 dark:text-slate-100">plynk</span>
          </Link>
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((item: any) => (
              <Link 
                key={item.href || item} 
                href={item.href || "#"} 
                className="nav-link text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors duration-200"
              >
                {item.name || item}
              </Link>
            ))}
          </div>
        </div>
        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {!isAuth ? (
            <>
              <Link href="/auth/signin" className="px-6 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all duration-300 cursor-pointer">
                Log in
              </Link>
              <Link href="/auth/signup" className="relative group overflow-hidden px-5 py-3 bg-linear-to-b from-primary/95 to-primary/85 hover:brightness-90 text-white/90 rounded-xl text-sm font-bold shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.05)] ring-1 ring-white/10 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
                Sign up free
              </Link>
            </>
          ) : (
             <Link href="/dashboard" className="relative group overflow-hidden flex items-center gap-2 px-5 py-3 bg-linear-to-b from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 rounded-xl text-sm font-bold shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.05)] ring-1 ring-white/10 dark:ring-black/5 transition-all duration-300 cursor-pointer active:scale-[0.98]">
                Go to Dashboard
                <ArrowRight className="size-4" />
             </Link>
          )}
        </div>
        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? "max-h-72 border-t border-slate-100 dark:border-slate-800" : "max-h-0"
          } bg-background-light dark:bg-background-dark`}
      >
        <div className="px-4 py-4 flex flex-col gap-3">
          {navLinks.map((item: any) => (
            <Link 
              key={item.href || item} 
              href={item.href || "#"} 
              className="py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors cursor-pointer" 
              onClick={() => setMobileOpen(false)}
            >
              {item.name || item}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            {!isAuth ? (
              <div className="flex gap-3">
                <Link href="/auth/signin" className="flex-1 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary hover:text-primary transition-all text-center cursor-pointer">
                  Log in
                </Link>
                <Link href="/auth/signup" className="flex-1 py-2.5 bg-linear-to-b from-primary/95 to-primary/85 hover:brightness-90 text-white/90 rounded-2xl text-sm font-bold shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.05)] ring-1 ring-white/10 transition-all text-center cursor-pointer">
                  Sign up free
                </Link>
              </div>
            ) : (
              <Link href="/dashboard" className="w-full flex justify-center items-center gap-2 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-bold shadow-md cursor-pointer">
                Go to Dashboard
                <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
