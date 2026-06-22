import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {UtensilsCrossed, MapPin, Settings, Star, Heart, ArrowRight, Globe} from 'lucide-react';
import {tx, euro} from '@/lib/localize';
import type {Menu, Allergen, Product, BurgerSlide, BurgerOffer} from '@/lib/queries';
import BurgerHero from './burger-hero';

// ---- Tema oscuro de la hamburguesería (colores independientes del DS claro) ----
const C = {
  bg: '#14100a',
  ink: '#f4ede2',
  muted: 'rgba(244,237,226,.62)',
  orange: '#f26b21',
  orangeHi: '#ff7c33',
  gold: '#dcb069'
};

const ABBR: Record<string, string> = {
  gluten: 'GL', crustaceos: 'CR', huevos: 'HU', pescado: 'PE', cacahuetes: 'CA', soja: 'SO',
  lacteos: 'LA', frutos_cascara: 'FC', frutos_secos: 'FC', apio: 'AP', mostaza: 'MO',
  sesamo: 'SE', sulfitos: 'SU', altramuces: 'AT', moluscos: 'ML'
};
const abbr = (code: string) => ABBR[code] ?? code.slice(0, 2).toUpperCase();
function hue(code: string) {
  let h = 0;
  for (const c of code) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}
function Chip({a, locale}: {a: Allergen; locale: string}) {
  const h = hue(a.code);
  return (
    <span title={tx(a.name, locale)} className="flex size-6 items-center justify-center rounded-full text-[0.58rem] font-bold" style={{background: `hsl(${h} 45% 28%)`, color: `hsl(${h} 70% 78%)`}}>
      {abbr(a.code)}
    </span>
  );
}

const OFFER_STYLES: Record<string, {card: string; text: string; sub: string; btn: string; btnText: string; ribbon: string; ribbonText: string}> = {
  orange: {card: 'linear-gradient(150deg,#f26b21,#c9531a)', text: '#fff', sub: 'rgba(255,255,255,.85)', btn: '#1a1209', btnText: '#fff', ribbon: '#f4d58c', ribbonText: '#7a3a10'},
  dark: {card: 'linear-gradient(150deg,#2a1d11,#15100a)', text: '#f4ede2', sub: 'rgba(244,237,226,.7)', btn: '#e7b46a', btnText: '#1a1209', ribbon: '#e7b46a', ribbonText: '#1a1209'},
  gold: {card: 'linear-gradient(150deg,#dcb069,#b98e44)', text: '#231708', sub: 'rgba(35,23,8,.75)', btn: '#1a1209', btnText: '#fff', ribbon: '#1a1209', ribbonText: '#e7b46a'}
};

