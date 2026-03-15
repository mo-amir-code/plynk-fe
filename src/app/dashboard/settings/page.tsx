"use client";

import { useEffect, useRef, useState } from "react";

type Theme = "light" | "dark" | "system";

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState("John Doe");
  const [username, setUsername] = useState("johndoe");
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>("light");
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const applyTheme = (t: Theme) => {
    setTheme(t);
    if (t === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else if (t === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      localStorage.removeItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      prefersDark
        ? document.documentElement.classList.add("dark")
        : document.documentElement.classList.remove("dark");
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const themeOptions: { value: Theme; label: string; icon: string; bg: string; iconColor: string }[] = [
    { value: "light",  label: "Light",  icon: "light_mode",      bg: "bg-gradient-to-br from-slate-100 to-white",       iconColor: "text-slate-400" },
    { value: "dark",   label: "Dark",   icon: "dark_mode",       bg: "bg-gradient-to-br from-slate-900 to-slate-800",   iconColor: "text-slate-500" },
    { value: "system", label: "System", icon: "desktop_windows", bg: "bg-gradient-to-br from-slate-500 to-slate-700",   iconColor: "text-slate-300" },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* ── Page Header ── */}
        <div className="flex flex-col xs:flex-row xs:items-center gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              Settings
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Customize your profile and preferences.
            </p>
          </div>
          <button
            onClick={handleSave}
            className={`btn-primary self-start xs:self-auto flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg transition-all duration-200 ${
              saved
                ? "bg-green-500 shadow-green-500/20 text-white"
                : "bg-primary shadow-primary/20 text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {saved ? "check_circle" : "save"}
            </span>
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>

        {/* ── Profile Details Card ── */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Card header */}
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <div className="size-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Profile Details</h2>
          </div>

          <div className="p-5 sm:p-6">
            {/* Avatar — always centred on mobile, left-aligned on sm+ */}
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-5 sm:gap-6 mb-5">
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div
                  className="relative size-24 rounded-full cursor-pointer group select-none"
                  onClick={() => fileRef.current?.click()}
                >
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt="Profile"
                      className="size-24 rounded-full object-cover ring-4 ring-white dark:ring-slate-900 shadow-xl"
                    />
                  ) : (
                    <div className="size-24 rounded-full bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center text-white font-black text-3xl ring-4 ring-white dark:ring-slate-900 shadow-xl">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
                  </div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                <p className="text-[11px] text-slate-400 font-medium">Tap to change</p>
              </div>

              {/* Name preview pill on mobile */}
              <div className="sm:hidden text-center">
                <p className="font-black text-slate-900 dark:text-slate-100 text-lg leading-tight">{displayName || "—"}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">@{username || "—"}</p>
              </div>
            </div>

            {/* Fields — stacked on mobile, 2-col on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Username / Handle
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold select-none">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s/g, "").toLowerCase())}
                    placeholder="yourhandle"
                    className="w-full pl-8 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Interface Appearance Card ── */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <div className="size-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">palette</span>
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Interface Appearance</h2>
          </div>

          <div className="p-5 sm:p-6">
            {/* 3-column grid — shrinks cleanly on mobile */}
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((opt) => {
                const isSelected = theme === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => applyTheme(opt.value)}
                    className={`relative rounded-2xl overflow-hidden transition-all duration-200 active:scale-95 ${
                      isSelected
                        ? "ring-2 ring-primary shadow-lg shadow-primary/10 scale-[1.02]"
                        : "ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-primary/40"
                    }`}
                  >
                    {/* Preview */}
                    <div className={`${opt.bg} h-16 sm:h-24 flex items-center justify-center`}>
                      <span className={`material-symbols-outlined text-3xl sm:text-4xl ${opt.iconColor}`}>
                        {opt.icon}
                      </span>
                    </div>
                    {/* Label row */}
                    <div className={`flex items-center justify-between px-2.5 sm:px-3 py-2 ${
                      isSelected ? "bg-primary/5 dark:bg-primary/10" : "bg-white dark:bg-slate-800"
                    }`}>
                      <span className={`text-xs sm:text-sm font-semibold truncate ${
                        isSelected ? "text-primary" : "text-slate-600 dark:text-slate-400"
                      }`}>
                        {opt.label}
                      </span>
                      <div className={`flex-shrink-0 size-4 sm:size-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        isSelected ? "border-primary bg-primary" : "border-slate-300 dark:border-slate-600"
                      }`}>
                        {isSelected && (
                          <span className="material-symbols-outlined text-white text-[10px] sm:text-[12px]">check</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom spacer for mobile scroll comfort */}
        <div className="h-4" />
      </div>
    </div>
  );
}
