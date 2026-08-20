import { readDB, writeDB } from "./db";
import type { SiteStats, Complaint } from "./db";
import type { Profile, User, Category } from "./types";

const normPhone = (p: string) => p.replace(/[^0-9]/g, "");
import { categoryMeta, starterContent } from "./categories";

/* ─────────────── Profils ─────────────── */

export async function getAllProfiles(): Promise<Profile[]> {
  const db = await readDB();
  return db.profiles;
}

export async function getPublishedProfiles(): Promise<Profile[]> {
  const db = await readDB();
  return db.profiles.filter((p) => p.published);
}

export async function getProfile(slug: string): Promise<Profile | null> {
  const db = await readDB();
  return db.profiles.find((p) => p.slug === slug) ?? null;
}

export async function getProfilesByUser(ownerId: string): Promise<Profile[]> {
  const db = await readDB();
  return db.profiles.filter((p) => p.ownerId === ownerId);
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 40);
}

async function uniqueSlug(base: string): Promise<string> {
  const db = await readDB();
  let slug = slugify(base) || "site";
  let n = 1;
  while (db.profiles.some((p) => p.slug === slug)) {
    slug = `${slugify(base)}-${n++}`;
  }
  return slug;
}

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

export async function createProfile(
  ownerId: string,
  category: Category,
  businessName: string
): Promise<Profile> {
  const db = await readDB();
  const meta = categoryMeta(category);
  const slug = await uniqueSlug(businessName);
  const profile: Profile = {
    id: "pr_" + Math.random().toString(36).slice(2, 9),
    ownerId,
    slug,
    category,
    published: false,
    createdAt: new Date().toISOString(),
    businessName,
    tagline: meta.label,
    ownerName: businessName,
    bio: "",
    initials: initialsFrom(businessName),
    city: "",
    country: "",
    whatsapp: "",
    currency: "FCFA",
    momo: [],
    theme: meta.theme,
    reviews: [],
    ...starterContent(category),
  };
  db.profiles.push(profile);
  await writeDB(db);
  return profile;
}

export async function updateProfile(
  id: string,
  ownerId: string,
  patch: Partial<Profile>
): Promise<Profile | null> {
  const db = await readDB();
  const idx = db.profiles.findIndex((p) => p.id === id && p.ownerId === ownerId);
  if (idx === -1) return null;
  const current = db.profiles[idx];
  // Champs jamais écrasés par le patch
  const merged: Profile = {
    ...current,
    ...patch,
    id: current.id,
    ownerId: current.ownerId,
    slug: current.slug,
    category: current.category,
    createdAt: current.createdAt,
    initials: patch.businessName ? initialsFrom(patch.businessName) : current.initials,
  };
  db.profiles[idx] = merged;
  await writeDB(db);
  return merged;
}

export async function deleteProfile(id: string, ownerId: string): Promise<boolean> {
  const db = await readDB();
  const before = db.profiles.length;
  db.profiles = db.profiles.filter((p) => !(p.id === id && p.ownerId === ownerId));
  if (db.profiles.length === before) return false;
  await writeDB(db);
  return true;
}

/* ─────────────── Statistiques ─────────────── */

export async function trackEvent(slug: string, type: "view" | "wa"): Promise<void> {
  const db = await readDB();
  if (!db.profiles.some((p) => p.slug === slug)) return;
  const s = (db.stats[slug] ??= { views: 0, waClicks: 0 });
  if (type === "view") s.views++;
  else s.waClicks++;
  await writeDB(db);
}

export async function getStats(slug: string): Promise<SiteStats> {
  const db = await readDB();
  return db.stats[slug] ?? { views: 0, waClicks: 0 };
}

/* ─────────────── Abonnés ─────────────── */

export async function getSubscriberCount(slug: string): Promise<number> {
  const db = await readDB();
  return (db.subscribers[slug] ?? []).length;
}

export async function subscribe(slug: string, phone: string): Promise<{ ok: boolean; count: number; already?: boolean }> {
  const p = normPhone(phone);
  const db = await readDB();
  if (!db.profiles.some((x) => x.slug === slug)) return { ok: false, count: 0 };
  const list = (db.subscribers[slug] ??= []);
  if (p.length < 8) return { ok: false, count: list.length };
  if (list.includes(p)) return { ok: true, count: list.length, already: true };
  list.push(p);
  await writeDB(db);
  return { ok: true, count: list.length };
}

export async function unsubscribe(slug: string, phone: string): Promise<{ found: boolean; count: number }> {
  const p = normPhone(phone);
  const db = await readDB();
  const list = db.subscribers[slug] ?? [];
  if (!list.includes(p)) return { found: false, count: list.length };
  db.subscribers[slug] = list.filter((x) => x !== p);
  await writeDB(db);
  return { found: true, count: db.subscribers[slug].length };
}

/* ─────────────── Signalements & réclamations ─────────────── */

export async function reportScam(slug: string): Promise<number> {
  const db = await readDB();
  if (!db.profiles.some((x) => x.slug === slug)) return 0;
  db.reports[slug] = (db.reports[slug] ?? 0) + 1;
  await writeDB(db);
  return db.reports[slug];
}

export async function addComplaint(slug: string, text: string): Promise<void> {
  const db = await readDB();
  if (!db.profiles.some((x) => x.slug === slug)) return;
  (db.complaints[slug] ??= []).push({ text: text.slice(0, 400), at: new Date().toISOString() });
  await writeDB(db);
}

export async function getReports(slug: string): Promise<number> {
  const db = await readDB();
  return db.reports[slug] ?? 0;
}

export async function getComplaints(slug: string): Promise<Complaint[]> {
  const db = await readDB();
  return db.complaints[slug] ?? [];
}

/* ─────────────── Utilisateurs ─────────────── */

export async function getUser(id: string): Promise<User | null> {
  const db = await readDB();
  return db.users.find((u) => u.id === id) ?? null;
}

export async function findOrCreateUserByPhone(phone: string): Promise<User> {
  const db = await readDB();
  let user = db.users.find((u) => u.phone === phone);
  if (!user) {
    user = { id: "u_" + Math.random().toString(36).slice(2, 9), phone, createdAt: new Date().toISOString() };
    db.users.push(user);
    await writeDB(db);
  }
  return user;
}

/* ─────────────── OTP (mode démo) ─────────────── */

export async function createOtp(phone: string): Promise<string> {
  const db = await readDB();
  const code = String(Math.floor(100000 + Math.random() * 900000));
  db.otps = db.otps.filter((o) => o.phone !== phone);
  db.otps.push({ phone, code, expires: Date.now() + 10 * 60 * 1000 });
  await writeDB(db);
  return code;
}

export async function verifyOtp(phone: string, code: string): Promise<boolean> {
  const db = await readDB();
  const otp = db.otps.find((o) => o.phone === phone);
  if (!otp || otp.expires < Date.now() || otp.code !== code) return false;
  db.otps = db.otps.filter((o) => o.phone !== phone);
  await writeDB(db);
  return true;
}
