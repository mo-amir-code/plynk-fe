"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import useAuthStore from "@/stores/authStore";
import { STORAGE_KEYS } from "@/config/app-config";
import { useLogout } from "@/hooks/useAuth";
import type { NavItem } from "@/types/components/dashboard";

const primaryNavItems = [
  { name: "Your Identity", href: "/dashboard/your-identity", icon: "person" },
  { name: "Analytics", href: "/dashboard/analytics", icon: "monitoring" },
];

const secondaryNavItems = [
  { name: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const logoutMutation = useLogout();

  const { logout, user } = useAuthStore();
  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutMutation.mutateAsync();
      logout();
      localStorage.removeItem("auth-storage");
      localStorage.removeItem(STORAGE_KEYS.legacyTheme);
      localStorage.removeItem(STORAGE_KEYS.legacyWidgets);

      window.location.assign("/auth/signin");
    } catch (error) {
      console.error("Logout failed", error);
      setIsLoggingOut(false);
    }
  };

  // Reusable component to keep the JSX clean
  const NavIcon = ({ item, isActive }: { item: NavItem; isActive?: boolean }) => (
    <Link
      href={item.href}
      className={`relative group flex items-center justify-center size-12 rounded-xl transition-all duration-300 ${
        isActive
          ? "bg-primary/10 text-primary shadow-inner shadow-primary/5 dark:bg-primary/10"
          : "text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200"
      }`}
    >
      <span 
        className={`material-symbols-outlined text-[24px] transition-all duration-300 ${isActive ? "text-primary scale-110" : "group-hover:scale-110"}`}
        style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
      >
        {item.icon}
      </span>
      {isActive && (
        <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-r-lg" />
      )}
      
      {/* Tooltip */}
      <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold rounded-lg opacity-0 -translate-x-2 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap z-100 shadow-xl border border-white/10 flex items-center">
        {item.name}
        <span className="absolute top-1/2 -left-1.25 -translate-y-1/2 border-[5px] border-transparent border-r-slate-900 dark:border-r-slate-700" />
      </div>
    </Link>
  );

  return (
    <aside className="hidden lg:flex flex-col items-center w-22 py-6 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none">
      {/* Logo */}
      <Link href="/" className="group mb-10 flex items-center justify-center relative">
        <div className="size-12 bg-linear-to-br from-primary to-orange-500 rounded-[14px] flex items-center justify-center text-white shadow-lg shadow-primary/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-primary/50 group-hover:-translate-y-0.5">
          <span className="material-symbols-outlined text-[26px] leading-none text-white/95 group-hover:scale-110 transition-transform duration-300">widgets</span>
        </div>
      </Link>

      {/* Primary Nav Items */}
      <nav className="flex flex-col items-center gap-3 w-full px-3 flex-1">
        {primaryNavItems.map((item) => (
          <NavIcon key={item.name} item={item} isActive={pathname === item.href} />
        ))}
      </nav>

      {/* Secondary & Utilities */}
      <div className="flex flex-col items-center gap-3 w-full px-3 pb-2 relative">
        {/* Subtle Divider */}
        <div className="w-6 h-px bg-slate-200 dark:bg-slate-800 my-1 rounded-full" />

        {/* Settings */}
        {secondaryNavItems.map((item) => (
          <NavIcon key={item.name} item={item} isActive={pathname === item.href} />
        ))}

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="cursor-pointer group relative flex items-center justify-center size-12 rounded-xl text-red-400 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 disabled:opacity-50"
        >
          {isLoggingOut ? (
             <span className="w-5 h-5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
          ) : (
            <span className="material-symbols-outlined text-[24px] group-hover:-translate-x-0.5 transition-transform duration-200">
              logout
            </span>
          )}
          
          <div className="absolute left-full ml-4 px-3 py-2 bg-red-600 dark:bg-red-500 text-white text-xs font-bold rounded-lg opacity-0 -translate-x-2 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap z-100 shadow-xl flex items-center">
            Sign out
            <span className="absolute top-1/2 -left-1.25 -translate-y-1/2 border-[5px] border-transparent border-r-red-600 dark:border-r-red-500" />
          </div>
        </button>

        {/* User avatar */}
        <div className="relative group mt-3 cursor-pointer">
          <div className="size-11 rounded-[14px] bg-linear-to-tr from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 p-0.5 transition-all duration-300 shadow-md ring-2 ring-transparent group-hover:ring-primary/30">
            <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-white/95 font-black tracking-wider text-sm overflow-hidden relative shadow-inner">
              <div className="absolute inset-0 bg-linear-to-b from-white/10 to-transparent" />
              {initials}
            </div>
          </div>
          
          <div className="absolute bottom-0 left-full ml-4 py-2 px-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg opacity-0 -translate-x-4 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap z-100 shadow-xl border border-white/10 flex flex-col items-start gap-0.5">
            <span className="text-sm font-bold tracking-tight">{user?.fullName || "User"}</span>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Pro Plan</span>
            <span className="absolute bottom-4 -left-1.25 border-[5px] border-transparent border-r-slate-900 dark:border-r-slate-700" />
          </div>
        </div>
      </div>
    </aside>
  );
}
