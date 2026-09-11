"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  Check,
} from "lucide-react";
import { StoreShell } from "@/components/store/StoreShell";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [sent, setSent] = useState(false);

  const change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: false }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, boolean> = {};
    (["name", "email", "subject", "message"] as const).forEach((k) => {
      if (!form[k].trim()) errs[k] = true;
    });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    // Prototype: no backend yet — acknowledge locally.
    setSent(true);
  };

  return (
    <StoreShell>
      <section className="sois-page-hero">
        <nav className="sois-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={13} />
          <span aria-current="page">Contact</span>
        </nav>
        <div className="sois-page-hero-eyebrow">GET IN TOUCH</div>
        <h1 className="sois-page-hero-title">Contact Us</h1>
        <p className="sois-page-hero-sub">
          Questions about an order, a product, or anything else? We’re here to
          help.
        </p>
      </section>

      <section className="sois-contact">
        {/* Info column */}
        <div className="sois-contact-info">
          <div className="sois-contact-item">
            <Mail size={18} />
            <div>
              <span className="sois-contact-label">Email</span>
              <a href="mailto:support@soisstore.com">support@soisstore.com</a>
            </div>
          </div>
          <div className="sois-contact-item">
            <Phone size={18} />
            <div>
              <span className="sois-contact-label">Phone</span>
              <a href="tel:+917305272195">+91 73052 72195</a>
            </div>
          </div>
          <div className="sois-contact-item">
            <Clock size={18} />
            <div>
              <span className="sois-contact-label">Support Hours</span>
              <span>Mon–Sat, 10:00 AM – 7:00 PM IST</span>
            </div>
          </div>
          <div className="sois-contact-item">
            <MapPin size={18} />
            <div>
              <span className="sois-contact-label">Store</span>
              <span>
                No. 16/123A, Melaraja Veethi, Swamimalai,
                <br />
                Kumbakonam, Thanjavur District,
                <br />
                Tamil Nadu – 612302, India
              </span>
            </div>
          </div>

          <div className="sois-contact-faqlink">
            Looking for quick answers? Visit our{" "}
            <Link href="/faq">FAQs</Link>.
          </div>
        </div>

        {/* Form column */}
        <div className="sois-contact-form-wrap">
          {sent ? (
            <div className="sois-contact-success">
              <div className="sois-contact-success-icon">
                <Check size={26} />
              </div>
              <h2>Message sent</h2>
              <p>
                Thanks for reaching out, {form.name.split(" ")[0] || "there"}.
                Our team will get back to you within 1–2 business days.
              </p>
              <button
                type="button"
                className="sois-account-cta ghost"
                onClick={() => {
                  setForm({ name: "", email: "", subject: "", message: "" });
                  setSent(false);
                }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form className="sois-contact-form" onSubmit={submit}>
              <div className="sois-contact-form-row">
                <label>
                  <span className="sois-address-form-label">Name</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={change}
                    style={{ borderColor: errors.name ? "#d4183d" : undefined }}
                  />
                </label>
                <label>
                  <span className="sois-address-form-label">Email</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={change}
                    style={{ borderColor: errors.email ? "#d4183d" : undefined }}
                  />
                </label>
              </div>
              <label style={{ display: "block" }}>
                <span className="sois-address-form-label">Subject</span>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={change}
                  style={{ borderColor: errors.subject ? "#d4183d" : undefined }}
                />
              </label>
              <label style={{ display: "block" }}>
                <span className="sois-address-form-label">Message</span>
                <textarea
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={change}
                  style={{ borderColor: errors.message ? "#d4183d" : undefined }}
                />
              </label>
              <button type="submit" className="sois-account-cta">
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </StoreShell>
  );
}
