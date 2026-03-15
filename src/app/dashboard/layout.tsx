"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Nav Drawer */}
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center px-4 sticky top-0 z-40 shadow-sm">
          <div className="size-8 bg-primary rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/30">
            <span className="material-symbols-outlined text-xl">widgets</span>
          </div>
          <span className="ml-3 font-black text-lg">mok<span className="text-primary">U</span></span>
          <button
            onClick={() => setMobileOpen(true)}
            className="ml-auto p-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className={`w-full h-full ${pathname === '/dashboard/your-identity' ? '' : 'max-w-5xl mx-auto p-4 sm:p-6 lg:p-8'}`}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
