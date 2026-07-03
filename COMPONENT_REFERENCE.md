# SOIS Authentication Components - Reference Guide

## Component Overview

### 1. AuthLayout
**Purpose**: Base container for all authentication pages

**Props**:
- `title` (string): Page heading
- `description` (string, optional): Subtitle or description
- `children` (React.ReactNode): Form content

**Structure**:
```
┌─ Header ─────────────────────┐
│  SOIS Logo                    │
├───────────────────────────────┤
│                               │
│  ┌─ Title & Description ─┐  │
│  │                        │  │
│  ├─────────────────────────┤  │
│  │                         │  │
│  │  ┌─ Form Card ──────┐ │  │
│  │  │  {children}      │ │  │
│  │  └──────────────────┘ │  │
│  └─────────────────────────┘  │
│                               │
├───────────────────────────────┤
│ © 2024 SOIS. All rights       │
│ reserved.                     │
└───────────────────────────────┘
```

**Features**:
- Fade-up animation on mount
- Responsive padding
- Centered layout with max-width 420px
- Header with SOIS branding
- Footer with copyright

**Usage**:
```tsx
<AuthLayout title="Sign In" description="Welcome back">
  <form>{/* Content */}</form>
</AuthLayout>
```

### 2. FormInput
**Purpose**: Intelligent input field with validation and visibility toggle

**Props**:
- `label` (string): Input label
- `name` (string): Input name attribute
- `type` (string, default: "text"): HTML input type
- `placeholder` (string, optional): Placeholder text
- `required` (boolean, default: false): Required field indicator
- `value` (string, optional): Controlled value
- `onChange` (function, optional): Change handler
- `error` (string, optional): Error message
- `autoComplete` (string, optional): Auto-complete attribute

**Features**:
- Animated focus states
- Password visibility toggle (for type="password")
- Real-time error display
- Error styling (red border, red text)
- Smooth transitions
- Touch-friendly spacing

**Visual States**:
```
Default State:
┌──────────────────────────────┐
│ Label                        │
├──────────────────────────────┤
│ Placeholder text            │
└──────────────────────────────┘

Focus State:
┌──────────────────────────────┐
│ Label                        │
├──────────────────────────────┤
│ Text input...               │
└──────────────────────────────┘
(Border: #115E59, Shadow: rgba(17,94,89,0.08))

Error State:
┌──────────────────────────────┐
│ Label                  * │
├──────────────────────────────┤
│ Text input...               │
└──────────────────────────────┘
❌ This field is required
```

**Usage**:
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

### 3. FormButton
**Purpose**: Consistent button with primary and secondary variants

**Props**:
- `children` (React.ReactNode): Button text
- `onClick` (function, optional): Click handler
- `type` ("button" | "submit" | "reset", default: "button"): Button type
- `disabled` (boolean, default: false): Disabled state
- `variant` ("primary" | "secondary", default: "primary"): Button style
- `fullWidth` (boolean, default: true): Full width button

**Features**:
- Smooth hover animations
- Loading state support
- Elevation effect on hover
- Disabled state handling
- Primary and secondary variants

**Visual States**:

**Primary Button**:
```
Default:                   Hover:
┌─────────────────┐       ┌─────────────────┐
│  SIGN IN        │  →    │  SIGN IN        │
└─────────────────┘       └─────────────────┘
(#115E59)                  (#0D4A46, elevated)

Disabled:
┌─────────────────┐
│  SIGN IN        │
└─────────────────┘
(Opacity: 0.6)
```

**Secondary Button**:
```
Default:                   Hover:
┌─────────────────┐       ┌─────────────────┐
│  BACK           │  →    │  BACK           │
└─────────────────┘       └─────────────────┘
(Border: #115E59)          (BG: rgba(17,94,89,0.05))
```

**Usage**:
```tsx
<FormButton type="submit" disabled={isLoading}>
  {isLoading ? "Signing In..." : "Sign In"}
</FormButton>

<FormButton variant="secondary" fullWidth={false}>
  Cancel
</FormButton>
```

---

## Page Components

### LoginPage
**Route**: `/auth/login`

