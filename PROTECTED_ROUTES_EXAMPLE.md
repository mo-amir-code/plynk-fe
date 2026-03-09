# Example: Using Protected Routes

This file demonstrates how to create protected pages that require authentication.

## Example 1: Dashboard Page (Protected)

```typescript
// src/app/dashboard/page.tsx

'use client';

import { useProtectedRoute } from '@/hooks/useAuth';
import useAuthStore from '@/stores/authStore';

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useProtectedRoute('/auth/signin');
  const { user, logout } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-primary/30 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Hook handles redirect
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-2">
              Welcome, {user?.fullName}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {user?.email}
            </p>
          </div>
          <button
            onClick={logout}
            className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Log Out
          </button>
        </div>

        {/* Dashboard content here */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Widgets, stats, etc. */}
        </div>
      </div>
    </div>
  );
}
```

## Example 2: Auto-Redirect Authenticated Users from Sign In

```typescript
// src/app/auth/signin/page.tsx

'use client';

import { useRedirectIfAuthenticated } from '@/hooks/useAuth';
import { SignInForm } from '@/components/auth/SignInForm';

export default function SignInPage() {
  const { isLoading } = useRedirectIfAuthenticated('/dashboard');

  if (isLoading) return null;

  return <SignInForm />;
}
```

## Example 3: Profile Settings (Protected, Custom Message)

```typescript
// src/app/profile/settings/page.tsx

'use client';

import { useProtectedRoute } from '@/hooks/useAuth';
import useAuthStore from '@/stores/authStore';

export default function SettingsPage() {
  const { isAuthenticated, isLoading } = useProtectedRoute('/auth/signin?next=/profile/settings');
  const { user } = useAuthStore();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings for {user?.username}</h1>
      {/* Settings form content */}
    </div>
  );
}
```

## Example 4: Public Page with Conditional Auth Display

```typescript
// src/components/PublicContent.tsx

'use client';

import useAuthStore from '@/stores/authStore';

export function PublicContent() {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <div>
      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          <span>Logged in as {user?.fullName}</span>
          <button onClick={logout} className="btn btn-secondary">
            Log Out
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <a href="/auth/signin" className="btn btn-secondary">
            Sign In
          </a>
          <a href="/auth/signup" className="btn btn-primary">
            Sign Up
          </a>
        </div>
      )}
    </div>
  );
}
```

## Pattern: Route Groups for Authentication

```typescript
// src/app/(auth)/layout.tsx

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Now all routes under src/app/(auth)/* are part of the auth group
// src/app/(auth)/signin/page.tsx
// src/app/(auth)/signup/page.tsx
// src/app/(auth)/forgot-password/page.tsx
```

## Best Practices

### ✅ Do
- ✅ Use `useProtectedRoute()` for pages that require authentication
- ✅ Show loading state while checking authentication
- ✅ Provide clear messages when redirect happens
- ✅ Handle edge cases (network errors, expired sessions)
- ✅ Use TypeScript for type safety

### ❌ Don't
- ❌ Render protected content before auth check completes
- ❌ Leave users on protected page if not authenticated
- ❌ Hardcode sensitive routes without checking auth
- ❌ Store sensitive data in localStorage (use httpOnly cookies in production)

## Integration with API Middleware

When integrating with API routes, use the auth state to send tokens:

```typescript
// API call with auth token
const fetchUserData = async () => {
  const { user } = useAuthStore.getState();
  
  const response = await fetch('/api/user/profile', {
    headers: {
      'Authorization': `Bearer ${user?.id}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.json();
};
```

## Session Management

### Refresh Session on App Load
```typescript
// src/app/layout.tsx

useEffect(() => {
  const initializeAuth = async () => {
    const storedUser = localStorage.getItem('auth-storage');
    if (storedUser) {
      // Verify session with backend
      const response = await fetch('/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        useAuthStore.getState().logout();
      }
    }
  };
  
  initializeAuth();
}, []);
```

## Logout Handling

### Global Logout Logic
```typescript
// After logout, redirect user
const handleLogout = () => {
  useAuthStore.getState().logout();
  router.push('/');
};
```

## References

- Complete Hook Documentation: `AUTH_DOCUMENTATION.md`
- Quick Start Guide: `AUTH_QUICKSTART.md`
