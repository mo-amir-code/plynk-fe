"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import useAuthStore from "@/stores/authStore";
import { useAppTheme } from "@/components/theme/ThemeProvider";
import { useLogout } from "@/hooks/useAuth";

const navItems = [
  { name: "Your Identity", href: "/dashboard/your-identity", icon: "person" },
  { name: "Analytics", href: "/dashboard/analytics", icon: "monitoring" },
  { name: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { theme, mounted, toggleTheme } = useAppTheme();
  const logoutMutation = useLogout();

  // Close on route change
  useEffect(() => {
    onClose();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      logout();
      localStorage.removeItem("auth-storage");
      onClose();
      window.location.assign("/auth/signin");
    } catch (error) {
       console.error("Logout failed", error);
    }
  };

  const initials = user?.fullName
  ? user.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  : "??";

  return (
    <>
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`lg:hidden fixed left-0 top-0 bottom-0 z-60 w-72 bg-white dark:bg-slate-900 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <div className="size-8 rounded-lg overflow-hidden">
              <Image src="/logo.svg" alt="plynk logo" width={32} height={32} className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold tracking-[-0.03em] text-slate-900 dark:text-slate-100">plynk</span>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[22px] ${isActive ? "text-primary" : "text-slate-500 dark:text-slate-500"}`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                {item.name}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[22px]">
                {theme === "dark" ? "light_mode" : "dark_mode"}
              </span>
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          )}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
            <div className="size-9 rounded-full bg-linear-to-tr from-primary to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{user?.fullName || "User"}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Early Access</p>
            </div>
            <button 
              onClick={handleLogout}
              className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors text-xl cursor-pointer"
            >
              logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
