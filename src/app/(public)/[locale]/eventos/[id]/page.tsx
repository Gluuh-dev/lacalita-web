import {setRequestLocale, getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import Image from 'next/image';
import {Calendar, Clock, Music, MapPin, Navigation} from 'lucide-react';
import {getPublicEvent, getUpcomingEvents, getEventTickets} from '@/lib/queries';
import {tx, euro} from '@/lib/localize';
import {altLanguages, SITE_URL} from '@/lib/site';
import EventCard from '@/components/event-card';
import EventActions from '@/components/event-actions';

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
  const tk = await getTranslations('events.kind');
  const [event, upcoming] = await Promise.all([getPublicEvent(id), getUpcomingEvents(8)]);
  if (!event) notFound();
  const tickets = await getEventTickets(id);

  const kind = (event.kind as 'dj' | 'concierto' | 'otro') || 'dj';
  const date = new Date(event.starts_at);
  const fecha = new Intl.DateTimeFormat(locale, {weekday: 'long', day: 'numeric', month: 'long'}).format(date);
  const time = new Intl.DateTimeFormat(locale, {hour: '2-digit', minute: '2-digit'}).format(date);
  const images = event.images?.length ? event.images : event.image ? [event.image] : [];
  const hasMedia = !!(event.video || images[0]);
  const others = upcoming.filter((e) => e.id !== event.id).slice(0, 3);
  const title = tx(event.title, locale);
  const desc = event.description ? tx(event.description, locale) : undefined;

  // Cuenta atrás (granularidad de días).
  const now = new Date();
  const startDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((startDay.getTime() - today.getTime()) / 86400000);
  const countdown = days === 0 ? '¡Hoy!' : days === 1 ? 'Mañana' : days > 1 ? `Faltan ${days} días` : null;

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
      {/* hero */}
      <section className={`lc-img-loading relative flex items-end overflow-hidden ${hasMedia ? 'min-h-[60vh]' : 'min-h-[40vh]'}`}>
        {event.video ? (
          <video src={event.video} poster={images[0]} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
        ) : images[0] ? (
          <Image src={images[0]} alt={title} fill priority sizes="100vw" className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent to-ink">
            <Music className="absolute -bottom-10 -right-6 size-64 text-white/[0.05]" strokeWidth={1} />
            <div className="absolute -left-16 -top-16 size-64 rounded-full" style={{background: 'radial-gradient(circle, rgba(233,174,116,.22), transparent 70%)'}} />
          </div>
        )}
        <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(20,15,8,.82) 0%, rgba(20,15,8,.12) 60%, rgba(20,15,8,.32) 100%)'}} />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-9 pt-24 text-white">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand px-3 py-1 text-sm font-semibold text-on-primary">{tk(kind)}</span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white backdrop-blur first-letter:uppercase">{fecha} · {time}</span>
            {countdown && <span className="rounded-full bg-brand/25 px-3 py-1 text-sm font-semibold text-white backdrop-blur">{countdown}</span>}
          </div>
          <h1 className="font-modern text-[clamp(2.2rem,6vw,4rem)] leading-none">{title}</h1>
          {event.artist && <p className="mt-2 font-eight text-xl tracking-wide text-brand">con {event.artist}</p>}
        </div>
      </section>

      {/* cuerpo */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          <div>
            <div className="eyebrow mb-3">Sobre el evento</div>
            {event.description ? (
              <p className="text-lg leading-relaxed text-ink-2">{tx(event.description, locale)}</p>
            ) : (
              <p className="text-ink-3">Una noche a pie de playa con la cocina de La Calita abierta y la mejor música frente al mar.</p>
            )}

            {images.length > 1 && (
              <>
                <div className="eyebrow mb-3 mt-8">Galería</div>
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
                <div className="font-adam text-[0.6rem] uppercase tracking-[0.16em] text-brand-deep">Cuenta atrás</div>
                <div className="mt-0.5 font-serif text-2xl font-bold text-ink">{countdown}</div>
              </div>
            )}
            <div className="flex flex-col gap-4">
              <InfoRow Icon={Calendar} label="Fecha" value={fecha} />
              <InfoRow Icon={Clock} label="Hora" value={time} />
              {event.artist && <InfoRow Icon={Music} label="Artista" value={event.artist} />}
              <InfoRow Icon={MapPin} label="Lugar" value="La Calita · Salobreña" />
            </div>

            {tickets.length > 0 && (
              <div className="mt-5 border-t border-line pt-5">
                <div className="eyebrow mb-3">Entradas</div>
                <div className="flex flex-col gap-2">
                  {tickets.map((tkt) => {
                    const soldOut = tkt.capacity != null && tkt.sold >= tkt.capacity;
                    return (
                      <div key={tkt.id} className="flex items-center justify-between gap-2 rounded-[12px] border border-line bg-bg px-3 py-2.5">
                        <div className="min-w-0">
                          <div className="font-semibold">{tx(tkt.name, locale)}</div>
                          {tx(tkt.description, locale) && <div className="text-xs text-ink-3">{tx(tkt.description, locale)}</div>}
                          {soldOut && <div className="text-xs font-semibold text-danger">Agotadas</div>}
                        </div>
                        <span className="shrink-0 font-bold text-brand-deep">{euro(Number(tkt.price), locale)}</span>
                      </div>
                    );
                  })}
                </div>
                <button disabled className="mt-3 w-full cursor-default rounded-full bg-brand py-3 font-semibold text-on-primary opacity-60">
                  Comprar entradas
                </button>
                <p className="mt-2 text-center text-xs text-ink-3">Pago online disponible próximamente.</p>
              </div>
            )}

            <div className="mt-5 overflow-hidden rounded-[14px] border border-line">
              <iframe title="Mapa La Calita" src="https://www.google.com/maps?q=La+Calita+Salobre%C3%B1a&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-40 w-full border-0" />
            </div>
            <a
              href="https://maps.google.com/?q=La+Calita+Salobre%C3%B1a"
              target="_blank"
              rel="noreferrer"
              className="ds-btn ds-btn-outline mt-3 w-full text-sm"
            >
              <Navigation className="size-4" /> Cómo llegar
            </a>
            <EventActions id={event.id} title={title} startsAt={event.starts_at} description={desc} />
          </aside>
        </div>
      </section>

      {/* más eventos */}
      {others.length > 0 && (
        <section className="bg-surface-2">
          <div className="mx-auto max-w-5xl px-4 py-14">
            <div className="eyebrow mb-5">Más eventos</div>
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
        <span className="block font-adam text-[0.66rem] uppercase tracking-[0.1em] text-ink-3">{label}</span>
        <span className="block font-semibold capitalize text-ink">{value}</span>
      </span>
    </div>
  );
}
