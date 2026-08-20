import { getProfile } from "@/lib/store";
import { toVCard } from "@/lib/format";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await getProfile(slug);
  if (!profile) return new Response("Not found", { status: 404 });

  return new Response(toVCard(profile), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${profile.slug}.vcf"`,
    },
  });
}
