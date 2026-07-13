import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {MapPin, Star, Heart, ArrowRight} from 'lucide-react';
import {tx, euro} from '@/lib/localize';
import type {Menu, Allergen, Product, Category, BurgerSlide, BurgerOffer} from '@/lib/queries';
import BurgerHero from './burger-hero';
import BurgerCategoryCarousel from './burger-category-carousel';
import BurgerOfferCarousel from './burger-offer-carousel';
import SnapCarousel from './snap-carousel';
import VoteButton from './vote-button';
import AllergenIcon from '@/components/allergen-icon';
import BurgerData from './burger-data';
import MaskIcon from '@/components/menu/mask-icon';
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


export default async function BurgerLanding({menu, allergens, slides, offers, locale}: {menu: Menu | null; allergens: Allergen[]; slides: BurgerSlide[]; offers: BurgerOffer[]; locale: string}) {
  const t = await getTranslations();
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
  // Bloques de portada: salen de las categorías que ya existen (nada nuevo en BD).
  const cats = menu?.categories ?? [];
  const catBy = (re: RegExp) => cats.find((c) => re.test(tx(c.name, 'es').toLowerCase()));
  const top = (c?: Category) =>
    [...(c?.products ?? [])]
      .filter((p) => p.available)
      .sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0) || a.position - b.position)
      .slice(0, 8);
  const burgers = top(catBy(/hamburg|burger|smash/));
  const wings = top(catBy(/wing|alita|pollo|chicken/));
  const sauces = (cats.find((c) => c.role === 'carousel')?.products ?? []).filter((p) => p.available);
  const combo = cats.find((c) => c.combo_price != null)?.combo_price ?? null;
  // Hero: diapositivas configuradas en el admin; si no hay, derivar de productos nuevos/destacados.
  const fromSlides = slides.map((s) => ({image: s.image, name: tx(s.title, locale), price: s.price, eyebrow: tx(s.eyebrow, locale), font: s.title_font, color: s.title_color, behind: s.title_behind, bgEffect: s.bg_effect, bgImage: s.bg_image, titleScale: s.title_scale, eyebrowScale: s.eyebrow_scale, priceScale: s.price_scale, showRings: s.show_rings, overlayFx: s.overlay_fx, gradient: s.title_gradient, fxSparks: s.fx_sparks, fxSmoke: s.fx_smoke, priceFont: s.price_font, priceColor: s.price_color, priceGradient: s.price_gradient, titleY: s.title_y, priceY: s.price_y, fxVideo: s.fx_video, fxVideoBehind: s.fx_video_behind, fxVideoX: s.fx_video_x, fxVideoY: s.fx_video_y, fxVideoScale: s.fx_video_scale, bgColor: s.bg_color, textShadow: s.text_shadow, titleOutline: s.title_outline, priceOutline: s.price_outline, hideTitle: s.hide_title, hidePrice: s.hide_price, accentColor: s.accent_color, buttonColor: s.button_color, textColor: s.text_color, navColor: s.nav_color, edgeColors: s.edge_colors, edgePoints: s.edge_points, mediaY: s.media_y}));
  const heroPool = (products.filter((p) => p.is_new || p.featured).length ? products.filter((p) => p.is_new || p.featured) : products).slice(0, 6);
  const heroSlides = fromSlides.length ? fromSlides : heroPool.map((p) => ({image: p.image, name: tx(p.name, locale), price: p.price, eyebrow: p.is_new ? t('burger.newBadge') : p.tag || t('burger.classic')}));
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
              {t('burger.ticker').repeat(4)}
            </span>
          ))}
        </div>
      </div>

      {/* ---- Carrusel de categorías ("Nuestra carta") ---- */}
      <BurgerCategoryCarousel
        categories={(menu?.categories ?? []).filter((c) => c.visible !== false && ((c.products?.length ?? 0) > 0 || !!c.image))}
        locale={locale}
      />

      {/* ---- Nuestras smash ---- */}
      <Rail eyebrow={t('burger.burgersEyebrow')} title={t('burger.burgersTitle')} cta={t('burger.seeAll')} products={burgers} locale={locale} />

      {/* ---- Hazlo menú: el combo solo se veía dentro de cada hamburguesa ---- */}
      {combo != null && (
        <section className="mx-auto max-w-7xl px-5 py-8">
          {/* En móvil se apila: el icono y el precio arriba, el texto debajo. */}
          <Link
            href="/burguer/carta"
            className="flex flex-col gap-4 rounded-[26px] border-2 border-dashed p-5 transition hover:bg-white sm:flex-row sm:items-center sm:gap-6 sm:p-6"
            style={{borderColor: C.orange, background: 'linear-gradient(180deg,#ffffff,#fbf2ef)'}}
          >
            <div className="flex items-center justify-between gap-4 sm:contents">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full sm:size-20" style={{background: C.orange, color: '#fdfbf7'}}>
                <MaskIcon src="/iconos/menu.svg" className="size-8 sm:size-11" />
              </span>
              <span className="shrink-0 rounded-full px-4 py-2 font-eight text-lg sm:order-last sm:text-xl" style={{background: C.orange, color: '#fdfbf7'}}>
                +{euro(Number(combo), locale)}
              </span>
            </div>
            <span className="min-w-0 flex-1">
              <span className="block font-adam text-[0.7rem] uppercase tracking-[0.2em]" style={{color: C.orange}}>{t('burger.comboEyebrow')}</span>
              <span className="mt-1 block font-eight text-xl leading-tight sm:text-2xl" style={{color: C.ink}}>{t('burger.comboTitle')}</span>
              <span className="mt-1 block text-sm" style={{color: C.muted}}>{t('burger.comboText')}</span>
            </span>
          </Link>
        </section>
      )}

      {/* ---- Nuestras salsas: los tarros, a todo el ancho ---- */}
      {sauces.length > 0 && (
        <section className="py-8">
          <div className="mx-auto mb-5 max-w-7xl px-5">
            <div className="font-adam text-[0.7rem] uppercase tracking-[0.2em]" style={{color: C.orange}}>{t('burger.saucesEyebrow')}</div>
            <h2 className="font-eight text-3xl md:text-4xl" style={{color: C.ink}}>{t('burger.saucesTitle')}</h2>
            <p className="mt-1 text-sm" style={{color: C.muted}}>{t('burger.saucesSub')}</p>
          </div>
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="mx-auto flex w-max gap-4">
              {sauces.map((p) => (
                <Link
                  key={p.id}
                  href={`/burguer/carta/${p.slug}`}
                  className="group flex w-[8.5rem] shrink-0 snap-start flex-col items-center gap-2 rounded-[22px] border border-black/5 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <span className="lc-img-loading relative flex size-24 items-center justify-center overflow-hidden rounded-full" style={{background: '#f6ece4'}}>
                    {p.image && <Image src={p.image} alt={tx(p.name, locale)} fill sizes="96px" className="object-contain transition duration-300 group-hover:scale-110" />}
                  </span>
                  <span className="line-clamp-2 text-center text-sm font-semibold leading-tight" style={{color: C.ink}}>{tx(p.name, locale)}</span>
                  {p.price != null && <span className="font-eight text-sm" style={{color: C.orange}}>{euro(Number(p.price), locale)}</span>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- Chicken wings ---- */}
      <Rail eyebrow={t('burger.wingsEyebrow')} title={t('burger.wingsTitle')} cta={t('burger.seeAll')} products={wings} locale={locale} />

      {/* ---- Ofertas ---- */}
      <BurgerOfferCarousel offers={offers} locale={locale} />

      {/* ---- Favoritas de la gente ---- */}
      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-6">
          <div className="flex items-center gap-2 font-adam text-[0.7rem] uppercase tracking-[0.2em]" style={{color: C.orange}}>
            <Heart className="size-3.5 fill-current" /> {t('burger.topVoted')}
          </div>
          <h2 className="font-eight text-3xl text-[#2a1713] md:text-4xl">{t('burger.topVotedSub')}</h2>
        </div>
        {favorites.length === 0 ? (
          // Lo lee el visitante, no el admin: nada de instrucciones internas.
          <p style={{color: C.muted}}>{t('burger.comingFavs')}</p>
        ) : (
          <SnapCarousel itemClass="w-[80vw] max-w-[320px]" mdItemClass="md:w-[320px]">
            {[
              ...favorites.map((p, i) => (
              <Link key={p.id} href={`/burguer/carta/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-black/5 bg-white shadow-sm transition hover:shadow-md">
                <div className="lc-img-loading relative aspect-[4/3] overflow-hidden">
                  {p.image && (
                    <Image src={p.image} alt={tx(p.name, locale)} fill sizes="(min-width:1024px) 22rem, 90vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  )}
                  {i === 0 && p.featured && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.62rem] font-bold uppercase shadow-sm" style={{background: C.gold, color: '#1a1209'}}>
                      <Star className="size-3 fill-current" /> {t('burger.favorite')}
                    </span>
                  )}
                  <div className="absolute right-3 top-3">
                    <VoteButton item={{id: p.id, name: tx(p.name, locale), price: p.price != null ? Number(p.price) : null, image: p.image ?? null, slug: p.slug, menuSlug: 'hamburgueseria'}} votes={p.votes ?? 0} className="shadow-sm backdrop-blur" />
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
              )),
              <SeeAllCard key="all" label={t('burger.goMenu')} />
            ]}
          </SnapCarousel>
        )}
      </section>

      {/* ---- Alérgenos + local ---- */}
      <section id="local" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-12">
        <div className="rounded-[22px] border border-black/5 p-6 shadow-sm" style={{background: 'linear-gradient(180deg,#ffffff,#fbf2ef)'}}>
          <div className="mb-5 font-adam text-[0.7rem] uppercase tracking-[0.2em]" style={{color: C.orange}}>{t('burger.allergensNote')}</div>
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
            <MapPin className="size-4" /> {t('info.location')}
          </a>
        </div>
      </section>
      <div className="h-16 md:hidden" />
      <BurgerData videos={videos} />
    </main>
  );
}

// Carrusel de una categoría en portada (smash, alitas...): los más votados
// primero, con el corazón que vota y guarda. Sin foto se ve el marco: se
// encenderá solo en cuanto se suban las imágenes desde el admin.
function Rail({eyebrow, title, cta, products, locale}: {eyebrow: string; title: string; cta: string; products: Product[]; locale: string}) {
  if (!products.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-5 py-8">
      <div className="mb-5">
        <div className="font-adam text-[0.7rem] uppercase tracking-[0.2em]" style={{color: C.orange}}>{eyebrow}</div>
        <h2 className="font-eight text-3xl md:text-4xl" style={{color: C.ink}}>{title}</h2>
      </div>
      <SnapCarousel itemClass="w-[70vw] max-w-[260px]" mdItemClass="md:w-[260px]">
        {[
          ...products.map((p) => (
          <Link key={p.id} href={`/burguer/carta/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-black/5 bg-white shadow-sm transition hover:shadow-md">
            <div className="lc-img-loading relative aspect-[4/3] overflow-hidden">
              {p.image && (
                <Image src={p.image} alt={tx(p.name, locale)} fill sizes="(min-width:1024px) 16rem, 70vw" className="object-cover transition duration-500 group-hover:scale-105" />
              )}
              <div className="absolute right-3 top-3">
                <VoteButton
                  item={{id: p.id, name: tx(p.name, locale), price: p.price != null ? Number(p.price) : null, image: p.image ?? null, slug: p.slug, menuSlug: 'hamburgueseria'}}
                  votes={p.votes ?? 0}
                  className="shadow-sm backdrop-blur"
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-1 p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-eight text-lg leading-tight" style={{color: C.ink}}>{tx(p.name, locale)}</h3>
                {p.price != null ? (
                  <span className="shrink-0 font-eight" style={{color: C.orange}}>{euro(Number(p.price), locale)}</span>
                ) : (p.product_variants?.length ?? 0) > 0 ? (
                  <span className="shrink-0 whitespace-nowrap text-xs font-semibold" style={{color: C.orange}}>
                    {euro(Math.min(...p.product_variants!.map((v) => Number(v.price))), locale)}
                  </span>
                ) : null}
              </div>
              {p.description && <p className="line-clamp-2 text-sm" style={{color: C.muted}}>{tx(p.description, locale)}</p>}
              </div>
            </Link>
          )),
          <SeeAllCard key="all" label={cta} />
        ]}
      </SnapCarousel>
    </section>
  );
}

// Última tarjeta del carrusel: lleva a la carta (antes era un botón suelto).
function SeeAllCard({label}: {label: string}) {
  return (
    <Link
      href="/burguer/carta"
      className="group flex h-full flex-col items-center justify-center gap-3 rounded-[22px] border-2 border-dashed p-6 text-center transition hover:bg-white"
      style={{borderColor: C.orange, color: C.orange}}
    >
      <span className="flex size-12 items-center justify-center rounded-full transition group-hover:scale-110" style={{background: C.orange, color: '#fdfbf7'}}>
        <ArrowRight className="size-5" />
      </span>
      <span className="font-eight text-lg leading-tight">{label}</span>
    </Link>
  );
}
