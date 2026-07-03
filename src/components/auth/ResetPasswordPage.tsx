"use client";

import React, { useState } from "react";
import Link from "next/link";
import { T } from "@/lib/tokens";
import { AuthLayout } from "./AuthLayout";
import { FormInput } from "./FormInput";
import { FormButton } from "./FormButton";
import { Check } from "lucide-react";

export function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
      console.log("Password reset successful");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthLayout title="Password Reset" description="">
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
            <Check size={32} color={T.forest} />
          </div>

          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              color: T.ink,
              marginBottom: 12,
            }}
          >
            Password Reset Successfully
          </h2>

          <p
            style={{
              fontSize: "0.95rem",
              color: T.muted,
              lineHeight: 1.7,
              marginBottom: 32,
            }}
          >
            Your password has been reset. You can now sign in with your new password.
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
              Sign In
            </Link>
          </FormButton>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create New Password"
      description="Enter your new password below"
    >
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <FormInput
          label="New Password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
        />

        <FormInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <div
          style={{
            fontSize: "0.8rem",
            color: T.muted,
            marginBottom: 28,
            lineHeight: 1.6,
          }}
        >
          <p style={{ margin: "0 0 8px 0", fontWeight: 500 }}>
            Password requirements:
          </p>
          <ul
            style={{
              margin: 0,
              paddingLeft: 16,
              listStyle: "disc",
            }}
          >
            <li>At least 8 characters long</li>
            <li>Mix of uppercase and lowercase letters</li>
            <li>At least one number</li>
          </ul>
        </div>

        <FormButton type="submit" disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </FormButton>
      </form>
    </AuthLayout>
  );
}
