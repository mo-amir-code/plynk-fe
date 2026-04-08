"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";

const COOKIE_NAME = "auth_token";
const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

type TokenPayload = {
  username?: string | null;
  exp?: number;
};

function getAuthCookieToken() {
  if (typeof document === "undefined") return null;

  const cookie = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${COOKIE_NAME}=`));

  return cookie ? decodeURIComponent(cookie.slice(`${COOKIE_NAME}=`.length)) : null;
}

function decodeTokenPayload(token: string): TokenPayload | null {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;

    const decodedJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodedJson) as TokenPayload;
  } catch {
    return null;
  }
}

function isTokenExpired(exp?: number) {
  if (!exp) return false;
  return Date.now() >= exp * 1000;
}

function setAuthCookie(token: string) {
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${ONE_WEEK_IN_SECONDS}`;
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const cookieToken = getAuthCookieToken();
    const queryToken = searchParams.get("token");
    const token = cookieToken || queryToken;

    if (!token) {
      router.replace("/auth/signin");
      return;
    }

    const payload = decodeTokenPayload(token);
    if (!payload || isTokenExpired(payload.exp)) {
      router.replace("/auth/signin");
      return;
    }

    if (!cookieToken) {
      setAuthCookie(token);
    }

    const nextPath = payload.username ? "/dashboard" : "/onboarding";
    router.replace(nextPath);
  }, [router, searchParams]);

  return (
    <AuthLayout>
      <div className="max-w-lg mx-auto w-full min-h-80 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Loader2 className="size-5 animate-spin" />
          <span className="text-sm font-medium">Authenticating with Google...</span>
        </div>
      </div>
    </AuthLayout>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense 
      fallback={
        <AuthLayout>
          <div className="max-w-lg mx-auto w-full min-h-80 flex items-center justify-center">
            <Loader2 className="size-5 animate-spin text-slate-400" />
          </div>
        </AuthLayout>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
