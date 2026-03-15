"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Your Identity", href: "/dashboard/your-identity", icon: "person" },
  { name: "Analytics", href: "/dashboard/analytics", icon: "monitoring" },
  { name: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const sync = () => {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
      if (isMounted) setMounted(true);
    };
    sync();
    return () => { isMounted = false; };
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", next);
    setTheme(next);
  };

  return (
    <aside className="hidden lg:flex flex-col items-center w-[72px] py-6 gap-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 h-screen sticky top-0 z-50 shadow-sm">
      {/* Logo */}
      <Link href="/" className="group mb-8 flex items-center justify-center">
        <div className="size-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-primary/50">
          <span className="material-symbols-outlined text-xl leading-none">widgets</span>
        </div>
      </Link>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col items-center gap-1 w-full px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.name}
              className={`relative group w-full flex items-center justify-center py-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <span className={`material-symbols-outlined text-[22px] transition-all duration-200 ${
                isActive ? "text-primary" : ""
              }`}
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>

              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
              )}

              {/* Tooltip */}
              <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold rounded-lg opacity-0 -translate-x-1 pointer-events-none transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap z-[100] shadow-xl">
                {item.name}
                <span className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-slate-700" />
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom utilities */}
      <div className="flex flex-col items-center gap-1 w-full px-2 pb-2">
        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            className="group relative w-full flex items-center justify-center py-3 rounded-2xl text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[22px]">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
            <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold rounded-lg opacity-0 -translate-x-1 pointer-events-none transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap z-[100] shadow-xl">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
              <span className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-slate-700" />
            </span>
          </button>
        )}

        {/* User avatar */}
        <div className="relative group mt-2 cursor-pointer">
          <div className="size-9 rounded-full bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
            JD
          </div>
          <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold rounded-lg opacity-0 -translate-x-1 pointer-events-none transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap z-[100] shadow-xl">
            John Doe · Pro
            <span className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-slate-700" />
          </span>
        </div>
      </div>
    </aside>
  );
}
