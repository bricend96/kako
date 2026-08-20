"use server";

import { redirect } from "next/navigation";
import { createOtp, verifyOtp, findOrCreateUserByPhone } from "@/lib/store";
import { setSession, clearSession, DEMO_MODE, DEMO_USER_ID } from "@/lib/auth";

function normalizePhone(raw: string): string {
  return raw.replace(/[^0-9]/g, "");
}

export async function requestOtp(phoneRaw: string): Promise<{ ok: boolean; demoCode?: string; error?: string }> {
  const phone = normalizePhone(phoneRaw);
  if (phone.length < 8) return { ok: false, error: "Numéro invalide." };
  const code = await createOtp(phone);
  // En prod : envoyer le code par WhatsApp/SMS. En démo : on le renvoie pour l'afficher.
  return { ok: true, demoCode: DEMO_MODE ? code : undefined };
}

export async function verifyOtpAction(phoneRaw: string, code: string): Promise<{ ok: boolean; error?: string }> {
  const phone = normalizePhone(phoneRaw);
  const valid = await verifyOtp(phone, code.trim());
  if (!valid) return { ok: false, error: "Code incorrect ou expiré." };
  const user = await findOrCreateUserByPhone(phone);
  await setSession(user.id);
  return { ok: true };
}

export async function demoLogin(): Promise<void> {
  await setSession(DEMO_USER_ID);
  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  await clearSession();
  redirect("/");
}
