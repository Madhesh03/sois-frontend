# SOIS Authentication Design System

## Overview

This document outlines the complete authentication flow design for the SOIS website. The authentication system maintains the premium, modern, and minimalist aesthetic while providing a seamless user experience across all devices.

## Design Philosophy

- **Premium & Luxurious**: Every element reflects the SOIS brand identity with elegant proportions and refined interactions
- **Mobile-First**: Optimized for small screens, responsive across all device sizes
- **Minimalist**: Clean interface with only essential elements
- **Accessible**: Full keyboard navigation and screen reader support
- **Subtle Animations**: Smooth transitions that enhance, not distract

## Color Palette

All auth pages use the existing SOIS color system:

- **Primary Forest**: `#115E59` - Main brand color for buttons and focus states
- **Sage**: `#D1FAE5` - Light accent color
- **Sage Dark**: `#99F6E4` - Medium accent color
- **Background**: `#FAFAFA` - Page background
- **Surface**: `#F3F4F6` - Input background
- **White**: `#FFFFFF` - Card backgrounds
- **Ink**: `#0A0A0A` - Primary text
- **Muted**: `#4B5563` - Secondary text
- **Faint**: `#9CA3AF` - Tertiary text
- **Border**: `#E8E8E8` - Divider lines
- **Destructive**: `#d4183d` - Error states

## Typography

Using the Plus Jakarta Sans font family as defined in the main layout:

- **Headlines**: 600-700 weight, larger sizes for visual hierarchy
- **Body Text**: 400 weight, 0.95rem (16px) base size
- **Labels**: 500 weight for form labels
- **Button Text**: 600 weight, uppercase with letter-spacing

## Authentication Pages

### 1. Login Page (`/auth/login`)

**Purpose**: User sign-in to existing account

**Components**:
- Email input field with validation
- Password input field with show/hide toggle
- "Forgot Password?" link
- "Sign In" button
- "Create Account" link for new users

**Features**:
- Email validation with error messaging
- Password visibility toggle with smooth transition
- Form validation on submit
- Loading state during authentication
- Responsive design optimized for mobile

**Key Interactions**:
- Focus states with subtle background and border color changes
- Button hover effects with elevation and color shift
- Links with underline animation on hover
- Clear error messaging with inline feedback

### 2. Register Page (`/auth/register`)

**Purpose**: New account creation

**Components**:
- Full Name input field
- Email input field
- Password input field
- Confirm Password field
- Terms & Privacy Agreement checkbox
- "Create Account" button
- "Already have an account?" link

**Features**:
- Multi-field form with progressive validation
- Custom checkbox with animated check mark
- Password strength requirements display
- Form validation on submit
- Confirmation password matching

**Key Interactions**:
- Inline error messaging for each field
- Animated checkbox with smooth check icon reveal
- Loading state during account creation
- Terms agreement required to submit

### 3. Forgot Password Page (`/auth/forgot-password`)

**Purpose**: Initiate password reset flow

**Components**:
- Email input field
- "Send Reset Link" button
- "Back to Sign In" link

**Two-State Flow**:

**State 1 - Email Entry**:
- Single email input with validation
- Clear error messaging
- Loading state during submission

**State 2 - Confirmation**:
- Success icon with background
- Email display (masked for display)
- 24-hour expiration notice
- Spam folder reminder
- "Back to Sign In" button
- "Try another email" option to reset form

### 4. Reset Password Page (`/auth/reset-password`)

**Purpose**: Complete password reset with new credentials

**Components**:
- New Password input field
- Confirm Password field
- Password requirements checklist
- "Reset Password" button

**Two-State Flow**:

**State 1 - Password Entry**:
- New password input with visibility toggle
- Confirm password field
- Password requirements display:
  - At least 8 characters
  - Mix of uppercase and lowercase
  - At least one number
- Form validation and password matching

