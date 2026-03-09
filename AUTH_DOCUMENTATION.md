# Authentication System Documentation

## Overview

This authentication system is built with modern best practices using:
- **Zustand** for global state management
- **Next.js 16** with App Router and TypeScript
- **Tailwind CSS** for responsive UI with custom animations
- **Material Icons** for consistent iconography

## Project Structure

```
src/
├── stores/
│   └── authStore.ts              # Zustand auth state management
├── components/
│   └── auth/
│       ├── AuthLayout.tsx        # Shared auth page wrapper
│       ├── FormInput.tsx         # Reusable form input component
│       ├── SignInForm.tsx        # Sign-in form with validation
│       ├── SignUpForm.tsx        # Sign-up form with validation
│       └── ForgotPasswordForm.tsx # Password reset form
└── app/
    └── auth/
        ├── signin/page.tsx       # Sign-in page
        ├── signup/page.tsx       # Sign-up page
        └── forgot-password/page.tsx # Password reset page
```

## Core Components

### 1. **authStore.ts** - Zustand Store
Main global state management for authentication.

**State Interface:**
```typescript
interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email, password, fullName, username) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: AuthUser | null) => void;
}
```

**Features:**
- ✅ Persistent storage using localStorage (via `persist` middleware)
- ✅ Redux DevTools integration for debugging
- ✅ Type-safe async actions with loading states
- ✅ Error handling and management
- ✅ Mock API calls with realistic delays

**Usage:**
```typescript
import useAuthStore from '@/stores/authStore';

function MyComponent() {
  const { user, isLoading, login, logout } = useAuthStore();
  
  // Auto-persists user to localStorage
}
```

### 2. **FormInput.tsx** - Reusable Input Component
Flexible form input with multiple features.

**Features:**
- ✅ Icon support with Material Icons
- ✅ Password visibility toggle
- ✅ Error messaging and validation feedback
- ✅ Dark mode support
- ✅ Smooth focus animations
- ✅ Accessibility best practices (labels, aria)

**Usage:**
```typescript
<FormInput
  label="Email"
  type="email"
  placeholder="user@example.com"
  value={email}
  onChange={setEmail}
  icon="mail"
  error={error}
/>

<FormInput
  label="Password"
  type="password"
  value={password}
  onChange={setPassword}
  showPasswordToggle
  icon="lock"
/>
```

### 3. **AuthLayout.tsx** - Layout Wrapper
Shared layout component for all auth pages.

**Features:**
- ✅ Animated gradient blobs (with optional control)
- ✅ Centered responsive design
- ✅ Scroll-triggered animations
- ✅ Consistent spacing and padding

### 4. **SignInForm.tsx** - Sign-In Page
Complete sign-in page with multiple providers.

**Features:**
- ✅ Email/password authentication
- ✅ "Remember me" option
- ✅ Forgot password link
- ✅ OAuth providers (Google, Apple)
- ✅ Client-side validation
- ✅ Error handling and display
- ✅ Loading states with spinner

### 5. **SignUpForm.tsx** - Sign-Up Page
Complete registration with comprehensive validation.

**Features:**
- ✅ Multi-field validation (Full Name, Email, Username, Password)
- ✅ Password confirmation matching
- ✅ Terms & Privacy Policy agreement
- ✅ OAuth integration
- ✅ Real-time form validation
- ✅ Error handling per field

### 6. **ForgotPasswordForm.tsx** - Password Reset
Multi-step password recovery flow.

**Features:**
- ✅ Two-step submission process
- ✅ Success confirmation display
- ✅ Email verification message
- ✅ Spam folder warning
- ✅ Support contact link
- ✅ Ability to retry with different email

## Design System Integration

All auth pages follow the main landing page design system:

### Colors
- **Primary**: `#ec5b13` (Orange)
- **Background Light**: `#f8f6f6`
- **Background Dark**: `#020617`

### Typography
- **Font Family**: Public Sans
- **Font Scales**: Responsive text sizing
- **Font Weights**: 400 (normal), 600 (semibold), 700 (bold), 900 (black)

### Animations
- ✅ `animate-fade-up` - Staggered entrance animations
- ✅ `animate-float` - Floating background elements
- ✅ `animate-blob` - Morphing gradient blobs
- ✅ Smooth transitions for all interactive elements

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg
- Touch-friendly button sizes
- Optimized spacing for all screens

## Validation & Error Handling

### Sign-In Validation
- ✅ Non-empty fields
- ✅ Valid email format
- ✅ Password length requirement

### Sign-Up Validation
- ✅ Full Name (min 2 characters)
- ✅ Email format validation
- ✅ Username (min 3 characters)
- ✅ Password (min 8 characters)
- ✅ Password confirmation match
- ✅ Terms agreement required

