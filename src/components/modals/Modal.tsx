"use client";

import React, { useEffect } from "react";
import { X, ArrowLeft } from "lucide-react";
import { T } from "@/lib/tokens";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg";
  onBack?: () => void;
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  onBack,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidth = {
    sm: 400,
    md: 600,
    lg: 800,
  };

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
          // Above the sticky nav (100) and CartDrawer (9998/9999), below
          // AuthDrawer (10998/10999) so sign-in always stays reachable.
          // At the old 40/50 the nav painted straight over the modal,
          // swallowing its title bar and close button.
          zIndex: 10500,
          animation: "fadeIn 0.3s ease-out",
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: maxWidth[size],
          width: "90%",
          maxHeight: "90vh",
          background: T.white,
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          zIndex: 10501,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          animation: "slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Header */}
        {title && (
          <div
            style={{
              padding: "24px 24px 16px",
              borderBottom: `1px solid ${T.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                minWidth: 0,
              }}
            >
              {onBack && (
                <button
                  onClick={onBack}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: T.muted,
                    padding: "4px",
                    marginLeft: "-4px",
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
                  aria-label="Go back"
                >
                  <ArrowLeft size={22} />
                </button>
              )}
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: T.ink,
                }}
              >
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: T.muted,
                padding: "4px",
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
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>
        )}

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: title ? "24px" : "32px",
          }}
        >
          {children}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -45%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </>
  );
}
