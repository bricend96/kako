// Générateur d'images de démonstration (SVG local, aucune dépendance réseau).
// Sert à visualiser le rendu "avec photos" en attendant les vrais uploads.
// Ex : /api/img?t=Sac%20à%20main&f=%23ea580c&to=%23b8460a

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function GET(req: Request) {
  const u = new URL(req.url);
  const t = (u.searchParams.get("t") || "Photo").slice(0, 40);
  const f = u.searchParams.get("f") || "#7c5cff";
  const to = u.searchParams.get("to") || "#4338ca";
  const seed = Number(u.searchParams.get("v") || 1);
  const isLogo = u.searchParams.get("logo") === "1";

  // Mode LOGO : monogramme (initiales) centré sur un dégradé du thème. 100% local.
  if (isLogo) {
    const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${esc(f)}"/><stop offset="1" stop-color="${esc(to)}"/>
  </linearGradient></defs>
  <rect width="400" height="400" fill="url(#g)"/>
  <circle cx="320" cy="80" r="120" fill="#ffffff" opacity="0.10"/>
  <circle cx="70" cy="340" r="130" fill="#ffffff" opacity="0.08"/>
  <text x="200" y="200" font-family="system-ui,Segoe UI,Arial" font-size="150" font-weight="800" fill="#ffffff" text-anchor="middle" dominant-baseline="central" letter-spacing="2">${esc(t.slice(0, 3).toUpperCase())}</text>
</svg>`;
    return new Response(logo, {
      headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=31536000, immutable" },
    });
  }

  // quelques bulles décoratives pseudo-aléatoires (déterministes)
  const rnd = (n: number) => ((Math.sin(seed * 99.7 + n * 12.3) + 1) / 2);
  const bubbles = Array.from({ length: 5 }, (_, i) =>
    `<circle cx="${(rnd(i) * 800).toFixed(0)}" cy="${(rnd(i + 5) * 800).toFixed(0)}" r="${(60 + rnd(i + 2) * 160).toFixed(0)}" fill="#ffffff" opacity="0.06"/>`
  ).join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${esc(f)}"/><stop offset="1" stop-color="${esc(to)}"/>
  </linearGradient></defs>
  <rect width="800" height="800" fill="url(#g)"/>
  ${bubbles}
  <g fill="#ffffff" opacity="0.9" transform="translate(400 360)">
    <path d="M-60-40h120a12 12 0 0 1 12 12v56a12 12 0 0 1-12 12h-120a12 12 0 0 1-12-12v-56a12 12 0 0 1 12-12z" fill="none" stroke="#ffffff" stroke-width="6" opacity="0.85"/>
    <circle cx="-32" cy="-14" r="10"/>
    <path d="M-70 32 -30 -6 0 18 26-14 70 32z" opacity="0.85"/>
  </g>
  <text x="400" y="520" font-family="system-ui,Arial" font-size="42" font-weight="700" fill="#ffffff" text-anchor="middle">${esc(t)}</text>
</svg>`;

  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
