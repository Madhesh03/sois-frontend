"use client";

import React from "react";
import { T } from "@/lib/tokens";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: T.bg,
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "24px 20px",
          borderBottom: `1px solid ${T.border}`,
          background: T.white,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <a
            href="/"
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: T.forest,
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            SOIS
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            animation: "fadeUp 0.6s ease both",
          }}
        >
          {/* Title */}
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <h1
              style={{
                fontSize: "clamp(1.75rem, 5vw, 2.25rem)",
                fontWeight: 600,
                color: T.ink,
                marginBottom: 12,
                letterSpacing: "-0.01em",
              }}
            >
              {title}
            </h1>

            {description && (
              <p
                style={{
                  fontSize: "0.95rem",
                  color: T.muted,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {description}
              </p>
            )}
          </div>

          {/* Form Container */}
          <div
            style={{
              background: T.white,
              border: `1px solid ${T.border}`,
              borderRadius: "12px",
              padding: "40px 24px",
            }}
          >
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: "32px 20px",
          borderTop: `1px solid ${T.border}`,
          background: T.white,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "0.8rem",
            color: T.faint,
            margin: 0,
            letterSpacing: "0.05em",
          }}
        >
          © 2024 SOIS. All rights reserved.
        </p>
      </footer>

      <style>{`
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
      `}</style>
    </div>
  );
}
