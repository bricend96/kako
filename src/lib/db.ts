import { promises as fs } from "fs";
import path from "path";
import type { Profile, User } from "./types";

/**
 * Persistance simple sur fichier JSON pour le mode démo.
 * Remplaçable par Prisma+Postgres sans toucher au reste de l'app
 * (seules les fonctions de store.ts appellent read/write).
 */

export interface SiteStats {
  views: number;
  waClicks: number;
}

export interface Complaint {
  text: string;
  at: string;
}

export interface DB {
  version: number;
  users: User[];
  profiles: Profile[];
  otps: { phone: string; code: string; expires: number }[];
  stats: Record<string, SiteStats>;
  subscribers: Record<string, string[]>;      // slug -> numéros E.164 (sans +)
  reports: Record<string, number>;             // slug -> nb de signalements "arnaque"
  complaints: Record<string, Complaint[]>;     // slug -> réclamations clients
}

// Incrémente ce numéro quand le contenu de démo change : au prochain
// démarrage, la base de démo est régénérée automatiquement (pas besoin
// de supprimer data/db.json à la main).
const SEED_VERSION = 11;

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

const DEMO_USER: User = {
  id: "u_demo",
  phone: "221770000000",
  name: "Compte démo",
  createdAt: "2026-01-01T00:00:00.000Z",
};

