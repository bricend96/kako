import type { SocialType } from "@/lib/types";

/**
 * Icônes de marque (SVG maison, aucune dépendance) + couleur officielle.
 * Chaque glyphe utilise currentColor → la couleur de marque est appliquée par le conteneur.
 * Jeu complet type Linktree.
 */

interface P { size?: number }
const box = (children: React.ReactNode, size = 20, fill = true) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke={fill ? "none" : "currentColor"} strokeWidth={fill ? 0 : 1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden>{children}</svg>
);

const Instagram = ({ size }: P) => box(<>
  <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.9" />
  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.9" />
  <circle cx="17.2" cy="6.8" r="1.1" />
</>, size);

const Facebook = ({ size }: P) => box(
  <path d="M13.5 21v-7h2.3l.4-2.9h-2.7V9.3c0-.8.3-1.4 1.5-1.4h1.3V5.3c-.6-.1-1.4-.2-2.3-.2-2.3 0-3.8 1.4-3.8 3.9v2.1H8.9V14h2.3v7z" />,
  size);

const XMark = ({ size }: P) => box(
  <path d="M4 3h3.6l4.3 5.9L16.8 3H20l-6.2 8 6.6 10H16.8l-4.7-6.4L6.7 21H3.4l6.6-8.4z" />,
  size);

const TikTok = ({ size }: P) => box(
  <path d="M14 3c.3 2.3 1.7 3.8 4 4v2.7c-1.4 0-2.7-.4-4-1.1v5.6a5.3 5.3 0 1 1-5.3-5.3c.3 0 .6 0 .9.1v2.8a2.5 2.5 0 1 0 1.7 2.4V3z" />,
  size);

const YouTube = ({ size }: P) => box(<>
  <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
  <path d="M10.2 9.2 15 12l-4.8 2.8z" fill="#000" />
</>, size);

const LinkedIn = ({ size }: P) => box(<>
  <rect x="3" y="3" width="18" height="18" rx="2.6" />
  <path d="M7.6 9.5v8M7.6 6.6v.1M11 17.5v-4.4c0-2.6 3.4-2.8 3.4 0v4.4" fill="none" stroke="#000" strokeWidth="1.9" />
  <circle cx="7.6" cy="6.6" r="0.2" fill="#000" />
</>, size);

const Snapchat = ({ size }: P) => box(
  <path d="M12 3c2.4 0 3.7 1.9 3.7 4.2 0 .8-.1 1.5-.1 1.7.2.1.6.2 1 .1.7-.2 1.1.6.4 1-.5.3-1.3.4-1.4.8-.1.5 1 1.9 2.6 2.4.4.1.4.5.1.7-.5.4-1.4.3-1.7.7-.2.3.1.9-.4 1-1 .2-1.6-.6-3.2-.1-1 .3-1.6 1.2-3 1.2s-2-.9-3-1.2c-1.6-.5-2.2.3-3.2.1-.5-.1-.2-.7-.4-1-.3-.4-1.2-.3-1.7-.7-.3-.2-.3-.6.1-.7 1.6-.5 2.7-1.9 2.6-2.4-.1-.4-.9-.5-1.4-.8-.7-.4-.3-1.2.4-1 .4.1.8 0 1-.1 0-.2-.1-.9-.1-1.7C8.3 4.9 9.6 3 12 3z" />,
  size);

const Telegram = ({ size }: P) => box(
  <path d="M21 5 3.2 11.6c-.8.3-.8 1.4 0 1.6l4.3 1.4 1.7 4.8c.2.6 1 .7 1.4.2l2.2-2.4 3.9 2.9c.5.4 1.2.1 1.3-.5L21.9 6c.2-.8-.6-1.4-.9-1z" />,
  size);

const WhatsApp = ({ size }: P) => box(
  <path d="M12.05 4C7.7 4 4.15 7.54 4.15 11.9c0 1.4.37 2.76 1.06 3.96L4 20l4.24-1.11a7.9 7.9 0 0 0 3.8.97c4.35 0 7.9-3.54 7.9-7.9 0-2.11-.82-4.1-2.35-5.64A7.85 7.85 0 0 0 12.05 4Zm3.65 8.32c-.2-.1-1.17-.58-1.35-.64-.18-.07-.31-.1-.44.1-.13.2-.51.64-.62.77-.11.13-.23.15-.43.05-.2-.1-.83-.31-1.59-.98-.59-.52-.98-1.17-1.1-1.37-.11-.2-.01-.3.09-.4.09-.09.2-.23.3-.35.1-.12.13-.2.2-.34.07-.13.03-.25-.02-.35-.05-.1-.44-1.07-.6-1.46-.16-.38-.32-.33-.44-.34h-.37a.72.72 0 0 0-.52.24c-.18.2-.68.67-.68 1.62 0 .96.7 1.88.8 2.01.1.13 1.38 2.11 3.34 2.96.47.2.83.32 1.11.42.47.15.9.13 1.23.08.38-.06 1.17-.48 1.33-.94.16-.46.16-.86.12-.94-.05-.08-.18-.13-.38-.23Z" />,
  size);

