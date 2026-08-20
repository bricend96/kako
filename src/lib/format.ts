import type { Profile } from "./types";

/** Formate un montant façon "15 000 FCFA" (séparateur milliers = espace insécable fine). */
export function money(amount: number, currency = "FCFA"): string {
  const formatted = new Intl.NumberFormat("fr-FR").format(amount);
  return `${formatted} ${currency}`;
}

/** Lien "click-to-chat" WhatsApp avec message pré-rempli. */
export function waLink(whatsapp: string, message?: string): string {
  const base = `https://wa.me/${whatsapp}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/** Message de commande e-commerce pré-rempli. */
export function orderMessage(profile: Profile, productName: string, price: number): string {
  return (
    `Bonjour ${profile.businessName} 👋\n` +
    `Je souhaite commander : ${productName} — ${money(price, profile.currency)}.\n` +
    `Est-ce disponible ?`
  );
}

/** Message de réservation coiffeur/beauté pré-rempli. */
export function bookingMessage(profile: Profile, serviceName: string): string {
  return (
    `Bonjour ${profile.businessName} 👋\n` +
    `Je voudrais réserver : ${serviceName}.\n` +
    `Quelles sont vos disponibilités ?`
  );
}

/** Message de commande restaurant pré-rempli. */
export function foodMessage(profile: Profile, dishName: string, price: number): string {
  return (
    `Bonjour ${profile.businessName} 👋\n` +
    `Je voudrais commander : ${dishName} — ${money(price, profile.currency)}.\n` +
    `Livraison possible ?`
  );
}

/** Message d'inscription (école) pré-rempli. */
export function enrollMessage(profile: Profile, programName: string): string {
  return (
    `Bonjour ${profile.businessName} 👋\n` +
    `Je souhaite m'inscrire au programme : ${programName}.\n` +
    `Pouvez-vous me donner les détails ?`
  );
}

/** Message de booking (artiste) pré-rempli. */
export function bookingArtistMessage(profile: Profile): string {
  return (
    `Bonjour ${profile.businessName} 👋\n` +
    `Je souhaite vous booker pour un événement.\n` +
    `Quelles sont vos conditions et disponibilités ?`
  );
}

/** Message de soutien / pourboire (artiste) pré-rempli. */
export function tipMessage(profile: Profile): string {
  return (
    `Bonjour ${profile.businessName} 👋\n` +
    `Je veux vous soutenir 🙌 Comment envoyer un pourboire (Mobile Money) ?`
  );
}

/** Message de service générique (devis, RDV, réservation…) pré-rempli. */
export function serviceMessage(profile: Profile, itemName: string, actionPhrase: string): string {
  return (
    `Bonjour ${profile.businessName} 👋\n` +
    `Je souhaite ${actionPhrase} : ${itemName}.\n` +
    `Pouvez-vous me donner les détails ?`
  );
}

/** Message d'intérêt pour un bien immobilier pré-rempli. */
export function listingMessage(profile: Profile, title: string, price: number): string {
  return (
    `Bonjour ${profile.businessName} 👋\n` +
    `Je suis intéressé(e) par ce bien : ${title} — ${money(price, profile.currency)}.\n` +
    `Est-il toujours disponible ? Peut-on organiser une visite ?`
  );
}

/** Message de don (ONG / association) pré-rempli. */
export function donateMessage(profile: Profile): string {
  return (
    `Bonjour ${profile.businessName} 👋\n` +
    `Je souhaite faire un don pour soutenir vos actions.\n` +
    `Comment procéder (Mobile Money) ?`
  );
}

/** Message de bénévolat (ONG / association) pré-rempli. */
export function volunteerMessage(profile: Profile): string {
  return (
    `Bonjour ${profile.businessName} 👋\n` +
    `Je souhaite devenir bénévole / m'impliquer. Comment faire ?`
  );
}

/** Message de réservation de chambre (hôtellerie) pré-rempli. */
export function bookingRoomMessage(profile: Profile, roomTitle: string, price: number): string {
  return (
    `Bonjour ${profile.businessName} 👋\n` +
    `Je souhaite réserver : ${roomTitle} — ${money(price, profile.currency)}/nuit.\n` +
    `Quelles sont vos disponibilités ?`
  );
}

/** Message de contact générique. */
export function contactMessage(profile: Profile): string {
  return `Bonjour ${profile.businessName} 👋\nJ'ai vu votre page kako et je suis intéressé(e).`;
}

/** Génère un vCard 3.0 téléchargeable pour la carte de visite numérique. */
export function toVCard(profile: Profile): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:;${profile.ownerName};;;`,
    `FN:${profile.ownerName}`,
    `ORG:${profile.businessName}`,
    `TITLE:${profile.tagline}`,
    `TEL;TYPE=CELL:+${profile.whatsapp}`,
    profile.phone ? `TEL;TYPE=WORK,VOICE:${profile.phone}` : null,
    profile.address ? `ADR;TYPE=WORK:;;${profile.address};${profile.city};;;${profile.country}` : null,
    `NOTE:${profile.bio}`,
    "END:VCARD",
  ].filter(Boolean);
  return lines.join("\r\n");
}
