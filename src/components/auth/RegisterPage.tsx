"use client";

import React, { useState } from "react";
import Link from "next/link";
import { T } from "@/lib/tokens";
import { AuthLayout } from "./AuthLayout";
import { FormInput } from "./FormInput";
import { FormButton } from "./FormButton";
import { Check } from "lucide-react";

export function RegisterPage() {
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms and privacy policy";
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
      console.log("Register attempt:", {
        name: formData.name,
        email: formData.email,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      description="Join SOIS and discover handcrafted sterling silver"
    >
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <FormInput
          label="Full Name"
          name="name"
          type="text"
          placeholder="Your name"
          required
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          autoComplete="name"
        />

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
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            marginBottom: 24,
            cursor: "pointer",
          }}
          onClick={() => setAgreedToTerms(!agreedToTerms)}
          role="checkbox"
          aria-checked={agreedToTerms}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setAgreedToTerms(!agreedToTerms);
            }
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              border: `1.5px solid ${
                agreedToTerms || errors.terms ? T.forest : T.border
              }`,
              background: agreedToTerms ? T.forest : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 4,
              transition: "all 0.2s ease",
            }}
          >
            {agreedToTerms && <Check size={14} color={T.white} strokeWidth={3} />}
          </div>

          <label
            style={{
              fontSize: "0.85rem",
              color: errors.terms ? "#d4183d" : T.muted,
              lineHeight: 1.6,
              cursor: "pointer",
              margin: 0,
              fontWeight: 400,
            }}
          >
            I agree to SOIS's Terms of Service and Privacy Policy
          </label>
        </div>

        {errors.terms && (
          <p
            style={{
              fontSize: "0.8rem",
              color: "#d4183d",
              marginBottom: 16,
              margin: 0,
              letterSpacing: "0.02em",
            }}
          >
            {errors.terms}
          </p>
        )}

        <FormButton type="submit" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
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
          Already have an account?{" "}
          <Link
            href="/auth/login"
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
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
