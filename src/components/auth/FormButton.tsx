"use client";

import React from "react";
import { T } from "@/lib/tokens";

interface FormButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
}

export function FormButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
  fullWidth = true,
}: FormButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: fullWidth ? "100%" : "auto",
        padding: "14px 28px",
        fontSize: "0.9rem",
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        border: isPrimary ? "none" : `1px solid ${T.forest}`,
        borderRadius: "8px",
        background: isPrimary ? T.forest : "transparent",
        color: isPrimary ? T.white : T.forest,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: disabled ? 0.6 : 1,
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          if (isPrimary) {
            e.currentTarget.style.background = "#0D4A46";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = `0 8px 20px rgba(17, 94, 89, 0.2)`;
          } else {
            e.currentTarget.style.background = "rgba(17, 94, 89, 0.05)";
            e.currentTarget.style.borderColor = "#0D4A46";
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          if (isPrimary) {
            e.currentTarget.style.background = T.forest;
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          } else {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = T.forest;
          }
        }
      }}
    >
      {children}
    </button>
  );
}
