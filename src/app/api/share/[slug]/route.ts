import { getProfile } from "@/lib/store";

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function wrap(s: string, max: number): string[] {
  const words = s.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max) { if (cur) lines.push(cur); cur = w; }
    else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProfile(slug);
  if (!p) return new Response("Not found", { status: 404 });

  const nameLines = wrap(p.businessName, 18);
  const nameSvg = nameLines
    .map((l, i) => `<text x="90" y="${430 + i * 96}" font-family="system-ui,Arial" font-size="82" font-weight="800" fill="#ffffff">${esc(l)}</text>`)
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${esc(p.theme.from)}"/><stop offset="1" stop-color="${esc(p.theme.to)}"/>
  </linearGradient></defs>
  <rect width="1080" height="1350" fill="#0a0a0f"/>
  <rect x="60" y="60" width="960" height="1230" rx="48" fill="url(#g)"/>
  <circle cx="880" cy="220" r="200" fill="#ffffff" opacity="0.10"/>
  <circle cx="200" cy="1120" r="240" fill="#ffffff" opacity="0.08"/>
  <rect x="90" y="150" width="150" height="150" rx="36" fill="#ffffff" opacity="0.18"/>
  <text x="165" y="252" font-family="system-ui,Arial" font-size="72" font-weight="800" fill="#ffffff" text-anchor="middle">${esc(p.initials)}</text>
  ${nameSvg}
  <text x="90" y="${430 + nameLines.length * 96 + 20}" font-family="system-ui,Arial" font-size="40" fill="#ffffff" opacity="0.92">${esc(p.tagline.slice(0, 46))}</text>
  <text x="90" y="${430 + nameLines.length * 96 + 84}" font-family="system-ui,Arial" font-size="36" fill="#ffffff" opacity="0.8">📍 ${esc(p.city)}, ${esc(p.country)}</text>
  <g transform="translate(90 1180)">
    <rect x="0" y="0" width="620" height="90" rx="45" fill="#25D366"/>
    <text x="310" y="59" font-family="system-ui,Arial" font-size="40" font-weight="700" fill="#ffffff" text-anchor="middle">Commander sur WhatsApp</text>
  </g>
  <text x="990" y="1245" font-family="system-ui,Arial" font-size="30" fill="#ffffff" opacity="0.85" text-anchor="end">kako.site/${esc(p.slug)}</text>
</svg>`;

  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=3600" },
  });
}
