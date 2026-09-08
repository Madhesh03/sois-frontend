"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  authApi,
  cartApi,
  ApiError,
  isAuthenticated as hasToken,
  peekSessionKey,
} from "@/lib/api";
import type { Customer } from "@/lib/api";

type AuthModalType =
  | "login"
  | "register"
  | "forgot-password"
  | "reset-password"
  | null;

export interface AuthUser {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  isOpen: boolean;
  currentModal: AuthModalType;
  openModal: (modal: AuthModalType) => void;
  closeModal: () => void;
  switchModal: (modal: AuthModalType) => void;
  isAuthenticated: boolean;
  user: AuthUser | null;
  /** Loading flag while the session is being restored on first mount. */
  loading: boolean;
  /** Last auth error message (login/register), for form display. */
  authError: string | null;
  clearAuthError: () => void;
  /**
   * When `name` is provided the caller is registering a new account;
   * otherwise it's a login. Never throws — check `authError` after awaiting.
   */
  login: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  updateUser: (partial: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Build a friendly display name from the customer record. */
function displayName(c: Customer): string {
  const full = `${c.first_name ?? ""} ${c.last_name ?? ""}`.trim();
  if (full) return full;
  const local = c.email.split("@")[0]?.split(/[._-]/)[0] ?? "there";
  return local.charAt(0).toUpperCase() + local.slice(1);
}

function toAuthUser(c: Customer): AuthUser {
  return {
    id: c.id,
    name: displayName(c),
    email: c.email,
    phone: c.phone || undefined,
    firstName: c.first_name || undefined,
    lastName: c.last_name || undefined,
  };
}

/** After sign-in, adopt any guest cart built before authenticating. */
async function mergeGuestCart() {
  const guestKey = peekSessionKey();
  if (!guestKey) return;
  try {
    await cartApi.mergeCart(guestKey);
  } catch {
    /* no guest cart to merge, or already merged — ignore */
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState<AuthModalType>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Restore the session from the persisted JWT on first mount.
  useEffect(() => {
    let active = true;
    (async () => {
      if (!hasToken()) {
        if (active) setLoading(false);
        return;
      }
      try {
        const profile = await authApi.getProfile();
        if (active) setUser(toAuthUser(profile));
      } catch {
        authApi.logout();
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const isAuthenticated = user !== null;

  const openModal = (modal: AuthModalType) => {
    setAuthError(null);
    setCurrentModal(modal);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentModal(null);
    setAuthError(null);
  };

  const switchModal = (modal: AuthModalType) => {
    setAuthError(null);
    setCurrentModal(modal);
  };

  const clearAuthError = () => setAuthError(null);

  const login = async (email: string, password: string, name?: string) => {
    setAuthError(null);
    try {
      let customer: Customer;
      if (name && name.trim()) {
        // Registration flow — split the display name into first/last.
        const [first, ...rest] = name.trim().split(/\s+/);
        const result = await authApi.register({
          email,
          password,
          first_name: first,
          last_name: rest.join(" ") || undefined,
        });
        customer = result.customer;
      } else {
        const result = await authApi.login(email, password);
        customer = result.customer;
      }
      await mergeGuestCart();
      setUser(toAuthUser(customer));
      closeModal();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.firstMessage
          : "Something went wrong. Please try again.";
      setAuthError(message);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const updateUser = async (partial: Partial<AuthUser>) => {
    // Optimistically update local state, then persist to the backend.
    // Note: `email` is read-only server-side, so it's never sent.
    setUser((prev) => (prev ? { ...prev, ...partial } : prev));
    if (!hasToken()) return;
    try {
      const patch: Record<string, string> = {};
      if (partial.phone !== undefined) patch.phone = partial.phone ?? "";
      if (partial.firstName !== undefined)
        patch.first_name = partial.firstName ?? "";
      if (partial.lastName !== undefined)
        patch.last_name = partial.lastName ?? "";
      // A combined display name is split into first/last for the API.
      if (partial.name !== undefined && partial.firstName === undefined) {
        const [first, ...rest] = partial.name.trim().split(/\s+/);
        patch.first_name = first ?? "";
        patch.last_name = rest.join(" ");
      }
      if (Object.keys(patch).length === 0) return;
      const updated = await authApi.updateProfile(patch);
      setUser(toAuthUser(updated));
    } catch {
      /* keep the optimistic value */
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isOpen,
        currentModal,
        openModal,
        closeModal,
        switchModal,
        isAuthenticated,
        user,
        loading,
        authError,
        clearAuthError,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
