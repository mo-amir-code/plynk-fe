/**
 * TanStack Query Configuration
 * Global QueryClient setup with default options
 */

import { QueryClient, DefaultError } from "@tanstack/react-query";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: data will be considered fresh for 5 minutes
        staleTime: 1000 * 60 * 5,
        // Garbage collection time: cached data will be removed after 10 minutes of inactivity
        gcTime: 1000 * 60 * 10,
        // Number of retry attempts for failed queries
        retry: 3,
        // Exponential backoff for retries
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Don't refetch on window focus by default
        refetchOnWindowFocus: false,
        // Don't refetch on mount by default
        refetchOnMount: false,
        // Don't refetch on reconnect by default
        refetchOnReconnect: false,
      },
      mutations: {
        // Number of retry attempts for failed mutations
        retry: 1,
        // Retry delay for mutations
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  });
}

// Create a singleton instance for use in server components
let clientSingleton: QueryClient | undefined;

export function getQueryClient() {
  if (!clientSingleton) clientSingleton = createQueryClient();
  return clientSingleton;
}
