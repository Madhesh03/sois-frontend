# SOIS Authentication - Quick Start Guide

## Access the Authentication Pages

The authentication system is now available at these URLs:

### Pages
- **Login**: `http://localhost:3000/auth/login`
- **Register**: `http://localhost:3000/auth/register`
- **Forgot Password**: `http://localhost:3000/auth/forgot-password`
- **Reset Password**: `http://localhost:3000/auth/reset-password`

## Key Features

### 1. **Premium Aesthetic**
- Clean, minimalist design matching SOIS brand
- Elegant typography and color palette
- Subtle animations and micro-interactions
- Luxury feel similar to premium fashion brands

### 2. **Mobile-First Design**
- Optimized for all screen sizes
- Touch-friendly interface with adequate spacing
- Responsive layouts from mobile to desktop
- Smooth transitions across devices

### 3. **User Experience**
- **Smart Validation**: Real-time error checking with clear messaging
- **Password Visibility Toggle**: Show/hide password with smooth animation
- **Loading States**: Visual feedback during form submission
- **Success Confirmations**: Clear success states with icons
- **Progressive Disclosure**: Multi-step flows for complex actions

### 4. **Accessibility**
- Full keyboard navigation support
- Screen reader friendly
- WCAG AA color contrast compliance
- Clear focus states
- Semantic HTML structure

### 5. **Security**
- Form validation on client and server
- Secure password handling
- Error handling without exposing sensitive data
- CSRF-ready architecture

## Component Overview

### AuthLayout
The base container for all auth pages. Includes:
- Header with SOIS logo
- Centered content area
- Footer with copyright
- Fade-up animation

```tsx
<AuthLayout title="Sign In" description="Welcome back">
  {/* Your form content */}
</AuthLayout>
```

### FormInput
Intelligent input component with:
- Automatic label association
- Password visibility toggle
- Real-time validation
- Animated focus states
- Error display

```tsx
<FormInput
  label="Email"
  name="email"
  type="email"
  placeholder="you@example.com"
  required
  value={email}
  onChange={handleChange}
  error={errors.email}
  autoComplete="email"
/>
```

### FormButton
Consistent, accessible button with:
- Primary and secondary variants
- Smooth hover effects
- Loading state support
- Full-width option

```tsx
<FormButton type="submit" disabled={isLoading}>
  {isLoading ? "Signing In..." : "Sign In"}
</FormButton>
```

## Authentication Flow Diagrams

### Login Flow
```
User visits /auth/login
    ↓
Enters email & password
    ↓
Clicks "Sign In"
    ↓
Form validates
    ├─ Invalid → Shows error messages
    └─ Valid → Submits to server
           ↓
       Server authenticates
       ├─ Failure → Shows error
       └─ Success → Redirects to dashboard
```

### Register Flow
```
User visits /auth/register
    ↓
Enters name, email, password
    ↓
Agrees to terms
    ↓
Clicks "Create Account"
    ↓
Form validates all fields
    ├─ Invalid → Shows error messages
    └─ Valid → Submits to server
           ↓
       Server creates account
       ├─ Failure → Shows error (email exists, etc.)
       └─ Success → Redirects to login/verification
```

### Password Reset Flow
```
User visits /auth/forgot-password
    ↓
Enters email
    ↓
Clicks "Send Reset Link"
    ↓
Email validates
    ├─ Invalid → Shows error
    └─ Valid → Submits to server
           ↓
       Server sends reset email
           ↓
       Shows confirmation screen
           ↓
User receives email with reset link
           ↓
Clicks link (opens /auth/reset-password)
           ↓
Enters new password
           ↓
Server validates & updates password
           ↓
Shows success confirmation
           ↓
User redirects to login
```

## Color Reference

The auth pages use the existing SOIS color system:

| Color | Hex | Usage |
|-------|-----|-------|
| Forest | `#115E59` | Primary button, links, focus states |
| Sage | `#D1FAE5` | Light accents |
| Sage Dark | `#99F6E4` | Medium accents |
| Background | `#FAFAFA` | Page background |
| Surface | `#F3F4F6` | Input background |
| White | `#FFFFFF` | Card backgrounds |
| Ink | `#0A0A0A` | Primary text |
| Muted | `#4B5563` | Secondary text |
| Faint | `#9CA3AF` | Tertiary text |
| Border | `#E8E8E8` | Divider lines |
| Error | `#d4183d` | Error states |

## Typography

All text uses **Plus Jakarta Sans**:
- Headlines: 600-700 weight
- Body: 400 weight
- Labels: 500 weight
- Buttons: 600 weight uppercase

## Mobile Responsive Breakpoints

- **Mobile**: < 768px
  - Compact spacing
  - Full-width buttons
  - Optimized for thumb navigation
  
- **Tablet**: 768px - 1024px
  - Balanced spacing
  - Increased padding
  
