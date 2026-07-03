"use client";

import React, { useState } from "react";
import Link from "next/link";
import { T } from "@/lib/tokens";
import { AuthLayout } from "./AuthLayout";
import { FormInput } from "./FormInput";
import { FormButton } from "./FormButton";

export function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      console.log("Login attempt:", formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign In"
      description="Welcome back to your SOIS account"
    >
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <FormInput
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />

        <div style={{ marginBottom: 28 }}>
          <Link
            href="/auth/forgot-password"
            style={{
              fontSize: "0.85rem",
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
            Forgot password?
          </Link>
        </div>

        <FormButton type="submit" disabled={isLoading}>
          {isLoading ? "Signing In..." : "Sign In"}
        </FormButton>
      </form>

      <div
        style={{
          marginTop: 28,
          paddingTop: 24,
          borderTop: `1px solid ${T.border}`,
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "0.9rem", color: T.muted, margin: 0 }}>
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            style={{
              color: T.forest,
              textDecoration: "none",
              fontWeight: 600,
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#0D4A46";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = T.forest;
            }}
          >
            Create one
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
