import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {getSettings, getUpcomingEvents} from '@/lib/queries';
import type {HeroSlide} from '@/lib/queries';
import {tx} from '@/lib/localize';
import {normalizeHours, formatRanges} from '@/lib/hours';
import {SITE_URL} from '@/lib/site';
import EventCard from '@/components/event-card';
import HeroCarousel from '@/components/hero-carousel';
import Reveal from '@/components/reveal';

export const revalidate = 300;

export default async function Home({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const [settings, events] = await Promise.all([
    getSettings(),
    getUpcomingEvents(3)
  ]);

  const heroSlides: HeroSlide[] =
    settings?.hero && settings.hero.length
      ? settings.hero
      : settings?.hero_video
        ? [{type: 'video', url: settings.hero_video, overlay: 35, logoLight: true, loop: true}]
        : settings?.hero_image
          ? [{type: 'image', url: settings.hero_image, overlay: 25, logoLight: true, loop: false}]
          : [];

  const intro = settings?.landing ? tx(settings.landing, locale) : t('home.intro');
  const hours = normalizeHours(settings?.hours);

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
      <HeroCarousel
        slides={heroSlides}
        tagline={t('home.tagline')}
        intro={intro}
        cta={t('home.cta')}
      />

      {/* Próximos eventos */}
      {events.length > 0 && (
        <Reveal>
        <section className="mx-auto max-w-3xl px-4 py-12">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="font-serif text-3xl">{t('events.upcoming')}</h2>
            <Link href="/eventos" className="text-sm text-brand-deep hover:underline">
              {t('events.all')} →
            </Link>
          </div>
          <div className="space-y-3">
            {events.map((e) => (
              <EventCard key={e.id} event={e} locale={locale} />
            ))}
          </div>
        </section>
        </Reveal>
      )}

      {/* Información */}
      <Reveal>
      <section id="info" className="mx-auto max-w-3xl px-4 pb-20 scroll-mt-20">
        <h2 className="mb-5 font-serif text-3xl">{t('info.title')}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[20px] border border-line bg-surface p-5 shadow-sm">
            <h3 className="mb-2 font-medium">{t('info.hours')}</h3>
            {hours.notice && (
              <p className="mb-3 rounded-lg bg-brand/15 px-3 py-2 text-sm font-medium text-brand-deep">
                {hours.notice}
              </p>
            )}
            <ul className="space-y-1 text-sm text-ink-2">
              {hours.rows.map((row, i) => (
                <li key={i} className="flex justify-between gap-4">
                  <span>{row.label}</span>
                  <span>{row.closed ? 'Cerrado' : formatRanges(row)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[20px] border border-line bg-surface p-5 shadow-sm">
            <h3 className="mb-2 font-medium">{t('info.location')}</h3>
            <p className="text-sm text-ink-2">{settings?.address}</p>
            {settings?.maps_url && (
              <a
                href={settings.maps_url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm text-accent hover:underline"
              >
                {t('info.directions')} →
              </a>
            )}
            {settings?.social && (
              <div className="mt-4">
                <h3 className="mb-1 font-medium">{t('info.follow')}</h3>
                <div className="flex gap-3 text-sm">
                  {settings.social.instagram && (
                    <a
                      href={settings.social.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent hover:underline"
                    >
                      Instagram
                    </a>
                  )}
                  {settings.social.facebook && (
                    <a
                      href={settings.social.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent hover:underline"
                    >
                      Facebook
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      </Reveal>
    </main>
  );
}
