"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { toast } from "sonner";
import { useVerifyOTP, useResendOTP, useLogout } from "@/hooks/useAuth";
import useAuthStore from "@/stores/authStore";
import Link from "next/link";

import { useSearchParams } from "next/navigation";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const [isInputMode, setIsInputMode] = useState(!searchParams.get("send"));
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  
  const { user } = useAuthStore();
  const verifyMutation = useVerifyOTP();
  const resendMutation = useResendOTP();
  const logoutMutation = useLogout();

  // Auto-focus first input on load
  useEffect(() => {
    if (isInputMode) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isInputMode]);

  // Handle countdown timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isInputMode) {
      handleResend();
      return;
    }

    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    try {
      await verifyMutation.mutateAsync({ email: user!.email, code });
      toast.success("Identity verified successfully");
      router.push("/onboarding");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Invalid or expired code");
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 && isInputMode) return;
    
    try {
      await resendMutation.mutateAsync({ email: user!.email });
      toast.success("Verification code sent to your email");
      setIsInputMode(true);
      setResendTimer(60);
    } catch (error: any) {
      toast.error(error.message || "Failed to send code");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.push("/auth/signin");
    } catch (error) {
      router.push("/auth/signin");
    }
  };

  return (
    <AuthLayout>
      <div className="animate-fade-up">
        {/* Header */}
        <div className="mb-8 sm:mb-10 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-3xl text-primary">
              {isInputMode ? "mark_email_read" : "contact_mail"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-3">
            {isInputMode ? "Verify your email" : "Needs Verification"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-2">
            {isInputMode 
              ? "Enter the verification code sent to" 
              : "To protect your digital identity, please verify"}
          </p>
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            {user?.email}
          </p>
        </div>

        {/* Dynamic Content: Request Mode vs Verify Mode */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {isInputMode ? (
            <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  autoFocus={index === 0}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              ))}
            </div>
          ) : (
             <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Click below and we'll send a 6-digit verification code to your inbox.
                </p>
             </div>
          )}

          <button
            type="submit"
            disabled={verifyMutation.isPending || resendMutation.isPending}
            className="w-full relative group overflow-hidden px-5 py-4 bg-linear-to-b from-primary/95 to-primary/85 hover:brightness-90 text-white/90 rounded-2xl text-sm sm:text-base font-bold shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.05)] ring-1 ring-white/10 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {verifyMutation.isPending || resendMutation.isPending ? (
              "Please wait..."
            ) : isInputMode ? (
              "Confirm Verification"
            ) : (
              <>
                <span className="material-symbols-outlined text-lg leading-none">send</span>
                Send Verification Code
              </>
            )}
          </button>
        </form>

        {/* Footer Actions */}
        <div className="mt-10 text-center space-y-6">
          <div className="text-sm">
            <span className="text-slate-500 dark:text-slate-400">Didn&apos;t receive the code? </span>
            <button
              onClick={handleResend}
              disabled={resendTimer > 0 || resendMutation.isPending}
              className={`font-semibold transition-colors ${
                resendTimer > 0 
                ? "text-slate-400 cursor-not-allowed" 
                : "text-primary hover:text-primary/80 cursor-pointer"
              }`}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Now"}
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors group cursor-pointer"
          >
            <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">logout</span>
            Back to Sign in / Change Email
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
