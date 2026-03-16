"use server";

import { api } from "@/lib/api-client";
import { AuthResponse } from "@/types/auth";
import { cookies } from "next/headers";

const COOKIE_NAME = "auth_token";

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
  } catch (error: any) {
    throw new Error(error.message || "Login failed");
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

export async function authSignup(data: { email: string; password: string; fullName: string }) {
  try {
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
  } catch (error: any) {
    throw new Error(error.message || "Signup failed");
  }
}

export async function checkUsernameAvailability(username: string) {
  try {
    const result = await api.get<{ isAvailable: boolean }>(`/auth/check-username/${username}`);
    return result.isAvailable;
  } catch (error: any) {
    throw new Error(error.message || "Username check failed");
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
  } catch (error: any) {
    throw new Error(error.message || "Username claim failed");
  }
}

export async function getMe() {
  try {
    return await api.get<any>("/users/me");
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch user");
  }
}

export async function updateProfile(data: { fullName?: string; username?: string }) {
  try {
    return await api.patch<any>("/users/me", data);
  } catch (error: any) {
    throw new Error(error.message || "Failed to update profile");
  }
}
