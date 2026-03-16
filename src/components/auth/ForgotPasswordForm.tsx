"use client";

import { useState } from "react";
import Link from "next/link";
import { FormInput } from "@/components/auth/FormInput";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setSubmitted(true);
      toast.success("Password reset link sent!");
    } catch (err: any) {
      const msg = err.message || "Failed to send reset link. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="animate-fade-up">
        {/* Header */}
        <div className="mb-8 sm:mb-10 text-center">
          <Link href="/" className="inline-flex items-center gap-2 bg-linear-to-r from-primary/20 to-primary/5 px-4 py-2 rounded-full mb-6 border border-primary/20 hover:border-primary/40 transition-colors group">
            <span className="material-symbols-outlined text-lg leading-none text-primary">arrow_back</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Back to Home</span>
          </Link>

          {!submitted ? (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <span className="material-symbols-outlined text-4xl leading-none text-primary">
                    lock_reset
                  </span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mb-3">
                Reset your password
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>
            </>
          ) : (
            <>
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="size-16 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 animate-scale-in">
                  <span className="material-symbols-outlined text-4xl leading-none text-green-500">
                    check_circle
                  </span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mb-3">
                Check your email
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                We&apos;ve sent a password reset link to{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-100">{email}</span>
              </p>
            </>
          )}
        </div>

        {!submitted ? (
          <>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 mb-8">
              <FormInput
                label="Email address"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={setEmail}
                icon="mail"
                error={error}
              />

              {/* Error Message */}
              {error && !error.includes("Please enter") && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
                  <span className="material-symbols-outlined text-lg leading-none text-red-600 dark:text-red-400 shrink-0">
                    error
                  </span>
                  <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                    {error}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary px-5 py-3.5 bg-primary text-white rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-primary/20 disabled:hover:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending link...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg leading-none">mail_lock</span>
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            {/* Alt Actions */}
            <div className="text-center text-sm text-slate-600 dark:text-slate-400 space-y-2">
              <p>
                Remember your password?{" "}
                <Link
                  href="/auth/signin"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Success Actions */}
            <div className="space-y-4 mb-8">
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
                <span className="material-symbols-outlined text-lg leading-none text-blue-600 dark:text-blue-400 shrink-0">
                  info
                </span>
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Check your spam folder if you don&apos;t see the email within a few minutes.
                </p>
              </div>

              <button
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                }}
                className="w-full px-5 py-3.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-xl text-base font-bold hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg leading-none">edit</span>
                Try another email
              </button>
            </div>

            {/* Help Text */}
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Still need help?{" "}
              <a
                href="/support"
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Contact Support
              </a>
            </p>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
