"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormInput } from "@/components/auth/FormInput";
import { AuthLayout } from "@/components/auth/AuthLayout";
import useAuthStore from "@/stores/authStore";
import { toast } from "sonner";
import { useSignup } from "@/hooks/useAuth";
import { redirectToGoogleAuth } from "@/lib/google-auth";

export function SignUpForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { setUser } = useAuthStore();
  const signupMutation = useSignup();

  const validateForm = (): boolean => {
    setFullNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let hasError = false;

    if (!fullName) {
      setFullNameError("Full name is required");
      hasError = true;
    } else if (fullName.length < 2) {
      setFullNameError("Full name must be at least 2 characters");
      hasError = true;
    }

    if (!email) {
      setEmailError("Email address is required");
      hasError = true;
    } else if (!email.includes("@")) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    }

    if (!agreeToTerms) {
      toast.error("You must agree to the Terms and Privacy Policy");
      hasError = true;
    }

    return !hasError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const auth = await signupMutation.mutateAsync({ email, password, fullName, tnc: agreeToTerms });
      setUser(auth.user);
      toast.success("Account created! Please verify your email.");
      router.push("/auth/verify-email");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Signup failed. Please try again.";
      toast.error(msg);
    }
  };

  const handleGoogleAuth = () => {
    try {
      setIsGoogleLoading(true);
      redirectToGoogleAuth();
    } catch {
      setIsGoogleLoading(false);
      toast.error("Unable to continue with Google. Please try again.");
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

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-3">
            Create your account
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Showcase your world, exactly your way.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4 mb-6" noValidate>
          <FormInput
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(val) => {
              setFullName(val);
              if (fullNameError) setFullNameError("");
            }}
            icon="person"
            error={fullNameError}
          />

          <FormInput
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(val) => {
              setEmail(val);
              if (emailError) setEmailError("");
            }}
            icon="mail"
            error={emailError}
          />

          <FormInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(val) => {
              setPassword(val);
              if (passwordError) setPasswordError("");
            }}
            icon="lock"
            showPasswordToggle
            error={passwordError}
          />

          <FormInput
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(val) => {
              setConfirmPassword(val);
              if (confirmPasswordError) setConfirmPasswordError("");
            }}
            icon="lock"
            showPasswordToggle
            error={confirmPasswordError}
          />

          {/* Terms Agreement */}
          <div className="flex items-start gap-3 group px-1">
            <div className="relative flex items-center h-5 mt-0.5">
              <input
                id="terms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 transition-all checked:bg-primary checked:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
              <span className="absolute text-white transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            <label htmlFor="terms" className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors cursor-pointer select-none">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline font-semibold">
                Terms of Service
              </Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-primary hover:underline font-semibold">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={signupMutation.isPending}
            className="w-full relative group overflow-hidden px-5 py-4 bg-linear-to-b from-primary/95 to-primary/85 hover:brightness-90 text-white/90 rounded-2xl text-sm sm:text-base font-bold shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.05)] ring-1 ring-white/10 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {signupMutation.isPending ? (
              <>
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg leading-none">person_add</span>
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600 font-bold">
            Or
          </span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all font-semibold text-slate-700 dark:text-slate-200 cursor-pointer disabled:opacity-50 group active:scale-[0.99] backdrop-blur-md"
        >
          <svg className="size-5 shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span className="text-[14px]">
            {isGoogleLoading ? "Connecting..." : "Continue with Google"}
          </span>
        </button>
        <div className="mb-8 mt-3" />

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
