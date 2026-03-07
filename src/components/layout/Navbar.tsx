"use client";

import { useEffect, useState } from "react";
import { navLinks } from "@/data/site-data";

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
          <a href="#" className="flex items-center gap-2 group">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white transition-transform duration-200 group-hover:scale-110">
              <span className="material-symbols-outlined text-xl leading-none">widgets</span>
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">mok<span className="text-primary">U</span></span>
          </a>
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((item) => (
              <a key={item} href="#" className="nav-link text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors duration-200">
                {item}
              </a>
            ))}
          </div>
        </div>
        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors duration-200 rounded-lg hover:bg-primary/5">
            Log in
          </button>
          <button className="btn-primary px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20">
            Sign up free
          </button>
        </div>
        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
        </button>
      </div>
      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? "max-h-72 border-t border-slate-100 dark:border-slate-800" : "max-h-0"
          } bg-background-light dark:bg-background-dark`}
      >
        <div className="px-4 py-4 flex flex-col gap-3">
          {navLinks.map((item) => (
            <a key={item} href="#" className="py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" onClick={() => setMobileOpen(false)}>
              {item}
            </a>
          ))}
          <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button className="flex-1 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary hover:text-primary transition-all">
              Log in
            </button>
            <button className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold">
              Sign up free
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