### Error Display
- ✅ Field-level error messages
- ✅ Alert boxes for general errors
- ✅ Red color-coded error states
- ✅ Error icons for visual clarity

## Usage Examples

### Using Auth Store in Components

```typescript
'use client';

import useAuthStore from '@/stores/authStore';

export function UserProfile() {
  const { user, logout, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user?.fullName}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes Pattern

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStore';

export default function ProtectedPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, isLoading, router]);
  
  if (!isAuthenticated) return <div>Loading...</div>;
  
  return <div>Protected content</div>;
}
```

### Synchronizing Auth State

```typescript
useEffect(() => {
  const user = useAuthStore.getState().user;
  // Use auth state in effects
}, []);
```

## Best Practices Implemented

### 1. **Component Architecture**
- ✅ Single Responsibility Principle
- ✅ Reusable, composable components
- ✅ Clear prop interfaces
- ✅ Proper TypeScript typing

### 2. **State Management**
- ✅ Centralized auth state with Zustand
- ✅ Persistent storage for user sessions
- ✅ Redux DevTools for debugging
- ✅ Minimal/atomic store structure

### 3. **Form Handling**
- ✅ Controlled components
- ✅ Real-time validation feedback
- ✅ Loading states during submission
- ✅ Error handling with user feedback

### 4. **Accessibility**
- ✅ Semantic HTML
- ✅ Proper label associations
- ✅ Error messages linked to fields
- ✅ Keyboard navigation support
- ✅ ARIA attributes

### 5. **Performance**
- ✅ `'use client'` directives only where needed
- ✅ Optimized re-renders with Zustand
- ✅ CSS animations for smooth UX
- ✅ Lazy loading patterns ready

### 6. **Security Considerations**
- ✅ Password fields use correct input type
- ✅ Password visibility toggle UI
- ✅ No sensitive data in console
- ✅ LocalStorage for persistence (production: use httpOnly cookies)

### 7. **UX/Design**
- ✅ Consistent with landing page
- ✅ Clear visual hierarchy
- ✅ Smooth animations and transitions
- ✅ Loading indicators for async operations
- ✅ Success/error feedback
- ✅ Multi-step flows where needed

## Dark Mode Support

All auth components automatically support dark mode through:
- ✅ `dark:` Tailwind classes
- ✅ System preference detection
- ✅ Theme toggle in footer
- ✅ LocalStorage persistence

## Integration with API

The store is configured for easy API integration:

```typescript
// Current: Mock implementation
const mockUser = { id: '1', email, ... };

// Future: Replace with actual API calls
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
const user = await response.json();
set({ user, isAuthenticated: true });
```

## Extending the System

### Adding New Auth Methods
1. Add new action to `authStore.ts`
2. Create form component following existing patterns
3. Create page component in `/app/auth/[route]/`
4. Link from existing auth pages

### Adding Field Validation
Extend validation logic in form components:
```typescript
const validateForm = (): boolean => {
  // Add new validation rules
  if (!customRule) {
    setLocalError("Custom error message");
    return false;
  }
  return true;
};
```

### Customizing Components
All components accept props for customization:
```typescript
export function AuthLayout({
  children,
  showBlobLeft = true,  // Control animations
  showBlobRight = true,
}) { ... }
```

## Navigation Integration

Auth pages are linked from:
- ✅ Navbar (Desktop & Mobile)
- ✅ Hero "Get Started" CTA
- ✅ Footer links (when needed)
- ✅ Internal navigation between auth pages

## Deployment Notes

### Before Production
- [ ] Replace mock API calls with real endpoints
- [ ] Implement proper error handling for API failures
- [ ] Add CSRF protection
- [ ] Use secure httpOnly cookies instead of localStorage
- [ ] Implement rate limiting
- [ ] Add reCAPTCHA for signup
- [ ] Set up proper HTTPS/SSL

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://api.moku.com
NEXT_PUBLIC_AUTH_CALLBACK_URL=https://moku.com/dashboard
```

## Testing Considerations

Ready for testing:
- ✅ Form validation logic
- ✅ Store actions and state changes
- ✅ Component rendering with props
- ✅ Error handling flows
- ✅ Navigation between auth pages

## Files Modified

- `src/components/layout/Navbar.tsx` - Added auth links
- `src/components/home/Hero.tsx` - "Get Started" links to signup
- `src/components/home/CTA.tsx` - CTA button links to signup

## Next Steps

1. **Backend Integration**: Connect to your API endpoints
2. **Email Verification**: Add email verification flow
3. **Social OAuth**: Implement Google/Apple/GitHub OAuth
4. **2FA Setup**: Add two-factor authentication options
5. **Session Management**: Implement proper session handling
6. **Profile Customization**: Add profile setup after signup
7. **Analytics**: Track auth funnel metrics
