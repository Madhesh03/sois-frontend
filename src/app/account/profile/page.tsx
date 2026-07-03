"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { AccountShell } from "@/components/account/AccountShell";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
      });
    }
  }, [user]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <AccountShell title="Profile">
      <div className="sois-account-section-head">
        <h2>Profile Information</h2>
      </div>

      <form className="sois-address-form" onSubmit={submit}>
        <div className="sois-address-form-grid">
          <label className="full" style={{ display: "block" }}>
            <span className="sois-address-form-label">Full Name</span>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </label>
          <label style={{ display: "block" }}>
            <span className="sois-address-form-label">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </label>
          <label style={{ display: "block" }}>
            <span className="sois-address-form-label">Phone</span>
            <input
              value={form.phone}
              placeholder="Add a phone number"
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            />
          </label>
        </div>
        <div className="sois-address-form-actions">
          <button type="submit" className="sois-account-cta">
            {saved ? (
              <>
                <Check size={16} /> Saved
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </AccountShell>
  );
}
