"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type AuthModalType =
  | "login"
  | "register"
  | "forgot-password"
  | "reset-password"
  | null;

export interface AuthUser {
  name: string;
  email: string;
  phone?: string;
}

interface AuthContextType {
  isOpen: boolean;
  currentModal: AuthModalType;
  openModal: (modal: AuthModalType) => void;
  closeModal: () => void;
  switchModal: (modal: AuthModalType) => void;
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  updateUser: (partial: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = "sois_user";

function loadUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function persistUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
}

/** Derive a friendly display name from an email local-part. */
function nameFromEmail(email: string): string {
  const local = email.split("@")[0]?.split(/[._-]/)[0] ?? "there";
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState<AuthModalType>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  // Hydrate the session from localStorage on first mount (survives refresh).
  useEffect(() => {
    setUser(loadUser());
  }, []);

  const isAuthenticated = user !== null;

  const openModal = (modal: AuthModalType) => {
    setCurrentModal(modal);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentModal(null);
  };

  const switchModal = (modal: AuthModalType) => {
    setCurrentModal(modal);
  };

  const login = async (email: string, password: string, name?: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const nextUser: AuthUser = {
      name: name?.trim() || nameFromEmail(email),
      email,
    };
    setUser(nextUser);
    persistUser(nextUser);
    closeModal();
  };

  const logout = () => {
    setUser(null);
    persistUser(null);
  };

  const updateUser = (partial: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      persistUser(next);
      return next;
    });
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
