"use client";

import Image from "next/image";

// Floating WhatsApp inquiry button shown on every store page and the homepage.
// Tapping it opens a WhatsApp chat with the store number and a prefilled
// inquiry message. The number mirrors the one in the footer. Styling and the
// pulse/entrance animation live in globals.css under `.sois-floating-whatsapp`.
const WHATSAPP_NUMBER = "917305272195";
const INQUIRY_MESSAGE = "Hi! I'm interested in your products.";

export function FloatingWhatsApp() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(INQUIRY_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title="Chat with us on WhatsApp"
      aria-label="Chat with us on WhatsApp"
      className="sois-floating-whatsapp"
    >
      {/* Expanding ripple rings that signal the button is "live". */}
      <span className="sois-floating-whatsapp-pulse" aria-hidden="true" />
      <Image
        src="/whatsapp.png"
        alt=""
        width={60}
        height={60}
        className="sois-floating-whatsapp-icon"
        priority
      />
    </a>
  );
}