**State 2 - Success**:
- Success icon with background
- Confirmation message
- "Sign In" button to return to login

## Component Architecture

### AuthLayout

Base layout component for all authentication pages. Provides:
- Consistent header with SOIS logo
- Centered form container with max-width
- Page footer with copyright
- Fade-up animation on mount
- Responsive padding and spacing

**Usage**:
```tsx
<AuthLayout title="Sign In" description="Welcome back">
  {/* Form content */}
</AuthLayout>
```

### FormInput

Reusable input component with built-in features:
- Label and validation
- Focus/blur state management
- Password visibility toggle for password fields
- Error messaging
- Animated border and background on focus
- Placeholder text
- Auto-complete attributes

**Usage**:
```tsx
<FormInput
  label="Email"
  name="email"
  type="email"
  required
  value={email}
  onChange={handleChange}
  error={errors.email}
  autoComplete="email"
/>
```

### FormButton

Consistent button component with:
- Primary and secondary variants
- Disabled state handling
- Loading state support
- Hover effects with elevation
- Full-width support
- Smooth transitions

**Usage**:
```tsx
<FormButton type="submit" disabled={isLoading}>
  {isLoading ? "Loading..." : "Submit"}
</FormButton>
```

## Responsive Design

### Mobile (< 768px)
- Full viewport height layout
- Compact padding (20px)
- Form max-width: 420px
- Larger touch targets (minimum 44px)
- Optimized spacing for thumb navigation

### Tablet (768px - 1024px)
- Consistent layout
- Increased padding (32px)
- Same form max-width

### Desktop (> 1024px)
- Centered card layout
- Balanced whitespace
- Enhanced hover effects

## Animation Details

### Page Load
- **Fade-up**: Main form container fades in and slides up (0.6s ease-out)
  - CSS: `animation: fadeUp 0.6s ease both`
  - From: `opacity: 0; transform: translateY(20px)`
  - To: `opacity: 1; transform: translateY(0)`

### Input Focus
- Border color: `#115E59` (forest)
- Background: `#FFFFFF` (white)
- Box shadow: `0 0 0 3px rgba(17, 94, 89, 0.08)`
- Transition: `0.2s ease`

### Input Blur
- Border color: `#E8E8E8` (border)
- Background: `#F3F4F6` (surface)
- Box shadow: none
- Transition: `0.2s ease`

### Button Hover (Primary)
- Background: `#0D4A46` (darker forest)
- Transform: `translateY(-1px)`
- Box shadow: `0 8px 20px rgba(17, 94, 89, 0.2)`
- Transition: `0.25s cubic-bezier(0.4, 0, 0.2, 1)`

### Button Hover (Secondary)
- Background: `rgba(17, 94, 89, 0.05)`
- Border color: `#0D4A46`
- Transition: `0.25s cubic-bezier(0.4, 0, 0.2, 1)`

### Link Hover
- Color: `#0D4A46` (darker forest)
- Transition: `0.2s ease`

### Checkbox Toggle
- Border and background color animation
- Check icon reveal with scale animation
- Transition: `0.2s ease`

## Accessibility Features

- Semantic HTML structure with proper heading hierarchy
- ARIA labels and descriptions for all interactive elements
- Keyboard navigation support (Tab, Enter, Space)
- Focus indicators visible on all interactive elements
- Error messages associated with form fields
- Color contrast meets WCAG AA standards
- Icon buttons include aria-labels
- Form inputs have explicit labels

## Form Validation

### Client-Side Validation
- Real-time validation on input change
- Clear error messaging
- Visual error indicators (red borders)
- Form submission prevention on invalid state

### Validation Rules

**Email**:
- Required field
- Valid email format (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)

**Password (Login)**:
- Required field
- Minimum 6 characters

**Password (Register/Reset)**:
- Required field
- Minimum 8 characters
- Recommended: uppercase, lowercase, numbers

**Confirm Password**:
- Must match primary password field
- Real-time validation

