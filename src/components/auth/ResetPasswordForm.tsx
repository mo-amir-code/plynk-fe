"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FormInput } from "@/components/auth/FormInput";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { toast } from "sonner";
import { api } from "@/lib/api-client";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Reset token is missing. Please request a new password reset link.");
    }
  }, [token]);

  const validate = () => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or missing token");
      return;
    }

    if (!validate()) return;

    setIsLoading(true);
    try {
      await api.post("/auth/reset-password", {
        token,
        password,
      });
      setIsSuccess(true);
      toast.success("Password reset successful!");
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        router.push("/auth/signin");
      }, 3000);
    } catch (err: any) {
      const msg = err.message || "Failed to reset password. The link may be expired.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout>
        <div className="animate-fade-up text-center">
          <div className="flex justify-center mb-6">
            <div className="size-16 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
              <span className="material-symbols-outlined text-4xl leading-none text-green-500">
                check_circle
              </span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mb-3">
            Password Reset
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-8">
            Your password has been reset successfully. You are being redirected to the sign-in page.
          </p>
          <Link
            href="/auth/signin"
            className="w-full btn-primary px-5 py-3.5 bg-primary text-white rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Sign In Now
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="animate-fade-up">
        {/* Header */}
        <div className="mb-8 sm:mb-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-4xl leading-none text-primary">
                password
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mb-3">
            Set new password
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Please enter your new password below.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 mb-8">
          <FormInput
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
            icon="lock"
            showPasswordToggle={true}
            error={error && error.includes("character") ? error : ""}
          />

          <FormInput
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={setConfirmPassword}
            icon="lock_reset"
            showPasswordToggle={true}
            error={error && error.includes("match") ? error : ""}
          />

          {/* Error Message */}
          {error && !error.includes("characters") && !error.includes("match") && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3 animate-shake">
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
            disabled={isLoading || !token}
            className="w-full btn-primary px-5 py-3.5 bg-primary text-white rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Resetting password...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg leading-none">key</span>
                Reset Password
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
      </div>
    </AuthLayout>
  );
}
