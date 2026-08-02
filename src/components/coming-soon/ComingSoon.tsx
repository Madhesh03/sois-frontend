"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Check } from "lucide-react";
import { business, addressOneLine } from "@/lib/business";
import { I } from "@/lib/data";

const policyLinks = [
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "Refund & Cancellation", href: "/refund-policy" },
  { label: "Shipping", href: "/shipping-policy" },
  { label: "Returns", href: "/return-policy" },
  { label: "Contact", href: "/contact" },
];

type FormState = "idle" | "error" | "done";

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<FormState>("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prototype: no messaging backend yet — validate and acknowledge locally.
    const valid =
      name.trim().length > 1 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) &&
      message.trim().length > 4;
    setState(valid ? "done" : "error");
  };

  const touched = () => {
    if (state === "error") setState("idle");
  };

  if (state === "done") {
    return (
      <div className="sois-cs-form-done" role="status">
        <span className="sois-cs-form-done-icon">
          <Check size={15} aria-hidden />
        </span>
        <p>
          Thank you, {name.trim().split(" ")[0]} — your message is with us.
          We&rsquo;ll reply to {email.trim()} shortly.
        </p>
      </div>
    );
  }

  return (
    <form className="sois-cs-form" onSubmit={submit} noValidate>
      <div className="sois-cs-field">
        <label htmlFor="cs-name" className="sois-cs-visually-hidden">
          Full name
        </label>
        <input
          id="cs-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Full Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            touched();
          }}
        />
      </div>

      <div className="sois-cs-field">
        <label htmlFor="cs-email" className="sois-cs-visually-hidden">
          Email address
        </label>
        <input
          id="cs-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            touched();
          }}
        />
      </div>

      <div className="sois-cs-field">
        <label htmlFor="cs-message" className="sois-cs-visually-hidden">
          Your message
        </label>
        <textarea
          id="cs-message"
          name="message"
          rows={2}
          placeholder="Your Message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            touched();
          }}
        />
      </div>

      {state === "error" && (
        <p className="sois-cs-form-error" role="alert">
          Please enter your name, a valid email address and a short message.
        </p>
      )}

      <button type="submit" className="sois-cs-submit">
        Contact Us
      </button>
    </form>
  );
}

export function ComingSoon() {
  const { launchDate } = business;
  const launchLabel = launchDate
    ? launchDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : null;

  return (
    <div className="sois-cs">
      {/* ── Left panel: brand, form, contact & policies ───────────── */}
      <div className="sois-cs-panel">
        <div className="sois-cs-inner">
          <header className="sois-cs-brand">
            <Image
              className="sois-cs-logo"
              src="/sois-logo.png"
              alt={business.brand}
              width={1106}
              height={402}
              priority
            />
            <span className="sois-cs-brand-sub">
              <span className="sois-cs-rule" aria-hidden />
              {business.tagline.toUpperCase()}
              <span className="sois-cs-rule" aria-hidden />
            </span>
          </header>

          <h1 className="sois-cs-title">Coming Soon</h1>

          <p className="sois-cs-lede">
            {launchLabel
              ? `We open in ${launchLabel}. Having any questions?`
              : "We will launch soon. Having any questions?"}{" "}
            Feel free to contact us.
          </p>

          <ContactForm />

          <div className="sois-cs-meta">
            <a
              className="sois-cs-social"
              href={business.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${business.brand} on Instagram`}
            >
              <Instagram size={16} aria-hidden />
            </a>

            <address className="sois-cs-contact">
              <a href={`mailto:${business.email}`}>{business.email}</a>
              <span aria-hidden>•</span>
              <a href={`tel:${business.phoneHref}`}>{business.phone}</a>
              <span aria-hidden>•</span>
              <span>{addressOneLine}</span>
            </address>

            <nav className="sois-cs-policies" aria-label="Policies">
              {policyLinks.map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </nav>

            <p className="sois-cs-legal">
              © {new Date().getFullYear()} {business.legalName} · Hallmarked 925
              sterling silver · Prices ₹
              {business.priceRange.min.toLocaleString("en-IN")}–₹
              {business.priceRange.max.toLocaleString("en-IN")} incl. GST
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel: full-bleed campaign image ────────────────── */}
      <div className="sois-cs-visual">
        <Image
          src={I.comingSoonHands}
          alt="Clasped hands wearing a SOIS sterling silver ring and bangle"
          fill
          priority
          sizes="(max-width: 899px) 100vw, 50vw"
          style={{ objectFit: "cover", objectPosition: "center 40%" }}
        />
      </div>
    </div>
  );
}
