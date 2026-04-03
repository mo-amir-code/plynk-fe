"use server";

import { api } from "@/lib/api-client";
import { AuthResponse, User } from "@/types/auth";
import { cookies } from "next/headers";

const COOKIE_NAME = "auth_token";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }

  return fallback;
}

export async function authLogin(data: { email: string; password: string }) {
  try {
    const result = await api.post<AuthResponse>("/auth/login", data);

    if (result && result.token) {
      const cookieStore = await cookies();
      cookieStore.set(COOKIE_NAME, result.token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return result.user;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Login failed"));
  }
}

export async function authLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function checkAuthStatus() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return !!token;
}

export async function authSignup(data: { email: string; password: string; fullName: string, tnc: boolean }) {
  try {
    console.log("Signup data:", data);
    const result = await api.post<AuthResponse>("/auth/register", data);

    if (result && result.token) {
      const cookieStore = await cookies();
      cookieStore.set(COOKIE_NAME, result.token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return result.user;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Signup failed"));
  }
}

export async function checkUsernameAvailability(username: string) {
  try {
    const result = await api.get<{ isAvailable: boolean }>(`/auth/check-username/${username}`);
    return result.isAvailable;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Username check failed"));
  }
}

export async function claimUsername(username: string) {
  try {
    const result = await api.patch<AuthResponse>("/auth/claim-username", {
      username,
    });

    if (result && result.token) {
      const cookieStore = await cookies();
      cookieStore.set(COOKIE_NAME, result.token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return result.user;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Username claim failed"));
  }
}

export async function getMe() {
  try {
    return await api.get<User>("/users/me");
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to fetch user"));
  }
}

export async function updateProfile(data: { fullName?: string; username?: string }) {
  try {
    return await api.patch<User>("/users/me", data);
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to update profile"));
  }
}
