import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStore';

/**
 * Hook to protect routes that require authentication
 * Redirects to sign-in page if user is not authenticated
 * 
 * @param redirectTo - URL to redirect to if not authenticated (default: '/auth/signin')
 * @returns { isAuthenticated, isLoading }
 * 
 * @example
 * export default function ProtectedPage() {
 *   const { isAuthenticated, isLoading } = useProtectedRoute();
 *   
 *   if (!isAuthenticated) return <div>Loading...</div>;
 *   return <div>Protected content</div>;
 * }
 */
export function useProtectedRoute(redirectTo = '/auth/signin') {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // Wait for hydration before checking auth
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated, isLoading };
}

/**
 * Hook to redirect authenticated users away from auth pages
 * 
 * @param redirectTo - URL to redirect authenticated users to (default: '/dashboard')
 * @returns { isAuthenticated, isLoading }
 * 
 * @example
 * export default function SignInPage() {
 *   useRedirectIfAuthenticated('/dashboard');
 *   return <SignInForm />;
 * }
 */
export function useRedirectIfAuthenticated(redirectTo = '/dashboard') {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated, isLoading };
}
