"use client";

import React from "react";
import type { AuthLayoutProps } from "@/types/components/auth";

export function AuthLayout({
  children,
  showBlobLeft = true,
  showBlobRight = true,
}: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 pb-8">
      {/* Ambient blobs */}
      {showBlobLeft && (
        <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-blob" />
      )}
      {showBlobRight && (
        <div className="pointer-events-none absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-orange-300/10 rounded-full blur-[100px] animate-blob delay-300" />
      )}

      {/* Content */}
      <div className="relative w-full max-w-md mx-auto px-4 sm:px-6 z-10">
        {children}
      </div>
    </div>
  );
}