function seed(): DB {
  const profiles: Profile[] = [
    {
      id: "pr_awa", ownerId: "u_demo", slug: "awa-beaute", category: "coiffeur",
      published: true, createdAt: "2026-01-02T00:00:00.000Z",
      businessName: "Awa Beauté", tagline: "Salon de coiffure & tresses — Dakar",
      ownerName: "Awa Ndiaye", initials: "AB",
      bio: "10 ans d'expérience en tresses, tissages et soins naturels. Sur rendez-vous.",
      city: "Dakar", country: "Sénégal", address: "Sicap Liberté 6, Dakar",
      mapUrl: "https://maps.google.com/?q=Sicap+Liberte+Dakar",
      whatsapp: "221771234567", phone: "+221 77 123 45 67",
      currency: "FCFA", momo: ["Orange Money", "Wave"],
      theme: { from: "#db2777", to: "#a21d5c", accent: "#db2777" },
      hours: [
        { day: "Lun–Ven", slot: "9h – 20h" },
        { day: "Samedi", slot: "9h – 22h" },
        { day: "Dimanche", slot: null },
      ],
      socials: [
        { type: "instagram", url: "https://instagram.com/awa.beaute", label: "@awa.beaute" },
        { type: "tiktok", url: "https://tiktok.com/@awa.beaute", label: "@awa.beaute" },
      ],
      services: [
        { name: "Tresses collées (cornrows)", price: 5000, durationMin: 90, description: "Motifs simples ou stylés" },
        { name: "Tissage complet", price: 15000, durationMin: 150, description: "Pose + coupe + finitions" },
        { name: "Défrisage & soin", price: 8000, durationMin: 60 },
        { name: "Coiffure enfant", price: 3000, durationMin: 45 },
        { name: "Maquillage événement", price: 20000, durationMin: 60, description: "Mariage, cérémonie" },
      ],
      gallery: ["💇🏾‍♀️", "✨", "💅🏾", "👑", "💆🏾‍♀️", "🎀"],
      reviews: [
        { author: "Fatou D.", rating: 5, text: "Mes tresses ont tenu 3 semaines, super propre !" },
        { author: "Mariam S.", rating: 5, text: "Accueil top et prix corrects. Je recommande." },
      ],
    },
    {
      id: "pr_fatou", ownerId: "u_demo", slug: "chez-fatou", category: "ecommerce",
      published: true, createdAt: "2026-01-03T00:00:00.000Z",
      businessName: "Chez Fatou", tagline: "Pagnes, sacs & accessoires — livraison Abidjan",
      ownerName: "Fatou Koné", initials: "CF",
      bio: "Sélection de pagnes wax, sacs faits main et bijoux. Commande sur WhatsApp, livraison 24–48h.",
      city: "Abidjan", country: "Côte d'Ivoire", whatsapp: "2250701234567",
      currency: "FCFA", momo: ["Orange Money", "MTN MoMo", "Wave"],
      requirePrepayment: true,
      delivery: { available: true, zones: ["Cocody", "Plateau", "Yopougon", "Marcory"], fee: 1500 },
      theme: { from: "#ea580c", to: "#b8460a", accent: "#ea580c" },
      socials: [
        { type: "instagram", url: "https://instagram.com/chez.fatou", label: "@chez.fatou" },
        { type: "facebook", url: "https://facebook.com/chezfatou", label: "Chez Fatou" },
      ],
      products: [
        { id: "p1", name: "Pagne wax 6 yards", price: 12000, emoji: "🧵", description: "100% coton, motifs variés", inStock: true },
        { id: "p2", name: "Sac à main cuir", price: 25000, emoji: "👜", description: "Fait main, plusieurs couleurs", inStock: true },
        { id: "p3", name: "Boucles d'oreilles bronze", price: 4000, emoji: "💍", inStock: true },
        { id: "p4", name: "Foulard soie", price: 8000, emoji: "🧣", inStock: true },
        { id: "p5", name: "Sandales perlées", price: 15000, emoji: "👡", description: "Pointures 37–42", inStock: false },
        { id: "p6", name: "Ensemble bébé pagne", price: 9000, emoji: "👶🏾", inStock: true },
      ],
      reviews: [
        { author: "Aïcha B.", rating: 5, text: "Livraison rapide, tissu de qualité 👌" },
        { author: "Koffi N.", rating: 4, text: "Beau sac, offert à ma femme, elle a adoré." },
      ],
    },
    {
      id: "pr_njeri", ownerId: "u_demo", slug: "mama-njeri", category: "restaurant",
      published: true, createdAt: "2026-01-04T00:00:00.000Z",
      businessName: "Mama Njeri", tagline: "Cuisine maison & grillades — Nairobi",
      ownerName: "Grace Njeri", initials: "MN",
      bio: "Plats du jour préparés maison. Sur place, à emporter ou en livraison.",
      city: "Nairobi", country: "Kenya", address: "Ngong Road, Nairobi",
      mapUrl: "https://maps.google.com/?q=Ngong+Road+Nairobi",
      whatsapp: "254712345678", currency: "KSh", momo: ["M-Pesa", "Airtel Money"],
      delivery: { available: true, zones: ["Kilimani", "Lavington", "Karen"], fee: 200 },
      theme: { from: "#16a34a", to: "#107a38", accent: "#16a34a" },
      socials: [
        { type: "instagram", url: "https://instagram.com/mama.njeri", label: "@mama.njeri" },
        { type: "facebook", url: "https://facebook.com/mamanjeri", label: "Mama Njeri" },
      ],
      hours: [{ day: "Tous les jours", slot: "11h – 22h" }],
      menu: [
        {
          title: "Plats principaux",
          dishes: [
            { name: "Nyama Choma (grillade)", price: 650, emoji: "🍖", tag: "populaire", description: "Chèvre grillée + accompagnement" },
            { name: "Poulet braisé", price: 550, emoji: "🍗", description: "Demi-poulet mariné" },
            { name: "Pilau", price: 350, emoji: "🍛", description: "Riz épicé" },
            { name: "Ugali + Sukuma", price: 250, emoji: "🥬", tag: "populaire" },
          ],
        },
        {
          title: "Boissons",
          dishes: [
            { name: "Jus de mangue frais", price: 150, emoji: "🥭", tag: "nouveau" },
            { name: "Soda", price: 100, emoji: "🥤" },
            { name: "Thé maziwa", price: 80, emoji: "☕" },
          ],
        },
      ],
      reviews: [
        { author: "Brian O.", rating: 5, text: "Best nyama choma in town. Livraison à l'heure." },
        { author: "Wanjiru K.", rating: 5, text: "Portions généreuses, prix corrects." },
      ],
    },
    {
      id: "pr_ecole", ownerId: "u_demo", slug: "ecole-lumiere", category: "ecole",
      published: true, createdAt: "2026-01-05T00:00:00.000Z",
      businessName: "École Lumière", tagline: "Cours d'informatique & bureautique — Cotonou",
      ownerName: "M. Adjovi", initials: "EL",
      bio: "Formations pratiques et certifiantes. Petits groupes, formateurs expérimentés.",
      city: "Cotonou", country: "Bénin", address: "Quartier Cadjèhoun, Cotonou",
      mapUrl: "https://maps.google.com/?q=Cadjehoun+Cotonou",
      whatsapp: "22997000000", phone: "+229 97 00 00 00",
      currency: "FCFA", momo: ["MTN MoMo", "Moov Money"],
      theme: { from: "#2563eb", to: "#1d4ed8", accent: "#2563eb" },
      socials: [
        { type: "facebook", url: "https://facebook.com/ecolelumiere", label: "École Lumière" },
        { type: "website", url: "https://ecole-lumiere.example", label: "Site web" },
      ],
      enrollNote: "Rentrée le 1er octobre — inscriptions ouvertes, places limitées.",
      hours: [{ day: "Lun–Sam", slot: "8h – 18h" }],
      programs: [
        { name: "Bureautique (Word, Excel)", price: 50000, duration: "2 mois", level: "Débutant", description: "Certificat à la fin" },
        { name: "Développement web", price: 150000, duration: "6 mois", level: "Intermédiaire", description: "HTML, CSS, JavaScript" },
        { name: "Marketing digital", price: 90000, duration: "3 mois", level: "Tous niveaux" },
        { name: "Anglais professionnel", price: 60000, duration: "4 mois", level: "Débutant à avancé" },
      ],
      reviews: [
        { author: "Prisca H.", rating: 5, text: "J'ai trouvé un emploi grâce à la formation Excel." },
        { author: "Rodrigue T.", rating: 5, text: "Formateurs patients, contenu concret." },
      ],
    },
    {
      id: "pr_king", ownerId: "u_demo", slug: "king-flow", category: "artiste",
      published: true, createdAt: "2026-01-06T00:00:00.000Z",
      businessName: "King Flow", tagline: "Artiste Afrobeat — Lagos",
      ownerName: "King Flow", initials: "KF",
      bio: "Chanteur & auteur-compositeur. Booking, concerts et nouveaux sons ici.",
      city: "Lagos", country: "Nigeria", whatsapp: "2348030000000",
      currency: "₦", momo: ["Airtel Money", "MTN MoMo"],
      theme: { from: "#a21caf", to: "#7e1a8a", accent: "#a21caf" },
      tipsEnabled: true,
      gallery: ["🎤", "🎶", "🎧", "🔥", "⭐", "📸"],
      socials: [
        { type: "youtube", url: "https://youtube.com/@kingflow", label: "King Flow" },
        { type: "instagram", url: "https://instagram.com/kingflow", label: "@kingflow" },
      ],
      tracks: [
        { title: "Lagos Nights", url: "https://youtube.com", duration: "3:24" },
        { title: "African Queen", url: "https://youtube.com", duration: "4:02" },
        { title: "No Wahala", url: "https://youtube.com", duration: "2:58" },
      ],
      events: [
        { date: "Sam. 12 oct.", venue: "Afrika Shrine", city: "Lagos", ticketUrl: "https://example.com" },
        { date: "Ven. 25 oct.", venue: "Palais des Congrès", city: "Cotonou" },
        { date: "Sam. 9 nov.", venue: "Sorano", city: "Dakar" },
      ],
      reviews: [
        { author: "DJ Spinall", rating: 5, text: "Énergie folle sur scène 🔥" },
      ],
    },
    {
      id: "pr_artisan", ownerId: "u_demo", slug: "atelier-diallo", category: "artisan",
      published: true, createdAt: "2026-01-07T00:00:00.000Z",
      businessName: "Atelier Diallo", tagline: "Couture & retouches sur mesure — Bamako",
      ownerName: "Ibrahim Diallo", initials: "AD",
      bio: "Tailleur depuis 15 ans. Boubous, costumes, tenues traditionnelles et retouches rapides.",
      city: "Bamako", country: "Mali", address: "Marché de Medina, Bamako",
      mapUrl: "https://maps.google.com/?q=Medina+Bamako",
      whatsapp: "22370000000", phone: "+223 70 00 00 00",
      currency: "FCFA", momo: ["Orange Money", "Moov Money"],
      theme: { from: "#0f766e", to: "#0b5952", accent: "#0f766e" },
      socials: [
        { type: "instagram", url: "https://instagram.com/atelier.diallo", label: "@atelier.diallo" },
        { type: "tiktok", url: "https://tiktok.com/@atelier.diallo", label: "@atelier.diallo" },
      ],
      gallery: ["🧵", "👔", "👗", "✂️", "🪡", "👘"],
      hours: [
        { day: "Lun–Sam", slot: "8h – 19h" },
        { day: "Dimanche", slot: null },
      ],
      services: [
        { name: "Boubou grand modèle", price: 25000, description: "Tissu bazin, broderie incluse" },
        { name: "Costume sur mesure", price: 45000, durationMin: 0, description: "Veste + pantalon" },
        { name: "Robe de cérémonie", price: 35000 },
        { name: "Retouche simple", price: 2000, description: "Ourlet, boutons, ajustement" },
      ],
      reviews: [
        { author: "Sekou T.", rating: 5, text: "Travail soigné et livré à temps pour la fête." },
        { author: "Aminata C.", rating: 5, text: "Ma robe était parfaite, merci !" },
      ],
    },
    {
      id: "pr_sante", ownerId: "u_demo", slug: "clinique-espoir", category: "sante",
      published: true, createdAt: "2026-01-08T00:00:00.000Z",
      businessName: "Clinique Espoir", tagline: "Cabinet médical & soins — Lomé",
      ownerName: "Dr. Mensah", initials: "CE",
      bio: "Consultations générales, pédiatrie et petits soins. Sur rendez-vous ou sans.",
      city: "Lomé", country: "Togo", address: "Boulevard du Mono, Lomé",
      mapUrl: "https://maps.google.com/?q=Boulevard+du+Mono+Lome",
      whatsapp: "22890000000", phone: "+228 90 00 00 00",
      currency: "FCFA", momo: ["MTN MoMo", "Moov Money"],
      theme: { from: "#0d9488", to: "#0a726a", accent: "#0d9488" },
      socials: [
        { type: "facebook", url: "https://facebook.com/cliniqueespoir", label: "Clinique Espoir" },
        { type: "website", url: "https://clinique-espoir.example", label: "Site web" },
      ],
      hours: [
        { day: "Lun–Ven", slot: "8h – 18h" },
        { day: "Samedi", slot: "8h – 13h" },
        { day: "Dimanche", slot: "Urgences uniquement" },
      ],
      services: [
        { name: "Consultation générale", price: 5000, durationMin: 20 },
        { name: "Consultation pédiatrique", price: 6000, durationMin: 25 },
        { name: "Pansement / petits soins", price: 3000 },
        { name: "Test paludisme", price: 2000, durationMin: 15 },
      ],
      reviews: [
        { author: "Kodjo A.", rating: 5, text: "Médecin à l'écoute, prise en charge rapide." },
      ],
    },
    {
      id: "pr_immo", ownerId: "u_demo", slug: "abidjan-immo", category: "immobilier",
      published: true, createdAt: "2026-01-09T00:00:00.000Z",
      businessName: "Abidjan Immo", tagline: "Location & vente de biens — Abidjan",
      ownerName: "Serge Kouassi", initials: "AI",
      bio: "Agence immobilière de confiance. Appartements, villas et terrains vérifiés.",
      city: "Abidjan", country: "Côte d'Ivoire",
      whatsapp: "2250505050505", phone: "+225 05 05 05 05 05",
      currency: "FCFA", momo: ["Orange Money", "Wave", "MTN MoMo"],
      theme: { from: "#b45309", to: "#8a3f07", accent: "#b45309" },
      socials: [
        { type: "facebook", url: "https://facebook.com/abidjanimmo", label: "Abidjan Immo" },
        { type: "website", url: "https://abidjan-immo.example", label: "Site web" },
      ],
      listings: [
        { id: "b1", title: "Appartement 2 chambres meublé", price: 250000, kind: "Location", location: "Cocody Angré", bedrooms: 2, area: "75 m²", emoji: "🏢", description: "Climatisé, parking, sécurité 24h" },
        { id: "b2", title: "Villa 4 chambres avec piscine", price: 120000000, kind: "Vente", location: "Riviera", bedrooms: 4, area: "350 m²", emoji: "🏡", description: "Jardin, garage 2 voitures" },
        { id: "b3", title: "Studio moderne", price: 90000, kind: "Location", location: "Plateau", bedrooms: 1, area: "35 m²", emoji: "🏬" },
        { id: "b4", title: "Terrain constructible 500 m²", price: 25000000, kind: "Vente", location: "Bingerville", area: "500 m²", emoji: "🌍", description: "Titre foncier disponible" },
      ],
      reviews: [
        { author: "Mariam D.", rating: 5, text: "Agence sérieuse, j'ai trouvé mon appart en 3 jours." },
        { author: "Yao B.", rating: 4, text: "Bon accompagnement pour l'achat de mon terrain." },
      ],
    },
    {
      id: "pr_event", ownerId: "u_demo", slug: "studio-lumiere", category: "evenementiel",
      published: true, createdAt: "2026-01-10T00:00:00.000Z",
      businessName: "Studio Lumière", tagline: "Photographe & vidéaste événementiel — Douala",
      ownerName: "Chris Ngassa", initials: "SL",
      bio: "Mariages, anniversaires, entreprises. Photos et vidéos de qualité, livraison rapide.",
      city: "Douala", country: "Cameroun",
      whatsapp: "2376900000000", phone: "+237 6 90 00 00 00",
      currency: "FCFA", momo: ["Orange Money", "MTN MoMo"],
      theme: { from: "#be185d", to: "#921247", accent: "#be185d" },
      gallery: ["📸", "💍", "🎉", "🎂", "🥂", "✨"],
      socials: [
        { type: "instagram", url: "https://instagram.com/studio.lumiere", label: "@studio.lumiere" },
        { type: "youtube", url: "https://youtube.com/@studiolumiere", label: "Studio Lumière" },
      ],
      services: [
        { name: "Forfait mariage complet", price: 350000, description: "Photos + vidéo, journée entière, album" },
        { name: "Forfait anniversaire", price: 80000, description: "Reportage 3h + retouches" },
        { name: "Shooting studio", price: 40000, description: "1h, 15 photos retouchées" },
        { name: "Événement entreprise", price: 150000, description: "Couverture demi-journée" },
      ],
      reviews: [
        { author: "Laure M.", rating: 5, text: "Photos magnifiques de notre mariage 😍" },
        { author: "Patrick E.", rating: 5, text: "Professionnel et ponctuel." },
      ],
    },
    {
      id: "pr_vtc", ownerId: "u_demo", slug: "dakar-ride", category: "transport",
      published: true, createdAt: "2026-01-11T00:00:00.000Z",
      businessName: "Dakar Ride", tagline: "VTC & courses privées — Dakar",
      ownerName: "Modou Fall", initials: "DR",
      bio: "Chauffeur pro, véhicule climatisé et propre. Ponctuel, disponible 7j/7.",
      city: "Dakar", country: "Sénégal",
      whatsapp: "221780000000", phone: "+221 78 000 00 00",
      currency: "FCFA", momo: ["Wave", "Orange Money"],
      theme: { from: "#1d4ed8", to: "#1740a8", accent: "#1d4ed8" },
      socials: [
        { type: "instagram", url: "https://instagram.com/dakar.ride", label: "@dakar.ride" },
        { type: "facebook", url: "https://facebook.com/dakarride", label: "Dakar Ride" },
      ],
      delivery: { available: true, zones: ["Dakar", "Rufisque", "Aéroport AIBD", "Saly"] },
      services: [
        { name: "Course en ville", price: 2500, description: "Trajet standard intra-Dakar" },
        { name: "Aéroport AIBD ↔ Dakar", price: 15000, description: "Prise en charge avec pancarte" },
        { name: "Mise à disposition journée", price: 40000, description: "Chauffeur inclus, 8h" },
        { name: "Trajet Saly / Mbour", price: 25000 },
      ],
      reviews: [
        { author: "Fatou N.", rating: 5, text: "Toujours à l'heure, conduite prudente." },
        { author: "James K.", rating: 5, text: "Reliable airport pickup, clean car." },
      ],
    },
    {
      id: "pr_ong", ownerId: "u_demo", slug: "espoir-pour-tous", category: "ong",
      published: true, createdAt: "2026-01-12T00:00:00.000Z",
      businessName: "Espoir Pour Tous", tagline: "Association d'aide à l'enfance — Kinshasa",
      ownerName: "Grâce Mukendi", initials: "EP",
      bio: "Nous scolarisons et nourrissons les enfants défavorisés. Votre soutien fait la différence.",
      city: "Kinshasa", country: "RD Congo",
      whatsapp: "243810000000", phone: "+243 81 000 00 00",
      currency: "FC", momo: ["Airtel Money", "Orange Money", "M-Pesa"],
      theme: { from: "#0891b2", to: "#066f89", accent: "#0891b2" },
      enrollNote: "Votre don change des vies. Chaque contribution compte 🙏",
      gallery: ["🤝", "❤️", "📚", "🍚", "💧", "🌍"],
      socials: [
        { type: "facebook", url: "https://facebook.com/espoirpourtous", label: "Espoir Pour Tous" },
      ],
      programs: [
        { name: "Scolarisation de 100 enfants", duration: "Objectif : 5 000 000 FC", description: "Frais, fournitures et uniformes pour la rentrée." },
        { name: "Cantine scolaire", duration: "Objectif : 2 000 000 FC", description: "Un repas chaud par jour pour chaque enfant." },
        { name: "Accès à l'eau potable", description: "Forage d'un puits dans le quartier de Masina." },
      ],
      reviews: [
        { author: "Jean-Paul M.", rating: 5, text: "Association transparente, j'ai visité, c'est du concret." },
        { author: "Sarah L.", rating: 5, text: "Fière de soutenir chaque mois. Merci pour votre travail." },
      ],
    },
    {
      id: "pr_agri", ownerId: "u_demo", slug: "ferme-kwame", category: "agriculture",
      published: true, createdAt: "2026-01-13T00:00:00.000Z",
      businessName: "Ferme Kwame", tagline: "Produits frais & vivriers — Kumasi",
      ownerName: "Kwame Asante", initials: "FK",
      bio: "Producteur local. Vente en gros et détail, directement de la ferme au client.",
      city: "Kumasi", country: "Ghana", address: "Ejisu, Kumasi",
      mapUrl: "https://maps.google.com/?q=Ejisu+Kumasi",
      whatsapp: "233240000000", phone: "+233 24 000 00 00",
      currency: "GHS", momo: ["MTN MoMo", "Airtel Money"],
      theme: { from: "#65a30d", to: "#4d7d0a", accent: "#65a30d" },
      socials: [
        { type: "facebook", url: "https://facebook.com/fermekwame", label: "Ferme Kwame" },
        { type: "whatsapp", url: "https://wa.me/233240000000", label: "WhatsApp Business" },
      ],
      delivery: { available: true, zones: ["Marché de Kumasi", "Livraison ville (dès 5 sacs)"], fee: 0 },
      products: [
        { id: "a1", name: "Sac de maïs 50kg", price: 320, emoji: "🌽", unit: "/sac", inStock: true, description: "Récolte de la saison" },
        { id: "a2", name: "Régime de plantains", price: 40, emoji: "🍌", unit: "/régime", inStock: true },
        { id: "a3", name: "Igname (tubercule)", price: 15, emoji: "🍠", unit: "/pièce", inStock: true },
        { id: "a4", name: "Plateau d'œufs frais", price: 35, emoji: "🥚", unit: "/plateau", inStock: true },
        { id: "a5", name: "Poulet fermier vivant", price: 60, emoji: "🐔", unit: "/pièce", inStock: false },
        { id: "a6", name: "Tomates fraîches", price: 25, emoji: "🍅", unit: "/cageot", inStock: true },
      ],
      reviews: [
        { author: "Ama B.", rating: 5, text: "Produits très frais, prix de gros imbattables." },
        { author: "Kofi D.", rating: 5, text: "Livraison directe à mon restaurant, top qualité." },
      ],
    },
    {
      id: "pr_hotel", ownerId: "u_demo", slug: "auberge-baobab", category: "hotellerie",
      published: true, createdAt: "2026-01-14T00:00:00.000Z",
      businessName: "Auberge du Baobab", tagline: "Hébergement calme & confortable — Ouagadougou",
      ownerName: "Salif Ouédraogo", initials: "AB",
      bio: "Chambres climatisées, wifi, petit-déjeuner local. Accueil chaleureux au cœur de la ville.",
      city: "Ouagadougou", country: "Burkina Faso", address: "Secteur 15, Ouagadougou",
      mapUrl: "https://maps.google.com/?q=Ouagadougou",
      whatsapp: "22670000000", phone: "+226 70 00 00 00",
      currency: "FCFA", momo: ["Orange Money", "Moov Money"],
      theme: { from: "#7c3aed", to: "#6d28d9", accent: "#7c3aed" },
      socials: [
        { type: "instagram", url: "https://instagram.com/auberge.baobab", label: "@auberge.baobab" },
        { type: "website", url: "https://auberge-baobab.example", label: "Site web" },
      ],
      listings: [
        { id: "r1", title: "Chambre standard", price: 20000, area: "18 m²", bedrooms: 1, emoji: "🛏️", description: "Climatisée, salle de bain privée, wifi" },
        { id: "r2", title: "Chambre double", price: 28000, area: "24 m²", bedrooms: 2, emoji: "🛌", description: "2 lits simples, TV, wifi, petit-déjeuner" },
        { id: "r3", title: "Suite familiale", price: 45000, area: "40 m²", bedrooms: 2, emoji: "🏨", description: "2 chambres, salon, petit-déjeuner inclus" },
      ],
      reviews: [
        { author: "Nadia F.", rating: 5, text: "Propre, calme et bien situé. Personnel adorable." },
        { author: "Marc T.", rating: 4, text: "Bon rapport qualité-prix, wifi correct." },
      ],
    },
  ];

  enrichDemoPhotos(profiles);
  const stats: Record<string, SiteStats> = {};
  const subscribers: Record<string, string[]> = {};
  const reports: Record<string, number> = {};
  const complaints: Record<string, Complaint[]> = {};
  for (const p of profiles) {
    stats[p.slug] = { views: 40 + Math.floor(Math.random() * 900), waClicks: 5 + Math.floor(Math.random() * 120) };
    // abonnés de démo (numéros fictifs, juste pour afficher un compteur crédible)
    const n = 8 + Math.floor(Math.random() * 240);
    subscribers[p.slug] = Array.from({ length: n }, (_, i) => `000000${p.slug.length}${i}`);
    reports[p.slug] = 0;
    complaints[p.slug] = [];
  }
  return { version: SEED_VERSION, users: [DEMO_USER], profiles, otps: [], stats, subscribers, reports, complaints };
}

