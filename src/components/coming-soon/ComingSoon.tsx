"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Mail, Phone, ArrowRight, Check } from "lucide-react";
import { business } from "@/lib/business";
import { I } from "@/lib/data";

const policyLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Refund & Cancellation", href: "/refund-policy" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Returns", href: "/return-policy" },
];

/** The three ways to reach us before the storefront opens. */
const channels = [
  {
    key: "instagram",
    Icon: Instagram,
    value: business.social.instagramHandle,
    href: business.social.instagram,
    external: true,
  },
  {
    key: "email",
    Icon: Mail,
    value: business.email,
    href: `mailto:${business.email}`,
    external: false,
  },
  {
    key: "phone",
    Icon: Phone,
    value: business.phone,
    href: `tel:${business.phoneHref}`,
    external: false,
  },
];

/** Enquiries land in a SheetDB-backed Google Sheet until a CRM exists. */
const ENQUIRY_ENDPOINT = "https://sheetdb.io/api/v1/thw3iuvc32ug7";

type FormState = "idle" | "invalid" | "sending" | "failed" | "done";

/** Eight-point gold star — the page's one repeating ornament. */
function Fleuron({ size = 15 }: { size?: number }) {
  return (
    <svg
      className="sois-cs-fleuron"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 0q1 11 12 12-11 1-12 12-1-11-12-12Q11 11 12 0Z" />
      <path
        d="M12 4.4q.7 6.9 7.6 7.6-6.9.7-7.6 7.6-.7-6.9-7.6-7.6Q11.3 11.3 12 4.4Z"
        transform="rotate(45 12 12)"
        opacity=".7"
      />
    </svg>
  );
}

/** Hairline–star–hairline rule used under the headline and in the footer. */
function Ornament({ wide = false }: { wide?: boolean }) {
  return (
    <span
      className={`sois-cs-orn${wide ? " sois-cs-orn-wide" : ""}`}
      aria-hidden
    >
      <span className="sois-cs-orn-line" />
      <Fleuron size={wide ? 17 : 15} />
      <span className="sois-cs-orn-line" />
    </span>
  );
}

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
      <div className="sois-cs-done" role="status">
        <span className="sois-cs-done-icon">
          <Check size={20} aria-hidden />
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
        <label htmlFor="cs-name" className="sois-cs-sr">
          Full Name
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
        <label htmlFor="cs-email" className="sois-cs-sr">
          Email Address
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
        <label htmlFor="cs-phone" className="sois-cs-sr">
          Mobile Number
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
        <label htmlFor="cs-message" className="sois-cs-sr">
          Your Message
        </label>
        <textarea
          id="cs-message"
          name="message"
          rows={5}
          placeholder="Your Message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            touched();
          }}
        />
      </div>

      {state === "invalid" && (
        <p className="sois-cs-alert" role="alert">
          Please enter your name, a valid email address, a 10-digit mobile
          number and a short message.
        </p>
      )}
      {state === "failed" && (
        <p className="sois-cs-alert" role="alert">
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
        <ArrowRight size={16} aria-hidden />
      </button>
    </form>
  );
}

export function ComingSoon() {
  return (
    <div className="sois-cs">
      {/* ── One band, three columns: photograph · brand · enquiry ─── */}
      <main className="sois-cs-hero">
        {/* Flush to the left edge of the viewport and carried on behind the
            brand column, where a gradient mask dissolves its right side into
            the cream. No card, container, radius, shadow, border or
            background — the fade is the only treatment.

            The photograph carries its own subject left of centre — pendant,
            then chain, then the ringed hand below it — so it is served
            unflipped and pulled a little further left (objectPosition 60%)
            to seat the necklace clear of the mask's 44% falloff. What ends up
            in the dissolve is the blown-out window light and the shirt, which
            is what should be melting into the cream. */}
        <figure className="sois-cs-figure">
          <Image
            src={I.comingSoonCampaign}
            alt=""
            fill
            priority
            sizes="(min-width: 1180px) 35vw, (min-width: 768px) 39vw, 100vw"
            style={{
              objectFit: "cover",
              objectPosition: "60% 42%",
            }}
          />
        </figure>

        <div className="sois-cs-lede">
          <Image
            className="sois-cs-logo"
            src="/sois-logo.png"
            alt={business.brand}
            width={1106}
            height={402}
            priority
          />
          <span className="sois-cs-tagline">
            {business.tagline.toUpperCase()}
          </span>

          <Ornament />

          <h1 className="sois-cs-title">
            <span>Coming</span>
            <em>Soon</em>
          </h1>

          <Ornament />

          <p className="sois-cs-statement">
            SOIS is more than a jewellery brand. It&rsquo;s a celebration of
            stories, emotions, and the people who wear them.
          </p>

          {/* Icon · text · hairline, directly under the description —
              not a card and not a panel. */}
          <ul className="sois-cs-channels">
            {channels.map(({ key, Icon, value, href, external }) => (
              <li key={key}>
                <a
                  className="sois-cs-channel"
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <span className="sois-cs-channel-icon" aria-hidden>
                    <Icon size={15} />
                  </span>
                  <span className="sois-cs-channel-value">{value}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="sois-cs-formcard">
          <ContactForm />
        </div>
      </main>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="sois-cs-footer">
        <div className="sois-cs-footer-top">
          <div className="sois-cs-footer-brand">
            <Image
              className="sois-cs-footer-logo"
              src="/sois-logo.png"
              alt={business.brand}
              width={1106}
              height={402}
            />
            <span className="sois-cs-footer-tagline">
              {business.tagline.toUpperCase()}
            </span>
            <span className="sois-cs-footer-rule" aria-hidden />
          </div>

          <nav className="sois-cs-footer-nav" aria-label="Policies">
            {policyLinks.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <Ornament wide />

        <p className="sois-cs-copy">
          © {new Date().getFullYear()} {business.legalName}. Hallmarked 925
          Sterling Silver. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
