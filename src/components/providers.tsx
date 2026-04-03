"use client";

import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/react-query";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = createQueryClient();

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