**Form Fields**:
1. Email input (required)
2. Password input (required, with visibility toggle)

**Actions**:
- Forgot Password link
- Sign In button
- Create Account link

**Validation**:
- Email: required, valid format
- Password: required, minimum 6 characters

**States**:
- Default
- Focused
- Error
- Loading
- Success (redirects)

**Visual Layout**:
```
┌───────────────────────────┐
│       Sign In             │
│   Welcome back to your    │
│   SOIS account            │
├───────────────────────────┤
│ Email                 *   │
│ ┌─────────────────────┐   │
│ │ you@example.com     │   │
│ └─────────────────────┘   │
│                           │
│ Password              *   │
│ ┌─────────────────────┐   │
│ │ ••••••••      👁️    │   │
│ └─────────────────────┘   │
│                           │
│ Forgot password?          │
│                           │
│ ┌─────────────────────┐   │
│ │   SIGN IN           │   │
│ └─────────────────────┘   │
│                           │
│ Don't have an account?    │
│ Create one                │
└───────────────────────────┘
```

### RegisterPage
**Route**: `/auth/register`

**Form Fields**:
1. Full Name input (required)
2. Email input (required)
3. Password input (required, with visibility toggle)
4. Confirm Password input (required, must match)
5. Terms & Privacy Agreement checkbox (required)

**Actions**:
- Create Account button
- Sign In link

**Validation**:
- Name: required, minimum 2 characters
- Email: required, valid format
- Password: required, minimum 8 characters
- Confirm Password: must match primary password
- Terms: must be checked

**Password Requirements Display**:
- At least 8 characters long
- Mix of uppercase and lowercase letters
- At least one number

**Visual Layout**:
```
┌───────────────────────────┐
│    Create Account         │
│  Join SOIS and discover   │
│  handcrafted sterling     │
│  silver                   │
├───────────────────────────┤
│ Full Name             *   │
│ ┌─────────────────────┐   │
│ │ Your name           │   │
│ └─────────────────────┘   │
│                           │
│ Email                 *   │
│ ┌─────────────────────┐   │
│ │ you@example.com     │   │
│ └─────────────────────┘   │
│                           │
│ Password              *   │
│ ┌─────────────────────┐   │
│ │ ••••••••      👁️    │   │
│ └─────────────────────┘   │
│                           │
│ Confirm Password      *   │
│ ┌─────────────────────┐   │
│ │ ••••••••      👁️    │   │
│ └─────────────────────┘   │
│                           │
│ ☐ I agree to SOIS's Terms │
│   of Service and Privacy  │
│   Policy                  │
│                           │
│ ┌─────────────────────┐   │
│ │ CREATE ACCOUNT      │   │
│ └─────────────────────┘   │
│                           │
│ Already have an account?  │
│ Sign in                   │
└───────────────────────────┘
```

### ForgotPasswordPage
**Route**: `/auth/forgot-password`

**State 1: Email Entry**

**Form Fields**:
1. Email input (required)

**Actions**:
- Send Reset Link button
- Back to Sign In link

**Validation**:
- Email: required, valid format

**Visual Layout (Entry)**:
```
┌───────────────────────────┐
│    Reset Password         │
│  Enter your email address │
│  and we'll send you a     │
│  link to reset your       │
│  password                 │
├───────────────────────────┤
│ Email Address         *   │
│ ┌─────────────────────┐   │
│ │ you@example.com     │   │
│ └─────────────────────┘   │
│                           │
│ ┌─────────────────────┐   │
│ │ SEND RESET LINK     │   │
│ └─────────────────────┘   │
│                           │
│ ← Back to Sign In         │
└───────────────────────────┘
```

**State 2: Confirmation**

**Content**:
- Mail icon
- Confirmation message
- Entered email display (masked)
- 24-hour expiration notice
- Spam folder reminder
- Back to Sign In button
- Try another email option

