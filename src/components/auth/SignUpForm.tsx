"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormInput } from "@/components/auth/FormInput";
import { AuthLayout } from "@/components/auth/AuthLayout";
import useAuthStore from "@/stores/authStore";
import { toast } from "sonner";
import { useSignup } from "@/hooks/useAuth";

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
      toast.success("Account created successfully!");
      // Redirect to onboarding or dashboard
      router.push("/onboarding");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Signup failed. Please try again.";
      toast.error(msg);
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
            Create your account
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Join 50k+ creators building their digital presence.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4 mb-6" noValidate>
          <FormInput
            label="Full Name"
            type="text"
            placeholder="Alex Rivera"
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
            placeholder="alex@example.com"
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
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => {
                setAgreeToTerms(e.target.checked);
              }}
              className="w-4 h-4 mt-0.5 rounded accent-primary cursor-pointer shrink-0"
            />
            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
              By signing up, you agree to our{" "}
              <Link href="#" className="text-primary hover:text-primary/80 font-semibold">
                Terms of Service
              </Link>
              {" "}and{" "}
              <Link href="#" className="text-primary hover:text-primary/80 font-semibold">
                Privacy Policy
              </Link>
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={signupMutation.isPending}
            className="w-full btn-primary px-5 py-3.5 bg-primary text-white rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-primary/20 disabled:hover:translate-y-0"
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
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          <span className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-600 font-medium">
            Or sign up with
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
