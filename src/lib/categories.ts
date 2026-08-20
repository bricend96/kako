import type { Category, Profile } from "./types";

export interface CategoryMeta {
  key: Category;
  label: string;
  emoji: string;
  /** Ce que la page aide à faire (montré au choix du métier). */
  goal: string;
  theme: { from: string; to: string; accent: string };
}

export const CATEGORIES: CategoryMeta[] = [
  { key: "coiffeur", label: "Coiffure & beauté", emoji: "💇🏾‍♀️", goal: "Faire prendre des rendez-vous", theme: { from: "#db2777", to: "#a21d5c", accent: "#db2777" } },
  { key: "ecommerce", label: "Boutique en ligne", emoji: "🛍️", goal: "Vendre un catalogue de produits", theme: { from: "#ea580c", to: "#b8460a", accent: "#ea580c" } },
  { key: "restaurant", label: "Restaurant & cuisine", emoji: "🍽️", goal: "Recevoir des commandes de plats", theme: { from: "#16a34a", to: "#107a38", accent: "#16a34a" } },
  { key: "ecole", label: "École & formation", emoji: "🎓", goal: "Présenter les programmes et inscrire", theme: { from: "#2563eb", to: "#1d4ed8", accent: "#2563eb" } },
  { key: "artiste", label: "Artiste & musique", emoji: "🎤", goal: "Se faire écouter et booker", theme: { from: "#a21caf", to: "#7e1a8a", accent: "#a21caf" } },
  { key: "artisan", label: "Artisan & services", emoji: "🔧", goal: "Montrer son travail et être contacté", theme: { from: "#0f766e", to: "#0b5952", accent: "#0f766e" } },
  { key: "sante", label: "Santé & bien-être", emoji: "🏥", goal: "Présenter les soins et prendre des RDV", theme: { from: "#0d9488", to: "#0a726a", accent: "#0d9488" } },
  { key: "immobilier", label: "Immobilier", emoji: "🏠", goal: "Publier des biens à louer ou vendre", theme: { from: "#b45309", to: "#8a3f07", accent: "#b45309" } },
  { key: "evenementiel", label: "Événementiel", emoji: "📸", goal: "Montrer son portfolio et vendre des forfaits", theme: { from: "#be185d", to: "#921247", accent: "#be185d" } },
  { key: "transport", label: "Transport & VTC", emoji: "🚕", goal: "Afficher ses tarifs et prendre des courses", theme: { from: "#1d4ed8", to: "#1740a8", accent: "#1d4ed8" } },
  { key: "ong", label: "ONG & association", emoji: "🤝", goal: "Présenter sa mission et collecter des dons", theme: { from: "#0891b2", to: "#066f89", accent: "#0891b2" } },
  { key: "agriculture", label: "Agriculture & agro", emoji: "🌾", goal: "Vendre ses produits en gros et détail", theme: { from: "#65a30d", to: "#4d7d0a", accent: "#65a30d" } },
  { key: "hotellerie", label: "Hôtellerie & hébergement", emoji: "🏨", goal: "Présenter ses chambres et prendre des réservations", theme: { from: "#7c3aed", to: "#6d28d9", accent: "#7c3aed" } },
];

export function categoryMeta(key: Category): CategoryMeta {
  return CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[0];
}

/**
 * Contenu de démarrage pré-rempli lors de la création d'un site.
 * L'utilisateur n'a plus qu'à remplacer par ses vraies infos.
 */
