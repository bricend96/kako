export interface Country {
  iso: string;
  name: string;
  dial: string;   // sans "+"
  flag: string;   // emoji drapeau
}

// Afrique en priorité + quelques pays majeurs. Indicatifs ("country code").
export const COUNTRIES: Country[] = [
  { iso: "SN", name: "Sénégal", dial: "221", flag: "🇸🇳" },
  { iso: "CI", name: "Côte d'Ivoire", dial: "225", flag: "🇨🇮" },
  { iso: "CM", name: "Cameroun", dial: "237", flag: "🇨🇲" },
  { iso: "BJ", name: "Bénin", dial: "229", flag: "🇧🇯" },
  { iso: "BF", name: "Burkina Faso", dial: "226", flag: "🇧🇫" },
  { iso: "ML", name: "Mali", dial: "223", flag: "🇲🇱" },
  { iso: "TG", name: "Togo", dial: "228", flag: "🇹🇬" },
  { iso: "NE", name: "Niger", dial: "227", flag: "🇳🇪" },
  { iso: "GN", name: "Guinée", dial: "224", flag: "🇬🇳" },
  { iso: "CD", name: "RD Congo", dial: "243", flag: "🇨🇩" },
  { iso: "CG", name: "Congo", dial: "242", flag: "🇨🇬" },
  { iso: "GA", name: "Gabon", dial: "241", flag: "🇬🇦" },
  { iso: "NG", name: "Nigeria", dial: "234", flag: "🇳🇬" },
  { iso: "GH", name: "Ghana", dial: "233", flag: "🇬🇭" },
  { iso: "KE", name: "Kenya", dial: "254", flag: "🇰🇪" },
  { iso: "TZ", name: "Tanzanie", dial: "255", flag: "🇹🇿" },
  { iso: "UG", name: "Ouganda", dial: "256", flag: "🇺🇬" },
  { iso: "RW", name: "Rwanda", dial: "250", flag: "🇷🇼" },
  { iso: "ET", name: "Éthiopie", dial: "251", flag: "🇪🇹" },
  { iso: "ZA", name: "Afrique du Sud", dial: "27", flag: "🇿🇦" },
  { iso: "MA", name: "Maroc", dial: "212", flag: "🇲🇦" },
  { iso: "DZ", name: "Algérie", dial: "213", flag: "🇩🇿" },
  { iso: "TN", name: "Tunisie", dial: "216", flag: "🇹🇳" },
  { iso: "EG", name: "Égypte", dial: "20", flag: "🇪🇬" },
  { iso: "FR", name: "France", dial: "33", flag: "🇫🇷" },
  { iso: "BE", name: "Belgique", dial: "32", flag: "🇧🇪" },
  { iso: "CA", name: "Canada", dial: "1", flag: "🇨🇦" },
  { iso: "US", name: "États-Unis", dial: "1", flag: "🇺🇸" },
  { iso: "GB", name: "Royaume-Uni", dial: "44", flag: "🇬🇧" },
];

const NAME_TO_ISO: Record<string, string> = {
  "sénégal": "SN", "senegal": "SN", "côte d'ivoire": "CI", "cote d'ivoire": "CI",
  "cameroun": "CM", "bénin": "BJ", "benin": "BJ", "burkina faso": "BF", "mali": "ML",
  "togo": "TG", "niger": "NE", "guinée": "GN", "rd congo": "CD", "congo": "CG",
  "gabon": "GA", "nigeria": "NG", "ghana": "GH", "kenya": "KE", "tanzanie": "TZ",
  "ouganda": "UG", "rwanda": "RW", "éthiopie": "ET", "afrique du sud": "ZA",
  "maroc": "MA", "algérie": "DZ", "tunisie": "TN", "égypte": "EG", "france": "FR",
};

export function countryFor(name?: string): Country {
  const iso = name ? NAME_TO_ISO[name.trim().toLowerCase()] : undefined;
  return COUNTRIES.find((c) => c.iso === iso) ?? COUNTRIES[0];
}
