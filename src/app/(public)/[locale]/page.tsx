import Image from 'next/image';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Coffee, UtensilsCrossed, Sandwich, Martini, ArrowRight, Clock, AlertTriangle, MapPin, Navigation, Phone, Waves, Quote, Star} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {getSettings, getUpcomingEvents, getMenus, getFeaturedProducts, DEFAULT_HERO_SLIDE} from '@/lib/queries';
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
  const [settings, events, menus, featured] = await Promise.all([
    getSettings(),
    getUpcomingEvents(6),
    getMenus(),
    getFeaturedProducts(4)
  ]);

  const intro = settings?.landing ? tx(settings.landing, locale) : t('home.intro');
  const hours = normalizeHours(settings?.hours);

  const content = settings?.content ?? {};
  const about = {...DEFAULT_CONTENT.about, ...content.about};
  const story = {...DEFAULT_CONTENT.story, ...content.story};
  const reviews = content.reviews ?? [];
  const gallery = content.gallery ?? [];

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
        <section className="mx-auto max-w-4xl px-4 py-16 text-center">
          <div className="eyebrow mb-3">Bienvenidos a La Calita</div>
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
        <section className="relative overflow-hidden bg-[#15110b] py-24 text-white sm:py-28">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/manifesto.svg" alt="" aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-full w-auto max-w-none -translate-x-1/2 -translate-y-1/2 select-none object-cover opacity-[0.18]" />
          <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
            <Waves className="mx-auto mb-8 size-9 text-brand" strokeWidth={2.2} />
            <blockquote className="font-serif text-[clamp(1.8rem,5.6vw,3.25rem)] font-bold italic leading-[1.15]">
              “No somos un club de playa. Somos el <span className="text-brand">latido</span> del Mediterráneo capturado en una copa.”
            </blockquote>
            <div className="mt-10 flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-white/25" />
              <span className="font-adam text-[0.62rem] uppercase tracking-[0.28em] text-white/45">La Calita · Manifesto</span>
              <span className="h-px w-10 bg-white/25" />
            </div>
          </div>
        </section>
      </Reveal>

      {/* Cartas */}
      <Reveal>
        <section id="carta" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHead eyebrow="Nuestra cocina" title="Sabores" />
            <div className="-mx-4 md:mx-0">
            <SnapCarousel itemClass="w-[80vw] max-w-[300px]" mdItemClass="md:w-[300px]" accent="#c98a4e" ink="#4c2f08">
            {menus.map((m) => {
              const Icon = ICONS[m.slug] ?? UtensilsCrossed;
              return (
                <Link
                  key={m.id}
                  href={m.slug === 'hamburgueseria' ? '/burguer' : `/carta/${m.slug}`}
                  data-theme={m.theme}
                  className="lc-img-loading ds-card--link group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[24px] p-5 text-white shadow-md"
                >
                  {m.header_image ? (
                    <Image src={m.header_image} alt={tx(m.name, locale)} fill sizes="(min-width:1024px) 22rem, 90vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand to-brand-deep" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />
                  <span className="absolute left-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                    <Icon className="size-5" />
                  </span>
                  <div className="relative z-10">
                    <h3 className="font-serif text-3xl leading-tight">{tx(m.name, locale)}</h3>
                    {m.subtitle && <p className="mt-1 text-sm text-white/85">{tx(m.subtitle, locale)}</p>}
                    <span className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-white py-2.5 font-adam text-[0.72rem] uppercase tracking-[0.12em] text-ink transition group-hover:bg-white/90">
                      Ver carta <ArrowRight className="size-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
            </SnapCarousel>
            </div>
            <MoreLink href="/carta" label={t('menu.title')} />
          </div>
        </section>
      </Reveal>

      {/* Platos destacados */}
      {featured.length > 0 && (
        <Reveal>
          <section className="mx-auto max-w-6xl px-4 py-16">
            <SectionHead eyebrow="De nuestra carta" title="Platos" />
            <div className="-mx-4 md:mx-0">
            <SnapCarousel itemClass="w-[72vw] max-w-[270px]" mdItemClass="md:w-[270px]" accent="#c98a4e" ink="#4c2f08">
              {featured.map((p) => (
                <Link
                  key={p.id}
                  href={`/carta/${p.categories?.menus?.slug ?? 'restaurante'}/${p.slug}`}
                  className="lc-img-loading ds-card--link group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[24px] p-4 text-white shadow-md"
                >
                  {p.image ? (
                    <Image src={p.image} alt={tx(p.name, locale)} fill sizes="(max-width:768px) 64vw, 260px" className="object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand to-brand-deep" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />
                  <div className="relative z-10">
                    <h3 className="font-serif text-xl leading-tight">{tx(p.name, locale)}</h3>
                    {p.price != null && <span className="mt-1 block font-bold tabular-nums text-white/95">{euro(Number(p.price), locale)}</span>}
                  </div>
                </Link>
              ))}
            </SnapCarousel>
            </div>
            <MoreLink href="/carta" label={t('menu.title')} />
          </section>
        </Reveal>
      )}

      {/* Eventos */}
      {events.length > 0 && (
        <Reveal>
          <section id="eventos" className="scroll-mt-20 bg-surface-2">
            <div className="mx-auto max-w-6xl px-4 py-16">
              <SectionHead eyebrow={t('events.upcoming')} title="Eventos" />
              <div className="-mx-4 md:mx-0">
              <SnapCarousel itemClass="w-[84vw] max-w-[380px]" mdItemClass="md:w-[380px]" accent="#c98a4e" ink="#4c2f08">
                {events.slice(0, 4).map((e) => (
                  <EventCard key={e.id} event={e} locale={locale} layout="tile" />
                ))}
              </SnapCarousel>
              </div>
              <MoreLink href="/eventos" label={t('events.all')} />
            </div>
          </section>
        </Reveal>
      )}

      {/* Historia */}
      <Reveal>
        <section className="bg-surface-2">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center">
            <div className="eyebrow mb-3">La Calita</div>
            <h2 className="font-serif text-3xl sm:text-4xl">{tx(story.title ?? {}, locale)}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-ink-2">{tx(story.text ?? {}, locale)}</p>
          </div>
        </section>
      </Reveal>

      {/* Reseñas */}
      {reviews.length > 0 && (
        <Reveal>
          <section className="mx-auto max-w-6xl px-4 py-16">
            <SectionHead eyebrow="Lo que dicen" title="Opiniones" />
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
          <section id="galeria" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
            <SectionHead eyebrow="Momentos" title="Galería" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {gallery.map((url, idx) => (
                <div key={idx} className="ds-media-zoom aspect-square overflow-hidden rounded-[16px] border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* Ubicación */}
      <Reveal>
        <section id="info" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
          <SectionHead eyebrow="Dónde estamos" title="Ubicación" />
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
                    <span className="tabular-nums text-ink-2">{row.closed ? 'Cerrado' : formatRanges(row)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mapa + contacto */}
            <div className="flex flex-col gap-5">
              <a
                href={settings?.maps_url ?? '#'}
                target="_blank"
                rel="noreferrer"
                className="ds-card--link relative block min-h-[280px] overflow-hidden rounded-[20px] border border-line shadow-sm"
                style={{background: 'linear-gradient(160deg, #e7eff1 0%, #d3e4e8 55%, #bcd8df 100%)'}}
              >
                <span className="absolute inset-0 opacity-50" style={{background: 'repeating-linear-gradient(35deg, transparent 0 38px, rgba(255,255,255,.9) 38px 42px), repeating-linear-gradient(-52deg, transparent 0 54px, rgba(255,255,255,.7) 54px 57px)'}} />
                <span className="absolute inset-x-0 bottom-0 h-[38%]" style={{background: 'linear-gradient(180deg, rgba(46,110,142,0), rgba(46,110,142,.55))'}} />
                <span className="absolute bottom-3 left-4 font-serif italic text-white/90" style={{textShadow: '0 1px 4px rgba(20,40,55,.5)'}}>Mar de Alborán</span>
                <span className="absolute left-1/2 top-[42%] flex size-11 -translate-x-1/2 -translate-y-1/2 rotate-[-45deg] items-center justify-center rounded-[50%_50%_50%_0] border-2 border-white bg-brand-deep shadow-lg">
                  <MapPin className="size-5 rotate-45 text-white" />
                </span>
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-sm font-medium text-ink shadow-sm">
                  <MapPin className="size-3.5 text-brand-deep" />
                  {settings?.address ?? 'Pº Marítimo'}
                </span>
                <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-sm font-medium text-white shadow-sm">
                  <Navigation className="size-4" /> {t('info.directions')}
                </span>
              </a>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {settings?.phone && (
                  <a href={`tel:${settings.phone}`} className="flex min-w-0 items-center gap-3 rounded-[14px] border border-line bg-surface px-4 py-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-sunken text-brand-deep">
                      <Phone className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-adam text-[0.7rem] uppercase tracking-[0.1em] text-ink-3">Reservas</span>
                      <span className="block truncate font-semibold">{settings.phone}</span>
                    </span>
                  </a>
                )}
                <div className="flex min-w-0 flex-col gap-2 rounded-[14px] border border-line bg-surface px-4 py-3">
                  <span className="font-adam text-[0.7rem] uppercase tracking-[0.1em] text-ink-3">{t('info.follow')}</span>
                  <span className="flex flex-wrap gap-2">
                    {settings?.social?.instagram && (
                      <a href={settings.social.instagram} target="_blank" rel="noreferrer" className="rounded-full bg-surface-sunken px-3 py-1 text-xs font-medium">Instagram</a>
                    )}
                    {settings?.social?.facebook && (
                      <a href={settings.social.facebook} target="_blank" rel="noreferrer" className="rounded-full bg-surface-sunken px-3 py-1 text-xs font-medium">Facebook</a>
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

const ICONS: Record<string, typeof Coffee> = {
  desayunos: Coffee,
  restaurante: UtensilsCrossed,
  cocteles: Martini,
  hamburgueseria: Sandwich
};

// Cabecera unificada estilo "Sabores.": palabra gigante de fondo + eyebrow + título con punto.
function SectionHead({eyebrow, title, bg, dark = false}: {eyebrow: string; title: string; bg?: string; dark?: boolean}) {
  return (
    <div className="relative left-1/2 mb-10 w-screen -translate-x-1/2 overflow-hidden py-6 text-center">
      {/* Marca de agua: Tosca Zero en mayúsculas. A 32vw la palabra era más
          ancha que la pantalla y el overflow-hidden la recortaba. */}
      <span
        aria-hidden
        className={`font-tosca pointer-events-none absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center text-[clamp(2.5rem,14vw,10.5rem)] uppercase leading-none tracking-[0.02em] ${dark ? 'text-white/[0.07]' : 'text-ink/[0.06]'}`}
      >
        {bg ?? title}
      </span>
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="eyebrow mb-2">{eyebrow}</div>
        <h2 className="font-serif text-5xl font-bold sm:text-6xl">
          {title}
          <span className="text-brand">.</span>
        </h2>
      </div>
    </div>
  );
}

// CTA "ver todo" debajo de las cards, centrado.
function MoreLink({href, label}: {href: string; label: string}) {
  return (
    <div className="mt-7 flex justify-center">
      <ActionLink href={href} label={label} />
    </div>
  );
}

function ActionLink({href, label}: {href: string; label: string}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium transition hover:border-brand hover:bg-surface-2"
    >
      {label} <ArrowRight className="size-4" />
    </Link>
  );
}
