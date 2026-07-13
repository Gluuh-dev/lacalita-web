import {setRequestLocale, getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import Image from 'next/image';
import {Calendar, Clock, Music, MapPin} from 'lucide-react';
import {getPublicEvent, getUpcomingEvents, getEventTickets} from '@/lib/queries';
import {tx, euro} from '@/lib/localize';
import {altLanguages, SITE_URL} from '@/lib/site';
import EventCard from '@/components/event-card';
import EventActions from '@/components/event-actions';
import {countdownToken} from '@/lib/event-time';
import CountdownBar from './countdown-bar';
import MapCard from '@/components/map-card';

export const revalidate = 300;

export async function generateMetadata({params}: {params: Promise<{locale: string; id: string}>}) {
  const {locale, id} = await params;
  const event = await getPublicEvent(id);
  if (!event) return {};
  const title = `${tx(event.title, locale)} · La Calita`;
  const img = event.image || event.images?.[0];
  return {
    title,
    description: event.description ? tx(event.description, locale) : undefined,
    alternates: altLanguages(`/eventos/${id}`),
    openGraph: {title, images: img ? [img] : undefined}
  };
}

export default async function EventoDetalle({params}: {params: Promise<{locale: string; id: string}>}) {
  const {locale, id} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('events');
  const tt = await getTranslations('time');
  const ti = await getTranslations('info');
  const tk = await getTranslations('events.kind');
  const [event, upcoming] = await Promise.all([getPublicEvent(id), getUpcomingEvents(8)]);
  if (!event) notFound();
  const tickets = await getEventTickets(id);

  const kind = (event.kind as 'dj' | 'concierto' | 'otro') || 'dj';
  const date = new Date(event.starts_at);
  const fecha = new Intl.DateTimeFormat(locale, {weekday: 'long', day: 'numeric', month: 'long'}).format(date);
  const time = new Intl.DateTimeFormat(locale, {hour: '2-digit', minute: '2-digit'}).format(date);
  const images = event.images?.length ? event.images : event.image ? [event.image] : [];
  const others = upcoming.filter((e) => e.id !== event.id).slice(0, 3);
  const title = tx(event.title, locale);
  const desc = event.description ? tx(event.description, locale) : undefined;

  const cd = countdownToken(event.starts_at);
  let countdown: string | null = null;
  if (cd) countdown = cd.kind === 'days' ? tt('left', {days: cd.days}) : tt(cd.kind);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: title,
    startDate: event.starts_at,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: images.length ? images : undefined,
    description: desc,
    url: `${SITE_URL}/${locale}/eventos/${event.id}`,
    location: {
      '@type': 'Place',
      name: 'La Calita Beach Club',
      address: {'@type': 'PostalAddress', addressLocality: 'Salobreña', addressRegion: 'Granada', addressCountry: 'ES'}
    },
    performer: event.artist ? {'@type': 'PerformingGroup', name: event.artist} : undefined,
    offers: tickets.length
      ? tickets.map((tkt) => ({
          '@type': 'Offer',
          name: tx(tkt.name, locale),
          price: Number(tkt.price),
          priceCurrency: 'EUR',
          availability: tkt.capacity != null && tkt.sold >= tkt.capacity ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock'
        }))
      : undefined
  };

  return (
    <main className="flex-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
      <CountdownBar startsAt={event.starts_at} />
      {/* Hero: cartel a todo el ancho y anclado arriba. Los datos van debajo,
          nunca encima, porque el cartel ya trae su propio texto. */}
      <section className="relative overflow-hidden bg-black text-white">
        <div className="lc-img-loading relative h-[68svh] w-full sm:h-[70vh] lg:h-[78vh]">
          {event.video ? (
            <video src={event.video} poster={images[0]} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover object-top" />
          ) : images[0] ? (
            <Image src={images[0]} alt={title} fill priority sizes="100vw" className="object-cover object-top" />
          ) : (
            <div className="absolute inset-0" style={{background: 'linear-gradient(150deg, #e0955a 0%, #b96e42 45%, #5e3620 100%)'}}>
              <Music className="absolute -bottom-10 -right-6 size-64 text-white/[0.05]" strokeWidth={1} />
            </div>
          )}
          {/* Arriba, para que los iconos del navbar se lean; abajo, funde a negro. */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black" />
        </div>

        <div className="relative z-10 mx-auto -mt-8 w-full max-w-5xl px-4 pb-12 text-center md:pb-16">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-brand px-3 py-1 font-montserrat text-[0.62rem] font-bold uppercase tracking-[0.16em] text-on-primary">{tk(kind)}</span>
            {countdown && (
              <span className="rounded-full bg-white/15 px-3 py-1 font-montserrat text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur">{countdown}</span>
            )}
          </div>
          <span className="block font-montserrat text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/70 sm:text-[0.78rem]">
            {fecha} · {time}
          </span>
          <h1 className="mt-2 font-serif text-[clamp(2.1rem,5.5vw,3.6rem)] font-bold leading-[1.03] tracking-tight">{title}</h1>
          {/* Great Vibes solo tiene un grosor: la negrita se consigue engrosando
              el trazo, no con font-bold (que el navegador falsearía deformándola). */}
          {event.artist && (
            <p className="-mt-2 font-vibes text-[3.4rem] leading-tight text-brand sm:-mt-4 sm:text-[5.5rem]" style={{WebkitTextStroke: '1.2px currentColor'}}>
              {event.artist}
            </p>
          )}
        </div>
      </section>

      {/* cuerpo */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          <div>
            <div className="text-center">
              <div className="mb-3 font-cinzel text-sm font-semibold uppercase tracking-[0.16em] text-ink-2">{t('about')}</div>
              {event.description ? (
                <p className="mx-auto max-w-2xl font-montserrat text-[1.02rem] leading-[1.75] text-ink-2">{tx(event.description, locale)}</p>
              ) : (
                <p className="mx-auto max-w-2xl font-montserrat leading-[1.75] text-ink-3">{t('aboutFallback')}</p>
              )}
            </div>

            {images.length > 1 && (
              <>
                <div className="mb-3 mt-8 font-cinzel text-sm font-semibold uppercase tracking-[0.16em] text-ink-2">{t('galleryTitle')}</div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {images.slice(1).map((url, i) => (
                    <div key={i} className="lc-img-loading relative aspect-square overflow-hidden rounded-[14px] border border-line">
                      <Image src={url} alt={`${title} — foto ${i + 2}`} fill sizes="(min-width:640px) 12rem, 45vw" className="object-cover" />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <aside className="rounded-[20px] border border-line bg-surface p-6 shadow-sm lg:sticky lg:top-20">
            {countdown && (
              <div className="mb-5 rounded-[14px] bg-brand/12 px-4 py-3 text-center">
                <div className="font-montserrat text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-brand-deep">{t('countdown')}</div>
                <div className="mt-0.5 font-serif text-2xl font-bold text-ink">{countdown}</div>
              </div>
            )}
            <div className="flex flex-col gap-4">
              <InfoRow Icon={Calendar} label={t('dateLabel')} value={fecha} />
              <InfoRow Icon={Clock} label={t('timeLabel')} value={time} />
              {event.artist && <InfoRow Icon={Music} label={t('artistLabel')} value={event.artist} />}
              <InfoRow Icon={MapPin} label={t('placeLabel')} value="La Calita · Salobreña" />
            </div>

            {tickets.length > 0 && (
              <div className="mt-5 border-t border-line pt-5">
                <div className="eyebrow mb-3">{t('tickets')}</div>
                <div className="flex flex-col gap-2">
                  {tickets.map((tkt) => {
                    const soldOut = tkt.capacity != null && tkt.sold >= tkt.capacity;
                    return (
                      <div key={tkt.id} className="flex items-center justify-between gap-2 rounded-[12px] border border-line bg-bg px-3 py-2.5">
                        <div className="min-w-0">
                          <div className="font-semibold">{tx(tkt.name, locale)}</div>
                          {tx(tkt.description, locale) && <div className="text-xs text-ink-3">{tx(tkt.description, locale)}</div>}
                          {soldOut && <div className="text-xs font-semibold text-danger">{t('soldOut')}</div>}
                        </div>
                        <span className="shrink-0 font-bold text-brand-deep">{euro(Number(tkt.price), locale)}</span>
                      </div>
                    );
                  })}
                </div>
                <button disabled className="mt-3 w-full cursor-default rounded-full bg-brand py-3 font-semibold text-on-primary opacity-60">
                  {t('buy')}
                </button>
                <p className="mt-2 text-center text-xs text-ink-3">{t('paySoon')}</p>
              </div>
            )}

            {/* El mapa ya es el enlace: sin botón repetido debajo. */}
            <MapCard href="https://maps.google.com/?q=La+Calita+Salobre%C3%B1a" label={ti('location')} className="mt-5 h-40" />
            <EventActions id={event.id} title={title} startsAt={event.starts_at} description={desc} />
          </aside>
        </div>
      </section>

      {/* más eventos */}
      {others.length > 0 && (
        <section className="bg-surface-2">
          <div className="mx-auto max-w-5xl px-4 py-14">
            <div className="eyebrow mb-5">{t('moreEvents')}</div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((e) => (
                <EventCard key={e.id} event={e} locale={locale} layout="tile" />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function InfoRow({Icon, label, value}: {Icon: typeof Calendar; label: string; value: string}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-sunken text-brand-deep">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block font-montserrat text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ink-3">{label}</span>
        <span className="block font-semibold capitalize text-ink">{value}</span>
      </span>
    </div>
  );
}
