"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Modal } from "./Modal";
import { T } from "@/lib/tokens";
import { ArrowLeft, Mail, Eye, EyeOff, Check } from "lucide-react";

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
    <div style={{ marginBottom: 20 }}>
      <label
        style={{
          display: "block",
          fontSize: "0.85rem",
          fontWeight: 500,
          color: T.ink,
          marginBottom: 8,
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
            e.currentTarget.style.boxShadow = `0 0 0 3px ${error ? "rgba(212,24,61,0.1)" : "rgba(17,94,89,0.08)"}`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? "#d4183d" : T.border;
            e.currentTarget.style.background = T.surface;
            e.currentTarget.style.boxShadow = "none";
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
              alignItems: "center",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = T.forest;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = T.muted;
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

function LoginForm() {
  const { login, switchModal } = useAuth();
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

      <div style={{ marginBottom: 20 }}>
        <button
          type="button"
          onClick={() => switchModal("forgot-password")}
          style={{
            background: "none",
            border: "none",
            color: T.forest,
            fontSize: "0.8rem",
            fontWeight: 500,
            cursor: "pointer",
            padding: 0,
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
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.background = "#0D4A46";
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.currentTarget.style.background = T.forest;
          }
        }}
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </button>

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <p style={{ fontSize: "0.85rem", color: T.muted, margin: 0 }}>
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => switchModal("register")}
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

function RegisterForm() {
  const { switchModal } = useAuth();
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
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
    switchModal("login");
  };

  return (
    <form onSubmit={handleSubmit}>
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
          marginBottom: 20,
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
          transition: "all 0.2s ease",
        }}
      >
        {isLoading ? "Creating..." : "Create Account"}
      </button>

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <p style={{ fontSize: "0.85rem", color: T.muted, margin: 0 }}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => switchModal("login")}
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

function ForgotPasswordForm() {
  const { switchModal } = useAuth();
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
            width: 56,
            height: 56,
            background: "rgba(17, 94, 89, 0.1)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <Mail size={28} color={T.forest} />
        </div>
        <p
          style={{
            fontSize: "0.9rem",
            color: T.muted,
            marginBottom: 8,
            lineHeight: 1.5,
          }}
        >
          Reset link sent to
        </p>
        <p style={{ fontSize: "0.9rem", fontWeight: 600, color: T.ink, marginBottom: 20 }}>
          {email}
        </p>
        <button
          onClick={() => switchModal("login")}
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
          }}
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: "0.9rem", color: T.muted, margin: 0, lineHeight: 1.5 }}>
          Enter your email and we'll send a password reset link.
        </p>
      </div>

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
          marginBottom: 12,
        }}
      >
        {isLoading ? "Sending..." : "Send Reset Link"}
      </button>

      <button
        type="button"
        onClick={() => switchModal("login")}
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

export function AuthModal() {
  const { isOpen, closeModal, currentModal, switchModal } = useAuth();

  const getTitle = () => {
    switch (currentModal) {
      case "login":
        return "Sign In";
      case "register":
        return "Create Account";
      case "forgot-password":
        return "Reset Password";
      default:
        return undefined;
    }
  };

  // "register" and "forgot-password" are both reached from the login screen,
  // so their back arrow returns there. Login is the entry point (no back).
  const onBack =
    currentModal === "register" || currentModal === "forgot-password"
      ? () => switchModal("login")
      : undefined;

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={getTitle()}
      size="md"
      onBack={onBack}
    >
      {currentModal === "login" && <LoginForm />}
      {currentModal === "register" && <RegisterForm />}
      {currentModal === "forgot-password" && <ForgotPasswordForm />}
    </Modal>
  );
}
