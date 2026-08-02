"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Check } from "lucide-react";
import { business } from "@/lib/business";
import { I } from "@/lib/data";

const policyLinks = [
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "Refund & Cancellation", href: "/refund-policy" },
  { label: "Shipping", href: "/shipping-policy" },
  { label: "Returns", href: "/return-policy" },
  { label: "Contact", href: "/contact" },
];

/** Enquiries land in a SheetDB-backed Google Sheet until a CRM exists. */
const ENQUIRY_ENDPOINT = "https://sheetdb.io/api/v1/thw3iuvc32ug7";

type FormState = "idle" | "invalid" | "sending" | "failed" | "done";

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<FormState>("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;

    const valid =
      name.trim().length > 1 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) &&
      // 10-digit Indian mobile, optionally with a +91 / 0 prefix.
      /^(\+?91[-\s]?|0)?[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, "")) &&
      message.trim().length > 4;

    if (!valid) {
      setState("invalid");
      return;
    }

    setState("sending");
    try {
      const res = await fetch(ENQUIRY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Keys must match the sheet's header row exactly — it is lower-case,
        // and SheetDB rejects the whole request ("Bad data format") otherwise.
        body: JSON.stringify({
          data: [
            {
              name: name.trim(),
              email: email.trim(),
              phone: phone.trim(),
              message: message.trim(),
            },
          ],
        }),
      });
      if (!res.ok) throw new Error(`Enquiry failed: ${res.status}`);
      setState("done");
    } catch {
      setState("failed");
    }
  };

  const touched = () => {
    if (state === "invalid" || state === "failed") setState("idle");
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
        <label htmlFor="cs-phone" className="sois-cs-visually-hidden">
          Mobile number
        </label>
        <input
          id="cs-phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="Mobile Number"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
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

      {state === "invalid" && (
        <p className="sois-cs-form-error" role="alert">
          Please enter your name, a valid email address, a 10-digit mobile
          number and a short message.
        </p>
      )}
      {state === "failed" && (
        <p className="sois-cs-form-error" role="alert">
          We couldn&rsquo;t send that just now. Please try again, or write to{" "}
          {business.email}.
        </p>
      )}

      <button
        type="submit"
        className="sois-cs-submit"
        disabled={state === "sending"}
      >
        {state === "sending" ? "Sending…" : "Contact Us"}
      </button>
    </form>
  );
}

export function ComingSoon() {
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

          <p className="sois-cs-statement">
            SOIS is more than a jewellery brand. It&rsquo;s a celebration of
            stories, emotions, and the people who wear them.
          </p>

          <p className="sois-cs-lede">
            We will launch soon. Having any questions? Feel free to contact us.
          </p>

          <ContactForm />

          <div className="sois-cs-meta">
            <a
              className="sois-cs-social"
              href={business.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={15} aria-hidden />
              <span>{business.social.instagramHandle}</span>
            </a>

            <address className="sois-cs-contact">
              <a href={`mailto:${business.email}`}>{business.email}</a>
              <span aria-hidden>•</span>
              <a href={`tel:${business.phoneHref}`}>{business.phone}</a>
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
