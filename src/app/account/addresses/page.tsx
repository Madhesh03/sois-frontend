"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2, Pencil } from "lucide-react";
import { AccountShell } from "@/components/account/AccountShell";
import { useCart, ShippingInfo } from "@/context/CartContext";

const EMPTY: ShippingInfo = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

const FIELDS: { name: keyof ShippingInfo; label: string; full?: boolean }[] = [
  { name: "fullName", label: "Full Name", full: true },
  { name: "phone", label: "Phone" },
  { name: "email", label: "Email" },
  { name: "address", label: "Address", full: true },
  { name: "city", label: "City" },
  { name: "state", label: "State" },
  { name: "pincode", label: "Pincode" },
];

export default function AddressesPage() {
  const { savedAddresses, saveAddress, updateSavedAddress, removeSavedAddress } =
    useCart();
  // null = form closed, "new" = adding, ShippingInfo = editing that address
  const [editing, setEditing] = useState<null | "new" | ShippingInfo>(null);
  const [form, setForm] = useState<ShippingInfo>(EMPTY);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const openAdd = () => {
    setForm(EMPTY);
    setErrors({});
    setEditing("new");
  };

  const openEdit = (a: ShippingInfo) => {
    setForm(a);
    setErrors({});
    setEditing(a);
  };

  const close = () => {
    setEditing(null);
    setForm(EMPTY);
    setErrors({});
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, boolean> = {};
    (Object.keys(form) as (keyof ShippingInfo)[]).forEach((k) => {
      if (k !== "email" && !form[k]) errs[k] = true;
    });
    setErrors(errs);
    if (Object.keys(errs).length) return;

    if (editing && editing !== "new") {
      updateSavedAddress(editing, form);
    } else {
      saveAddress(form);
    }
    close();
  };

  return (
    <AccountShell title="Addresses">
      <div className="sois-account-section-head">
        <h2>Saved Addresses</h2>
        {!editing && (
          <button
            type="button"
            className="sois-account-viewall"
            onClick={openAdd}
          >
            <Plus size={15} /> Add New
          </button>
        )}
      </div>

      {editing && (
        <form className="sois-address-form" onSubmit={submit}>
          <div className="sois-address-form-heading">
            {editing === "new" ? "New Address" : "Edit Address"}
          </div>
          <div className="sois-address-form-grid">
            {FIELDS.map((f) => (
              <label
                key={f.name}
                className={f.full ? "full" : ""}
                style={{ display: "block" }}
              >
                <span className="sois-address-form-label">{f.label}</span>
                <input
                  value={form[f.name] ?? ""}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, [f.name]: e.target.value }));
                    if (errors[f.name])
                      setErrors((p) => ({ ...p, [f.name]: false }));
                  }}
                  style={{
                    borderColor: errors[f.name] ? "#d4183d" : undefined,
                  }}
                />
              </label>
            ))}
          </div>
          <div className="sois-address-form-actions">
            <button type="submit" className="sois-account-cta">
              {editing === "new" ? "Save Address" : "Update Address"}
            </button>
            <button
              type="button"
              className="sois-account-cta ghost"
              onClick={close}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {savedAddresses.length === 0 && !editing ? (
        <div className="sois-account-empty-state">
          <MapPin size={30} />
          <p className="sois-empty-title">No saved addresses</p>
          <p className="sois-empty-sub">
            Add an address to check out faster next time.
          </p>
        </div>
      ) : (
        <div className="sois-address-grid">
          {savedAddresses.map((a) => (
            <div key={a.id} className="sois-address-card">
              <MapPin size={18} className="sois-address-card-pin" />
              <div className="sois-address-card-body">
                <strong>{a.fullName}</strong>
                <span>
                  {a.address}, {a.city}, {a.state} - {a.pincode}
                </span>
                <span>{a.phone}</span>
              </div>
              <div className="sois-address-card-actions">
                <button
                  type="button"
                  aria-label="Edit address"
                  onClick={() => openEdit(a)}
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  aria-label="Remove address"
                  className="danger"
                  onClick={() => removeSavedAddress(a)}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AccountShell>
  );
}
