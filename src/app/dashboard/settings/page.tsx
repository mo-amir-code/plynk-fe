"use client";

import { useEffect, useRef, useState } from "react";
import {
  User as UserIcon,
  Palette,
  Save,
  Loader2,
  Camera,
  Moon,
  Sun,
  ShieldCheck,
  CreditCard,
  Settings,
  Bell,
  Lock,
  Globe,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import useAuthStore from "@/stores/authStore";
import { useAppTheme } from "@/components/theme/ThemeProvider";
import { useGetMe, useUpdateProfile, useUpdateAvatar, useRemoveAvatar } from "@/hooks/useUsers";
import type { SettingsDraftProfile, Theme } from "@/types/app/dashboard/settings";

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const { theme, setTheme } = useAppTheme();
  const [draftProfile, setDraftProfile] = useState<SettingsDraftProfile | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const fileRef = useRef<HTMLInputElement>(null);
  const getMeQuery = useGetMe();
  const updateProfileMutation = useUpdateProfile();
  const updateAvatarMutation = useUpdateAvatar();
  const removeAvatarMutation = useRemoveAvatar();

  useEffect(() => {
    if (getMeQuery.data) setUser(getMeQuery.data);
  }, [getMeQuery.data, setUser]);

  useEffect(() => {
    if (getMeQuery.isError) toast.error("Could not load profile details");
  }, [getMeQuery.isError]);

  const profile = draftProfile ?? {
    displayName: getMeQuery.data?.fullName || user?.fullName || "",
    username: getMeQuery.data?.username || user?.username || "",
    email: getMeQuery.data?.email || user?.email || "",
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await updateAvatarMutation.mutateAsync(file);
      setUser(result);
      toast.success("Profile photo updated");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to update photo");
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const result = await removeAvatarMutation.mutateAsync();
      setUser(result);
      toast.success("Profile photo removed");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to remove photo");
    }
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
      <div className="h-full flex items-center justify-center py-24">
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

  /* ─── Shared styles ─── */
  const inputCls =
    "w-full h-11 px-4 rounded-xl text-sm font-medium outline-none transition-all " +
    "bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/5 " +
    "dark:bg-white/5 dark:border-white/5 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-primary/40 dark:focus:ring-0 dark:focus:shadow-[0_0_20px_rgba(255,77,0,0.08)]";

  const sectionCardCls =
    "rounded-2xl border p-5 " +
    "bg-slate-50 border-slate-200 " +
    "dark:bg-white/[0.02] dark:border-white/5";

  const labelCls = "text-[10px] font-black uppercase tracking-widest text-slate-500";

  const ComingSoon = ({ title, description }: { title: string; description: string }) => (
    <div className={sectionCardCls}>
      <div className="mb-4 inline-flex items-center rounded-full border border-amber-400/40 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
        Coming Soon
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
    </div>
  );

  return (
    <div className="min-h-full">
      {/* ── Top Bar ── */}
      <div className="sticky top-0 z-10 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/80 backdrop-blur-xl px-6 sm:px-10 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-primary relative">
              <Settings className="size-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-none tracking-tight">
                Settings
              </h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">
                Account & Preferences
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={updateProfileMutation.isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-[11px] font-bold capitalize rounded-lg transition-all shadow-primary/20 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {updateProfileMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" strokeWidth={3} />
            )}
            {updateProfileMutation.isPending ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Sidebar Nav ── */}
          <aside className="w-full lg:w-56 shrink-0">
            <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer
                      ${active
                        ? "bg-primary/10 text-slate-900 dark:text-white"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.03]"
                      }`}
                  >
                    {/* Orange left-edge indicator */}
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full shadow-[2px_0_10px_rgba(255,77,0,0.5)]" />
                    )}
                    <Icon className={`size-4 shrink-0 ${active ? "text-primary" : ""}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* ── Content ── */}
          <main className="flex-1 max-w-2xl space-y-8">

            {/* ── Profile ── */}
            {activeTab === "profile" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <header>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Profile</h2>
                  <p className="text-sm text-slate-500 mt-1">Manage your account details and identity.</p>
                </header>

                {/* Avatar */}
                <section className="flex items-center gap-6 py-6 border-y border-slate-200 dark:border-white/5">
                  <div className="relative group shrink-0">
                    <div className="size-20 rounded-2xl overflow-hidden relative bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                      {updateAvatarMutation.isPending || removeAvatarMutation.isPending ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <Loader2 className="size-5 animate-spin text-primary" />
                        </div>
                      ) : user?.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-black text-slate-400 dark:text-white/60">
                          {profile.displayName.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                      <button
                        onClick={() => fileRef.current?.click()}
                        disabled={updateAvatarMutation.isPending || removeAvatarMutation.isPending}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer disabled:cursor-not-allowed"
                      >
                        <Camera className="size-5" />
                      </button>
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Profile Photo</h4>
                    <p className="text-[11px] text-slate-500 mt-1">PNG, JPG or GIF. Max 2MB.</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button
                        onClick={() => fileRef.current?.click()}
                        className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                      >
                        Upload new photo
                      </button>
                      {user?.profileImage && (
                        <button
                          onClick={handleRemoveAvatar}
                          className="text-[11px] font-bold text-rose-500 hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="size-3" />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </section>

                {/* Form Fields */}
                <section className="space-y-6">
                  <div className="space-y-2">
                    <label className={labelCls}>Full Name</label>
                    <input
                      type="text"
                      value={profile.displayName}
                      onChange={(e) =>
                        setDraftProfile((prev) => ({ ...profile, ...prev, displayName: e.target.value }))
                      }
                      placeholder="e.g. John Doe"
                      className={inputCls}
                    />
                    <p className="text-[10px] text-slate-400">Displayed in emails and receipts.</p>
                  </div>

                  <div className="space-y-2">
                    <label className={labelCls}>Username</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold select-none">@</span>
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
                        className={`${inputCls} pl-9`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={labelCls}>Email Address</label>
                    <div className="opacity-50">
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className={`${inputCls} cursor-not-allowed`}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">To change your email, contact support.</p>
                  </div>
                </section>
              </div>
            )}

            {/* ── Appearance ── */}
            {activeTab === "appearance" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <header>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Appearance</h2>
                  <p className="text-sm text-slate-500 mt-1">Customize how Plynk looks for you.</p>
                </header>

                <div className="grid grid-cols-2 gap-3">
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
                        className={`flex flex-col gap-3 p-5 rounded-2xl border-2 transition-all text-left cursor-pointer
                          ${active
                            ? "border-primary bg-primary/5 dark:bg-primary/10"
                            : "border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] hover:border-slate-300 dark:hover:border-white/10"
                          }`}
                      >
                        <Icon className={`size-5 ${active ? "text-primary" : "text-slate-400 dark:text-slate-500"}`} />
                        <span className={`text-sm font-bold ${active ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className={sectionCardCls}>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Globe className="size-4 text-slate-400" />
                    Interface Language
                  </h4>
                  <p className="text-xs text-slate-500 mt-1.5">Default is set to English (US).</p>
                </div>
              </div>
            )}

            {/* ── Notifications ── */}
            {activeTab === "notifications" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <header>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Notifications</h2>
                  <p className="text-sm text-slate-500 mt-1">Control how and when we notify you.</p>
                </header>
                <ComingSoon
                  title="Notification preferences are under active development"
                  description="We're building granular controls for product updates, account alerts, and security notifications. This section will be enabled automatically once it launches."
                />
              </div>
            )}

            {/* ── Security ── */}
            {activeTab === "security" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <header>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Security</h2>
                  <p className="text-sm text-slate-500 mt-1">Protect your account and access.</p>
                </header>
                <ComingSoon
                  title="Security controls are under active development"
                  description="We're preparing features like session management, sign-in protection, and account recovery controls. You'll get access here once rollout is complete."
                />
              </div>
            )}

            {/* ── Billing ── */}
            {activeTab === "billing" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <header>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Billing</h2>
                  <p className="text-sm text-slate-500 mt-1">Manage your subscription and invoices.</p>
                </header>

                <ComingSoon
                  title="Billing portal is under active development"
                  description="We're finalizing subscription management, invoice history, and payment method controls. Billing tools will appear here once rollout is complete."
                />

                {/* Plynk PRO card — always dark by design */}
                <div className="rounded-2xl border border-white/10 bg-slate-950 dark:bg-[#0a0c10] p-8 relative overflow-hidden">
                  <div className="absolute -top-24 -right-24 size-64 bg-primary/15 rounded-full blur-[80px] pointer-events-none" />
                  <div className="absolute -bottom-24 -left-24 size-64 bg-orange-500/8 rounded-full blur-[80px] pointer-events-none" />
                  <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

                  <div className="relative z-10 space-y-6">
                    <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      <ShieldCheck className="size-3.5 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Enterprise Access
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-4xl font-black tracking-tighter flex items-center gap-3 text-white">
                        Plynk{" "}
                        <span className="bg-linear-to-r from-primary to-orange-400 bg-clip-text text-transparent italic">
                          PRO
                        </span>
                      </h3>
                      <p className="max-w-sm text-sm font-medium leading-relaxed text-slate-400">
                        Deploy unlimited widgets, unlock global analytics, and get priority developer support.
                      </p>
                    </div>

                    <button className="inline-flex items-center gap-2.5 px-7 py-3 bg-white text-slate-950 rounded-xl text-xs font-black transition-all hover:bg-slate-100 active:translate-y-0 shadow-xl shadow-black/30">
                      <CreditCard className="size-4" />
                      Manage Subscription
                    </button>
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
