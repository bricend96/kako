import { cookies } from "next/headers";
import crypto from "crypto";
import { getUser } from "./store";
import type { User } from "./types";

const COOKIE = "zando_session";
const SECRET = process.env.ZANDO_SECRET ?? "zando-demo-secret-change-me";

/** Mode démo : OTP affiché à l'écran, bouton connexion express. */
export const DEMO_MODE = process.env.ZANDO_DEMO !== "false";
export const DEMO_USER_ID = "u_demo";

function sign(value: string): string {
  const mac = crypto.createHmac("sha256", SECRET).update(value).digest("hex").slice(0, 32);
  return `${value}.${mac}`;
}

function unsign(signed: string | undefined): string | null {
  if (!signed) return null;
  const dot = signed.lastIndexOf(".");
  if (dot === -1) return null;
  const value = signed.slice(0, dot);
  const mac = signed.slice(dot + 1);
  const expected = crypto.createHmac("sha256", SECRET).update(value).digest("hex").slice(0, 32);
  return crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected)) ? value : null;
}

export async function setSession(userId: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, sign(userId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const userId = unsign(store.get(COOKIE)?.value);
  if (!userId) return null;
  return getUser(userId);
}