**Visual Layout (Confirmation)**:
```
┌───────────────────────────┐
│  Check Your Email         │
│                           │
│        📧                  │
│                           │
│  We've sent a password    │
│  reset link to:           │
│                           │
│  you@example.com          │
│                           │
│  The link will expire in  │
│  24 hours. Please check   │
│  your spam folder if you  │
│  don't see the email.     │
│                           │
│ ┌─────────────────────┐   │
│ │ BACK TO SIGN IN     │   │
│ └─────────────────────┘   │
│                           │
│  Try another email        │
└───────────────────────────┘
```

### ResetPasswordPage
**Route**: `/auth/reset-password?token=xxx`

**State 1: Password Entry**

**Form Fields**:
1. New Password input (required, with visibility toggle)
2. Confirm Password input (required, must match)

**Password Requirements Display**:
- At least 8 characters long
- Mix of uppercase and lowercase letters
- At least one number

**Actions**:
- Reset Password button

**Validation**:
- Password: required, minimum 8 characters
- Confirm Password: must match primary password

**Visual Layout (Entry)**:
```
┌───────────────────────────┐
│  Create New Password      │
│  Enter your new password  │
│  below                    │
├───────────────────────────┤
│ New Password          *   │
│ ┌─────────────────────┐   │
│ │ ••••••••      👁️    │   │
│ └─────────────────────┘   │
│                           │
│ Confirm Password      *   │
│ ┌─────────────────────┐   │
│ │ ••••••••      👁️    │   │
│ └─────────────────────┘   │
│                           │
│ Password requirements:    │
│ • At least 8 characters   │
│ • Mix of upper/lowercase  │
│ • At least one number     │
│                           │
│ ┌─────────────────────┐   │
│ │ RESET PASSWORD      │   │
│ └─────────────────────┘   │
└───────────────────────────┘
```

**State 2: Success**

**Content**:
- Check icon
- Success message
- Sign In button

**Visual Layout (Success)**:
```
┌───────────────────────────┐
│  Password Reset           │
│                           │
│        ✅                  │
│                           │
│  Password Reset           │
│  Successfully             │
│                           │
│  Your password has been   │
│  reset. You can now sign  │
│  in with your new         │
│  password.                │
│                           │
│ ┌─────────────────────┐   │
│ │ SIGN IN             │   │
│ └─────────────────────┘   │
└───────────────────────────┘
```

---

## Color Reference

### Usage in Components

**AuthLayout**:
- Background: `#FAFAFA` (page background)
- Header/Footer: `#FFFFFF` (white)
- Border: `#E8E8E8` (light gray)
- Text: `#0A0A0A` (ink), `#9CA3AF` (faint)

**FormInput**:
- Default Border: `#E8E8E8` (border)
- Default Background: `#F3F4F6` (surface)
- Focus Border: `#115E59` (forest)
- Focus Background: `#FFFFFF` (white)
- Focus Shadow: `rgba(17, 94, 89, 0.08)` (forest with transparency)
- Error Border/Text: `#d4183d` (red)
- Label: `#0A0A0A` (ink)
- Placeholder: `#4B5563` (muted)

**FormButton**:
- Primary Background: `#115E59` (forest)
- Primary Hover: `#0D4A46` (darker forest)
- Primary Text: `#FFFFFF` (white)
- Secondary Border: `#115E59` (forest)
- Secondary Hover Background: `rgba(17, 94, 89, 0.05)` (forest with low opacity)
- Secondary Text: `#115E59` (forest)

**Links**:
- Default: `#115E59` (forest)
- Hover: `#0D4A46` (darker forest)

**Icons**:
- Password Toggle: `#4B5563` (muted) → `#115E59` (forest on hover)
- Success/Mail: `#115E59` (forest)

---

## Animation Specifications

### Page Load
```css
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

animation: fadeUp 0.6s ease both;
```

### Input Focus
```css
transition: all 0.2s ease;
/* Changes: border-color, background, box-shadow */
```

### Button Hover (Primary)
```css
transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
/* Changes: background, transform, box-shadow */
transform: translateY(-1px);
box-shadow: 0 8px 20px rgba(17, 94, 89, 0.2);
```

### Link Hover
```css
transition: color 0.2s ease;
```

### Checkbox Toggle
```css
transition: all 0.2s ease;
/* Changes: border, background, check mark scale */
```

---

## Accessibility Features

