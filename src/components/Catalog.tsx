"use client";

import { useMemo, useState } from "react";
import type { Profile, Product } from "@/lib/types";
import { Image as ImgIcon } from "@/components/icons";
import { BuyButton } from "@/components/BuyButton";
import { CloseButton } from "@/components/blocks";
import { Countdown } from "./Countdown";
import { useLockScroll } from "./useLockScroll";
import { Portal } from "./Portal";

function money(a: number, c: string) {
  return `${new Intl.NumberFormat("fr-FR").format(a)} ${c}`;
}
const isUrl = (s: string) => /^(https?:|\/)/.test(s);

/** Visuel d'un produit : photo réelle si URL, sinon panneau teinté (emoji/placeholder). */
function Visual({ src, emoji, theme, className, iconSize = 30 }: { src?: string; emoji?: string; theme: Profile["theme"]; className?: string; iconSize?: number }) {
  const tint = { background: `linear-gradient(135deg, ${theme.from}22, ${theme.to}22)` };
  return (
    <div className={`relative grid place-items-center ${className ?? ""}`} style={tint}>
      {emoji ? <span style={{ fontSize: iconSize * 1.2 }}>{emoji}</span> : <ImgIcon size={iconSize} className="text-[var(--text-dim)]" />}
      {src && isUrl(src) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      )}
    </div>
  );
}

function imagesOf(p: Product): string[] {
  if (p.images?.length) return p.images;
  if (p.imageUrl) return [p.imageUrl];
  return [];
}

