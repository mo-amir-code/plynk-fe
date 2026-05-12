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
  const { pathname, search } = request.nextUrl;

  const host = request.headers
    .get("host")
    ?.split(":")[0]
    .toLowerCase();

  // Redirect non-www → www
  // Ignore localhost during development
  if (
    host &&
    host !== "localhost" &&
    !host.startsWith("www.")
  ) {
    return NextResponse.redirect(
      `https://www.${host}${pathname}${search}`,
      301
    );
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? getPayload(token) : null;
  // console.log("Payload from token:", payload);
  const isValid = payload && !isTokenExpired(payload);
  const hasUsername = isValid && !!payload.username;
  const isVerified = isValid && payload.isVerified === true;

  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isVerifyEmailRoute = pathname === "/auth/verify-email";
  const isProtectedRoute = pathname.startsWith("/dashboard");
  const isOnboardingRoute = pathname === "/onboarding";

  // 1. Logged Out Redirects
  if (!isValid) {
    if (isProtectedRoute || isOnboardingRoute || isVerifyEmailRoute) {
      const response = NextResponse.redirect(new URL("/auth/signin", request.url));
      if (token) response.cookies.delete(COOKIE_NAME);
      return response;
    }
    return NextResponse.next();
  }

  // 2. Unverified User Redirects (The Cage)
  // If user is logged in but NOT verified, they ONLY belong on the verify-email page.
  if (!isVerified) {
    if (!isVerifyEmailRoute) {
      return NextResponse.redirect(new URL("/auth/verify-email", request.url));
    }
    return NextResponse.next();
  }

  // 3. Verified User Redirects
  // If they are verified, they should NEVER be on the verify-email page.
  if (isVerifyEmailRoute) {
    return NextResponse.redirect(new URL(hasUsername ? "/dashboard" : "/onboarding", request.url));
  }

  // 4. Auth Page Redirects (Already logged in)
  if (isAuthRoute) {
    return NextResponse.redirect(new URL(hasUsername ? "/dashboard" : "/onboarding", request.url));
  }

  // 5. Onboarding & Username Redirects
  if (!hasUsername && isProtectedRoute) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

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
