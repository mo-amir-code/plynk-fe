# API Configuration & TanStack Query Setup

## Overview
The application has been reconfigured with a centralized API configuration and TanStack Query for efficient API state management. All API requests now go through a properly configured system that ensures consistent handling and correctness.

## Configuration Files

### 1. `.env.local` - Environment Variables
Location: `/home/mo-amir/Desktop/plynk-fe/.env.local`

```
NEXT_PUBLIC_BASE_URL=http://localhost:8080/api/v1
```

**Important**: The BASE_URL is now configured to use port **8080** instead of 3000.

### 2. `src/lib/api-config.ts` - Centralized API Configuration
This file contains:
- **API_CONFIG**: Base URL and timeout settings
- **API_ENDPOINTS**: All API endpoint definitions organized by feature
- **QUERY_KEYS**: TanStack Query key definitions for caching

All endpoints are defined in one place, making it easy to maintain and update.

### 3. `src/lib/api-client.ts` - HTTP Client
The core HTTP client that:
- Uses `API_CONFIG.BASE_URL` from the centralized config
- Handles authentication tokens automatically
- Manages error responses with proper error classes
- Provides methods: `get()`, `post()`, `patch()`, `put()`, `delete()`

### 4. `src/lib/react-query.ts` - QueryClient Setup
Configures TanStack Query with:
- 5-minute stale time for queries
- 10-minute garbage collection time
- Automatic retry with exponential backoff (3 attempts)
- Singleton pattern for server components

## Custom Hooks

### Authentication Hooks (`src/hooks/useAuth.ts`)
- **useLogin()** - Login mutation
- **useSignup()** - Registration mutation
- **useCheckUsername()** - Check username availability
- **useClaimUsername()** - Claim a username
- **useLogout()** - Logout mutation
- **useProtectedRoute()** - Route protection utility
- **useRedirectIfAuthenticated()** - Redirect authenticated users

### User Hooks (`src/hooks/useUsers.ts`)
- **useGetMe()** - Fetch current user profile
- **useUpdateProfile()** - Update user profile

### Page & Widget Hooks (`src/hooks/usePage.ts`)
- **useGetMyPage()** - Fetch user's page
- **useGetPageBySlug()** - Fetch page by slug
- **useCreatePage()** - Create new page
- **useUpdatePage()** - Update page
- **useSyncPage()** - Sync page data (widgets, theme, publish status)
- **useCreateWidget()** - Create widget
- **useUpdateWidget()** - Update widget
- **useDeleteWidget()** - Delete widget

## Usage Examples

### In Server Components (Server Actions)
```typescript
// actions/auth.ts
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";

export async function authLogin(data: { email: string; password: string }) {
  const result = await api.post(API_ENDPOINTS.AUTH.LOGIN, data);
  // Handle result...
}
```

### In Client Components
```typescript
"use client";

import { useLogin } from "@/hooks/useAuth";

export function SignInForm() {
  const { mutate: login, isPending } = useLogin();

  const handleSubmit = async (data: any) => {
    login(data, {
      onSuccess: (result) => {
        // Handle success
        router.push("/dashboard");
      },
      onError: (error) => {
        // Handle error
        toast.error(error.message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## Key Benefits

1. **Centralized Configuration**: All API endpoints and configuration in one place
2. **Consistent Design**: All API calls follow the same pattern
3. **Type Safety**: Full TypeScript support with proper types
4. **Automatic Caching**: TanStack Query manages request caching and revalidation
5. **Error Handling**: Centralized error handling with custom ApiError class
6. **Token Management**: Automatic token injection for authenticated requests
7. **Performance**: Query deduplication and intelligent refetching strategies
8. **Maintainability**: Easy to add new endpoints or modify existing ones

## Port Configuration

- **Frontend Dev Server**: `http://localhost:3000` (Next.js)
- **Backend API Server**: `http://localhost:8080` (with `/api/v1` prefix)

Configured in: `.env.local` with `NEXT_PUBLIC_BASE_URL=http://localhost:8080/api/v1`

## Adding New API Endpoints

1. **Add endpoint to `API_ENDPOINTS`** in `src/lib/api-config.ts`:
```typescript
FEATURE: {
  GET_ALL: "/feature",
  GET_ONE: (id: string) => `/feature/${id}`,
  CREATE: "/feature",
  UPDATE: (id: string) => `/feature/${id}`,
}
```

2. **Add query key** to `QUERY_KEYS` in `src/lib/api-config.ts`:
```typescript
FEATURE: {
  ALL: ["feature"] as const,
  BY_ID: (id: string) => ["feature", id] as const,
}
```

3. **Create hook** in `src/hooks/useFeature.ts`:
```typescript
export const useGetFeature = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.FEATURE.BY_ID(id),
    queryFn: async () => await api.get(API_ENDPOINTS.FEATURE.GET_ONE(id)),
  });
};
```

## Provider Setup

The app is wrapped with `Providers` component in `src/app/layout.tsx`:
```typescript
<Providers>
  {children}
</Providers>
```

This provides:
- QueryClientProvider for TanStack Query
- Access to all query and mutation hooks throughout the app

## Migration Notes

All existing API calls through server actions continue to work as before. The new hook-based system is available for new client-side API calls and can gradually replace server actions where appropriate.