### Keyboard Navigation
- Tab through all focusable elements
- Enter to submit forms
- Space to toggle checkboxes
- Show/hide password button keyboard accessible

### Screen Reader Support
- Labels associated with inputs via `htmlFor`
- ARIA-labels on icon buttons
- Error messages announced
- Form structure and hierarchy
- Link purpose clear from text

### Color Contrast
- All text meets WCAG AA standards (4.5:1 for normal text)
- Error states remain accessible to colorblind users
- Icons used alongside text (not alone for critical info)

### Focus Indicators
- Visible focus ring on all interactive elements
- Clear visual distinction of focused state
- Sufficient contrast (3:1 minimum)

---

## Responsive Breakpoints

### Mobile (< 768px)
- Form max-width: 420px (100% with padding)
- Padding: 20px
- Font size adjustments via clamp()
- Touch-friendly spacing (44px minimum)
- Full-width buttons

### Tablet (768px - 1024px)
- Form max-width: 420px (centered)
- Padding: 32px
- Same typography scale
- Enhanced spacing

### Desktop (> 1024px)
- Form max-width: 420px (centered)
- Padding: 40px+
- Optimal reading line length
- Enhanced hover effects

---

## Customization Points

### Quick Customizations

**Change Primary Color**:
Edit `src/lib/tokens.ts`:
```ts
forest: "#YOUR_COLOR"  // Change primary brand color
```

**Change Button Radius**:
Edit `FormButton.tsx`:
```tsx
borderRadius: "8px"  // Adjust from 8px
```

**Change Input Radius**:
Edit `FormInput.tsx`:
```tsx
borderRadius: "8px"  // Adjust from 8px
```

**Change Animation Speed**:
Edit component files:
```tsx
transition: "all 0.2s ease"  // Change 0.2s value
```

**Change Form Max Width**:
Edit `AuthLayout.tsx`:
```tsx
maxWidth: 420  // Adjust from 420px
```

---

## Component Dependencies

```
AuthLayout
├── No internal dependencies
├── Uses: T (tokens from @/lib/tokens.ts)
└── Children: React.ReactNode

FormInput
├── No internal dependencies
├── Uses: T (tokens), Eye/EyeOff from lucide-react
└── Props: FormInputProps

FormButton
├── No internal dependencies
├── Uses: T (tokens)
└── Props: FormButtonProps

LoginPage
├── AuthLayout
├── FormInput
├── FormButton
├── Uses: T (tokens), Link from next/link
└── Props: None (self-contained)

RegisterPage
├── AuthLayout
├── FormInput
├── FormButton
├── Uses: T (tokens), Check from lucide-react, Link
└── Props: None (self-contained)

ForgotPasswordPage
├── AuthLayout
├── FormInput
├── FormButton
├── Uses: T (tokens), Mail/ArrowLeft from lucide-react, Link
└── Props: None (self-contained)

ResetPasswordPage
├── AuthLayout
├── FormInput
├── FormButton
├── Uses: T (tokens), Check from lucide-react, Link
└── Props: None (self-contained)
```

---

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- iOS Safari: Latest version
- Chrome Mobile: Latest version

---

## Performance Notes

- Zero external dependencies (except Next.js, Lucide)
- Minimal JavaScript bundle
- CSS-in-JS for styling (easily switchable)
- Optimized animations (GPU-accelerated transforms)
- Server-side rendering compatible
- No unnecessary re-renders with proper state management

---

## Testing Guide

### Manual Testing
1. Load each page independently
2. Test form validation (empty, invalid, valid)
3. Test error states
4. Test loading states
5. Verify responsive design at different breakpoints
6. Test keyboard navigation (Tab, Enter, Space)
7. Test with screen reader (NVDA, JAWS, VoiceOver)

### Automated Testing Suggestions
```tsx
// Example with Vitest + React Testing Library
describe('LoginPage', () => {
  test('renders login form', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  test('validates email', () => {
    // Test implementation
  });

  test('toggles password visibility', () => {
    // Test implementation
  });
});
```

---

**Last Updated**: July 2, 2026
**Status**: Complete & Production-Ready
