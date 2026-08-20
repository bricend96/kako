"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { Profile, Service, Product, MenuSection, Dish, Program, Track, EventDate, Review, Listing, SocialLink } from "@/lib/types";
import { MOMO_PROVIDERS } from "@/lib/types";
import { categoryMeta } from "@/lib/categories";
import { saveProfileAction, togglePublishAction } from "@/app/dashboard/actions";
import { Field, Text, Area, Num, Card, ListEditor, EmojiListEditor } from "./fields";
import { ImageUpload, ImageUploadMulti } from "./ImageUpload";
import { CategoryIcon } from "@/components/icons";
import { SOCIALS, SOCIAL_ORDER } from "@/components/social-icons";

export default function Editor({ profile: initial }: { profile: Profile }) {
  const [form, setForm] = useState<Profile>(initial);
  const [saved, setSaved] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [pending, start] = useTransition();
  const meta = categoryMeta(form.category);

  function set<K extends keyof Profile>(key: K, value: Profile[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function save() {
    start(async () => {
      const res = await saveProfileAction(form.id, form);
      if (res.ok) {
        setSaved(true);
        setPreviewKey((k) => k + 1);
      }
    });
  }

  return (
    <main className="min-h-screen bg-[var(--surface-2)]">
      {/* Barre du haut */}
      <header className="sticky top-0 z-20 glass backdrop-blur-2xl backdrop-saturate-150 border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/dashboard" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] shrink-0">← Mes sites</Link>
            <span className="text-sm font-semibold text-[var(--text)] truncate inline-flex items-center gap-1.5"><CategoryIcon category={form.category} size={16} /> {form.businessName}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href={`/${form.slug}`} target="_blank" className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text)] hover:bg-[var(--surface-2)]">Voir</Link>
            <form action={togglePublishAction.bind(null, form.slug)}>
              <button className={`rounded-lg px-3 py-2 text-xs font-semibold ${form.published ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                {form.published ? "Dépublier" : "Publier"}
              </button>
            </form>
            <button onClick={save} disabled={pending} className="rounded-lg bg-[var(--btn)] text-white px-4 py-2 text-xs font-semibold disabled:opacity-50">
              {pending ? "Enregistrement…" : saved ? "Enregistré ✓" : "Enregistrer"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-[1fr_380px] gap-6">
        {/* Colonne formulaire */}
        <div className="space-y-5">
          <Card title="Identité">
            <Field label="Nom de l'activité"><Text value={form.businessName} onChange={(v) => set("businessName", v)} /></Field>
            <Field label="Nom du responsable"><Text value={form.ownerName} onChange={(v) => set("ownerName", v)} /></Field>
            <Field label="Slogan / accroche"><Text value={form.tagline} onChange={(v) => set("tagline", v)} placeholder="Ex : Salon de coiffure — Dakar" /></Field>
            <Field label="Présentation"><Area value={form.bio} onChange={(v) => set("bio", v)} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Ville"><Text value={form.city} onChange={(v) => set("city", v)} /></Field>
              <Field label="Pays"><Text value={form.country} onChange={(v) => set("country", v)} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ImageUpload label="Logo / photo de profil" value={form.avatarUrl} onChange={(v) => set("avatarUrl", v)} aspect="square" />
              <ImageUpload label="Bannière" value={form.coverUrl} onChange={(v) => set("coverUrl", v)} aspect="wide" />
            </div>
          </Card>

          <Card title="Contact">
            <Field label="Numéro WhatsApp" hint="Format international sans +, ex : 221771234567">
              <Text value={form.whatsapp} onChange={(v) => set("whatsapp", v.replace(/[^0-9]/g, ""))} placeholder="221771234567" />
            </Field>
            <Field label="Téléphone (affiché, optionnel)"><Text value={form.phone ?? ""} onChange={(v) => set("phone", v)} /></Field>
            <Field label="Adresse (optionnel)"><Text value={form.address ?? ""} onChange={(v) => set("address", v)} /></Field>
            <Field label="Lien Google Maps (optionnel)"><Text value={form.mapUrl ?? ""} onChange={(v) => set("mapUrl", v)} /></Field>
          </Card>

          <Card title="Réseaux sociaux">
            <p className="text-xs text-[var(--text-muted)] -mt-2">Ces boutons apparaissent sur ta page, quel que soit ton métier.</p>
            <ListEditor
              items={form.socials ?? []}
              onChange={(v) => set("socials", v)}
              blank={(): SocialLink => ({ type: "instagram", url: "" })}
              addLabel="Ajouter un réseau"
              render={(s, up) => (
                <>
                  <div className="grid grid-cols-[130px_1fr] gap-2">
                    <select
                      value={s.type}
                      onChange={(e) => up({ type: e.target.value as SocialLink["type"] })}
                      className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-2 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--focus)]"
                    >
                      {SOCIAL_ORDER.map((t) => (
                        <option key={t} value={t}>{SOCIALS[t].label}</option>
                      ))}
                    </select>
                    <Text value={s.label ?? ""} onChange={(v) => up({ label: v })} placeholder="Nom affiché (ex : @moncompte)" />
                  </div>
                  <Text value={s.url} onChange={(v) => up({ url: v })} placeholder={SOCIALS[s.type]?.placeholder ?? "https://…"} />
                </>
              )}
            />
          </Card>

          <Card title="Paiement">
            <Field label="Devise"><Text value={form.currency} onChange={(v) => set("currency", v)} placeholder="FCFA" /></Field>
            <div>
              <span className="block text-sm font-medium text-[var(--text)] mb-2">Mobile Money accepté</span>
              <div className="flex flex-wrap gap-2">
                {MOMO_PROVIDERS.map((m) => {
                  const on = form.momo.includes(m);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => set("momo", on ? form.momo.filter((x) => x !== m) : [...form.momo, m])}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium border ${on ? "bg-[var(--btn)] text-white border-[var(--focus)]" : "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]"}`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
            <label className="flex items-start gap-3 rounded-xl border border-[var(--border)] p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.requirePrepayment ?? false}
                onChange={(e) => set("requirePrepayment", e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[var(--btn)]"
              />
              <span className="text-sm">
                <span className="font-medium text-[var(--text)]">Exiger le paiement Mobile Money avant la commande</span>
                <span className="block text-xs text-[var(--text-muted)] mt-0.5">Le client paie sur la plateforme, puis est redirigé vers WhatsApp avec la preuve de paiement. Sinon, il te contacte directement.</span>
              </span>
            </label>
          </Card>

          <Card title="Couleurs du site">
            <div className="flex items-center gap-4">
              <ColorInput label="Début" value={form.theme.from} onChange={(v) => set("theme", { ...form.theme, from: v })} />
              <ColorInput label="Fin" value={form.theme.to} onChange={(v) => set("theme", { ...form.theme, to: v })} />
              <ColorInput label="Accent" value={form.theme.accent} onChange={(v) => set("theme", { ...form.theme, accent: v })} />
              <div className="flex-1 h-12 rounded-xl" style={{ background: `linear-gradient(135deg, ${form.theme.from}, ${form.theme.to})` }} />
            </div>
          </Card>

          <CategoryContent form={form} set={set} />

          <Card title="Avis clients (optionnel)">
            <ListEditor
              items={form.reviews ?? []}
              onChange={(v) => set("reviews", v)}
              blank={(): Review => ({ author: "", rating: 5, text: "" })}
              addLabel="Ajouter un avis"
              render={(r, up) => (
                <>
                  <div className="grid grid-cols-[1fr_90px] gap-2">
                    <Text value={r.author} onChange={(v) => up({ author: v })} placeholder="Nom du client" />
                    <Num value={r.rating} onChange={(v) => up({ rating: Math.max(1, Math.min(5, v)) })} placeholder="Note /5" />
                  </div>
                  <Text value={r.text} onChange={(v) => up({ text: v })} placeholder="Commentaire" />
                </>
              )}
            />
          </Card>

          <div className="lg:hidden">
            <Link href={`/${form.slug}`} target="_blank" className="block text-center rounded-xl border border-[var(--border)] py-3 font-semibold text-[var(--text)]">
              Ouvrir l&apos;aperçu du site →
            </Link>
          </div>
        </div>

        {/* Colonne aperçu (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-20">
            <div className="mx-auto w-[360px] rounded-[2rem] border-8 border-[var(--focus)] overflow-hidden shadow-xl bg-[var(--surface)] h-[720px]">
              <iframe key={previewKey} src={`/${form.slug}`} className="w-full h-full" title="Aperçu" />
            </div>
            <p className="text-center text-xs text-[var(--text-dim)] mt-3">Aperçu · se met à jour après « Enregistrer »</p>
          </div>
        </div>
      </div>
    </main>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="text-center">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-10 h-10 rounded-lg border border-[var(--border)] cursor-pointer" />
      <span className="block text-[10px] text-[var(--text-dim)] mt-1">{label}</span>
    </label>
  );
}

/* ─────────── Contenu spécifique au métier ─────────── */
function CategoryContent({ form, set }: { form: Profile; set: <K extends keyof Profile>(k: K, v: Profile[K]) => void }) {
  switch (form.category) {
    case "coiffeur":
      return (
        <>
          <Card title="Prestations & tarifs">
            <ListEditor
              items={form.services ?? []} onChange={(v) => set("services", v)}
              blank={(): Service => ({ name: "", price: 0 })} addLabel="Ajouter une prestation"
              render={(s, up) => (
                <>
                  <Text value={s.name} onChange={(v) => up({ name: v })} placeholder="Nom de la prestation" />
                  <div className="grid grid-cols-2 gap-2">
                    <Num value={s.price} onChange={(v) => up({ price: v })} placeholder="Prix" />
                    <Num value={s.durationMin} onChange={(v) => up({ durationMin: v })} placeholder="Durée (min)" />
                  </div>
                  <Text value={s.description ?? ""} onChange={(v) => up({ description: v })} placeholder="Description (optionnel)" />
                </>
              )}
            />
          </Card>
          <GalleryCard form={form} set={set} />
          <HoursCard form={form} set={set} />
        </>
      );

    case "ecommerce":
      return (
        <>
          <Card title="Catalogue de produits">
            <ListEditor
              items={form.products ?? []} onChange={(v) => set("products", v)}
              blank={(): Product => ({ id: "p" + Math.random().toString(36).slice(2, 6), name: "", price: 0, emoji: "🛍️", inStock: true })}
              addLabel="Ajouter un produit"
              render={(p, up) => (
                <>
                  <Text value={p.name} onChange={(v) => up({ name: v })} placeholder="Nom du produit" />
                  <div className="grid grid-cols-2 gap-2 items-center">
                    <Num value={p.price} onChange={(v) => up({ price: v })} placeholder="Prix" />
                    <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                      <input type="checkbox" checked={p.inStock !== false} onChange={(e) => up({ inStock: e.target.checked })} /> En stock
                    </label>
                  </div>
                  <Text value={p.category ?? ""} onChange={(v) => up({ category: v })} placeholder="Catégorie (ex : Sacs, Bijoux…)" />
                  <Text value={p.description ?? ""} onChange={(v) => up({ description: v })} placeholder="Description (optionnel)" />
                  <ImageUploadMulti value={p.images ?? []} onChange={(imgs) => up({ images: imgs })} />
                </>
              )}
            />
          </Card>
          <DeliveryCard form={form} set={set} />
        </>
      );

    case "restaurant":
      return (
        <>
          <Card title="Menu">
            <ListEditor
              items={form.menu ?? []} onChange={(v) => set("menu", v)}
              blank={(): MenuSection => ({ title: "Nouvelle section", dishes: [] })} addLabel="Ajouter une section"
              render={(section, up) => (
                <>
                  <Text value={section.title} onChange={(v) => up({ title: v })} placeholder="Titre de la section" />
                  <ListEditor
                    items={section.dishes} onChange={(dishes) => up({ dishes })}
                    blank={(): Dish => ({ name: "", price: 0, emoji: "🍽️" })} addLabel="Ajouter un plat"
                    render={(d, upd) => (
                      <>
                        <div className="grid grid-cols-[56px_1fr] gap-2">
                          <input value={d.emoji ?? ""} onChange={(e) => upd({ emoji: e.target.value })} className="text-center text-2xl rounded-xl border border-[var(--border)]" />
                          <Text value={d.name} onChange={(v) => upd({ name: v })} placeholder="Nom du plat" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Num value={d.price} onChange={(v) => upd({ price: v })} placeholder="Prix" />
                          <select value={d.tag ?? ""} onChange={(e) => upd({ tag: (e.target.value || undefined) as typeof d.tag })} className="rounded-xl border border-[var(--border)] px-2 text-sm text-[var(--text)]">
                            <option value="">— Étiquette</option>
                            <option value="populaire">Populaire</option>
                            <option value="nouveau">Nouveau</option>
                            <option value="epuise">Épuisé</option>
                          </select>
                        </div>
                        <Text value={d.description ?? ""} onChange={(v) => upd({ description: v })} placeholder="Description (optionnel)" />
                      </>
                    )}
                  />
                </>
              )}
            />
          </Card>
          <DeliveryCard form={form} set={set} />
          <HoursCard form={form} set={set} />
        </>
      );

    case "ecole":
      return (
        <>
          <Card title="Inscription">
            <Field label="Message d'appel à l'inscription"><Text value={form.enrollNote ?? ""} onChange={(v) => set("enrollNote", v)} placeholder="Ex : Rentrée le 1er octobre — places limitées" /></Field>
          </Card>
          <Card title="Programmes & formations">
            <ListEditor
              items={form.programs ?? []} onChange={(v) => set("programs", v)}
              blank={(): Program => ({ name: "" })} addLabel="Ajouter un programme"
              render={(p, up) => (
                <>
                  <Text value={p.name} onChange={(v) => up({ name: v })} placeholder="Nom du programme" />
                  <div className="grid grid-cols-2 gap-2">
                    <Text value={p.level ?? ""} onChange={(v) => up({ level: v })} placeholder="Niveau" />
                    <Text value={p.duration ?? ""} onChange={(v) => up({ duration: v })} placeholder="Durée (ex : 3 mois)" />
                  </div>
                  <Num value={p.price} onChange={(v) => up({ price: v })} placeholder="Prix (optionnel)" />
                  <Text value={p.description ?? ""} onChange={(v) => up({ description: v })} placeholder="Description (optionnel)" />
                </>
              )}
            />
          </Card>
          <HoursCard form={form} set={set} />
        </>
      );

    case "artiste":
      return (
        <>
          <Card title="Options">
            <label className="flex items-center gap-2 text-sm text-[var(--text)]">
              <input type="checkbox" checked={!!form.tipsEnabled} onChange={(e) => set("tipsEnabled", e.target.checked)} />
              Afficher le bouton « Me soutenir » (pourboire Mobile Money)
            </label>
          </Card>
          <Card title="Mes titres">
            <ListEditor
              items={form.tracks ?? []} onChange={(v) => set("tracks", v)}
              blank={(): Track => ({ title: "" })} addLabel="Ajouter un titre"
              render={(t, up) => (
                <>
                  <div className="grid grid-cols-[1fr_80px] gap-2">
                    <Text value={t.title} onChange={(v) => up({ title: v })} placeholder="Titre" />
                    <Text value={t.duration ?? ""} onChange={(v) => up({ duration: v })} placeholder="3:24" />
                  </div>
                  <Text value={t.url ?? ""} onChange={(v) => up({ url: v })} placeholder="Lien d'écoute (YouTube, Audiomack…)" />
                </>
              )}
            />
          </Card>
          <Card title="Concerts & dates">
            <ListEditor
              items={form.events ?? []} onChange={(v) => set("events", v)}
              blank={(): EventDate => ({ date: "", venue: "", city: "" })} addLabel="Ajouter une date"
              render={(e, up) => (
                <>
                  <Text value={e.date} onChange={(v) => up({ date: v })} placeholder="Date (ex : Sam. 12 oct.)" />
                  <div className="grid grid-cols-2 gap-2">
                    <Text value={e.venue} onChange={(v) => up({ venue: v })} placeholder="Lieu" />
                    <Text value={e.city} onChange={(v) => up({ city: v })} placeholder="Ville" />
                  </div>
                  <Text value={e.ticketUrl ?? ""} onChange={(v) => up({ ticketUrl: v })} placeholder="Lien billetterie (optionnel)" />
                </>
              )}
            />
          </Card>
          <GalleryCard form={form} set={set} />
        </>
      );

    case "artisan":
      return (
        <>
          <ServicesCard form={form} set={set} title="Mes prestations" />
          <GalleryCard form={form} set={set} />
          <HoursCard form={form} set={set} />
        </>
      );

    case "sante":
      return (
        <>
          <ServicesCard form={form} set={set} title="Consultations & soins" />
          <HoursCard form={form} set={set} />
        </>
      );

    case "evenementiel":
      return (
        <>
          <ServicesCard form={form} set={set} title="Forfaits" />
          <GalleryCard form={form} set={set} />
        </>
      );

    case "transport":
      return (
        <>
          <ServicesCard form={form} set={set} title="Tarifs des courses" />
          <DeliveryCard form={form} set={set} labels={{ toggle: "J'affiche mes zones desservies", zones: "Zones desservies (séparées par des virgules)" }} />
        </>
      );

    case "immobilier":
      return (
        <Card title="Biens (à louer / vendre)">
          <ListEditor
            items={form.listings ?? []} onChange={(v) => set("listings", v)}
            blank={(): Listing => ({ id: "b" + Math.random().toString(36).slice(2, 6), title: "", price: 0, kind: "Location", emoji: "🏠" })}
            addLabel="Ajouter un bien"
            render={(b, up) => (
              <>
                <div className="grid grid-cols-[56px_1fr] gap-2">
                  <input value={b.emoji ?? ""} onChange={(e) => up({ emoji: e.target.value })} className="text-center text-2xl rounded-xl border border-[var(--border)]" />
                  <Text value={b.title} onChange={(v) => up({ title: v })} placeholder="Titre (ex : Appartement 2 chambres)" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select value={b.kind ?? "Location"} onChange={(e) => up({ kind: e.target.value as Listing["kind"] })} className="rounded-xl border border-[var(--border)] px-2 text-sm text-[var(--text)]">
                    <option value="Location">Location</option>
                    <option value="Vente">Vente</option>
                  </select>
                  <Num value={b.price} onChange={(v) => up({ price: v })} placeholder="Prix" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Text value={b.location ?? ""} onChange={(v) => up({ location: v })} placeholder="Quartier" />
                  <Num value={b.bedrooms} onChange={(v) => up({ bedrooms: v })} placeholder="Chambres" />
                  <Text value={b.area ?? ""} onChange={(v) => up({ area: v })} placeholder="Surface" />
                </div>
                <Text value={b.description ?? ""} onChange={(v) => up({ description: v })} placeholder="Description (optionnel)" />
              </>
            )}
          />
        </Card>
      );

    case "ong":
      return (
        <>
          <Card title="Appel aux dons">
            <Field label="Message affiché aux visiteurs"><Text value={form.enrollNote ?? ""} onChange={(v) => set("enrollNote", v)} placeholder="Ex : Votre don change des vies 🙏" /></Field>
          </Card>
          <Card title="Nos projets & actions">
            <ListEditor
              items={form.programs ?? []} onChange={(v) => set("programs", v)}
              blank={(): Program => ({ name: "" })} addLabel="Ajouter un projet"
              render={(p, up) => (
                <>
                  <Text value={p.name} onChange={(v) => up({ name: v })} placeholder="Nom du projet" />
                  <Text value={p.duration ?? ""} onChange={(v) => up({ duration: v })} placeholder="Objectif (ex : Objectif : 500 000 FCFA)" />
                  <Text value={p.description ?? ""} onChange={(v) => up({ description: v })} placeholder="Description / impact" />
                </>
              )}
            />
          </Card>
          <GalleryCard form={form} set={set} />
        </>
      );

    case "agriculture":
      return (
        <>
          <Card title="Nos produits">
            <ListEditor
              items={form.products ?? []} onChange={(v) => set("products", v)}
              blank={(): Product => ({ id: "a" + Math.random().toString(36).slice(2, 6), name: "", price: 0, emoji: "🌾", inStock: true })}
              addLabel="Ajouter un produit"
              render={(p, up) => (
                <>
                  <Text value={p.name} onChange={(v) => up({ name: v })} placeholder="Nom du produit" />
                  <div className="grid grid-cols-[1fr_100px] gap-2 items-center">
                    <Num value={p.price} onChange={(v) => up({ price: v })} placeholder="Prix" />
                    <Text value={p.unit ?? ""} onChange={(v) => up({ unit: v })} placeholder="/kg, /sac…" />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                    <input type="checkbox" checked={p.inStock !== false} onChange={(e) => up({ inStock: e.target.checked })} /> Disponible
                  </label>
                  <Text value={p.category ?? ""} onChange={(v) => up({ category: v })} placeholder="Catégorie (ex : Céréales, Fruits…)" />
                  <Text value={p.description ?? ""} onChange={(v) => up({ description: v })} placeholder="Description (optionnel)" />
                  <ImageUploadMulti value={p.images ?? []} onChange={(imgs) => up({ images: imgs })} />
                </>
              )}
            />
          </Card>
          <DeliveryCard form={form} set={set} />
        </>
      );

    case "hotellerie":
      return (
        <Card title="Nos chambres">
          <ListEditor
            items={form.listings ?? []} onChange={(v) => set("listings", v)}
            blank={(): Listing => ({ id: "r" + Math.random().toString(36).slice(2, 6), title: "", price: 0, emoji: "🛏️" })}
            addLabel="Ajouter une chambre"
            render={(r, up) => (
              <>
                <div className="grid grid-cols-[56px_1fr] gap-2">
                  <input value={r.emoji ?? ""} onChange={(e) => up({ emoji: e.target.value })} className="text-center text-2xl rounded-xl border border-[var(--border)]" />
                  <Text value={r.title} onChange={(v) => up({ title: v })} placeholder="Type de chambre" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Num value={r.price} onChange={(v) => up({ price: v })} placeholder="Prix/nuit" />
                  <Num value={r.bedrooms} onChange={(v) => up({ bedrooms: v })} placeholder="Lits" />
                  <Text value={r.area ?? ""} onChange={(v) => up({ area: v })} placeholder="Surface" />
                </div>
                <Text value={r.description ?? ""} onChange={(v) => up({ description: v })} placeholder="Équipements (climatisation, wifi…)" />
              </>
            )}
          />
        </Card>
      );

    default:
      return null;
  }
}

function ServicesCard({ form, set, title }: { form: Profile; set: <K extends keyof Profile>(k: K, v: Profile[K]) => void; title: string }) {
  return (
    <Card title={title}>
      <ListEditor
        items={form.services ?? []} onChange={(v) => set("services", v)}
        blank={(): Service => ({ name: "", price: 0 })} addLabel="Ajouter une ligne"
        render={(s, up) => (
          <>
            <Text value={s.name} onChange={(v) => up({ name: v })} placeholder="Intitulé" />
            <div className="grid grid-cols-2 gap-2">
              <Num value={s.price} onChange={(v) => up({ price: v })} placeholder="Prix" />
              <Num value={s.durationMin} onChange={(v) => up({ durationMin: v })} placeholder="Durée min (optionnel)" />
            </div>
            <Text value={s.description ?? ""} onChange={(v) => up({ description: v })} placeholder="Description (optionnel)" />
          </>
        )}
      />
    </Card>
  );
}

function GalleryCard({ form, set }: { form: Profile; set: <K extends keyof Profile>(k: K, v: Profile[K]) => void }) {
  return (
    <Card title="Galerie (emojis en attendant tes photos)">
      <EmojiListEditor items={form.gallery ?? []} onChange={(v) => set("gallery", v)} />
    </Card>
  );
}

function HoursCard({ form, set }: { form: Profile; set: <K extends keyof Profile>(k: K, v: Profile[K]) => void }) {
  return (
    <Card title="Horaires">
      <ListEditor
        items={form.hours ?? []} onChange={(v) => set("hours", v)}
        blank={() => ({ day: "", slot: "" })} addLabel="Ajouter une ligne"
        render={(h, up) => (
          <div className="grid grid-cols-2 gap-2">
            <Text value={h.day} onChange={(v) => up({ day: v })} placeholder="Jour (ex : Lun–Ven)" />
            <Text value={h.slot ?? ""} onChange={(v) => up({ slot: v === "" ? null : v })} placeholder="Horaire (vide = fermé)" />
          </div>
        )}
      />
    </Card>
  );
}

function DeliveryCard({
  form, set, labels,
}: {
  form: Profile;
  set: <K extends keyof Profile>(k: K, v: Profile[K]) => void;
  labels?: { toggle: string; zones: string };
}) {
  const d = form.delivery ?? { available: false };
  return (
    <Card title={labels ? "Zones" : "Livraison"}>
      <label className="flex items-center gap-2 text-sm text-[var(--text)]">
        <input type="checkbox" checked={!!d.available} onChange={(e) => set("delivery", { ...d, available: e.target.checked })} />
        {labels?.toggle ?? "Je propose la livraison"}
      </label>
      {d.available && (
        <>
          <Field label={labels?.zones ?? "Zones (séparées par des virgules)"}>
            <Text value={(d.zones ?? []).join(", ")} onChange={(v) => set("delivery", { ...d, zones: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
          </Field>
          {!labels && (
            <Field label="Frais de livraison">
              <Num value={d.fee} onChange={(v) => set("delivery", { ...d, fee: v })} />
            </Field>
          )}
        </>
      )}
    </Card>
  );
}