export function Catalog({ profile, products, sectionTitle = "Catalogue" }: { profile: Profile; products: Product[]; sectionTitle?: string }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [detail, setDetail] = useState<Product | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [promo, setPromo] = useState("");
  const [promoPct, setPromoPct] = useState(0);
  const [promoMsg, setPromoMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  function copyCode(code: string) {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 1800);
  }
  const flashProducts = products.filter((p) => p.flash && p.inStock !== false);
  const fs = profile.flashSale;

  function applyPromo() {
    const found = (profile.promoCodes ?? []).find((c) => c.code.toLowerCase() === promo.trim().toLowerCase());
    if (found) { setPromoPct(found.percent); setPromoMsg(`Code appliqué : -${found.percent}%`); }
    else { setPromoPct(0); setPromoMsg("Code promo invalide."); }
  }

  const cats = useMemo(() => [...new Set(products.map((p) => p.category).filter(Boolean))] as string[], [products]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return products.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (!t) return true;
      return (p.name + " " + (p.description ?? "")).toLowerCase().includes(t);
    });
  }, [products, q, cat]);

  function add(p: Product, n = 1) {
    if (p.inStock === false) return;
    setCart((c) => ({ ...c, [p.id]: (c[p.id] ?? 0) + n }));
  }
  function setQty(id: string, n: number) {
    setCart((c) => {
      const next = { ...c };
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });
  }

  const cartItems = Object.entries(cart).map(([id, qty]) => ({ p: products.find((x) => x.id === id)!, qty })).filter((x) => x.p);
  const count = cartItems.reduce((s, x) => s + x.qty, 0);
  const subtotal = cartItems.reduce((s, x) => s + x.p.price * x.qty, 0);
  const discount = Math.round((subtotal * promoPct) / 100);
  const total = subtotal - discount;

  const recap =
    `Bonjour ${profile.businessName} 👋\nJe souhaite commander :\n` +
    cartItems.map((x) => `• ${x.qty}× ${x.p.name} (${money(x.p.price * x.qty, profile.currency)})`).join("\n") +
    (promoPct ? `\nCode promo ${promo.trim().toUpperCase()} : -${money(discount, profile.currency)}` : "") +
    `\n\nTotal : ${money(total, profile.currency)}`;

  const accent = profile.theme.accent;
  const tint = { background: `${accent}14`, borderColor: `${accent}3a` };

  return (
    <section className="px-5 mt-5 animate-fade-up">
      {/* ── Promotions (juste sous le bloc livraison) ── */}
      {(profile.promoCodes?.length || (fs && flashProducts.length > 0)) && (
        <div className="space-y-3 mb-5">
          {/* Type 1 : code promo */}
          {profile.promoCodes?.length ? (() => {
            const pc = profile.promoCodes[0];
            return (
              <div className="rounded-2xl p-4 border" style={tint}>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: accent }}>🎁 Code promo · -{pc.percent}%</p>
                    <button onClick={() => copyCode(pc.code)}
                      className="mt-1.5 inline-flex items-center gap-2 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] px-3 py-1.5 font-mono font-extrabold text-lg tracking-[0.2em] active:scale-95 transition"
                      style={{ color: accent }}>
                      {pc.code}
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
                    </button>
                    <p className="text-[11px] text-[var(--text-muted)] mt-1">{copied === pc.code ? "Copié ! À saisir au panier." : "Cliquez pour copier, à saisir au panier"}</p>
                  </div>
                  {pc.until && <Countdown until={pc.until} />}
                </div>
              </div>
            );
          })() : null}

          {/* Type 2 : ventes flash (produits) */}
          {fs && flashProducts.length > 0 && (
            <div className="rounded-2xl p-4 border" style={tint}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: accent }}>⚡ Vente flash · -{fs.percent}%</p>
                  <p className="font-bold text-base leading-tight text-[var(--text)]">{fs.label}</p>
                </div>
                <Countdown until={fs.until} />
              </div>
              <div className="hscroll flex gap-3 mt-3 pb-1">
                {flashProducts.map((p) => {
                  const flashPrice = Math.round(p.price * (1 - fs.percent / 100));
                  return (
                    <button key={p.id} onClick={() => { add(p); setCartOpen(true); }}
                      className="shrink-0 w-28 rounded-xl overflow-hidden bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--border-strong)] text-left active:scale-95 transition">
                      <Visual src={imagesOf(p)[0]} emoji={p.emoji} theme={profile.theme} className="aspect-square w-full" iconSize={26} />
                      <div className="p-2">
                        <p className="text-xs font-medium truncate text-[var(--text)]">{p.name}</p>
                        <p className="text-[11px] line-through text-[var(--text-dim)]">{money(p.price, profile.currency)}</p>
                        <p className="text-sm font-extrabold" style={{ color: accent }}>{money(flashPrice, profile.currency)}</p>
                        <span className="mt-1 block text-center text-[10px] font-bold rounded-full py-0.5 text-white" style={{ background: accent }}>+ Ajouter</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <h2 className="text-lg font-bold text-[var(--text)] mb-3">{sectionTitle}</h2>

      {/* Recherche */}
      <div className="relative">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un article…"
          className="w-full rounded-full border border-[var(--border)] bg-[var(--surface-2)] pl-10 pr-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] outline-none focus:border-[var(--focus)]"
        />
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-dim)]">
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" />
        </svg>
      </div>

      {/* Filtres par catégorie */}
      {cats.length > 0 && (
        <div className="hscroll flex gap-2 mt-3 pb-1">
          <Chip active={cat === null} onClick={() => setCat(null)}>Tous</Chip>
          {cats.map((c) => (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)} accent={profile.theme.accent}>{c}</Chip>
          ))}
        </div>
      )}

      {/* Grille */}
      {filtered.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] mt-6 text-center">Aucun article ne correspond à ta recherche.</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {filtered.map((p) => {
            const imgs = imagesOf(p);
            return (
              <div key={p.id} className="glass-card rounded-2xl overflow-hidden flex flex-col lift">
                <button onClick={() => setDetail(p)} className="relative block text-left">
                  <Visual src={imgs[0]} emoji={p.emoji} theme={profile.theme} className="aspect-square w-full" iconSize={34} />
                  {imgs.length > 1 && (
                    <span className="absolute top-2 left-2 rounded-full bg-black/60 text-white text-[10px] px-1.5 py-0.5">1/{imgs.length}</span>
                  )}
                  {p.inStock === false && (
                    <span className="absolute top-2 right-2 rounded-full bg-black/70 text-white text-[10px] px-2 py-0.5">Épuisé</span>
                  )}
                </button>
                <div className="p-3 flex flex-col flex-1">
                  <button onClick={() => setDetail(p)} className="text-left">
                    <p className="font-semibold text-[var(--text)] text-sm leading-tight">{p.name}</p>
                  </button>
                  <p className="mt-1 font-bold text-sm" style={{ color: profile.theme.accent }}>
                    {money(p.price, profile.currency)}{p.unit && <span className="text-[var(--text-dim)] text-xs font-normal"> {p.unit}</span>}
                  </p>
                  {p.inStock !== false && (
                    <button onClick={() => add(p)} className="mt-2 rounded-full px-3 py-2 text-white text-xs font-semibold active:scale-95 transition" style={{ background: profile.theme.accent }}>
                      + Ajouter
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Barre panier flottante */}
      {count > 0 && !cartOpen && !detail && (
        <Portal>
          <button onClick={() => setCartOpen(true)}
            style={{ background: profile.theme.accent }}
            className="animate-attention fixed left-1/2 -translate-x-1/2 bottom-20 lg:left-auto lg:right-6 lg:translate-x-0 lg:bottom-6 z-40 flex items-center gap-3 rounded-full text-white pl-5 pr-4 py-3 active:scale-95">
            <span className="font-semibold text-sm">Panier · {money(total, profile.currency)}</span>
            <span className="grid place-items-center w-6 h-6 rounded-full bg-white/25 text-xs font-bold">{count}</span>
          </button>
        </Portal>
      )}

      {/* Fiche produit */}
      {detail && <Detail product={detail} profile={profile} onClose={() => setDetail(null)} onAdd={(n) => { add(detail, n); setDetail(null); setCartOpen(true); }} inCart={cart[detail.id] ?? 0} />}

      {/* Panier */}
      {cartOpen && (
        <Sheet onClose={() => setCartOpen(false)} title="Mon panier">
          {cartItems.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] py-6 text-center">Ton panier est vide.</p>
          ) : (
            <>
              <div className="space-y-3 max-h-[45vh] overflow-y-auto">
                {cartItems.map((x) => (
                  <div key={x.p.id} className="flex items-center gap-3">
                    <Visual src={imagesOf(x.p)[0]} emoji={x.p.emoji} theme={profile.theme} className="w-12 h-12 rounded-lg shrink-0" iconSize={18} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text)] truncate">{x.p.name}</p>
                      <p className="text-xs" style={{ color: profile.theme.accent }}>{money(x.p.price, profile.currency)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Step onClick={() => setQty(x.p.id, x.qty - 1)}>−</Step>
                      <span className="w-5 text-center text-sm text-[var(--text)]">{x.qty}</span>
                      <Step onClick={() => setQty(x.p.id, x.qty + 1)}>+</Step>
                    </div>
                  </div>
                ))}
              </div>
              {profile.promoCodes?.length ? (
                <div className="mt-4">
                  <div className="flex gap-2">
                    <input value={promo} onChange={(e) => { setPromo(e.target.value); setPromoMsg(null); }} placeholder="Code promo"
                      className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] outline-none focus:border-[var(--focus)] uppercase" />
                    <button onClick={applyPromo} className="rounded-xl border border-[var(--border-strong)] px-4 text-sm font-semibold text-[var(--text)]">Appliquer</button>
                  </div>
                  {promoMsg && <p className={`text-xs mt-1 ${promoPct ? "text-green-400" : "text-red-400"}`}>{promoMsg}</p>}
                </div>
              ) : null}

              <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-1 text-sm">
                {promoPct > 0 && (
                  <>
                    <div className="flex justify-between text-[var(--text-muted)]"><span>Sous-total</span><span>{money(subtotal, profile.currency)}</span></div>
                    <div className="flex justify-between text-green-400"><span>Remise -{promoPct}%</span><span>−{money(discount, profile.currency)}</span></div>
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Total</span>
                  <span className="font-bold text-[var(--text)] text-base">{money(total, profile.currency)}</span>
                </div>
              </div>
              <div className="mt-4">
                <BuyButton
                  whatsapp={profile.whatsapp}
                  message={recap}
                  amount={total}
                  currency={profile.currency}
                  momo={profile.momo}
                  requirePrepayment={profile.requirePrepayment}
                  accent={profile.theme.accent}
                  label="Commander sur WhatsApp"
                  iconSize={18}
                  className="w-full rounded-xl py-3"
                />
              </div>
            </>
          )}
        </Sheet>
      )}
    </section>
  );
}

