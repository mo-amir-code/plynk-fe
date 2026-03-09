"use client";

import { useState } from "react";
import Link from "next/link";
import useAuthStore from "@/stores/authStore";
import { FormInput } from "@/components/auth/FormInput";
import { AuthLayout } from "@/components/auth/AuthLayout";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const { login, isLoading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!email || !password) {
      setLocalError("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      setLocalError("Please enter a valid email address");
      return;
    }

    try {
      await login(email, password);
      // Redirect to dashboard (would be next/navigation in real app)
      window.location.href = "/dashboard";
    } catch (err) {
      setLocalError(error || "Login failed. Please try again.");
    }
  };

  return (
    <AuthLayout>
      <div className="animate-fade-up">
        {/* Header */}
        <div className="mb-8 sm:mb-10 text-center">
          <Link href="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-primary/5 px-4 py-2 rounded-full mb-6 border border-primary/20 hover:border-primary/40 transition-colors group">
            <span className="material-symbols-outlined text-lg leading-none text-primary">arrow_back</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Back to Home</span>
          </Link>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mb-3">
            Welcome back
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Manage your link-in-bio widgets
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 mb-6">
          <FormInput
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={setEmail}
            icon="mail"
            error={localError.includes("email") ? localError : ""}
          />

          <FormInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
            icon="lock"
            showPasswordToggle
            error={localError.includes("password") ? localError : ""}
          />

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded accent-primary cursor-pointer"
                defaultChecked
              />
              <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                Remember me for 30 days
              </span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Error Message */}
          {(localError || error) && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
              <span className="material-symbols-outlined text-lg leading-none text-red-600 dark:text-red-400 flex-shrink-0">
                error
              </span>
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                {localError || error}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary px-5 py-3.5 bg-primary text-white rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg leading-none">login</span>
                Sign in
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          <span className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-600 font-medium">
            Or continue with
          </span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* OAuth Button */}
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-semibold text-slate-900 dark:text-slate-100">
          <i className="devicon-google-plain text-lg" />
          <span className="text-sm">Continue with Google</span>
        </button>
        <div className="mb-8 mt-3" />

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
