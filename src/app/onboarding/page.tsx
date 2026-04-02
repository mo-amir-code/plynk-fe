"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import useAuthStore from "@/stores/authStore";
import { Loader2, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { checkUsernameAvailability, claimUsername } from "../../../actions/auth";
import { APP_DOMAIN } from "@/config/app-config";

type Status = "idle" | "checking" | "available" | "taken" | "invalid";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simple debounce logic
  useEffect(() => {
    if (!username) {
      setStatus("idle");
      return;
    }

    // Invalid formatting
    if (username.length < 3 || username.length > 20 || !/^[a-zA-Z0-9_-]+$/.test(username)) {
      setStatus("invalid");
      return;
    }

    setStatus("checking");

    const timer = setTimeout(async () => {
      try {
        const isAvailable = await checkUsernameAvailability(username);
        if (isAvailable) {
          setStatus("available");
        } else {
          setStatus("taken");
        }
      } catch (err) {
        setStatus("idle");
      }
    }, 600); // 600ms latency simulation

    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status !== "available") {
      toast.error("Please choose an available username.");
      return;
    }

    setIsSubmitting(true);
    try {
      await claimUsername(username);
      
      if (user) {
        setUser({ ...user, username });
      }
      toast.success("Username claimed successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to claim username. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="animate-fade-up max-w-lg mx-auto w-full">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-4xl leading-none text-primary">
                badge
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
            Claim your link
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Choose a unique username for your Plynk hub.
            <br className="hidden sm:block" /> You can always change this later in settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Input Area */}
          <div className="space-y-3">
            <div
              className={`relative flex items-center w-full px-5 py-4 border-2 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden transition-all duration-300 shadow-sm
                ${status === "available"
                  ? "border-green-500/50 shadow-green-500/10 focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/20"
                  : status === "taken" || status === "invalid"
                  ? "border-red-500/50 shadow-red-500/10 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/20"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20"
              }`}
            >
              {/* Domain Prefix */}
              <span className="text-base sm:text-lg font-medium text-slate-400 dark:text-slate-500 select-none mr-0.5">
                {APP_DOMAIN}/
              </span>

              {/* Input */}
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="yourname"
                autoComplete="off"
                spellCheck="false"
                className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 text-base sm:text-lg font-bold border-none outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700 placeholder:font-medium p-0"
                maxLength={30}
              />

              {/* Status Icons */}
              <div className="absolute right-5 flex items-center justify-center size-6 shrink-0 transition-opacity">
                {status === "checking" && (
                  <Loader2 className="size-5 text-primary animate-spin" />
                )}
                {status === "available" && (
                  <CheckCircle className="size-5 text-green-500 animate-scale-in" />
                )}
                {(status === "taken" || status === "invalid") && (
                  <XCircle className="size-5 text-red-500 animate-scale-in" />
                )}
              </div>
            </div>

            {/* Hint text */}
            <div className="h-5 px-1 animate-fade-in">
              {status === "invalid" && username.length > 0 && username.length < 3 && (
                <p className="text-sm font-medium text-red-500">Username must be at least 3 characters</p>
              )}
              {status === "invalid" && username.length >= 3 && (
                <p className="text-sm font-medium text-red-500">Use only letters, numbers, hyphens, and underscores</p>
              )}
              {status === "taken" && (
                <p className="text-sm font-medium text-red-500">This username is already taken.</p>
              )}
              {status === "available" && (
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Perfect! This username is yours.</p>
              )}
            </div>
          </div>

          {/* Setup Button */}
          <button
            type="submit"
            disabled={status !== "available" || isSubmitting}
            className="w-full btn-primary px-5 py-4 bg-primary text-white rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-primary/20 disabled:hover:translate-y-0 disabled:saturate-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Claiming...
              </>
            ) : (
              <>
                Complete Setup
                <ArrowRight className="size-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
