import Image from 'next/image';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Coffee, UtensilsCrossed, Sandwich, Martini, ArrowRight, Clock, AlertTriangle, MapPin, Navigation, Phone, Waves, Quote, Star} from 'lucide-react';
import {IconBrandInstagram, IconBrandWhatsapp} from '@tabler/icons-react';
import MapCard from '@/components/map-card';
import SunsetBadge from '@/components/sunset-badge';
import MenuCard, {FONDOS} from '@/components/menu-card';
import {Link} from '@/i18n/navigation';
import {getSettings, getUpcomingEvents, getMenus, getFeaturedProducts, DEFAULT_HERO_SLIDE, getGalleryAlbums, getReviews} from '@/lib/queries';
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
import SectionHead from '@/components/section-head';
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
  const [settings, events, menus, featured, albums, reviews] = await Promise.all([
    getSettings(),
    getUpcomingEvents(6),
    getMenus(),
    getFeaturedProducts(5),
    getGalleryAlbums(),
    getReviews()
  ]);

  const intro = settings?.landing ? tx(settings.landing, locale) : t('home.intro');
  const hours = normalizeHours(settings?.hours);

  const content = settings?.content ?? {};
  const about = {...DEFAULT_CONTENT.about, ...content.about};
  const story = {...DEFAULT_CONTENT.story, ...content.story};
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
            reviewBody: r.text
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
            <SectionHead eyebrow={t('home.reviewsEyebrow')} title={t('home.reviewsTitle')} sub={t('home.reviewsSub')} bg="Opiniones" />
            <div className="grid gap-5 md:grid-cols-3">
              {reviews.map((r) => (
                <figure key={r.id} className="rounded-[20px] border border-line bg-surface p-6 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {Array.from({length: 5}).map((_, s) => (
                        <Star key={s} className={`size-4 ${(r.rating ?? 5) > s ? 'fill-amber-400 text-amber-400' : 'text-line-strong'}`} />
                      ))}
                    </div>
                    <Quote className="size-5 text-brand/60" />
                  </div>
                  <blockquote className="leading-relaxed text-ink-2">{r.text}</blockquote>
                  <figcaption className="mt-4 font-semibold text-brand-deep">
                    — {r.author}
                    {r.source && <span className="ml-1 font-normal text-ink-3">· {r.source}</span>}
                  </figcaption>
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

      {/* Dónde estamos: bloque oscuro con la tarjeta de datos y el plano al lado. */}
      <Reveal>
        <section
          id="info"
          className="relative left-1/2 w-screen -translate-x-1/2 scroll-mt-20 overflow-hidden pb-16 text-white sm:pb-20"
          style={{background: '#1a1512'}}
        >
          <SectionHead eyebrow={t('home.locationEyebrow')} title={t('home.locationTitle')} sub={t('home.locationSub')} bg="Ubicación" dark />

          <div className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-2 lg:items-stretch">
            {/* Datos del local */}
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
              <div className="font-adam text-[0.66rem] uppercase tracking-[0.2em] text-[#e2a869]">La Calita Beach Club</div>
              <h3 className="mt-2 font-serif text-2xl font-bold leading-tight sm:text-3xl">{settings?.address?.split(',')[0] ?? 'Paseo Marítimo'}, Salobreña</h3>
              {settings?.address && <p className="mt-1 text-sm text-white/55">{settings.address}</p>}

              <div className="mt-4">
                <OpenStatus hours={hours} dark />
              </div>

              {hours.notice && (
                <div className="mt-4 flex items-start gap-2 rounded-[14px] bg-amber-400/10 px-3 py-2.5 text-sm font-medium text-amber-300">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  {hours.notice}
                </div>
              )}

              <div className="mt-6 font-adam text-[0.62rem] uppercase tracking-[0.16em] text-white/40">{t('info.hours')}</div>
              <ul className="mt-2 flex flex-col gap-0.5">
                {hours.rows.map((row, i) => {
                  const hoy = isTodayRow(row.label);
                  return (
                    <li
                      key={i}
                      className={`flex items-center justify-between gap-4 rounded-[12px] px-3 py-2.5 text-sm ${hoy ? 'bg-[#e2a869]/10' : ''}`}
                    >
                      <span className="flex items-center gap-2 font-medium text-white/90">
                        {row.label}
                        {hoy && (
                          <span className="rounded-full bg-[#e2a869] px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-[#2a1713]">
                            {t('home.today')}
                          </span>
                        )}
                      </span>
                      <span className={`tabular-nums ${hoy ? 'font-semibold text-[#e2a869]' : 'text-white/55'}`}>
                        {row.closed ? t('home.closed') : formatRanges(row)}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <SunsetBadge label={t('home.bestMoment')} className="mt-5" />

              {settings?.maps_url && (
                <a
                  href={settings.maps_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#e2a869] px-6 py-3.5 font-semibold text-[#2a1713] transition hover:brightness-105"
                >
                  <MapPin className="size-4" /> {t('info.location')}
                </a>
              )}

              <div className="mt-3 grid grid-cols-3 gap-3">
                {settings?.phone && (
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex items-center justify-center gap-2 rounded-full border border-white/15 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
                  >
                    <Phone className="size-4" /> {t('home.call')}
                  </a>
                )}
                {settings?.phone && (
                  <a
                    href={`https://wa.me/${settings.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                    className="flex items-center justify-center rounded-full border border-white/15 py-3 text-white/90 transition hover:bg-white/10"
                  >
                    <IconBrandWhatsapp className="size-5" />
                  </a>
                )}
                {settings?.social?.instagram && (
                  <a
                    href={settings.social.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="flex items-center justify-center rounded-full border border-white/15 py-3 text-white/90 transition hover:bg-white/10"
                  >
                    <IconBrandInstagram className="size-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Mapa real de Google, sin las tarjetas que mete el embed: se centra en
                las coordenadas del local y encima van nuestro chip y el botón. */}
            <div className="relative min-h-[460px] overflow-hidden rounded-[22px] border border-white/10 shadow-xl">
              <iframe
                title="Mapa de La Calita en Salobreña"
                // Por nombre del negocio: así el pin cae en el local y no en mitad
                // de la calle (con la dirección genérica salía desviado).
                src="https://www.google.com/maps?q=La+Calita+Beach+Salobre%C3%B1a&z=17&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
                style={{filter: 'saturate(1.05)'}}
              />

              {/* Chip con la dirección */}
              <div className="absolute bottom-4 left-4 flex max-w-[80%] items-center gap-3 rounded-[16px] border border-white/10 bg-[rgba(20,15,8,0.72)] px-4 py-3 backdrop-blur-md">
                <MapPin className="size-5 shrink-0 text-[#e2a869]" />
                <div className="leading-tight">
                  <p className="text-[0.92rem] font-bold text-white">La Calita Beach Club</p>
                  <p className="text-[0.78rem] text-white/60">{settings?.address ?? 'C. Pº Marítimo, s/n · Salobreña'}</p>
                </div>
              </div>

              <a
                href={settings?.maps_url ?? 'https://maps.google.com/?q=La+Calita+Salobre%C3%B1a'}
                target="_blank"
                rel="noreferrer"
                className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-bg px-5 py-2.5 font-adam text-[0.7rem] uppercase tracking-[0.12em] text-ink shadow-md transition hover:brightness-105"
              >
                {t('info.directions')} <ArrowRight className="size-3.5" />
              </a>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}


// ¿Esta fila del horario ("Lunes a Viernes", "Sábado"…) incluye el día de hoy?
function isTodayRow(label: string): boolean {
  const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const s = label.toLowerCase().normalize('NFD').replace(new RegExp('[̀-ͯ]', 'g'), '');
  const hoy = new Date().getDay();
  const citados = dias.map((d, i) => (s.includes(d) ? i : -1)).filter((i) => i >= 0);
  // 'Lunes a Viernes' es un rango; 'Sabado', un dia suelto.
  const esRango = citados.length >= 2 && (s.includes(' a ') || s.includes('-') || s.includes('–') || s.includes('hasta'));
  if (esRango) return hoy >= citados[0] && hoy <= citados[citados.length - 1];
  return citados.includes(hoy);
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
