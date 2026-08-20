import type { Category } from "@/lib/types";

/**
 * Set d'icônes maison (aucune dépendance).
 * Trait uniforme (stroke 1.75, currentColor), taille réglable via `size`.
 * Remplace les emojis utilisés comme icônes d'interface et de contenu.
 */

interface IconProps {
  size?: number;
  className?: string;
}

function Svg({ size = 18, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

/* ── Actions / interface ── */
export const Phone = (p: IconProps) => (
  <Svg {...p}><path d="M4 5c0 8.3 6.7 15 15 15a2 2 0 0 0 2-2v-2.3a1 1 0 0 0-.8-1l-3.3-.7a1 1 0 0 0-1 .3l-1 1.2a12 12 0 0 1-5-5l1.2-1a1 1 0 0 0 .3-1L10.3 4.8a1 1 0 0 0-1-.8H7a2 2 0 0 0-2 2Z" /></Svg>
);
export const MapPin = (p: IconProps) => (
  <Svg {...p}><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></Svg>
);
export const IdCard = (p: IconProps) => (
  <Svg {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><circle cx="8.5" cy="11" r="2" /><path d="M5.5 16c.4-1.5 1.6-2.2 3-2.2s2.6.7 3 2.2M14 10h4M14 13.5h4" /></Svg>
);
export const Truck = (p: IconProps) => (
  <Svg {...p}><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" /><circle cx="7" cy="17.5" r="1.6" /><circle cx="17.5" cy="17.5" r="1.6" /></Svg>
);
export const Calendar = (p: IconProps) => (
  <Svg {...p}><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" /></Svg>
);
export const Ticket = (p: IconProps) => (
  <Svg {...p}><path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2 2 2 0 0 0 0-4Z" /><path d="M13 6v12" strokeDasharray="1.5 2" /></Svg>
);
export const Heart = (p: IconProps) => (
  <Svg {...p}><path d="M12 20s-7-4.4-7-9.5A4 4 0 0 1 12 8a4 4 0 0 1 7 2.5C19 15.6 12 20 12 20Z" /></Svg>
);
export const Play = (p: IconProps) => (
  <Svg {...p}><path d="M8 5.5v13l10-6.5Z" /></Svg>
);
export const Headphones = (p: IconProps) => (
  <Svg {...p}><path d="M4 13a8 8 0 0 1 16 0" /><rect x="3.5" y="13" width="4" height="6" rx="1.5" /><rect x="16.5" y="13" width="4" height="6" rx="1.5" /></Svg>
);
export const Lock = (p: IconProps) => (
  <Svg {...p}><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></Svg>
);
export const Bed = (p: IconProps) => (
  <Svg {...p}><path d="M3 8v11M3 12h18v7M21 19v-3a4 4 0 0 0-4-4H10v4" /><circle cx="6.5" cy="10.5" r="1.4" /></Svg>
);
export const Ruler = (p: IconProps) => (
  <Svg {...p}><rect x="3" y="7" width="18" height="10" rx="1.5" transform="rotate(0 12 12)" /><path d="M7 7v3M11 7v4M15 7v3M19 7v4" /></Svg>
);
export const Target = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" /></Svg>
);
export const Image = (p: IconProps) => (
  <Svg {...p}><rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="8.5" cy="10" r="1.6" /><path d="M4 17l4.5-4 3 2.5L15 11l5 5" /></Svg>
);
export const Star = ({ size = 18, className, filled }: IconProps & { filled?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" className={className} aria-hidden>
    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9Z" />
  </svg>
);

/* ── Réseaux sociaux ── */
export const Instagram = (p: IconProps) => (
  <Svg {...p}><rect x="4" y="4" width="16" height="16" rx="4.5" /><circle cx="12" cy="12" r="3.5" /><circle cx="17" cy="7" r="0.6" fill="currentColor" /></Svg>
);
export const Facebook = (p: IconProps) => (
  <Svg {...p}><path d="M14.5 8.5H13c-.8 0-1.2.5-1.2 1.2v1.8h2.5l-.4 2.6h-2.1V21" /><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" /></Svg>
);
export const TikTok = (p: IconProps) => (
  <Svg {...p}><path d="M14 4c.4 2.4 1.9 3.8 4 4v2.6c-1.4 0-2.8-.4-4-1.2v5.4a5 5 0 1 1-5-5c.3 0 .7 0 1 .1v2.7a2.3 2.3 0 1 0 1.6 2.2V4Z" /></Svg>
);
export const YouTube = (p: IconProps) => (
  <Svg {...p}><rect x="3" y="6.5" width="18" height="11" rx="3" /><path d="M10.5 9.5l4 2.5-4 2.5Z" fill="currentColor" /></Svg>
);
export const Globe = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4c2.5 2.5 2.5 13 0 16M12 4c-2.5 2.5-2.5 13 0 16" /></Svg>
);

/* ── Métiers (icône de catégorie) ── */
const Scissors = (p: IconProps) => (
  <Svg {...p}><circle cx="6.5" cy="7" r="2.2" /><circle cx="6.5" cy="17" r="2.2" /><path d="M8.4 8.5L20 17M8.4 15.5L20 7" /></Svg>
);
const ShoppingBag = (p: IconProps) => (
  <Svg {...p}><path d="M5 8h14l-1 12H6ZM8.5 8V6.5a3.5 3.5 0 0 1 7 0V8" /></Svg>
);
const Utensils = (p: IconProps) => (
  <Svg {...p}><path d="M7 3v8M5 3v4a2 2 0 0 0 2 2v0M9 3v4a2 2 0 0 1-2 2v0M7 11v10M16 3c-1.5 1-2 3-2 5s.5 3 2 3v10" /></Svg>
);
const GraduationCap = (p: IconProps) => (
  <Svg {...p}><path d="M12 4 2.5 9 12 14l9.5-5Z" /><path d="M6 11v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5M21.5 9v5" /></Svg>
);
const Mic = (p: IconProps) => (
  <Svg {...p}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" /></Svg>
);
const Wrench = (p: IconProps) => (
  <Svg {...p}><path d="M15 6a4 4 0 0 0-5 5L4 17l3 3 6-6a4 4 0 0 0 5-5l-2.5 2.5L13 8.5Z" /></Svg>
);
const Stethoscope = (p: IconProps) => (
  <Svg {...p}><path d="M6 3v5a4 4 0 0 0 8 0V3M6 3H4.5M14 3h1.5M10 16a6 6 0 0 0 6 6c2.2 0 3.5-1.8 3.5-3.5" /><circle cx="19.5" cy="15" r="2" /></Svg>
);
const Home = (p: IconProps) => (
  <Svg {...p}><path d="M4 11 12 4l8 7M6 10v9h12v-9" /><path d="M10 19v-5h4v5" /></Svg>
);
const Camera = (p: IconProps) => (
  <Svg {...p}><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a1 1 0 0 1 1-1Z" /><circle cx="12" cy="13" r="3.2" /></Svg>
);
const Car = (p: IconProps) => (
  <Svg {...p}><path d="M4 15v-2l2-5h12l2 5v2M4 15h16v3h-2v-1H6v1H4Z" /><circle cx="7.5" cy="15.5" r="1.3" fill="currentColor" /><circle cx="16.5" cy="15.5" r="1.3" fill="currentColor" /></Svg>
);
const Handshake = (p: IconProps) => (
  <Svg {...p}><path d="M3 8h4l3 3 2-1 5 4M21 8h-4l-2 2M8 11l-2.5 2.5a1.5 1.5 0 0 0 2 2M9.5 15.5a1.4 1.4 0 0 0 2 2l.5-.5M12 17.5a1.4 1.4 0 0 0 2 2" /></Svg>
);
const Wheat = (p: IconProps) => (
  <Svg {...p}><path d="M12 21V9M12 9c0-2 1.5-4 1.5-4S15 6.5 13.5 9M12 9c0-2-1.5-4-1.5-4S9 6.5 10.5 9M12 13c0-1.5 2-3 2-3s.5 2.5-1 4M12 13c0-1.5-2-3-2-3s-.5 2.5 1 4M12 17c0-1.5 2-3 2-3s.5 2.5-1 4M12 17c0-1.5-2-3-2-3s-.5 2.5 1 4" /></Svg>
);
const Hotel = (p: IconProps) => (
  <Svg {...p}><path d="M4 20V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v15M15 20V9h4a1 1 0 0 1 1 1v10M4 20h17" /><path d="M7.5 8h2M7.5 11.5h2M7.5 15h2" /></Svg>
);

const CATEGORY_ICONS: Record<Category, (p: IconProps) => React.JSX.Element> = {
  coiffeur: Scissors,
  ecommerce: ShoppingBag,
  restaurant: Utensils,
  ecole: GraduationCap,
  artiste: Mic,
  artisan: Wrench,
  sante: Stethoscope,
  immobilier: Home,
  evenementiel: Camera,
  transport: Car,
  ong: Handshake,
  agriculture: Wheat,
  hotellerie: Hotel,
};

export function CategoryIcon({ category, size = 20, className }: { category: Category } & IconProps) {
  const Ico = CATEGORY_ICONS[category] ?? ShoppingBag;
  return <Ico size={size} className={className} />;
}