export default function BurgerLanding({menu, allergens, slides, offers, locale}: {menu: Menu | null; allergens: Allergen[]; slides: BurgerSlide[]; offers: BurgerOffer[]; locale: string}) {
  const products: Product[] = (menu?.categories ?? []).flatMap((c) => c.products ?? []).filter((p) => p.available);
  const favorites = [...products].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0)).filter((p) => p.featured || (p.votes ?? 0) > 0).slice(0, 3);
  // Hero: diapositivas configuradas en el admin; si no hay, derivar de productos nuevos/destacados.
  const fromSlides = slides.map((s) => ({image: s.image, name: tx(s.title, locale), price: s.price, eyebrow: tx(s.eyebrow, locale)}));
  const heroPool = (products.filter((p) => p.is_new || p.featured).length ? products.filter((p) => p.is_new || p.featured) : products).slice(0, 6);
  const heroSlides = fromSlides.length ? fromSlides : heroPool.map((p) => ({image: p.image, name: tx(p.name, locale), price: p.price, eyebrow: p.is_new ? 'Nuevo' : p.tag || 'De siempre'}));
  const hero = heroSlides.length ? heroSlides : [{image: null, name: 'La Calita Burger', price: null, eyebrow: 'Próximamente'}];

  const nav = [
    {label: 'Carta', href: `/carta/hamburgueseria`},
    {label: 'Ofertas', href: '#ofertas'},
    {label: 'Local', href: '#local'}
  ];

  return (
    <main style={{background: C.bg, color: C.ink}} className="min-h-screen font-sans">
      {/* ---- Cabecera (superpuesta sobre el hero) ---- */}
      <header className="absolute inset-x-0 top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5">
          <Link href="/hamburgueseria" aria-label="La Calita Burger">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-solo.svg" alt="" className="h-8 w-auto brightness-0 invert" />
          </Link>
          <nav className="flex items-center gap-6 font-adam text-[0.7rem] uppercase tracking-[0.18em]">
            {nav.map((n) =>
              n.href.startsWith('#') ? (
                <a key={n.label} href={n.href} className="text-white/75 transition hover:text-white">{n.label}</a>
              ) : (
                <Link key={n.label} href={n.href} className="text-white/75 transition hover:text-white">{n.label}</Link>
              )
            )}
          </nav>
          <div className="flex items-center gap-4 text-white/70">
            <a href="/admin" className="flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.14em] transition hover:text-white">
              <Settings className="size-3.5" /> Admin
            </a>
            <span className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-[0.7rem] uppercase">
              <Globe className="size-3.5" /> {locale.toUpperCase()}
            </span>
          </div>
        </div>
      </header>

      {/* ---- Hero (slider de hamburguesas nuevas) ---- */}
      <BurgerHero slides={hero} locale={locale} />

      {/* ---- Marquesinas cruzadas (X), de lado a lado ---- */}
      <div className="relative h-52 overflow-hidden md:h-64" style={{background: C.bg}}>
        {/* Banda 2 (debajo, marrón, sentido contrario) */}
        <div className="absolute left-1/2 top-1/2 flex w-[260%] items-center overflow-hidden py-3.5" style={{background: '#2a1709', transform: 'translate(-50%,-50%) rotate(-5deg)'}}>
          <div className="lc-mq rev" style={{animationDuration: '40s'}}>
            {[0, 1].map((k) => (
              <span key={k} className="flex shrink-0 items-center font-eight text-xl md:text-2xl" style={{color: '#e7b46a'}}>
                {Array.from({length: 26}).map((_, idx) => (
                  <span key={idx} className="mx-5 whitespace-nowrap">{['fresh', 'beach', 'grill'][idx % 3]} ·</span>
                ))}
              </span>
            ))}
          </div>
        </div>
        {/* Banda 1 (encima, naranja) */}
        <div className="absolute left-1/2 top-1/2 flex w-[260%] items-center overflow-hidden py-3.5" style={{background: C.orange, transform: 'translate(-50%,-50%) rotate(5deg)'}}>
          <div className="lc-mq" style={{animationDuration: '36s'}}>
            {[0, 1].map((k) => (
              <span key={k} className="flex shrink-0 items-center font-eight text-xl text-[#2a1709] md:text-2xl">
                {Array.from({length: 26}).map((_, idx) => (
                  <span key={idx} className="mx-5 whitespace-nowrap">{['smash', 'juicy', 'crispy'][idx % 3]} ·</span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ---- Ofertas ---- */}
      <section id="ofertas" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-eight text-4xl text-white md:text-5xl">ofertas</h2>
          <span className="font-adam text-[0.7rem] uppercase tracking-[0.2em]" style={{color: C.orange}}>Solo en La Calita Burger</span>
        </div>
        {offers.length === 0 ? (
          <p style={{color: C.muted}}>Aún no hay ofertas. Créalas en el admin → Hamburguesería.</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {offers.map((o) => {
              const st = OFFER_STYLES[o.color_style] ?? OFFER_STYLES.orange;
              const oTitle = tx(o.title, locale);
              const oEyebrow = tx(o.eyebrow, locale);
              const oDesc = tx(o.description, locale);
              return (
                <article key={o.id} className="relative flex min-h-[340px] flex-col overflow-hidden rounded-[22px] p-6" style={{background: st.card, color: st.text}}>
                  {o.discount_label && (
                    <span className="absolute -right-9 top-5 z-10 rotate-45 px-10 py-1 text-center text-xs font-bold" style={{background: st.ribbon, color: st.ribbonText}}>{o.discount_label}</span>
                  )}
                  {o.image && (
                    <div className="pointer-events-none absolute -bottom-2 -top-2 right-[-0.75rem] w-44 opacity-95">
                      <Image src={o.image} alt={oTitle} fill sizes="180px" className="object-contain object-bottom drop-shadow-2xl" />
                    </div>
                  )}
                  <div className="relative z-[1] flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.14em]" style={{color: st.sub}}>
                    {oEyebrow || 'Oferta'}
                    {o.rating != null && (
                      <span className="inline-flex items-center gap-0.5" style={{color: st.text}}>
                        <Star className="size-3 fill-current" /> {o.rating}
                      </span>
                    )}
                  </div>
                  <h3 className="relative z-[1] mt-2 max-w-[6.5em] font-eight text-3xl leading-[0.95]">{oTitle}</h3>
                  {oDesc && <p className="relative z-[1] mt-2 line-clamp-3 max-w-[10em] text-sm" style={{color: st.sub}}>{oDesc}</p>}
                  <Link href="/carta/hamburgueseria" className="relative z-[1] mt-auto inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold" style={{background: st.btn, color: st.btnText}}>
                    Ver la oferta <ArrowRight className="size-4" />
                  </Link>
                  <div className="relative z-[1] mt-3 flex items-end gap-2 font-eight text-2xl">
                    {o.price != null && <span>{euro(o.price, locale)}</span>}
                    {o.old_price != null && <span className="text-base line-through opacity-60">{euro(o.old_price, locale)}</span>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ---- Favoritas de la gente ---- */}
      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-6">
          <div className="flex items-center gap-2 font-adam text-[0.7rem] uppercase tracking-[0.2em]" style={{color: C.orange}}>
            <Heart className="size-3.5 fill-current" /> Las más votadas
          </div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-eight text-4xl text-white md:text-5xl">favoritas de la gente</h2>
            <Link href="/carta/hamburgueseria" className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em]" style={{borderColor: C.orange, color: C.orange}}>
              Ir a la carta <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
        {favorites.length === 0 ? (
          <p style={{color: C.muted}}>Marca productos como destacados (o con votos) para que salgan aquí.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((p, i) => (
              <Link key={p.id} href={`/carta/hamburgueseria/${p.slug}`} className="group flex flex-col overflow-hidden rounded-[20px] border border-white/8" style={{background: 'linear-gradient(180deg,#241910,#160f08)'}}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  {p.image ? (
                    <Image src={p.image} alt={tx(p.name, locale)} fill sizes="(min-width:1024px) 22rem, 90vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/20"><UtensilsCrossed className="size-10" /></div>
                  )}
                  {i === 0 && p.featured && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.62rem] font-bold uppercase" style={{background: C.gold, color: '#1a1209'}}>
                      <Star className="size-3 fill-current" /> Favorita
                    </span>
                  )}
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
                    <Heart className="size-3.5 fill-current" style={{color: C.orange}} /> {p.votes ?? 0}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-lg font-bold text-white">{tx(p.name, locale)}</h3>
                    {p.price != null && <span className="shrink-0 font-bold" style={{color: C.orange}}>{euro(p.price, locale)}</span>}
                  </div>
                  {p.description && <p className="mt-1 line-clamp-2 text-sm" style={{color: C.muted}}>{tx(p.description, locale)}</p>}
                  {p.product_allergens?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {p.product_allergens.map((pa) => pa.allergens && <Chip key={pa.allergens.code} a={pa.allergens} locale={locale} />)}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ---- Alérgenos + local ---- */}
      <section id="local" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-12">
        <div className="rounded-[22px] border border-white/8 p-6" style={{background: 'linear-gradient(180deg,#221710,#160f08)'}}>
          <div className="mb-5 font-adam text-[0.7rem] uppercase tracking-[0.2em]" style={{color: C.orange}}>Alérgenos · 14 oficiales UE</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-5">
            {allergens.map((a) => (
              <div key={a.code} className="flex items-center gap-2 text-sm" style={{color: C.muted}}>
                <Chip a={a} locale={locale} /> {tx(a.name, locale)}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-sm" style={{color: C.muted}}>
          <span>La Calita Burger · Salobreña, Granada</span>
          <a href="https://maps.google.com/?q=La+Calita+Salobre%C3%B1a" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10">
            <MapPin className="size-4" /> Cómo llegar
          </a>
        </div>
      </section>
    </main>
  );
}
