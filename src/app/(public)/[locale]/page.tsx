import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Coffee, UtensilsCrossed, Sandwich, ArrowRight, Clock, AlertTriangle, MapPin, Navigation, Phone} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {getSettings, getUpcomingEvents, getMenus, DEFAULT_HERO_SLIDE} from '@/lib/queries';
import type {HeroSlide} from '@/lib/queries';
import {tx} from '@/lib/localize';
import {toHeroEvents} from '@/lib/hero';
import {normalizeHours, formatRanges} from '@/lib/hours';
import {SITE_URL, altLanguages} from '@/lib/site';
import EventCard from '@/components/event-card';
import Hero from '@/components/hero';
import Reveal from '@/components/reveal';

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
  const [settings, events, menus] = await Promise.all([
    getSettings(),
    getUpcomingEvents(6),
    getMenus()
  ]);

  const intro = settings?.landing ? tx(settings.landing, locale) : t('home.intro');
  const hours = normalizeHours(settings?.hours);

  const heroSlides: HeroSlide[] = settings?.hero?.length
    ? settings.hero
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
          heroMode: events.length > 0 ? 'agenda' : 'boton'
        }
      ];

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
    sameAs: [settings?.social?.instagram, settings?.social?.facebook].filter(Boolean)
  };

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
      <Hero slides={heroSlides} events={toHeroEvents(events, locale)} />

      {/* Cartas */}
      <Reveal>
        <section id="carta" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
          <SectionHead
            eyebrow="Nuestra cocina"
            title="Tres cartas, un mismo mar"
            action={<ActionLink href="/carta" label={t('menu.title')} />}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {menus.map((m) => {
              const Icon = ICONS[m.slug] ?? UtensilsCrossed;
              return (
                <Link
                  key={m.id}
                  href={`/carta/${m.slug}`}
                  data-theme={m.theme}
                  className="ds-card--link group relative flex min-h-[240px] flex-col justify-end overflow-hidden rounded-[28px] bg-gradient-to-br from-brand to-brand-deep p-6 text-white shadow-md"
                >
                  <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="font-serif text-2xl">{tx(m.name, locale)}</h3>
                  {m.subtitle && <p className="mt-1 text-sm text-white/90">{tx(m.subtitle, locale)}</p>}
                  <span className="mt-3 inline-flex items-center gap-1.5 font-adam text-[0.72rem] uppercase tracking-[0.12em]">
                    Ver carta <ArrowRight className="size-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </Reveal>

      {/* Eventos */}
      {events.length > 0 && (
        <Reveal>
          <section id="eventos" className="scroll-mt-20 bg-surface-2">
            <div className="mx-auto max-w-6xl px-4 py-16">
              <SectionHead
                eyebrow={t('events.upcoming')}
                title="Música a pie de playa"
                action={<ActionLink href="/eventos" label={t('events.all')} />}
              />
              <div className="grid gap-5 md:grid-cols-2">
                {events.slice(0, 4).map((e) => (
                  <EventCard key={e.id} event={e} locale={locale} />
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {/* Ubicación */}
      <Reveal>
        <section id="info" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
          <SectionHead eyebrow="Dónde estamos" title="A pie de playa, en Salobreña" />
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            {/* Horario */}
            <div className="rounded-[20px] border border-line bg-surface p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Clock className="size-5 text-brand-deep" />
                <h3 className="font-serif text-xl">{t('info.hours')}</h3>
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

              <div className="grid grid-cols-2 gap-4">
                {settings?.phone && (
                  <a href={`tel:${settings.phone}`} className="flex items-center gap-3 rounded-[14px] border border-line bg-surface px-4 py-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-sunken text-brand-deep">
                      <Phone className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-adam text-[0.7rem] uppercase tracking-[0.1em] text-ink-3">Reservas</span>
                      <span className="block truncate font-semibold">{settings.phone}</span>
                    </span>
                  </a>
                )}
                <div className="flex items-center justify-between gap-2 rounded-[14px] border border-line bg-surface px-4 py-3">
                  <span className="font-adam text-[0.7rem] uppercase tracking-[0.1em] text-ink-3">{t('info.follow')}</span>
                  <span className="flex gap-2">
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
  hamburgueseria: Sandwich
};

function SectionHead({eyebrow, title, action}: {eyebrow: string; title: string; action?: React.ReactNode}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="eyebrow mb-2">{eyebrow}</div>
        <h2 className="font-serif text-3xl sm:text-4xl">{title}</h2>
      </div>
      {action}
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
