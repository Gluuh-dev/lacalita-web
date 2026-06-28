import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {UtensilsCrossed, MapPin, Star, Heart, ArrowRight} from 'lucide-react';
import {tx, euro} from '@/lib/localize';
import type {Menu, Allergen, Product, BurgerSlide, BurgerOffer} from '@/lib/queries';
import BurgerHero from './burger-hero';
import BurgerCategoryCarousel from './burger-category-carousel';
import BurgerOfferCarousel from './burger-offer-carousel';
import SnapCarousel from './snap-carousel';
import VoteButton from './vote-button';
import AllergenIcon from '@/components/allergen-icon';
import BurgerData from './burger-data';
import type {MenuItem} from '@/components/menu/store';

// ---- Tema oscuro de la hamburguesería (colores independientes del DS claro) ----
const C = {
  bg: '#fdfbf7',
  ink: '#2a1713',
  muted: 'rgba(42,23,19,.6)',
  orange: '#c36148',
  orangeHi: '#d67a63',
  gold: '#d67a63'
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


export default function BurgerLanding({menu, allergens, slides, offers, locale}: {menu: Menu | null; allergens: Allergen[]; slides: BurgerSlide[]; offers: BurgerOffer[]; locale: string}) {
  const products: Product[] = (menu?.categories ?? []).flatMap((c) => c.products ?? []).filter((p) => p.available);
  const videos: MenuItem[] = products
    .filter((p) => p.video)
    .map((p) => ({
      id: p.id,
      name: tx(p.name, locale),
      price: p.price != null ? Number(p.price) : null,
      image: p.image ?? null,
      slug: p.slug,
      menuSlug: menu?.slug ?? 'hamburgueseria',
      video: p.video,
      desc: p.description ? tx(p.description, locale) : undefined,
      ingredients: p.ingredients ?? [],
      allergens: (p.product_allergens ?? [])
        .map((pa) => pa.allergens)
        .filter((a): a is NonNullable<typeof a> => !!a)
        .map((a) => ({code: a.code, icon: a.icon, name: a.name}))
    }));
  const favorites = [...products].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0)).filter((p) => p.featured || (p.votes ?? 0) > 0).slice(0, 3);
  // Hero: diapositivas configuradas en el admin; si no hay, derivar de productos nuevos/destacados.
  const fromSlides = slides.map((s) => ({image: s.image, name: tx(s.title, locale), price: s.price, eyebrow: tx(s.eyebrow, locale), font: s.title_font, color: s.title_color, behind: s.title_behind, bgEffect: s.bg_effect, bgImage: s.bg_image, titleScale: s.title_scale, eyebrowScale: s.eyebrow_scale, priceScale: s.price_scale, showRings: s.show_rings, overlayFx: s.overlay_fx, gradient: s.title_gradient, fxSparks: s.fx_sparks, fxSmoke: s.fx_smoke, priceFont: s.price_font, priceColor: s.price_color, priceGradient: s.price_gradient, titleY: s.title_y, priceY: s.price_y, fxVideo: s.fx_video, fxVideoBehind: s.fx_video_behind, fxVideoX: s.fx_video_x, fxVideoY: s.fx_video_y, fxVideoScale: s.fx_video_scale, bgColor: s.bg_color, textShadow: s.text_shadow, titleOutline: s.title_outline, priceOutline: s.price_outline, hideTitle: s.hide_title, hidePrice: s.hide_price, accentColor: s.accent_color, buttonColor: s.button_color, textColor: s.text_color, navColor: s.nav_color, edgeColors: s.edge_colors, edgePoints: s.edge_points, mediaY: s.media_y}));
  const heroPool = (products.filter((p) => p.is_new || p.featured).length ? products.filter((p) => p.is_new || p.featured) : products).slice(0, 6);
  const heroSlides = fromSlides.length ? fromSlides : heroPool.map((p) => ({image: p.image, name: tx(p.name, locale), price: p.price, eyebrow: p.is_new ? 'Nuevo' : p.tag || 'De siempre'}));
  const hero = heroSlides.length ? heroSlides : [{image: null, name: 'La Calita Burger', price: null, eyebrow: 'Próximamente'}];

  return (
    <main style={{background: C.bg, color: C.ink}} className="min-h-screen font-sans">
      {/* ---- Cabecera (responsive) ---- */}

      {/* ---- Hero (slider de hamburguesas nuevas) ---- */}
      <BurgerHero slides={hero} locale={locale} />

      {/* ---- Marquesina (banda naranja inclinada, igual que la referencia) ---- */}
      <div
        className="relative z-[10] overflow-hidden"
        style={{background: C.orange, padding: '0.65rem 0', transform: 'rotate(-2.2deg)', width: '112%', marginLeft: '-6%', marginTop: '-30px', marginBottom: '-10px', boxShadow: '0 12px 30px rgba(0,0,0,.4)'}}
      >
        <div className="lc-mq" style={{animationDuration: '18s'}}>
          {[0, 1].map((k) => (
            <span key={k} className="whitespace-nowrap font-eight uppercase" style={{fontSize: '1.35rem', color: '#fdfbf7', letterSpacing: '0.06em', paddingRight: 14}}>
              {'smash · juicy · crispy · '.repeat(8)}
            </span>
          ))}
        </div>
      </div>

      {/* ---- Carrusel de categorías ("Nuestra carta") ---- */}
      <BurgerCategoryCarousel
        categories={(menu?.categories ?? []).filter((c) => c.visible !== false && ((c.products?.length ?? 0) > 0 || !!c.image))}
        locale={locale}
      />

      {/* ---- Ofertas ---- */}
      <BurgerOfferCarousel offers={offers} locale={locale} />

      {/* ---- Favoritas de la gente ---- */}
      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-6">
          <div className="flex items-center gap-2 font-adam text-[0.7rem] uppercase tracking-[0.2em]" style={{color: C.orange}}>
            <Heart className="size-3.5 fill-current" /> Las más votadas
          </div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-eight text-4xl text-[#2a1713] md:text-5xl">favoritas de la gente</h2>
            <Link href="/burguer/carta" className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em]" style={{borderColor: C.orange, color: C.orange}}>
              Ir a la carta <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
        {favorites.length === 0 ? (
          <p style={{color: C.muted}}>Marca productos como destacados (o con votos) para que salgan aquí.</p>
        ) : (
          <SnapCarousel itemClass="w-[80vw] max-w-[320px]" mdCols="md:grid-cols-3">
            {favorites.map((p, i) => (
              <Link key={p.id} href={`/burguer/carta/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-black/5 bg-white shadow-sm transition hover:shadow-md">
                <div className="lc-img-loading relative aspect-[4/3] overflow-hidden">
                  {p.image ? (
                    <Image src={p.image} alt={tx(p.name, locale)} fill sizes="(min-width:1024px) 22rem, 90vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#f3e7da] text-black/15"><UtensilsCrossed className="size-10" /></div>
                  )}
                  {i === 0 && p.featured && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.62rem] font-bold uppercase shadow-sm" style={{background: C.gold, color: '#1a1209'}}>
                      <Star className="size-3 fill-current" /> Favorita
                    </span>
                  )}
                  <div className="absolute right-3 top-3">
                    <VoteButton id={p.id} votes={p.votes ?? 0} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-eight text-xl leading-tight text-[#2a1713]">{tx(p.name, locale)}</h3>
                    {p.price != null && <span className="shrink-0 font-eight text-lg" style={{color: C.orange}}>{euro(p.price, locale)}</span>}
                  </div>
                  {p.description && <p className="mt-1 line-clamp-2 text-sm" style={{color: C.muted}}>{tx(p.description, locale)}</p>}
                  {p.product_allergens?.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
                      {p.product_allergens.map(
                        (pa) =>
                          pa.allergens && (
                            <span key={pa.allergens.code} className="flex size-7 items-center justify-center rounded-full bg-[#f3e7da]" title={tx(pa.allergens.name, locale)}>
                              <AllergenIcon src={pa.allergens.icon} label={tx(pa.allergens.name, locale)} size={18} />
                            </span>
                          )
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </SnapCarousel>
        )}
      </section>

      {/* ---- Alérgenos + local ---- */}
      <section id="local" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-12">
        <div className="rounded-[22px] border border-black/5 p-6 shadow-sm" style={{background: 'linear-gradient(180deg,#ffffff,#fbf2ef)'}}>
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
          <a href="https://maps.google.com/?q=La+Calita+Salobre%C3%B1a" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#c36148] px-5 py-2.5 font-semibold text-[#c36148] transition hover:bg-[#c36148]/10">
            <MapPin className="size-4" /> Cómo llegar
          </a>
        </div>
      </section>
      <div className="h-16 md:hidden" />
      <BurgerData videos={videos} />
    </main>
  );
}
