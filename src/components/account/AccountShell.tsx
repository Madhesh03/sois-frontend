"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Package, MapPin, User, LogOut } from "lucide-react";
import { StoreShell } from "@/components/store/StoreShell";
import { useAuth } from "@/context/AuthContext";

const TABS = [
  { href: "/account", label: "Overview", icon: LayoutGrid, exact: true },
  { href: "/account/orders", label: "My Orders", icon: Package, exact: false },
  { href: "/account/addresses", label: "Addresses", icon: MapPin, exact: true },
  { href: "/account/profile", label: "Profile", icon: User, exact: true },
];

function SignInPrompt() {
  const { openModal } = useAuth();
  return (
    <div className="sois-acct-signin">
      <div className="sois-acct-signin-icon">
        <User size={26} />
      </div>
      <h2>Sign in to your account</h2>
      <p>View your orders, track deliveries and manage your saved addresses.</p>
      <div className="sois-acct-signin-actions">
        <button type="button" onClick={() => openModal("login")}>
          Sign In
        </button>
        <button
          type="button"
          className="ghost"
          onClick={() => openModal("register")}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

export function AccountShell({
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();

  if (!isAuthenticated || !user) {
    return (
      <StoreShell>
        <div className="sois-acct">
          <SignInPrompt />
        </div>
      </StoreShell>
    );
  }

  return (
    <StoreShell>
      <div className="sois-acct">
        {/* Banner */}
        <div className="sois-acct-banner">
          <div className="sois-acct-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div className="sois-acct-welcome">
            <span className="sois-acct-eyebrow">My Account</span>
            <span className="sois-acct-hello">Hello, {user.name}</span>
            <span className="sois-acct-email">{user.email}</span>
          </div>
          <button
            type="button"
            className="sois-acct-signout"
            onClick={logout}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tabs */}
        <nav className="sois-acct-tabs" aria-label="Account sections">
          {TABS.map((tab) => {
            const active = tab.exact
              ? pathname === tab.href
              : pathname.startsWith(tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`sois-acct-tab${active ? " active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={17} />
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {/* Content */}
        <div className="sois-acct-content">{children}</div>
      </div>
    </StoreShell>
  );
}