- **Desktop**: > 1024px
  - Maximum content width
  - Enhanced hover effects

## Error Handling

All forms include validation for:

### Email Validation
- Field required
- Valid email format
- Real-time feedback

### Password Validation
- Minimum length (6 for login, 8 for registration)
- Confirmation matching for register/reset
- Visibility toggle for better UX

### Name Validation
- Minimum 2 characters
- Required field

### Terms Agreement
- Must be checked before registration

## Testing the Authentication

### Test Login
1. Go to `http://localhost:3000/auth/login`
2. Try invalid email (e.g., "notanemail")
3. Try empty password
4. Try valid email with short password
5. Try valid credentials

### Test Registration
1. Go to `http://localhost:3000/auth/register`
2. Try empty fields
3. Try non-matching passwords
4. Try without accepting terms
5. Try complete registration flow

### Test Password Reset
1. Go to `http://localhost:3000/auth/forgot-password`
2. Try invalid email
3. Try valid email → See success confirmation
4. Go to `/auth/reset-password`
5. Try mismatched passwords
6. Try complete reset flow

### Test Responsiveness
1. Open dev tools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test at different breakpoints:
   - iPhone 12 (390px)
   - iPad (768px)
   - Desktop (1440px)

## Integration Checklist

- [ ] Link "Sign In" button on homepage to `/auth/login`
- [ ] Link "Create Account" button to `/auth/register`
- [ ] Update forgot password form with actual email service
- [ ] Connect login form to your auth backend
- [ ] Connect register form to user creation API
- [ ] Implement password reset email sending
- [ ] Add session/JWT handling
- [ ] Set up protected route middleware
- [ ] Configure redirects after authentication
- [ ] Add user profile or dashboard page
- [ ] Implement logout functionality
- [ ] Add "Remember me" if desired
- [ ] Set up email verification flow
- [ ] Configure rate limiting

## Customization Quick Tips

### Change Button Color
Edit `FormButton.tsx`:
```tsx
background: "#YOUR_COLOR" // For primary button
```

### Change Input Radius
Edit `FormInput.tsx`:
```tsx
borderRadius: "12px" // Adjust rounded corners
```

### Change Animation Speed
Edit component files:
```tsx
transition: "all 0.25s ease" // Change 0.25s value
```

### Change Form Max Width
Edit `AuthLayout.tsx`:
```tsx
maxWidth: 500 // Adjust from 420px
```

### Add Logo to Header
Edit `AuthLayout.tsx` header section:
```tsx
<img src="/sois-logo.svg" alt="SOIS" style={{ height: 40 }} />
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- iOS Safari: Latest version
- Chrome Mobile: Latest version

## Performance Notes

- Zero external dependencies for auth components
- Minimal JavaScript bundle
- CSS-in-JS for styling (easily switchable to Tailwind)
- Optimized animations (GPU-accelerated transforms)
- Server-side rendering compatible

## File Locations

```
📁 src/
  📁 components/auth/
    📄 AuthLayout.tsx
    📄 FormInput.tsx
    📄 FormButton.tsx
    📄 LoginPage.tsx
    📄 RegisterPage.tsx
    📄 ForgotPasswordPage.tsx
    📄 ResetPasswordPage.tsx
  📁 app/auth/
    📄 layout.tsx
    📁 login/
      📄 page.tsx
    📁 register/
      📄 page.tsx
    📁 forgot-password/
      📄 page.tsx
    📁 reset-password/
      📄 page.tsx

📄 AUTHENTICATION_DESIGN.md (Full documentation)
📄 AUTHENTICATION_QUICK_START.md (This file)
```

## Common Questions

**Q: How do I add social login?**
A: Add buttons to `AuthLayout` or relevant pages pointing to your OAuth providers.

**Q: How do I connect to my backend?**
A: Replace the API call simulation in each page's `handleSubmit` with actual fetch/axios calls.

**Q: How do I customize the colors?**
A: Update the `T` (tokens) values imported from `@/lib/tokens.ts`.

**Q: Can I use this with my existing authentication library?**
A: Yes! The components are UI-only and can work with any auth library (NextAuth, Clerk, Auth0, etc.).

**Q: How do I protect routes?**
A: Implement middleware to check authentication status and redirect unauthenticated users.

**Q: How do I add email verification?**
A: Create an additional page at `/auth/verify-email` following the same pattern.

## Next Steps

1. **Test** all pages locally
2. **Connect** to your backend API
3. **Implement** session/token management
4. **Add** links from homepage
5. **Customize** colors/branding if needed
6. **Deploy** to production
7. **Monitor** authentication metrics

## Support

For detailed information, see `AUTHENTICATION_DESIGN.md`

For issues or questions, review:
- Component comments in source files
- Design system in `src/styles/theme.css`
- Existing SOIS components for patterns
