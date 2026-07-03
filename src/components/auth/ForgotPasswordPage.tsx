"use client";

import React, { useState } from "react";
import Link from "next/link";
import { T } from "@/lib/tokens";
import { AuthLayout } from "./AuthLayout";
import { FormInput } from "./FormInput";
import { FormButton } from "./FormButton";
import { ArrowLeft, Mail } from "lucide-react";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const validateEmail = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
      console.log("Password reset email sent to:", email);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthLayout title="Check Your Email" description="">
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: "rgba(17, 94, 89, 0.1)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <Mail size={32} color={T.forest} />
          </div>

          <p
            style={{
              fontSize: "0.95rem",
              color: T.muted,
              lineHeight: 1.7,
              marginBottom: 28,
            }}
          >
            We've sent a password reset link to:
          </p>

          <p
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: T.ink,
              marginBottom: 28,
              wordBreak: "break-all",
            }}
          >
            {email}
          </p>

          <p
            style={{
              fontSize: "0.9rem",
              color: T.muted,
              lineHeight: 1.6,
              marginBottom: 32,
            }}
          >
            The link will expire in 24 hours. Please check your spam folder if you don't see the email.
          </p>

          <FormButton>
            <Link
              href="/auth/login"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
              }}
            >
              Back to Sign In
            </Link>
          </FormButton>

          <button
            onClick={() => setSubmitted(false)}
            style={{
              background: "none",
              border: "none",
              color: T.forest,
              fontSize: "0.9rem",
              fontWeight: 500,
              marginTop: 16,
              cursor: "pointer",
              padding: 0,
              textDecoration: "underline",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#0D4A46";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = T.forest;
            }}
          >
            Try another email
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      description="Enter your email address and we'll send you a link to reset your password"
    >
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={handleChange}
          error={error}
          autoComplete="email"
        />

        <FormButton type="submit" disabled={isLoading}>
          {isLoading ? "Sending Link..." : "Send Reset Link"}
        </FormButton>
      </form>

      <div
        style={{
          marginTop: 28,
          paddingTop: 24,
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <Link
          href="/auth/login"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontSize: "0.9rem",
            color: T.forest,
            textDecoration: "none",
            fontWeight: 500,
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#0D4A46";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = T.forest;
          }}
        >
          <ArrowLeft size={16} /> Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}
