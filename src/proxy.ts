import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "auth_token";
const AUTH_ROUTES = ["/auth/signin", "/auth/signup", "/auth/forgot-password"];

function getPayload(token: string) {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;
    const decodedJson = Buffer.from(payloadBase64, "base64").toString();
    return JSON.parse(decodedJson);
  } catch {
    return null;
  }
}

function isTokenExpired(payload: any) {
  if (!payload) return true;
  const exp = payload.exp;
  if (!exp) return false;
  return Date.now() >= exp * 1000;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? getPayload(token) : null;
  const isValid = payload && !isTokenExpired(payload);
  const hasUsername = isValid && !!payload.username;

  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isProtectedRoute = pathname.startsWith("/dashboard");
  const isOnboardingRoute = pathname === "/onboarding";

  // 1. Logged Out Redirects
  if (!isValid) {
    if (isProtectedRoute || isOnboardingRoute) {
      const response = NextResponse.redirect(new URL("/auth/signin", request.url));
      if (token) response.cookies.delete(COOKIE_NAME);
      return response;
    }
    return NextResponse.next();
  }

  // 2. Logged In Redirects
  // If user is logged in but trying to access auth pages (signin/signup)
  if (isAuthRoute) {
    return NextResponse.redirect(new URL(hasUsername ? "/dashboard" : "/onboarding", request.url));
  }

  // If user is logged in but doesn't have a username, they MUST be on /onboarding
  if (!hasUsername && isProtectedRoute) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // If user is logged in AND has a username, they CANNOT be on /onboarding
  if (hasUsername && isOnboardingRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ],
};
