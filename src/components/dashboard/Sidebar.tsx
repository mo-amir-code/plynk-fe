"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import useAuthStore from "@/stores/authStore";
import { STORAGE_KEYS } from "@/config/app-config";
import { useLogout } from "@/hooks/useAuth";
import type { NavItem } from "@/types/components/dashboard";

import { BarChart3, LogOut as LogOutIcon, Settings as SettingsIcon, User as UserIcon } from "lucide-react";

const primaryNavItems = [
  { name: "Your Identity", href: "/dashboard/your-identity", icon: UserIcon },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

const secondaryNavItems = [
  { name: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
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
  const NavIcon = ({ item, isActive }: { item: any; isActive?: boolean }) => {
    const Icon = item.icon;
    return (
      <Link
        href={item.href}
        className={`relative group flex items-center justify-center size-12 rounded-2xl transition-all duration-300 ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-slate-500 hover:bg-white/5 hover:text-white"
        }`}
      >
        <Icon 
          size={22} 
          strokeWidth={isActive ? 2.5 : 2}
          className="transition-colors duration-300"
        />
        
        {isActive && (
          <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-[2px_0_12px_rgba(255,77,0,0.5)]" />
        )}
        
        {/* Elite Glass Tooltip */}
        <div className="absolute left-full ml-5 px-4 py-2.5 bg-[#181c24] text-white text-[11px] font-bold capitalize tracking-[0.1em] rounded-lg opacity-0 -translate-x-3 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap z-100 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)] border border-white/5 flex items-center">
          {item.name}
          {/* Seamless Arrow */}
          <div className="absolute top-1/2 -left-1 size-2 rotate-45 -translate-y-1/2 bg-[#181c24] border-l border-b border-white/5" />
        </div>
      </Link>
    );
  };

  return (
    <aside className="hidden lg:flex flex-col items-center w-22 py-8 bg-[#080a0f] border-r border-white/5 h-screen sticky top-0 z-50">
      {/* Brand Architecture */}
      <Link href="/" className="mb-12 flex flex-col items-center group">
        <div className="size-12 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden">
           <Image src="/logo.svg" alt="plynk logo" width={44} height={44} className="relative z-10 size-10" />
        </div>
      </Link>

      {/* Primary Intelligence */}
      <nav className="flex flex-col items-center gap-5 w-full px-4 flex-1">
        {primaryNavItems.map((item) => (
          <NavIcon key={item.name} item={item} isActive={pathname === item.href} />
        ))}
      </nav>

      {/* Meta Nav & Identity */}
      <div className="flex flex-col items-center gap-5 w-full px-4 pb-4">
        <div className="w-8 h-px bg-white/5 rounded-full" />

        {secondaryNavItems.map((item) => (
          <NavIcon key={item.name} item={item} isActive={pathname === item.href} />
        ))}

        {/* Global Exit */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="cursor-pointer group relative flex items-center justify-center size-12 rounded-2xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
        >
          {isLoggingOut ? (
             <span className="size-5 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
          ) : (
            <LogOutIcon size={22} className="transition-all duration-300 group-hover:-translate-x-0.5" />
          )}
          
          <div className="absolute left-full ml-5 px-4 py-2.5 bg-red-500 text-white text-[11px] font-bold capitalize tracking-[0.1em] rounded-lg opacity-0 -translate-x-3 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap z-100 shadow-xl flex items-center">
            Sign Out
            <div className="absolute top-1/2 -left-1 size-2 rotate-45 -translate-y-1/2 bg-red-500" />
          </div>
        </button>

        {/* User Identity Pillar */}
        <div className="relative group mt-2 pt-4 border-t border-white/5 w-full flex justify-center">
          <div className="size-11 rounded-[1.2rem] bg-slate-900 border border-white/5 p-0.5 transition-all duration-500 shadow-2xl relative overflow-hidden group-hover:border-primary/30 cursor-pointer">
            <div className="w-full h-full rounded-[1rem] bg-[#0c0e12] flex items-center justify-center text-white/90 font-bold tracking-widest text-[11px] relative shadow-inner">
              <div className="absolute inset-x-0 top-0 h-1/2 bg-white/5" />
              {initials}
            </div>
          </div>
          
          <div className="absolute bottom-4 left-full ml-5 py-3 px-5 bg-[#181c24] text-white rounded-2xl opacity-0 -translate-x-5 pointer-events-none transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap z-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col items-start gap-1">
            <span className="text-sm font-bold tracking-tight capitalize">{user?.fullName || "Operator"}</span>
            <span className="text-[10px] text-primary font-bold capitalize tracking-[0.1em] opacity-80">Early Access Node</span>
            <div className="absolute bottom-5 -left-1 size-2 rotate-45 bg-[#181c24] border-l border-b border-white/5" />
          </div>
        </div>
      </div>
    </aside>
  );
}