export function starterContent(category: Category): Partial<Profile> {
  switch (category) {
    case "coiffeur":
      return {
        gallery: ["💇🏾‍♀️", "✨", "💅🏾", "👑", "💆🏾‍♀️", "🎀"],
        services: [
          { name: "Tresses collées", price: 5000, durationMin: 90, description: "Motifs simples ou stylés" },
          { name: "Tissage complet", price: 15000, durationMin: 150 },
        ],
        hours: [
          { day: "Lun–Ven", slot: "9h – 20h" },
          { day: "Samedi", slot: "9h – 22h" },
          { day: "Dimanche", slot: null },
        ],
      };
    case "ecommerce":
      return {
        delivery: { available: true, zones: ["Centre-ville"], fee: 1500 },
        products: [
          { id: "p1", name: "Article 1", price: 10000, emoji: "🛍️", inStock: true },
          { id: "p2", name: "Article 2", price: 25000, emoji: "👜", inStock: true },
        ],
      };
    case "restaurant":
      return {
        delivery: { available: true, zones: ["Centre-ville"], fee: 500 },
        hours: [{ day: "Tous les jours", slot: "11h – 22h" }],
        menu: [
          {
            title: "Plats principaux",
            dishes: [
              { name: "Plat du jour", price: 2500, emoji: "🍛", tag: "populaire" },
              { name: "Grillade", price: 3500, emoji: "🍖" },
            ],
          },
        ],
      };
    case "ecole":
      return {
        enrollNote: "Inscriptions ouvertes — places limitées.",
        programs: [
          { name: "Programme 1", price: 50000, duration: "3 mois", level: "Débutant", description: "Description du programme" },
          { name: "Programme 2", price: 90000, duration: "6 mois", level: "Intermédiaire" },
        ],
        hours: [{ day: "Lun–Ven", slot: "8h – 17h" }],
      };
    case "artiste":
      return {
        tipsEnabled: true,
        gallery: ["🎤", "🎶", "🎧", "🔥", "⭐", "📸"],
        tracks: [
          { title: "Titre 1", url: "", duration: "3:24" },
          { title: "Titre 2", url: "", duration: "4:02" },
        ],
        events: [
          { date: "Sam. 12 oct.", venue: "Salle de concert", city: "Ville" },
        ],
      };
    case "artisan":
      return {
        gallery: ["🔧", "🛠️", "✅", "👷🏾", "⭐", "📸"],
        services: [
          { name: "Prestation 1", price: 10000, description: "Décris ta prestation" },
          { name: "Prestation 2", price: 25000 },
        ],
        hours: [
          { day: "Lun–Sam", slot: "8h – 18h" },
          { day: "Dimanche", slot: null },
        ],
      };
    case "sante":
      return {
        services: [
          { name: "Consultation générale", price: 5000, durationMin: 20 },
          { name: "Bilan / analyse", price: 15000 },
        ],
        hours: [
          { day: "Lun–Ven", slot: "8h – 17h" },
          { day: "Samedi", slot: "8h – 13h" },
        ],
      };
    case "immobilier":
      return {
        listings: [
          { id: "b1", title: "Appartement 2 chambres", price: 150000, kind: "Location", location: "Centre-ville", bedrooms: 2, area: "70 m²", emoji: "🏢" },
          { id: "b2", title: "Villa avec jardin", price: 45000000, kind: "Vente", location: "Zone résidentielle", bedrooms: 4, area: "300 m²", emoji: "🏡" },
        ],
      };
    case "evenementiel":
      return {
        gallery: ["📸", "🎉", "💍", "🎂", "🎈", "✨"],
        services: [
          { name: "Forfait mariage", price: 250000, description: "Photos + vidéo journée complète" },
          { name: "Forfait anniversaire", price: 80000, description: "Reportage 3h" },
        ],
      };
    case "transport":
      return {
        delivery: { available: true, zones: ["Ville et environs"] },
        services: [
          { name: "Course en ville", price: 2000, description: "Trajet standard intra-muros" },
          { name: "Aéroport ↔ centre", price: 10000 },
          { name: "Location à la journée", price: 35000, description: "Chauffeur inclus, 8h" },
        ],
      };
    case "ong":
      return {
        enrollNote: "Votre don change des vies. Chaque contribution compte 🙏",
        gallery: ["🤝", "❤️", "🌍", "📚", "💧", "🍚"],
        programs: [
          { name: "Projet 1", duration: "Objectif : 500 000 FCFA", description: "Décris ce projet et son impact" },
          { name: "Projet 2", description: "Autre action menée par l'association" },
        ],
      };
    case "agriculture":
      return {
        delivery: { available: true, zones: ["Marché local", "Livraison ville"], fee: 0 },
        products: [
          { id: "a1", name: "Sac de riz local 25kg", price: 15000, emoji: "🌾", unit: "/sac", inStock: true },
          { id: "a2", name: "Régime de bananes", price: 3000, emoji: "🍌", unit: "/régime", inStock: true },
          { id: "a3", name: "Œufs frais", price: 2500, emoji: "🥚", unit: "/plateau", inStock: true },
        ],
      };
    case "hotellerie":
      return {
        listings: [
          { id: "r1", title: "Chambre standard", price: 20000, area: "18 m²", bedrooms: 1, emoji: "🛏️", description: "Climatisée, salle de bain privée, wifi" },
          { id: "r2", title: "Suite familiale", price: 45000, area: "40 m²", bedrooms: 2, emoji: "🏨", description: "2 chambres, salon, petit-déjeuner inclus" },
        ],
      };
  }
}
