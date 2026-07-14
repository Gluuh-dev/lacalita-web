import Image from 'next/image';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Coffee, UtensilsCrossed, Sandwich, Martini, ArrowRight, Clock, AlertTriangle, MapPin, Phone, Waves, Quote, Star} from 'lucide-react';
import {IconBrandInstagram, IconBrandFacebook, IconCoffee, IconToolsKitchen2, IconGlassCocktail, IconBurger} from '@tabler/icons-react';
import MapCard from '@/components/map-card';
import MenuCard, {FONDOS} from '@/components/menu-card';
import {Link} from '@/i18n/navigation';
import {getSettings, getUpcomingEvents, getMenus, getFeaturedProducts, DEFAULT_HERO_SLIDE, getGalleryAlbums} from '@/lib/queries';
import type {HeroSlide} from '@/lib/queries';
import {DEFAULT_CONTENT} from '@/lib/content-types';
import {tx, euro} from '@/lib/localize';
import {toHeroEvents} from '@/lib/hero';
import {normalizeHours, formatRanges} from '@/lib/hours';
import {SITE_URL, altLanguages} from '@/lib/site';
import EventCard from '@/components/event-card';
import SnapCarousel from '@/components/burger/snap-carousel';
import Hero from '@/components/hero';
import Reveal from '@/components/reveal';
import Watermark from '@/components/watermark';
import OpenStatus from '@/components/open-status';

export const revalidate = 300;

export function generateMetadata() {
  return {alternates: altLanguages('')};
}

