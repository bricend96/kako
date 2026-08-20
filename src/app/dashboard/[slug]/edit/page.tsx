import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getProfile } from "@/lib/store";
import Editor from "@/components/editor/Editor";

export const dynamic = "force-dynamic";

export default async function EditPage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { slug } = await params;
  const profile = await getProfile(slug);
  if (!profile) notFound();
  if (profile.ownerId !== user.id) redirect("/dashboard");

  return <Editor profile={profile} />;
}
