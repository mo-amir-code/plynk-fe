"use client";

import { useEffect, useRef, useState } from "react";
import { 
  User as UserIcon, 
  Mail, 
  Palette, 
  Save, 
  Loader2, 
  Camera,
  Monitor,
  Moon,
  Sun,
  AtSign,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  Settings,
  Bell,
  Lock,
  Globe
} from "lucide-react";
import { toast } from "sonner";
import useAuthStore from "@/stores/authStore";
import { useAppTheme } from "@/components/theme/ThemeProvider";
import { useGetMe, useUpdateProfile } from "@/hooks/useUsers";
import type { SettingsDraftProfile, Theme } from "@/types/app/dashboard/settings";

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const { theme, setTheme } = useAppTheme();
  const [draftProfile, setDraftProfile] = useState<SettingsDraftProfile | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const fileRef = useRef<HTMLInputElement>(null);
  const getMeQuery = useGetMe();
  const updateProfileMutation = useUpdateProfile();

  useEffect(() => {
    if (getMeQuery.data) {
      setUser(getMeQuery.data);
    }
  }, [getMeQuery.data, setUser]);

  useEffect(() => {
    if (getMeQuery.isError) {
      toast.error("Could not load profile details");
    }
  }, [getMeQuery.isError]);

  const profile = draftProfile ?? {
    displayName: getMeQuery.data?.fullName || user?.fullName || "",
    username: getMeQuery.data?.username || user?.username || "",
    email: getMeQuery.data?.email || user?.email || "",
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const result = await updateProfileMutation.mutateAsync({
        fullName: profile.displayName,
        username: profile.username,
      });
      setUser(result);
      setDraftProfile({
        displayName: result.fullName || "",
        username: result.username || "",
        email: result.email || "",
      });
      toast.success("Settings updated successfully");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to save changes";
      toast.error(message);
    }
  };

  if (getMeQuery.isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-black/20">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Top Section */}
      <div className="border-b border-slate-200 dark:border-slate-800/60 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md sticky top-0 z-10 px-6 sm:px-10 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-slate-900 dark:text-white">
              <Settings className="size-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-none tracking-tight">Settings</h1>
              <p className="text-xs text-slate-500 font-medium mt-1">Manage your team and account preferences</p>
            </div>
          </div>
          
          <button
            onClick={handleSave}
            disabled={updateProfileMutation.isPending}
            className="inline-flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
          >
            {updateProfileMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Nav */}
          <aside className="w-full lg:w-64 shrink-0">
            <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-4 lg:pb-0 scrollbar-none">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                      active 
                        ? "bg-slate-100 dark:bg-slate-900 text-slate-950 dark:text-white" 
                        : "text-slate-500 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/50"
                    }`}
                  >
                    <Icon className="size-4.5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Settings Content */}
          <main className="flex-1 max-w-2xl">
            {activeTab === "profile" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-400">
                {/* Header */}
                <header>
                  <h2 className="text-2xl font-bold text-slate-950 dark:text-white tracking-tight">Profile</h2>
                  <p className="text-sm text-slate-500 mt-1">Manage your account details and identity.</p>
                </header>

                {/* Avatar */}
                <section className="flex items-center gap-8 py-6 border-y border-slate-100 dark:border-slate-900">
                  <div className="relative group shrink-0">
                    <div className="size-20 rounded-2xl bg-slate-100 dark:bg-slate-900 overflow-hidden relative ring-1 ring-slate-200 dark:ring-slate-800">
                      {avatarSrc ? (
                        <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 text-slate-600 dark:text-slate-400">
                          {profile.displayName.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                      
                      <button 
                        onClick={() => fileRef.current?.click()}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                      >
                        <Camera className="size-5" />
                      </button>
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-950 dark:text-white">Profile Photo</h4>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG or GIF. Max 3MB.</p>
                    <button 
                      onClick={() => fileRef.current?.click()}
                      className="mt-2 text-xs font-bold text-primary hover:underline"
                    >
                      Upload new photo
                    </button>
                  </div>
                </section>

                {/* Form */}
                <section className="grid grid-cols-1 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-950 dark:text-white">Full Name</label>
                    <input
                      type="text"
                      value={profile.displayName}
                      onChange={(e) =>
                        setDraftProfile((prev) => ({ ...profile, ...prev, displayName: e.target.value }))
                      }
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-medium text-slate-950 dark:text-white placeholder-slate-400"
                    />
                    <p className="text-[10px] text-slate-500">Your real name will be displayed in emails and receipts.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-950 dark:text-white">Username</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">@</span>
                      <input
                        type="text"
                        value={profile.username}
                        onChange={(e) =>
                          setDraftProfile((prev) => ({
                            ...profile,
                            ...prev,
                            username: e.target.value.toLowerCase().replace(/\s+/g, ""),
                          }))
                        }
                        placeholder="username"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-medium text-slate-950 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-950 dark:text-white">Email Address</label>
                    <div className="relative opacity-60">
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-500 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500">To change your email, contact support.</p>
                  </div>
                </section>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <header>
                  <h2 className="text-2xl font-bold text-slate-950 dark:text-white tracking-tight">Appearance</h2>
                  <p className="text-sm text-slate-500 mt-1">Customize how Plynk looks for you.</p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: "light", label: "Light", icon: Sun },
                    { id: "dark", label: "Dark", icon: Moon },
                  ].map((option) => {
                    const active = theme === option.id;
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setTheme(option.id as Theme)}
                        className={`flex flex-col gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                          active 
                            ? "border-primary bg-primary/5" 
                            : "border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 hover:border-slate-200 dark:hover:border-slate-800"
                        }`}
                      >
                        <Icon className={`size-5 ${active ? "text-primary" : "text-slate-500"}`} />
                        <span className={`text-sm font-bold ${active ? "text-slate-950 dark:text-white" : "text-slate-500"}`}>
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <h4 className="text-sm font-semibold text-slate-950 dark:text-white flex items-center gap-2">
                    <Globe className="size-4 text-slate-400" />
                    Interface Language
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">Default is set to English (US).</p>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <header>
                  <h2 className="text-2xl font-bold text-slate-950 dark:text-white tracking-tight">Notifications</h2>
                  <p className="text-sm text-slate-500 mt-1">Control how and when we notify you.</p>
                </header>

                <div className="rounded-3xl border border-slate-200 bg-white px-6 py-8 text-left shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-4 inline-flex items-center rounded-full border border-amber-300/60 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:border-amber-700/40 dark:bg-amber-950/30 dark:text-amber-300">
                    Coming Soon
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Notification preferences are under active development</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    We’re building granular controls for product updates, account alerts, and security notifications.
                  </p>
                  <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                    This section will be enabled automatically once it launches.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <header>
                  <h2 className="text-2xl font-bold text-slate-950 dark:text-white tracking-tight">Security</h2>
                  <p className="text-sm text-slate-500 mt-1">Protect your account and access.</p>
                </header>

                <div className="rounded-3xl border border-slate-200 bg-white px-6 py-8 text-left shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-4 inline-flex items-center rounded-full border border-amber-300/60 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:border-amber-700/40 dark:bg-amber-950/30 dark:text-amber-300">
                    Coming Soon
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Security controls are under active development</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    We’re preparing features like session management, sign-in protection, and account recovery controls.
                  </p>
                  <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                    You’ll get access here as soon as rollout is complete.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <header>
                  <h2 className="text-2xl font-bold text-slate-950 dark:text-white tracking-tight">Billing</h2>
                  <p className="text-sm text-slate-500 mt-1">Manage your subscription and invoices.</p>
                </header>

                <div className="rounded-3xl border border-slate-200 bg-white px-6 py-8 text-left shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-4 inline-flex items-center rounded-full border border-amber-300/60 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:border-amber-700/40 dark:bg-amber-950/30 dark:text-amber-300">
                    Coming Soon
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Billing portal is under active development</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    We’re finalizing subscription management, invoice history, and payment method controls.
                  </p>
                  <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                    Billing tools will appear here once rollout is complete.
                  </p>
                </div>

                {/* Billing Pro section */}
                <div className="mt-6 rounded-3xl border border-white/10 bg-linear-to-br from-slate-900 via-slate-950 to-black p-10 text-white relative overflow-hidden group shadow-2xl dark:shadow-none">
                  <div className="absolute -top-32 -right-32 size-80 bg-primary/20 rounded-full blur-[100px] group-hover:bg-primary/30 transition-all duration-1000" />
                  <div className="absolute -bottom-32 -left-32 size-80 bg-orange-500/10 rounded-full blur-[100px] group-hover:bg-orange-500/20 transition-all duration-1000" />

                  <div className="relative z-10 space-y-8">
                    <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
                      <ShieldCheck className="size-3.5 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Enterprise Access</span>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-4xl font-black tracking-tighter flex items-center gap-3">
                        Plynk <span className="bg-linear-to-r from-primary to-orange-400 bg-clip-text text-transparent italic">PRO</span>
                      </h3>
                      <p className="max-w-sm text-base font-medium leading-relaxed text-slate-400">
                        Deploy unlimited widgets, unlock global analytics, and get priority developer support.
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <button className="cursor-pointer flex items-center gap-2.5 px-8 py-3.5 bg-white text-slate-950 rounded-xl text-xs font-black transition-all hover:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0 shadow-xl shadow-black/20">
                        <CreditCard className="size-4" />
                        Manage Subscription
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