export default async function Home({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const [settings, events, menus, featured, albums] = await Promise.all([
    getSettings(),
    getUpcomingEvents(6),
    getMenus(),
    getFeaturedProducts(5),
    getGalleryAlbums()
  ]);

  const intro = settings?.landing ? tx(settings.landing, locale) : t('home.intro');
  const hours = normalizeHours(settings?.hours);

  const content = settings?.content ?? {};
  const about = {...DEFAULT_CONTENT.about, ...content.about};
  const story = {...DEFAULT_CONTENT.story, ...content.story};
  const reviews = content.reviews ?? [];
  // La galería sale de los álbumes (antes leía un campo de ajustes que nadie
  // rellenaba, así que las 28 fotos subidas no se veían en la portada).
  const gallery = albums.flatMap((a) => a.images ?? []).slice(0, 7);

  const heroEvents = toHeroEvents(events, locale);
  // Todas las diapositivas activas del admin (incluidas las de tipo 'poster').
  const activeHero = (settings?.hero ?? []).filter((s) => s.active !== false);
  const baseSlides: HeroSlide[] = activeHero.length
    ? activeHero
    : [
        {
          ...DEFAULT_HERO_SLIDE,
          id: 'default',
          media: settings?.hero_video || settings?.hero_image || '',
          mediaType: settings?.hero_video ? 'video' : 'image',
          eyebrow: 'Beach Club · Salobreña',
          lema: t('home.tagline'),
          bienvenida: intro,
          button: t('home.cta'),
          link: '/carta',
          heroMode: 'boton'
        }
      ];
  // Los eventos NO generan diapositivas: el hero son las del admin. Los próximos
  // eventos se ven en la agenda del hero, y desde ahí se entra a cada evento.
  const heroSlides: HeroSlide[] = baseSlides;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'La Calita Beach Club',
    servesCuisine: 'Mediterránea',
    priceRange: '€€',
    url: SITE_URL,
    telephone: settings?.phone || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings?.address || 'C. Pº Marítimo, s/n',
      addressLocality: 'Salobreña',
      addressRegion: 'Granada',
      postalCode: '18680',
      addressCountry: 'ES'
    },
    sameAs: [settings?.social?.instagram, settings?.social?.facebook].filter(Boolean),
    image: settings?.hero_image ? [settings.hero_image] : undefined,
    hasMenu: `${SITE_URL}/carta`,
    acceptsReservations: false,
    ...(reviews.length
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: (reviews.reduce((s, r) => s + (r.rating ?? 5), 0) / reviews.length).toFixed(1),
            reviewCount: reviews.length,
            bestRating: 5
          },
          review: reviews.map((r) => ({
            '@type': 'Review',
            reviewRating: {'@type': 'Rating', ratingValue: r.rating ?? 5, bestRating: 5},
            author: {'@type': 'Person', name: r.author},
            reviewBody: r.quote
          }))
        }
      : {})
  };

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
      <Hero slides={heroSlides} events={heroEvents} />

      {/* Sobre el sitio */}
      <Reveal>
        <section className="mx-auto max-w-4xl px-4 py-10 text-center sm:py-12">
          <div className="eyebrow mb-3">{t('home.welcome')}</div>
          <h2 className="font-serif text-3xl sm:text-4xl">{tx(about.title ?? {}, locale)}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-ink-2">{tx(about.text ?? {}, locale)}</p>
          <span
            aria-hidden
            className="mx-auto mt-8 block h-32 sm:h-40"
            style={{
              aspectRatio: '281.53 / 312.4',
              backgroundColor: '#E9AE74',
              WebkitMaskImage: 'url(/brand/ornament.svg)',
              maskImage: 'url(/brand/ornament.svg)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskPosition: 'center',
              maskPosition: 'center'
            }}
          />
        </section>
      </Reveal>

      {/* Manifesto */}
      <Reveal>
        <section className="relative overflow-hidden bg-[#15110b] py-16 text-white sm:py-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/manifesto.svg" alt="" aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-full w-auto max-w-none -translate-x-1/2 -translate-y-1/2 select-none object-cover opacity-[0.18]" />
          <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
            <Waves className="mx-auto mb-8 size-9 text-brand" strokeWidth={2.2} />
            <blockquote className="font-serif text-[clamp(1.8rem,5.6vw,3.25rem)] font-bold italic leading-[1.15]">
              “{t.rich('home.manifestoQuote', {brand: (chunks) => <span className="text-brand">{chunks}</span>})}”
            </blockquote>
            <div className="mt-10 flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-white/25" />
              <span className="font-adam text-[0.62rem] uppercase tracking-[0.28em] text-white/45">{t('home.manifestoLabel')}</span>
              <span className="h-px w-10 bg-white/25" />
            </div>
          </div>
        </section>
      </Reveal>

      {/* Cartas */}
      <Reveal>
        <section id="carta" className="scroll-mt-20 py-10 sm:py-12">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHead eyebrow={t('home.kitchenEyebrow')} title={t('home.kitchenTitle')} sub={t('home.kitchenSub')} bg="Sabores" />
            <div className="-mx-4 md:mx-0 xl:-mx-20">
            <SnapCarousel itemClass="w-[80vw] max-w-[300px]" mdItemClass="md:w-[300px]" accent="#c98a4e" ink="#4c2f08" controls={false}>
            {menus.map((m) => (
              <MenuCard key={m.id} menu={m} locale={locale} cta={t('common.seeMenu')} />
            ))}
            </SnapCarousel>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Platos destacados */}
      {featured.length > 0 && (
        <Reveal>
          <section className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
            <SectionHead eyebrow={t('home.featuredEyebrow')} title={t('home.featuredTitle')} sub={t('home.featuredSub')} bg="Platos" />
            <div className="-mx-4 md:mx-0 xl:-mx-20">
            <SnapCarousel itemClass="w-[72vw] max-w-[270px]" mdItemClass="md:w-[270px]" accent="#c98a4e" ink="#4c2f08">
              {[
                ...featured.map((p) => (
                <Link
                  key={p.id}
                  href={`/carta/${p.categories?.menus?.slug ?? 'restaurante'}/${p.slug}`}
                  className="lc-img-loading ds-card--link group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[24px] p-4 text-white shadow-md"
                >
                  {(() => {
                    const bg = p.image || FONDOS[p.categories?.menus?.slug ?? ''];
                    return bg ? (
                      <Image src={bg} alt={tx(p.name, locale)} fill sizes="(max-width:768px) 64vw, 260px" className="object-cover transition duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-brand to-brand-deep" />
                    );
                  })()}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />
                  <div className="relative z-10">
                    <h3 className="font-serif text-xl leading-tight">{tx(p.name, locale)}</h3>
                    {p.price != null && <span className="mt-1 block font-bold tabular-nums text-white/95">{euro(Number(p.price), locale)}</span>}
                  </div>
                </Link>
                )),
                // Última tarjeta: a la carta (antes era un enlace suelto arriba).
                <Link
                  key="all"
                  href="/carta"
                  className="group flex aspect-[3/4] flex-col items-center justify-center gap-3 rounded-[24px] border-2 border-dashed border-brand/50 p-6 text-center text-brand-deep transition hover:bg-surface"
                >
                  <span className="flex size-12 items-center justify-center rounded-full bg-brand text-on-primary transition group-hover:scale-110">
                    <ArrowRight className="size-5" />
                  </span>
                  <span className="font-serif text-xl leading-tight">{t('common.seeMenu')}</span>
                </Link>
              ]}
            </SnapCarousel>
            </div>
          </section>
        </Reveal>
      )}

      {/* Eventos */}
      {events.length > 0 && (
        <Reveal>
          <section id="eventos" className="scroll-mt-20 bg-surface-2">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
              <SectionHead eyebrow={t('events.upcoming')} title={t('home.eventsTitle')} sub={t('home.eventsSub')} bg="Eventos" />
              <div className="-mx-4 md:mx-0 xl:-mx-20">
              <SnapCarousel itemClass="w-[74vw] max-w-[300px]" mdItemClass="md:w-[300px]" accent="#c98a4e" ink="#4c2f08">
                {[
                  ...events.slice(0, 4).map((e) => <EventCard key={e.id} event={e} locale={locale} layout="tile" />),
                  // Última card: la puerta a la agenda completa (sustituye al enlace de arriba).
                  <Link
                    key="ver-todos"
                    href="/eventos"
                    className="ds-card--link group flex aspect-[3/4] flex-col items-center justify-center gap-4 rounded-[20px] border border-line bg-surface text-center shadow-sm"
                  >
                    <span className="flex size-16 items-center justify-center rounded-full bg-brand/10 text-brand-deep transition group-hover:bg-brand group-hover:text-on-primary">
                      <ArrowRight className="size-7 transition-transform group-hover:translate-x-0.5" />
                    </span>
                    <span className="px-6 font-serif text-2xl font-bold leading-tight text-ink">{t('events.all')}</span>
                    <span className="font-montserrat text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink-3">{t('home.fullAgenda')}</span>
                  </Link>
                ]}
              </SnapCarousel>
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {/* Historia */}
      <Reveal>
        <section className="bg-surface-2">
          <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:py-12">
            <div className="eyebrow mb-3">La Calita</div>
            <h2 className="font-serif text-3xl sm:text-4xl">{tx(story.title ?? {}, locale)}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-ink-2">{tx(story.text ?? {}, locale)}</p>
          </div>
        </section>
      </Reveal>

      {/* Reseñas */}
      {reviews.length > 0 && (
        <Reveal>
          <section className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
            <SectionHead eyebrow={t('home.reviewsEyebrow')} title={t('home.reviewsTitle')} />
            <div className="grid gap-5 md:grid-cols-3">
              {reviews.map((r, idx) => (
                <figure key={idx} className="rounded-[20px] border border-line bg-surface p-6 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {Array.from({length: 5}).map((_, s) => (
                        <Star key={s} className={`size-4 ${(r.rating ?? 5) > s ? 'fill-amber-400 text-amber-400' : 'text-line-strong'}`} />
                      ))}
                    </div>
                    <Quote className="size-5 text-brand/60" />
                  </div>
                  <blockquote className="leading-relaxed text-ink-2">{r.quote}</blockquote>
                  <figcaption className="mt-4 font-semibold text-brand-deep">— {r.author}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* Galería */}
      {gallery.length > 0 && (
        <Reveal>
          <section id="galeria" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10 sm:py-12">
            <SectionHead eyebrow={t('home.galleryEyebrow')} title={t('home.galleryTitle')} sub={t('home.gallerySub')} bg="Galería" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {gallery.map((url, idx) => (
                <div key={idx} className="lc-img-loading ds-media-zoom relative aspect-square overflow-hidden rounded-[16px] border border-line">
                  <Image src={url} alt="" fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px" className="object-cover" />
                </div>
              ))}
              {/* La última celda cierra la cuadrícula y lleva a la galería. */}
              <Link
                href="/galeria"
                className="flex aspect-square items-center justify-center rounded-[16px] border border-line bg-surface-sunken text-center font-adam text-[0.72rem] uppercase tracking-[0.14em] text-ink-2 transition hover:bg-brand hover:text-on-primary"
              >
                {t('common.seeMore')}
              </Link>
            </div>


          </section>
        </Reveal>
      )}

      {/* Reserva: el cierre de la portada, justo antes de la información de servicio. */}
      {settings?.phone && (
        <Reveal>
          <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-16 text-center text-white sm:py-20">
            {/* Atardecer: del terracota de la casa a la noche. */}
            <div
              className="absolute inset-0 -z-10"
              style={{background: 'radial-gradient(120% 100% at 30% 0%, #c98a4e 0%, #8a4f2c 35%, #3b2417 70%, #23150e 100%)'}}
            />
            <div className="mx-auto max-w-2xl px-5">
              <div className="eyebrow !text-white/70">{t('home.bookEyebrow')}</div>
              <h2 className="mt-2 font-serif text-[clamp(2rem,5vw,3.4rem)] font-bold leading-[1.1]">{t('home.bookTitle')}</h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">{t('home.bookText')}</p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`tel:${settings.phone}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#e2a869] px-6 py-3.5 font-semibold text-[#2a1713] transition hover:brightness-105"
                >
                  <Phone className="size-4" /> {t('home.bookPhone')}
                </a>
                <a
                  href={`https://wa.me/${settings.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
                >
                  WhatsApp <ArrowRight className="size-4" />
                </a>
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {/* Ubicación */}
      <Reveal>
        <section id="info" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10 sm:py-12">
          <SectionHead eyebrow={t('home.locationEyebrow')} title={t('home.locationTitle')} />
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            {/* Horario */}
            <div className="rounded-[20px] border border-line bg-surface p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="size-5 text-brand-deep" />
                  <h3 className="font-serif text-xl">{t('info.hours')}</h3>
                </div>
                <OpenStatus hours={hours} />
              </div>
              {hours.notice && (
                <div className="mb-4 flex items-start gap-2 rounded-[14px] bg-amber-50 px-3 py-2.5 text-sm font-medium text-amber-700">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  {hours.notice}
                </div>
              )}
              <ul className="flex flex-col">
                {hours.rows.map((row, i) => (
                  <li key={i} className="flex items-center justify-between gap-4 rounded-lg px-2 py-2 text-sm">
                    <span className="font-medium text-ink">{row.label}</span>
                    <span className="tabular-nums text-ink-2">{row.closed ? t('home.closed') : formatRanges(row)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mapa + contacto */}
            <div className="flex flex-col gap-5">
              <MapCard href={settings?.maps_url} label={t('info.directions')} className="min-h-[280px]" />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {settings?.phone && (
                  <a href={`tel:${settings.phone}`} className="flex min-w-0 items-center gap-3 rounded-[14px] border border-line bg-surface px-4 py-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-sunken text-brand-deep">
                      <Phone className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-adam text-[0.7rem] uppercase tracking-[0.1em] text-ink-3">{t('home.reservations')}</span>
                      <span className="block truncate font-semibold">{settings.phone}</span>
                    </span>
                  </a>
                )}
                <div className="flex min-w-0 items-center gap-3 rounded-[14px] border border-line bg-surface px-4 py-3">
                  <span className="min-w-0 flex-1">
                    <span className="block font-adam text-[0.7rem] uppercase tracking-[0.1em] text-ink-3">{t('info.follow')}</span>
                    <span className="block truncate font-semibold">@lacalitabeach</span>
                  </span>
                  <span className="flex shrink-0 gap-2">
                    {settings?.social?.instagram && (
                      <a href={settings.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="flex size-10 items-center justify-center rounded-lg bg-surface-sunken text-brand-deep transition hover:bg-brand hover:text-on-primary">
                        <IconBrandInstagram className="size-5" />
                      </a>
                    )}
                    {settings?.social?.facebook && (
                      <a href={settings.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="flex size-10 items-center justify-center rounded-lg bg-surface-sunken text-brand-deep transition hover:bg-brand hover:text-on-primary">
                        <IconBrandFacebook className="size-5" />
                      </a>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}


// Cabecera de sección: papel crema en degradado, palabra grabada de fondo,
// filigranas doradas en las esquinas, antesala espaciada y título con su punto.
function SectionHead({eyebrow, title, sub, bg, dark = false}: {eyebrow: string; title: string; sub?: string; bg?: string; dark?: boolean}) {
  const word = (bg ?? title).trim();
  return (
    <div className="relative left-1/2 mb-9 w-screen -translate-x-1/2 overflow-hidden py-[clamp(2rem,6vw,4.5rem)] text-center [isolation:isolate] sm:mb-11">
      <Watermark word={word} dark={dark} />

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <p
          className="mb-[clamp(0.4rem,1vw,0.9rem)] font-montserrat font-medium uppercase text-[clamp(0.8rem,1.5vw,1.15rem)] leading-none tracking-[0.42em] max-[520px]:tracking-[0.3em]"
          style={{color: dark ? 'rgba(255,255,255,.75)' : '#b0895a', paddingLeft: '0.42em'}}
        >
          {eyebrow}
        </p>
        <h2
          className="font-serif font-bold leading-[1.05] tracking-[-0.01em]"
          style={{
            color: dark ? '#fff' : '#23374f',
            // Los títulos largos (frases) no pueden ir al tamaño de una palabra suelta.
            fontSize: title.length > 14 ? 'clamp(2.3rem, 5.4vw, 4.1rem)' : 'clamp(3rem, 9vw, 7rem)'
          }}
        >
          {title}
          <span className="ml-[0.02em] inline-block size-[0.16em] -translate-y-[0.02em] rounded-full align-baseline bg-[#c06a44]" />
        </h2>
        {sub && (
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed sm:text-base" style={{color: dark ? 'rgba(255,255,255,.7)' : 'var(--ink-2)'}}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// CTA "ver todo" justo bajo la cabecera de sección: solo texto, sin flecha ni
// píldora. El -mt-6 lo mete dentro del mb-10 que deja SectionHead.
function MoreLink({href, label}: {href: string; label: string}) {
  return (
    <div className="-mt-6 mb-9 flex justify-center">
      <Link
        href={href}
        className="group relative inline-block py-1 text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-brand-deep transition-colors hover:text-ink"
      >
        {label}
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100" />
      </Link>
    </div>
  );
}
