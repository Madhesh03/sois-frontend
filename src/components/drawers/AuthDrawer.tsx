"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { T } from "@/lib/tokens";
import { X, Eye, EyeOff, Check, Mail, ArrowLeft } from "lucide-react";

/** Inline banner for auth (login/register) API errors. */
function AuthErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      style={{
        background: "#fdecea",
        color: "#b3261e",
        border: "1px solid #f5c6c0",
        borderRadius: 8,
        padding: "10px 12px",
        marginBottom: 16,
        fontSize: "0.82rem",
        lineHeight: 1.4,
      }}
    >
      {message}
    </div>
  );
}

function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: "block",
          fontSize: "0.8rem",
          fontWeight: 500,
          color: T.ink,
          marginBottom: 6,
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </label>

      <div style={{ position: "relative" }}>
        <input
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{
            width: "100%",
            padding: "10px 12px",
            fontSize: "0.9rem",
            border: `1px solid ${error ? "#d4183d" : T.border}`,
            borderRadius: "8px",
            background: T.surface,
            color: T.ink,
            transition: "all 0.2s ease",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error ? "#d4183d" : T.forest;
            e.currentTarget.style.background = T.white;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? "#d4183d" : T.border;
            e.currentTarget.style.background = T.surface;
          }}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.muted,
              padding: 4,
              display: "flex",
            }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {error && (
        <p
          style={{
            fontSize: "0.75rem",
            color: "#d4183d",
            marginTop: 4,
            margin: 0,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

function LoginForm({
  onSwitchToRegister,
  onForgot,
}: {
  onSwitchToRegister: () => void;
  onForgot: () => void;
}) {
  const { login, authError } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "Email required";
    if (!formData.password) newErrors.password = "Password required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {authError && <AuthErrorBanner message={authError} />}
      <FormInput
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />

      <FormInput
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />

      <div style={{ textAlign: "right", marginBottom: 12 }}>
        <button
          type="button"
          onClick={onForgot}
          style={{
            background: "none",
            border: "none",
            color: T.forest,
            fontWeight: 500,
            cursor: "pointer",
            padding: 0,
            fontSize: "0.8rem",
          }}
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "0.85rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          background: T.forest,
          color: T.white,
          border: "none",
          borderRadius: "8px",
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.6 : 1,
          transition: "all 0.2s ease",
          marginBottom: 12,
        }}
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </button>

      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "0.85rem", color: T.muted, margin: 0 }}>
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            style={{
              background: "none",
              border: "none",
              color: T.forest,
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
              fontSize: "0.85rem",
            }}
          >
            Create one
          </button>
        </p>
      </div>
    </form>
  );
}

function RegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const { login, authError } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name required";
    if (!formData.email) newErrors.email = "Email required";
    if (!formData.password || formData.password.length < 8)
      newErrors.password = "Min 8 characters";
    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords don't match";
    if (!agreedToTerms) newErrors.terms = "Agree to terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    // Register then sign the new user straight in (closes the drawer).
    await login(formData.email, formData.password, formData.name);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {authError && <AuthErrorBanner message={authError} />}
      <FormInput
        label="Full Name"
        name="name"
        type="text"
        placeholder="Your name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />

      <FormInput
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />

      <FormInput
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />

      <FormInput
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
          cursor: "pointer",
        }}
        onClick={() => setAgreedToTerms(!agreedToTerms)}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            border: `1.5px solid ${agreedToTerms ? T.forest : T.border}`,
            background: agreedToTerms ? T.forest : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
        >
          {agreedToTerms && <Check size={12} color={T.white} strokeWidth={3} />}
        </div>
        <label
          style={{
            fontSize: "0.8rem",
            color: errors.terms ? "#d4183d" : T.muted,
            cursor: "pointer",
            margin: 0,
          }}
        >
          I agree to Terms and Privacy Policy
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "0.85rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          background: T.forest,
          color: T.white,
          border: "none",
          borderRadius: "8px",
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.6 : 1,
          marginBottom: 12,
        }}
      >
        {isLoading ? "Creating..." : "Create Account"}
      </button>

      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "0.85rem", color: T.muted, margin: 0 }}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{
              background: "none",
              border: "none",
              color: T.forest,
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
              fontSize: "0.85rem",
            }}
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
}

function ForgotPasswordForm({
  onBack,
}: {
  onBack: () => void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    if (!email) {
      setError("Email required");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 48,
            height: 48,
            background: "rgba(17, 94, 89, 0.1)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <Mail size={24} color={T.forest} />
        </div>
        <p
          style={{
            fontSize: "0.9rem",
            color: T.muted,
            marginBottom: 4,
          }}
        >
          Reset link sent to
        </p>
        <p style={{ fontSize: "0.9rem", fontWeight: 600, color: T.ink, marginBottom: 20 }}>
          {email}
        </p>
        <button
          onClick={onBack}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: T.forest,
            color: T.white,
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <ArrowLeft size={14} /> Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
      />

      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "0.85rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          background: T.forest,
          color: T.white,
          border: "none",
          borderRadius: "8px",
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.6 : 1,
          marginBottom: 8,
        }}
      >
        {isLoading ? "Sending..." : "Send Reset Link"}
      </button>

      <button
        type="button"
        onClick={onBack}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "0.85rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          background: "transparent",
          color: T.forest,
          border: `1px solid ${T.forest}`,
          borderRadius: "8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <ArrowLeft size={14} /> Back
      </button>
    </form>
  );
}

export function AuthDrawer() {
  const { isOpen, closeModal, currentModal } = useAuth();
  const [view, setView] = useState<"login" | "register" | "forgot">("login");

  // Sync the local view with whichever modal was requested when it opens.
  useEffect(() => {
    if (isOpen) {
      setView(currentModal === "register" ? "register" : "login");
    }
  }, [isOpen, currentModal]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
          // Above CartDrawer's 9998/9999 — sign-in can be triggered while
          // the cart drawer is still open (e.g. from checkout), and must
          // render on top of it rather than behind it.
          zIndex: 10998,
          animation: "fadeIn 0.3s ease-out",
        }}
        onClick={closeModal}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          width: "100%",
          maxWidth: 450,
          background: T.white,
          boxShadow: "-20px 0 60px rgba(0, 0, 0, 0.3)",
          zIndex: 10999,
          display: "flex",
          flexDirection: "column",
          animation: "slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.1rem",
              fontWeight: 600,
              color: T.ink,
            }}
          >
            {view === "forgot"
              ? "Reset Password"
              : view === "login"
                ? "Sign In"
                : "Create Account"}
          </h2>
          <button
            onClick={closeModal}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.muted,
              padding: "4px",
              display: "flex",
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "24px",
          }}
        >
          {view === "forgot" ? (
            <ForgotPasswordForm onBack={() => setView("login")} />
          ) : view === "login" ? (
            <LoginForm
              onSwitchToRegister={() => setView("register")}
              onForgot={() => setView("forgot")}
            />
          ) : (
            <RegisterForm onSwitchToLogin={() => setView("login")} />
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(450px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @media (max-width: 768px) {
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        }
      `}</style>
    </>
  );
}
