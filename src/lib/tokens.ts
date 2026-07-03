export const T = {
  bg: "#FAFAFA",
  surface: "#F3F4F6",
  white: "#FFFFFF",
  ink: "#0A0A0A",
  muted: "#4B5563",
  faint: "#9CA3AF",
  silver: "#8891A4",
  forest: "#115E59",
  sage: "#D1FAE5",
  sageDark: "#99F6E4",
  border: "#E8E8E8",
  borderDk: "#D1D5DB",
} as const;

export const globalStyles = `
  @keyframes ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes heartPop {
    0%   { transform: scale(1); }
    35%  { transform: scale(1.45); }
    65%  { transform: scale(0.88); }
    100% { transform: scale(1); }
  }
  @keyframes badgeFade {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes heroSlideFade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .ticker-track { animation: ticker 28s linear infinite; }
  .ticker-track:hover { animation-play-state: paused; }
  .fade-up { animation: fadeUp 0.7s ease both; }
  .product-card:hover .card-actions { opacity: 1; transform: translateY(0); }
  .product-card:hover .card-img { transform: scale(1.05); }
  .cat-tile:hover .cat-overlay { opacity: 1; }
  .cat-tile:hover .cat-img { transform: scale(1.06); }
  .story-img-tile { transition: transform 0.55s ease; }
  .craft-img-tile { transition: transform 0.55s ease; }
  .sois-story-img:hover .story-img-tile { transform: scale(1.05); }
  .sois-craft-img:hover .craft-img-tile { transform: scale(1.05); }
  .nav-link::after {
    content: ''; display: block; height: 1.5px;
    background: ${T.forest}; width: 0;
    transition: width 0.25s ease;
  }
  .nav-link:hover::after { width: 100%; }
  .pc-img { transition: transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94); }
  .heart-pop { animation: heartPop 0.38s ease; }
  .hero-slide { animation: heroSlideFade 1s ease; }
  .hero-dot { transition: background 0.25s ease, transform 0.25s ease, width 0.25s ease; }
  .hero-arrow { transition: background 0.2s ease, opacity 0.2s ease; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${T.sage}; border-radius: 3px; }
`;