const GitHub = ({ size }: P) => box(
  <path d="M12 3a9 9 0 0 0-2.85 17.54c.45.08.62-.2.62-.43v-1.5c-2.5.55-3.03-1.2-3.03-1.2-.41-1.04-1-1.32-1-1.32-.82-.56.06-.55.06-.55.9.06 1.38.93 1.38.93.8 1.38 2.1.98 2.62.75.08-.58.31-.98.57-1.2-2-.23-4.1-1-4.1-4.45 0-.98.35-1.79.93-2.42-.1-.23-.4-1.15.08-2.4 0 0 .76-.24 2.48.92a8.6 8.6 0 0 1 4.52 0c1.72-1.16 2.48-.92 2.48-.92.48 1.25.18 2.17.09 2.4.58.63.92 1.44.92 2.42 0 3.46-2.1 4.22-4.11 4.44.32.28.6.82.6 1.66v2.46c0 .24.16.52.63.43A9 9 0 0 0 12 3Z" />,
  size);

const Email = ({ size }: P) => box(<>
  <rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.9" />
  <path d="M4 7l8 5.5L20 7" fill="none" stroke="currentColor" strokeWidth="1.9" />
</>, size);

const Spotify = ({ size }: P) => box(<>
  <circle cx="12" cy="12" r="9" />
  <path d="M7.5 9.6c3-.8 6-.5 8.4 1M8 12.6c2.4-.6 4.8-.3 6.7.9M8.4 15.4c1.9-.4 3.7-.2 5.2.7" fill="none" stroke="#000" strokeWidth="1.5" />
</>, size);

const Audiomack = ({ size }: P) => box(<>
  <circle cx="12" cy="12" r="9" />
  <path d="M8 15V9l3 3 2-4 3 7" fill="none" stroke="#000" strokeWidth="1.6" />
</>, size);

const Pinterest = ({ size }: P) => box(
  <path d="M12 3a9 9 0 0 0-3.3 17.4c-.1-.7-.1-1.9 0-2.7l1-4.3s-.3-.5-.3-1.3c0-1.2.7-2.1 1.6-2.1.8 0 1.1.6 1.1 1.3 0 .8-.5 2-.8 3.1-.2.9.5 1.6 1.4 1.6 1.7 0 2.8-2.1 2.8-4.6 0-1.9-1.3-3.3-3.6-3.3-2.6 0-4.2 1.9-4.2 4 0 .7.2 1.3.5 1.6.1.2.2.3.1.5l-.2.8c0 .2-.2.3-.4.2-1.1-.5-1.6-1.8-1.6-3.3 0-2.5 2.1-5.4 6.2-5.4 3.3 0 5.5 2.4 5.5 5 0 3.4-1.9 5.9-4.6 5.9-.9 0-1.8-.5-2.1-1.1l-.6 2.2c-.2.7-.6 1.5-1 2.1A9 9 0 1 0 12 3Z" />,
  size);

const Threads = ({ size }: P) => box(
  <path d="M12.5 3c3.6 0 6 2.4 6.3 6.2.2 2.6-.4 5-1.9 6.7-1.3 1.5-3.1 2.1-5 2.1-3.6 0-6.4-2.6-6.4-6.9C5.5 6.5 8.3 3 12.5 3Zm.2 6.7c-2 0-3.1.9-3.1 2.2 0 1.1.9 1.8 2.1 1.8 1.7 0 2.7-1.2 2.7-3.1 0-.2 0-.4-.1-.6-.5-.2-1-.3-1.6-.3Z" fill="none" stroke="currentColor" strokeWidth="1.9" />,
  size);

const Discord = ({ size }: P) => box(
  <path d="M18.5 6.2A15 15 0 0 0 14.8 5l-.3.5c1.3.3 2 .7 2.8 1.2A11 11 0 0 0 12 6c-1.9 0-3.6.3-5.3.9.8-.5 1.5-.9 2.8-1.2L9.2 5A15 15 0 0 0 5.5 6.2C3.6 9 3 11.7 3.2 14.4A14 14 0 0 0 7.3 16l.6-1c-.6-.2-1.2-.5-1.7-.9.4.2.9.4 1.3.6a11 11 0 0 0 9 0c.4-.2.9-.4 1.3-.6-.5.4-1.1.7-1.7.9l.6 1a14 14 0 0 0 4.1-1.6c.3-3.2-.6-5.9-2.3-8.2ZM9.5 13c-.7 0-1.3-.7-1.3-1.5S8.8 10 9.5 10s1.3.7 1.3 1.5S10.2 13 9.5 13Zm5 0c-.7 0-1.3-.7-1.3-1.5S13.8 10 14.5 10s1.3.7 1.3 1.5S15.2 13 14.5 13Z" />,
  size);

