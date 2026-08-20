// Indice de fiabilité kako — calculé à partir de signaux RÉELS du profil.
// Aucune donnée inventée : vérification, avis, ancienneté, abonnés, signalements, réclamations.

export interface ReliabilityInput {
  verified: boolean;
  avgRating: number;      // 0..5 (0 si aucun avis)
  reviewCount: number;
  clientsServed: number;
  subscribers: number;
  reports: number;        // signalements "arnaque"
  complaints: number;     // réclamations clients
  ageMonths: number;      // ancienneté du profil
  hasMomo: boolean;
  hasDelivery: boolean;
  socials: number;
}

export interface Reliability {
  score: number;          // 0..100
  label: string;
  tone: "excellent" | "good" | "ok" | "watch";
}

export function reliabilityIndex(i: ReliabilityInput): Reliability {
  let s = 40; // base

  if (i.verified) s += 22;
  if (i.reviewCount > 0) s += (i.avgRating / 5) * 18;
  s += Math.min(12, Math.log10(1 + i.clientsServed) * 6);
  s += Math.min(10, Math.log10(1 + i.subscribers) * 5);
  s += Math.min(8, i.ageMonths * 0.5);
  if (i.hasMomo) s += 3;
  if (i.hasDelivery) s += 2;
  s += Math.min(3, i.socials);

  s -= i.reports * 10;
  s -= i.complaints * 3;

  const score = Math.max(0, Math.min(100, Math.round(s)));
  let label = "À surveiller", tone: Reliability["tone"] = "watch";
  if (score >= 80) { label = "Excellent"; tone = "excellent"; }
  else if (score >= 62) { label = "Fiable"; tone = "good"; }
  else if (score >= 45) { label = "Correct"; tone = "ok"; }

  return { score, label, tone };
}