**Name**:
- Required field
- Minimum 2 characters

**Terms Agreement**:
- Must be checked to submit register form

## File Structure

```
src/
├── components/
│   └── auth/
│       ├── AuthLayout.tsx          # Base layout component
│       ├── FormInput.tsx           # Reusable input component
│       ├── FormButton.tsx          # Reusable button component
│       ├── LoginPage.tsx           # Login page component
│       ├── RegisterPage.tsx        # Register page component
│       ├── ForgotPasswordPage.tsx # Forgot password component
│       └── ResetPasswordPage.tsx  # Reset password component
└── app/
    └── auth/
        ├── layout.tsx              # Auth routes layout
        ├── login/
        │   └── page.tsx            # Login page route
        ├── register/
        │   └── page.tsx            # Register page route
        ├── forgot-password/
        │   └── page.tsx            # Forgot password route
        └── reset-password/
            └── page.tsx            # Reset password route
```

## Usage Examples

### Adding Login Link to Homepage
```tsx
import Link from "next/link";
<Link href="/auth/login">Sign In</Link>
```

### Adding Register Button
```tsx
import Link from "next/link";
<Link href="/auth/register">Create Account</Link>
```

### Protecting Routes (Frontend)
```tsx
import { useRouter } from "next/navigation";

function ProtectedComponent() {
  const router = useRouter();
  const isAuthenticated = checkAuth(); // Your auth check

  if (!isAuthenticated) {
    router.push("/auth/login");
    return null;
  }

  return <div>Protected content</div>;
}
```

## Customization Guide

### Changing Button Colors
Update the color values in `FormButton.tsx`:
```tsx
// Primary button hover color
background: "#YOUR_COLOR"
```

### Changing Input Styling
Modify `FormInput.tsx` to adjust:
- Border radius
- Padding
- Focus states
- Error styling

### Adjusting Animations
Modify timing in component CSS:
```tsx
transition: "all 0.2s ease" // Adjust 0.2s for different speed
```

### Responsive Breakpoints
Current breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

Adjust in components using media queries or Tailwind breakpoints.

## Integration Points

### Backend API Integration
Replace the simulated API calls with actual endpoints:

```tsx
// In LoginPage.tsx handleSubmit
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```

### Authentication State Management
Integrate with your preferred state management:
- React Context API
- Redux
- Zustand
- NextAuth.js

### Session Management
Implement server-side session handling:
- HTTPOnly cookies
- JWT tokens
- Session validation

## Security Considerations

- **Password Storage**: Implement secure hashing (bcrypt, Argon2)
- **HTTPS**: Use SSL/TLS for all auth endpoints
- **CSRF Protection**: Implement CSRF tokens
- **Rate Limiting**: Implement rate limiting on auth endpoints
- **Input Sanitization**: Sanitize all user inputs
- **XSS Prevention**: Use Next.js built-in XSS protection
- **Password Reset Tokens**: Use secure, time-limited tokens
- **Two-Factor Authentication**: Consider implementing 2FA

## Testing Checklist

- [ ] Form validation works correctly
- [ ] Error messages display properly
- [ ] Loading states appear during submission
- [ ] Links navigate correctly
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Keyboard navigation works
- [ ] Password visibility toggle works
- [ ] Checkbox interactions work
- [ ] Success states display correctly
- [ ] Animations are smooth and appropriate
- [ ] Color contrast meets accessibility standards
- [ ] Screen reader announces errors and form labels

## Future Enhancements

- Social login integration (Google, Apple, etc.)
- Two-factor authentication
- Email verification flow
- Remember me functionality
- Biometric authentication
- Session management UI
- Account recovery options
- Password strength indicator
- User preference settings

## Support & Questions

For questions or issues with the authentication design, refer to:
1. This documentation file
2. Individual component comments
3. Design system in theme.css
4. Existing SOIS components for reference