function Chip({ active, onClick, children, accent }: { active: boolean; onClick: () => void; children: React.ReactNode; accent?: string }) {
  return (
    <button onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium border transition ${active ? "text-white border-transparent" : "text-[var(--text-muted)] border-[var(--border)]"}`}
      style={active ? { background: accent ?? "var(--btn)" } : undefined}>
      {children}
    </button>
  );
}

function Step({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className="w-7 h-7 rounded-full border border-[var(--border)] text-[var(--text)] grid place-items-center active:scale-90 transition">{children}</button>;
}

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useLockScroll(true);
  return (
    <Portal>
      <div className="fixed inset-0 z-[60] grid place-items-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-lg animate-fade-in" onClick={onClose} />
        <div className="relative w-full max-w-md max-h-[88vh] overflow-y-auto rounded-3xl bg-[var(--surface)] border border-[var(--border-strong)] p-5 animate-fade-up shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[var(--text)]">{title}</h3>
            <CloseButton onClick={onClose} className="absolute top-3 right-3" />
          </div>
          {children}
        </div>
      </div>
    </Portal>
  );
}

function Detail({ product, profile, onClose, onAdd, inCart }: { product: Product; profile: Profile; onClose: () => void; onAdd: (n: number) => void; inCart: number }) {
  const imgs = imagesOf(product);
  const panels = imgs.length ? imgs : [""];
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);

  return (
    <Sheet title={product.name} onClose={onClose}>
      {/* Carrousel d'images */}
      <div
        className="hscroll flex rounded-2xl overflow-hidden"
        onScroll={(e) => setActive(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
      >
        {panels.map((src, i) => (
          <Visual key={i} src={src} emoji={product.emoji} theme={profile.theme} className="w-full shrink-0 aspect-square" iconSize={54} />
        ))}
      </div>
      {panels.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2">
          {panels.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === active ? "w-5" : "w-1.5 bg-[var(--border-strong)]"}`} style={i === active ? { background: profile.theme.accent } : undefined} />
          ))}
        </div>
      )}

      {product.category && (
        <span className="inline-block mt-3 text-xs rounded-full px-2.5 py-1" style={{ background: `${profile.theme.accent}22`, color: profile.theme.accent }}>{product.category}</span>
      )}
      <p className="mt-2 text-xl font-bold" style={{ color: profile.theme.accent }}>
        {money(product.price, profile.currency)}{product.unit && <span className="text-[var(--text-dim)] text-sm font-normal"> {product.unit}</span>}
      </p>
      {product.description && <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">{product.description}</p>}
      {product.inStock === false && <p className="mt-2 text-sm text-red-400">Actuellement épuisé.</p>}

      {product.inStock !== false && (
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Step onClick={() => setQty((n) => Math.max(1, n - 1))}>−</Step>
            <span className="w-6 text-center text-[var(--text)]">{qty}</span>
            <Step onClick={() => setQty((n) => n + 1)}>+</Step>
          </div>
          <button onClick={() => onAdd(qty)} className="flex-1 rounded-xl text-white font-semibold py-3 active:scale-95 transition" style={{ background: profile.theme.accent }}>
            Ajouter au panier{inCart ? ` (${inCart} déjà)` : ""}
          </button>
        </div>
      )}
    </Sheet>
  );
}
