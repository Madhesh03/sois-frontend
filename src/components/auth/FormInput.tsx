"use client";

import React, { useState } from "react";
import { T } from "@/lib/tokens";
import { Eye, EyeOff } from "lucide-react";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
}

export function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  value,
  onChange,
  error,
  autoComplete,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div style={{ marginBottom: 24 }}>
      <label
        htmlFor={name}
        style={{
          display: "block",
          fontSize: "0.9rem",
          fontWeight: 500,
          color: T.ink,
          marginBottom: 8,
          letterSpacing: "0.02em",
        }}
      >
        {label}
        {required && <span style={{ color: "#d4183d" }}>*</span>}
      </label>

      <div style={{ position: "relative" }}>
        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          style={{
            width: "100%",
            padding: "12px 14px",
            fontSize: "0.95rem",
            border: `1px solid ${error ? "#d4183d" : T.border}`,
            borderRadius: "8px",
            background: T.surface,
            color: T.ink,
            transition: "all 0.2s ease",
            boxSizing: "border-box",
            fontWeight: 400,
            letterSpacing: "0.01em",
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
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.muted,
              padding: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = T.forest;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = T.muted;
            }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <p
          style={{
            fontSize: "0.8rem",
            color: "#d4183d",
            marginTop: 6,
            margin: 0,
            letterSpacing: "0.02em",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
