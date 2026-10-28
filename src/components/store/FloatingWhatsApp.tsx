"use client";

// Floating WhatsApp inquiry button shown on every store page (rendered from
// StoreShell). Tapping it opens a WhatsApp chat with the store number and a
// prefilled inquiry message. The number mirrors the one in the footer.
const WHATSAPP_NUMBER = "917305272195";
const INQUIRY_MESSAGE = "Hi! I'm interested in your products.";
const WHATSAPP_GREEN = "#25D366";

// Sits above page content and the fixed nav (z-index 100) but below the
// overlay drawers (z-index 9998+) so it never floats over an open cart/auth
// drawer.
const Z_INDEX = 900;

export function FloatingWhatsApp() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(INQUIRY_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title="Chat with us on WhatsApp"
      aria-label="Chat with us on WhatsApp"
      className="sois-touch-target sois-floating-whatsapp"
      style={{
        position: "fixed",
        right: "clamp(16px, 4vw, 28px)",
        bottom: "clamp(16px, 4vw, 28px)",
        zIndex: Z_INDEX,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: WHATSAPP_GREEN,
        color: "#fff",
        boxShadow: "0 6px 18px rgba(0,0,0,0.22)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
    >
      <svg width={30} height={30} viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12.031 2C6.505 2 2.02 6.485 2.02 12.011c0 1.916.532 3.786 1.541 5.409L2 22l4.703-1.53a9.96 9.96 0 004.323.997h.005c5.526 0 10.011-4.485 10.011-10.011C21.042 6.93 16.557 2 12.031 2zm0 18.184h-.004a8.16 8.16 0 01-4.161-1.14l-.298-.177-3.096 1.008 1.024-3.017-.194-.309a8.146 8.146 0 01-1.253-4.346c0-4.51 3.671-8.181 8.186-8.181 2.187 0 4.243.852 5.789 2.399a8.126 8.126 0 012.396 5.792c0 4.51-3.671 8.181-8.19 8.181z" />
      </svg>
    </a>
  );
}
