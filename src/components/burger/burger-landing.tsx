import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {UtensilsCrossed, MapPin, Settings, Star, Heart, ArrowRight, Globe} from 'lucide-react';
import {tx, euro} from '@/lib/localize';
import type {Menu, Allergen, Product} from '@/lib/queries';

// ---- Tema oscuro de la hamburguesería (colores independientes del DS claro) ----
const C = {
  bg: '#1a1209',
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

const OFFER_STYLES = [
  {card: 'linear-gradient(150deg,#f26b21,#c9531a)', text: '#fff', sub: 'rgba(255,255,255,.85)', btn: '#1a1209', btnText: '#fff', ribbon: '#f4d58c', ribbonText: '#7a3a10'},
  {card: 'linear-gradient(150deg,#2a1d11,#15100a)', text: '#f4ede2', sub: 'rgba(244,237,226,.7)', btn: '#e7b46a', btnText: '#1a1209', ribbon: '#e7b46a', ribbonText: '#1a1209'},
  {card: 'linear-gradient(150deg,#dcb069,#b98e44)', text: '#231708', sub: 'rgba(35,23,8,.75)', btn: '#1a1209', btnText: '#fff', ribbon: '#1a1209', ribbonText: '#e7b46a'}
];

export default function BurgerLanding({menu, allergens, locale}: {menu: Menu | null; allergens: Allergen[]; locale: string}) {
  const products: Product[] = (menu?.categories ?? []).flatMap((c) => c.products ?? []).filter((p) => p.available);
  const offers = products.filter((p) => p.tag || p.old_price != null).sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0)).slice(0, 3);
  const favorites = [...products].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0)).filter((p) => p.featured || (p.votes ?? 0) > 0).slice(0, 3);
  const highlight = offers[0] ?? favorites[0] ?? products[0] ?? null;
  const heroImg = menu?.header_image ?? highlight?.image ?? null;

  const nav = [
    {label: 'Carta', href: `/carta/hamburgueseria`},
    {label: 'Ofertas', href: '#ofertas'},
    {label: 'Local', href: '#local'}
  ];

  return (
    <main style={{background: C.bg, color: C.ink}} className="min-h-screen font-sans">
      {/* ---- Cabecera ---- */}
      <header className="sticky top-0 z-40 border-b border-white/5 backdrop-blur-md" style={{background: 'rgba(26,18,9,.78)'}}>
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

      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden">
        {/* anillos concéntricos decorativos */}
        <div aria-hidden className="pointer-events-none absolute -right-40 top-1/2 size-[820px] -translate-y-1/2 rounded-full" style={{border: '1px solid rgba(231,180,106,.08)', boxShadow: '0 0 0 90px rgba(231,180,106,.04), 0 0 0 200px rgba(231,180,106,.03)'}} />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo-solo.svg" alt="" className="h-14 w-auto" style={{filter: `drop-shadow(0 0 1px ${C.gold})`}} />
              <span className="font-modern text-4xl tracking-wide" style={{color: C.ink}}>LA CALITA</span>
            </div>
            <div className="mt-2 font-adam text-[0.72rem] uppercase tracking-[0.28em]" style={{color: C.gold}}>Smash Burgers · A pie de playa</div>
            <p className="mt-6 max-w-md text-lg leading-relaxed" style={{color: C.muted}}>
              Carne fresca, pan brioche y queso fundido, frente al mar. Hechas al momento, sin atajos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/carta/hamburgueseria" className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold transition hover:brightness-105" style={{background: C.orange, color: '#fff'}}>
                <UtensilsCrossed className="size-4" /> Ver la carta
              </Link>
              <a href="#local" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10">
                <MapPin className="size-4" /> Cómo llegar
              </a>
            </div>
          </div>

          <div className="relative flex min-h-[360px] items-center justify-center">
            {highlight && <div className="absolute top-2 font-adam text-[0.7rem] uppercase tracking-[0.32em]" style={{color: C.gold}}>Crujiente</div>}
            {highlight && <div className="absolute top-8 text-center font-eight text-5xl leading-none text-white md:text-6xl">{tx(highlight.name, locale)}</div>}
            {heroImg ? (
              <div className="relative mt-16 aspect-square w-full max-w-sm">
                <Image src={heroImg} alt={highlight ? tx(highlight.name, locale) : 'Hamburguesa'} fill sizes="(min-width:768px) 24rem, 90vw" className="object-contain drop-shadow-2xl" />
              </div>
            ) : (
              <div className="mt-16 flex aspect-square w-full max-w-sm items-center justify-center rounded-3xl border border-dashed border-white/15 text-white/30">
                <UtensilsCrossed className="size-16" />
              </div>
            )}
            {highlight?.price != null && (
              <div className="absolute bottom-0 font-eight text-4xl" style={{color: C.ink}}>
                {euro(highlight.price, locale)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---- Marquesina diagonal ---- */}
      <div className="relative my-2 overflow-hidden">
        <div className="-rotate-2 py-3" style={{background: C.orange}}>
          <div className="lc-mq" style={{animationDuration: '22s'}}>
            {[0, 1].map((k) => (
              <span key={k} className="flex shrink-0 items-center font-eight text-xl text-[#231708]">
                {Array.from({length: 10}).map((_, i) => (
                  <span key={i} className="mx-6">{['juicy', 'crispy', 'smash'][i % 3]} ·</span>
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
          <p style={{color: C.muted}}>Aún no hay ofertas. Marca productos con una etiqueta (2x1, oferta) en el admin.</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {offers.map((p, i) => {
              const st = OFFER_STYLES[i % OFFER_STYLES.length];
              const disc = p.old_price && p.price ? Math.round((1 - p.price / p.old_price) * 100) : null;
              return (
                <article key={p.id} className="relative flex min-h-[330px] flex-col overflow-hidden rounded-[22px] p-6" style={{background: st.card, color: st.text}}>
                  <span className="absolute -right-9 top-5 rotate-45 px-10 py-1 text-center text-xs font-bold" style={{background: st.ribbon, color: st.ribbonText}}>
                    {disc ? `-${disc}%` : p.tag}
                  </span>
                  <div className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.14em]" style={{color: st.sub}}>
                    {p.is_new ? 'Nuevo' : p.featured ? 'Oferta estrella' : 'Oferta'}
                    {p.rating != null && (
                      <span className="inline-flex items-center gap-0.5" style={{color: st.text}}>
                        <Star className="size-3 fill-current" /> {p.rating}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 max-w-[7em] font-eight text-3xl leading-[0.95]">{tx(p.name, locale)}</h3>
                  {p.description && <p className="mt-2 line-clamp-2 max-w-[14em] text-sm" style={{color: st.sub}}>{tx(p.description, locale)}</p>}
                  <Link href={`/carta/hamburgueseria/${p.slug}`} className="mt-auto inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold" style={{background: st.btn, color: st.btnText}}>
                    Ver la oferta <ArrowRight className="size-4" />
                  </Link>
                  <div className="mt-3 flex items-end gap-2 font-eight text-2xl">
                    {p.price != null && <span>{euro(p.price, locale)}</span>}
                    {p.old_price != null && <span className="text-base line-through opacity-60">{euro(p.old_price, locale)}</span>}
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