const Twitch = ({ size }: P) => box(
  <path d="M5 3h15v10l-4 4h-3l-2 2H8v-2H4V6zm2 2v9h3v2l2-2h3l3-3V5zm5 2h2v4h-2zm4 0h2v4h-2z" />,
  size);

const Website = ({ size }: P) => box(<>
  <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.9" />
  <path d="M3.5 12h17M12 3c2.6 2.5 2.6 15 0 18M12 3c-2.6 2.5-2.6 15 0 18" fill="none" stroke="currentColor" strokeWidth="1.6" />
</>, size);

const PhoneIco = ({ size }: P) => box(
  <path d="M6 3h3l1.5 4-2 1.5a12 12 0 0 0 5 5L15 11l4 1.5V16a2 2 0 0 1-2 2A14 14 0 0 1 4 5a2 2 0 0 1 2-2z" />,
  size);

export interface SocialMeta {
  label: string;
  color: string; // couleur de marque (visible sur fond sombre)
  Icon: (p: P) => React.JSX.Element;
  placeholder: string;
}

export const SOCIALS: Record<SocialType, SocialMeta> = {
  instagram: { label: "Instagram", color: "#E1306C", Icon: Instagram, placeholder: "https://instagram.com/…" },
  facebook:  { label: "Facebook",  color: "#1877F2", Icon: Facebook,  placeholder: "https://facebook.com/…" },
  tiktok:    { label: "TikTok",    color: "#ffffff", Icon: TikTok,    placeholder: "https://tiktok.com/@…" },
  youtube:   { label: "YouTube",   color: "#FF0000", Icon: YouTube,   placeholder: "https://youtube.com/@…" },
  x:         { label: "X",         color: "#e7e7ea", Icon: XMark,     placeholder: "https://x.com/…" },
  linkedin:  { label: "LinkedIn",  color: "#0A66C2", Icon: LinkedIn,  placeholder: "https://linkedin.com/in/…" },
  snapchat:  { label: "Snapchat",  color: "#FFFC00", Icon: Snapchat,  placeholder: "https://snapchat.com/add/…" },
  telegram:  { label: "Telegram",  color: "#26A5E4", Icon: Telegram,  placeholder: "https://t.me/…" },
  whatsapp:  { label: "WhatsApp",  color: "#25D366", Icon: WhatsApp,  placeholder: "https://wa.me/221…" },
  github:    { label: "GitHub",    color: "#f0f0f2", Icon: GitHub,    placeholder: "https://github.com/…" },
  email:     { label: "E-mail",    color: "#EA4335", Icon: Email,     placeholder: "mailto:contact@…" },
  spotify:   { label: "Spotify",   color: "#1DB954", Icon: Spotify,   placeholder: "https://open.spotify.com/artist/…" },
  audiomack: { label: "Audiomack", color: "#FFA200", Icon: Audiomack, placeholder: "https://audiomack.com/…" },
  pinterest: { label: "Pinterest", color: "#E60023", Icon: Pinterest, placeholder: "https://pinterest.com/…" },
  threads:   { label: "Threads",   color: "#f0f0f2", Icon: Threads,   placeholder: "https://threads.net/@…" },
  discord:   { label: "Discord",   color: "#5865F2", Icon: Discord,   placeholder: "https://discord.gg/…" },
  twitch:    { label: "Twitch",    color: "#9146FF", Icon: Twitch,    placeholder: "https://twitch.tv/…" },
  website:   { label: "Site web",  color: "#9aa0aa", Icon: Website,   placeholder: "https://…" },
  phone:     { label: "Téléphone", color: "#34D399", Icon: PhoneIco,  placeholder: "tel:+221…" },
};

export const SOCIAL_ORDER = Object.keys(SOCIALS) as SocialType[];

/** Bouton réseau social prêt à l'emploi (couleur de marque, sur fond sombre). */
export function SocialButton({ type, url, label, size = 18 }: { type: SocialType; url: string; label?: string; size?: number }) {
  const meta = SOCIALS[type] ?? SOCIALS.website;
  const Icon = meta.Icon;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 rounded-full glass-card px-3.5 py-2 text-sm font-medium text-[var(--text)] transition active:scale-95 hover:bg-white/10"
      style={{ borderColor: `color-mix(in srgb, ${meta.color} 40%, transparent)` }}
    >
      <span style={{ color: meta.color }} className="grid place-items-center transition group-hover:scale-110">
        <Icon size={size} />
      </span>
      <span className="truncate max-w-[9rem]">{label || meta.label}</span>
    </a>
  );
}
