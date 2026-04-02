"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormInput } from "@/components/auth/FormInput";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { authLogin } from "../../../actions/auth";
import { toast } from "sonner";

export function SignInForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      await authLogin(formData);
      toast.success("Login successful");
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      const msg = error.message || "Invalid credentials";
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

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mb-3">
            Welcome back
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Manage your link-in-bio widgets
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 mb-6" noValidate>
          <FormInput
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(val) => {
              setFormData((prev) => ({ ...prev, email: val }));
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
            }}
            icon="mail"
            error={errors.email}
          />

          <FormInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(val) => {
              setFormData((prev) => ({ ...prev, password: val }));
              if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
            }}
            icon="lock"
            showPasswordToggle
            error={errors.password}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary px-5 py-3.5 bg-primary text-white rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-primary/20 disabled:hover:translate-y-0"
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
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-semibold text-slate-900 dark:text-slate-100 cursor-pointer">
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