/**
 * Peuple automatiquement des PHOTOS de démo partout (avatar, bannière, produits,
 * plats, biens, galeries) avec des images RÉELLES libres de droit via Lorem Picsum
 * (photos aléatoires, déterministes par graine). Le générateur local /api/img sert
 * de repli. Ajoute aussi des catégories produits et des comptes sociaux (profils à 10+).
 */
function enrichDemoPhotos(profiles: Profile[]) {
  // Lorem Picsum : images libres de droit, aléatoires mais stables par "seed".
  const pic = (slug: string, key: string, w: number, h: number) =>
    `https://picsum.photos/seed/zando-${slug}-${key}/${w}/${h}`;

  const productCats: Record<string, Record<string, string>> = {
    "chez-fatou": { p1: "Vêtements", p2: "Sacs & accessoires", p3: "Bijoux", p4: "Sacs & accessoires", p5: "Chaussures", p6: "Enfant" },
    "ferme-kwame": { a1: "Céréales", a2: "Fruits", a3: "Tubercules", a4: "Élevage", a5: "Élevage", a6: "Légumes" },
  };

  const bigSocials: Record<string, Profile["socials"]> = {
    "king-flow": [
      { type: "instagram", url: "https://instagram.com/kingflow", label: "@kingflow" },
      { type: "tiktok", url: "https://tiktok.com/@kingflow", label: "@kingflow" },
      { type: "youtube", url: "https://youtube.com/@kingflow", label: "King Flow" },
      { type: "spotify", url: "https://open.spotify.com/artist/kingflow", label: "King Flow" },
      { type: "audiomack", url: "https://audiomack.com/kingflow", label: "King Flow" },
      { type: "x", url: "https://x.com/kingflow", label: "@kingflow" },
      { type: "snapchat", url: "https://snapchat.com/add/kingflow", label: "kingflow" },
      { type: "facebook", url: "https://facebook.com/kingflow", label: "King Flow" },
      { type: "threads", url: "https://threads.net/@kingflow", label: "@kingflow" },
      { type: "telegram", url: "https://t.me/kingflow", label: "King Flow" },
      { type: "whatsapp", url: "https://wa.me/2348010000000", label: "Booking" },
    ],
    "studio-lumiere": [
      { type: "instagram", url: "https://instagram.com/studio.lumiere", label: "@studio.lumiere" },
      { type: "facebook", url: "https://facebook.com/studiolumiere", label: "Studio Lumière" },
      { type: "tiktok", url: "https://tiktok.com/@studio.lumiere", label: "@studio.lumiere" },
      { type: "youtube", url: "https://youtube.com/@studiolumiere", label: "Studio Lumière" },
      { type: "pinterest", url: "https://pinterest.com/studiolumiere", label: "Studio Lumière" },
      { type: "x", url: "https://x.com/studiolumiere", label: "@studiolumiere" },
      { type: "linkedin", url: "https://linkedin.com/company/studiolumiere", label: "Studio Lumière" },
      { type: "website", url: "https://studio-lumiere.example", label: "Portfolio" },
      { type: "email", url: "mailto:contact@studio-lumiere.example", label: "Contact" },
      { type: "whatsapp", url: "https://wa.me/237690000000", label: "Devis" },
    ],
  };

  const verifiedSlugs = new Set(["awa-beaute", "chez-fatou", "king-flow", "studio-lumiere", "clinique-espoir"]);
  const boostedSlugs: Record<string, string> = {
    "king-flow": "Nouveau single dispo 🔥 Écoutez « Lagos Nights » maintenant !",
    "studio-lumiere": "Forfait mariage -15% ce mois-ci. Réservez votre date !",
    "chez-fatou": "Arrivage de nouveaux pagnes wax. Livraison Abidjan 24h.",
  };
  const coords: Record<string, [number, number]> = {
    Dakar: [14.716, -17.467], Abidjan: [5.36, -4.008], Nairobi: [-1.286, 36.817],
    Cotonou: [6.37, 2.39], Lagos: [6.524, 3.379], Bamako: [12.639, -8.0],
    Lomé: [6.13, 1.22], Douala: [4.05, 9.7], Kinshasa: [-4.44, 15.27],
    Kumasi: [6.69, -1.62], Ouagadougou: [12.37, -1.53],
  };
  const inTwoDays = new Date(Date.now() + 2 * 86400000 + 5 * 3600000).toISOString();

  for (const p of profiles) {
    // Avatar d'en-tête = logo monogramme LOCAL (100% hors-ligne, toujours net) :
    // initiales de l'activité sur un dégradé du thème.
    p.avatarUrl = `/api/img?logo=1&t=${encodeURIComponent(p.initials)}&f=${encodeURIComponent(p.theme.from)}&to=${encodeURIComponent(p.theme.to)}`;
    p.coverUrl = pic(p.slug, "cover", 1200, 500);
    p.ownerPhotoUrl = `https://i.pravatar.cc/400?u=zando-${p.slug}`;
    p.verified = verifiedSlugs.has(p.slug);
    p.clientsServed = 60 + Math.floor(Math.random() * 900);
    if (!p.ownerRole) p.ownerRole = ({ coiffeur: "Gérante", restaurant: "Cheffe", artiste: "Artiste", sante: "Responsable", ecole: "Directeur", ong: "Coordinatrice" } as Record<string, string>)[p.category] ?? "Responsable";
    if (!p.ownerBio) p.ownerBio = `${p.ownerName} est à la tête de ${p.businessName}. Passionné(e) et à l'écoute, je mets tout en œuvre pour vous satisfaire.`;

    if (p.products) {
      const cats = productCats[p.slug];
      p.products.forEach((pr, i) => {
        pr.category = cats?.[pr.id];
        pr.images = [pic(p.slug, `p${i}a`, 800, 800), pic(p.slug, `p${i}b`, 800, 800), pic(p.slug, `p${i}c`, 800, 800)];
      });
    }
    if (p.menu) p.menu.forEach((sec, si) => sec.dishes.forEach((d, i) => { d.imageUrl = pic(p.slug, `d${si}-${i}`, 600, 600); }));
    if (p.listings) p.listings.forEach((l, i) => { l.imageUrl = pic(p.slug, `l${i}`, 800, 600); });
    if (p.gallery) p.gallery = p.gallery.map((_, i) => pic(p.slug, `g${i}`, 600, 600));

    if (bigSocials[p.slug]) p.socials = bigSocials[p.slug];

    // Géolocalisation (annuaire "près de moi")
    const c = coords[p.city];
    if (c) { p.lat = c[0]; p.lng = c[1]; }

    // Stories de démo (photos)
    p.stories = Array.from({ length: 4 }, (_, i) => ({ imageUrl: pic(p.slug, `story${i}`, 720, 1280), caption: `Nouveauté ${i + 1}` }));

    // Boost + publicité locale
    if (boostedSlugs[p.slug]) { p.boosted = true; p.adText = boostedSlugs[p.slug]; }

    // Vente flash + codes promo (boutiques)
    if (p.slug === "chez-fatou" || p.slug === "ferme-kwame") {
      p.flashSale = { label: "Offre du week-end", percent: p.slug === "chez-fatou" ? 20 : 15, until: inTwoDays };
      p.promoCodes = [{ code: "KAKO10", percent: 10, until: inTwoDays }, { code: "BIENVENUE", percent: 5, until: inTwoDays }];
      // met les premiers produits disponibles en vente flash
      let n = 0;
      p.products?.forEach((pr) => { if (pr.inStock !== false && n < 3) { pr.flash = true; n++; } });
    }

    // Menu du jour (restaurant)
    if (p.slug === "mama-njeri" && p.menu?.[0]) {
      p.dailyMenuNote = "Nyama Choma + Ugali, préparé ce matin";
      p.menu[0].dishes.forEach((d, i) => { d.available = i !== 3; d.dailySpecial = i === 0; });
    }
  }
}

let cache: DB | null = null;

export async function readDB(): Promise<DB> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    cache = JSON.parse(raw) as DB;
    if (cache.version !== SEED_VERSION) {
      // Contenu de démo obsolète → régénération automatique
      cache = seed();
      await writeDB(cache);
    }
    if (!cache.stats) cache.stats = {};
    if (!cache.subscribers) cache.subscribers = {};
    if (!cache.reports) cache.reports = {};
    if (!cache.complaints) cache.complaints = {};
  } catch {
    cache = seed();
    await writeDB(cache);
  }
  return cache;
}

export async function writeDB(db: DB): Promise<void> {
  cache = db; // le cache mémoire suffit en lecture seule (ex : hébergement serverless)
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch {
    // système de fichiers en lecture seule (Vercel…) : on garde tout en mémoire.
  }
}
