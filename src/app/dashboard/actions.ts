"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { createProfile, updateProfile, deleteProfile, getProfile } from "@/lib/store";
import type { Category, Profile } from "@/lib/types";

export async function createProfileAction(category: Category, businessName: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const name = businessName.trim() || "Mon site";
  const profile = await createProfile(user.id, category, name);
  redirect(`/dashboard/${profile.slug}/edit`);
}

export async function saveProfileAction(
  id: string,
  patch: Partial<Profile>
): Promise<{ ok: boolean; error?: string; slug?: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Non connecté" };
  const updated = await updateProfile(id, user.id, patch);
  if (!updated) return { ok: false, error: "Introuvable" };
  revalidatePath(`/${updated.slug}`);
  revalidatePath("/dashboard");
  return { ok: true, slug: updated.slug };
}

export async function togglePublishAction(slug: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getProfile(slug);
  if (!profile || profile.ownerId !== user.id) return;
  await updateProfile(profile.id, user.id, { published: !profile.published });
  revalidatePath("/dashboard");
  revalidatePath(`/${slug}`);
}

export async function deleteProfileAction(slug: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getProfile(slug);
  if (profile && profile.ownerId === user.id) {
    await deleteProfile(profile.id, user.id);
  }
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
