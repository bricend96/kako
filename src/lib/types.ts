// kako — types du domaine
// Un "Profil" = un mini-site. Sa "category" détermine le template affiché.

export type Category =
  | "coiffeur"
  | "ecommerce"
  | "restaurant"
  | "ecole"
  | "artiste"
  | "artisan"
  | "sante"
  | "immobilier"
  | "evenementiel"
  | "transport"
  | "ong"
  | "agriculture"
  | "hotellerie";

export type MomoProvider =
  | "Orange Money"
  | "MTN MoMo"
  | "Wave"
  | "Moov Money"
  | "M-Pesa"
  | "Airtel Money";

export const MOMO_PROVIDERS: MomoProvider[] = [
  "Orange Money",
  "MTN MoMo",
  "Wave",
  "Moov Money",
  "M-Pesa",
  "Airtel Money",
];

export interface OpeningHour {
  day: string; // "Lun–Ven"
  slot: string | null; // null = fermé
}

export type SocialType =
  | "instagram" | "facebook" | "tiktok" | "youtube" | "x" | "linkedin"
  | "snapchat" | "telegram" | "whatsapp" | "github" | "email" | "spotify"
  | "audiomack" | "pinterest" | "threads" | "discord" | "twitch"
  | "website" | "phone";

export interface SocialLink {
  type: SocialType;
  url: string;
  label?: string;
}

export interface Review {
  author: string;
  rating: number; // 1..5
  text: string;
}

/* ── Contenus spécifiques par métier ── */

export interface Service {
  name: string;
  price: number;
  durationMin?: number;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  emoji?: string;
  inStock?: boolean;
  unit?: string; // agriculture : "/kg", "/sac", "/régime"
  imageUrl?: string; // photo uploadée (compat)
  images?: string[]; // plusieurs images (URLs) ; en démo : emojis rendus en visuel
  category?: string; // catégorie définie par le vendeur (pour filtres)
}

export interface Dish {
  name: string;
  price: number;
  description?: string;
  emoji?: string;
  tag?: "populaire" | "nouveau" | "epuise";
  imageUrl?: string;
}

export interface MenuSection {
  title: string;
  dishes: Dish[];
}

/** École / formation */
export interface Program {
  name: string;
  price?: number;
  duration?: string; // "3 mois", "1 an"
  level?: string; // "Débutant", "CP–CM2"
  description?: string;
}

/** Artiste / chanteur */
export interface Track {
  title: string;
  url?: string; // lien d'écoute (YouTube, Audiomack…)
  duration?: string;
}

export interface EventDate {
  date: string; // libre : "Sam. 12 oct."
  venue: string;
  city: string;
  ticketUrl?: string;
}

/** Immobilier : bien à louer / vendre */
export interface Listing {
  id: string;
  title: string;
  price: number;
  kind?: "Location" | "Vente";
  location?: string;
  bedrooms?: number;
  area?: string; // "120 m²"
  emoji?: string;
  description?: string;
  imageUrl?: string;
}

export interface Profile {
  id: string;
  ownerId: string;
  slug: string;
  category: Category;
  published: boolean;
  createdAt: string;

  // Identité
  businessName: string;
  tagline: string;
  ownerName: string;
  bio: string;
  initials: string;
  verified?: boolean; // badge "Vérifié"
  avatarUrl?: string; // logo / photo de profil
  coverUrl?: string; // bannière
  ownerPhotoUrl?: string; // photo du responsable
  ownerRole?: string; // "Gérante", "Chef", "Fondateur"…
  ownerBio?: string; // petite bio perso du vendeur
  clientsServed?: number; // compteur social déclaré

  // Localisation & contact
  city: string;
  country: string;
  address?: string;
  mapUrl?: string;
  whatsapp: string; // E.164 sans "+"
  phone?: string;

  // Commerce
  currency: string; // "FCFA"
  momo: MomoProvider[];
  delivery?: { available: boolean; zones?: string[]; fee?: number };
  /** Si vrai : le client doit payer par Mobile Money sur la plateforme avant de contacter le vendeur. */
  requirePrepayment?: boolean;

  // Présentation
  hours?: OpeningHour[];
  socials?: SocialLink[];
  reviews?: Review[];

  theme: { from: string; to: string; accent: string };

  // Contenu spécifique au métier
  services?: Service[];
  gallery?: string[];
  products?: Product[];
  menu?: MenuSection[];
  programs?: Program[];
  enrollNote?: string; // école : phrase d'appel à l'inscription
  tracks?: Track[];
  events?: EventDate[];
  tipsEnabled?: boolean; // artiste : bouton "Soutenir / pourboire"
  listings?: Listing[]; // immobilier
}

export interface User {
  id: string;
  phone: string; // E.164 sans "+"
  name?: string;
  createdAt: string;
}
