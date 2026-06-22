import {setRequestLocale, getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Calendar, Clock, Music, MapPin} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {getPublicEvent, getUpcomingEvents} from '@/lib/queries';
import {tx} from '@/lib/localize';
import {altLanguages} from '@/lib/site';
import EventCard from '@/components/event-card';

export const revalidate = 300;

const GRAD: Record<string, string> = {
  dj: 'radial-gradient(120% 100% at 70% 0%, #3f88a6, #1a2c3b 80%)',
  concierto: 'radial-gradient(120% 100% at 30% 0%, #6a4a86, #241a3b 80%)',
  otro: 'radial-gradient(120% 100% at 60% 0%, #c98a4e, #5a3a18 80%)'
};

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
  const [t, tk] = [await getTranslations('events'), await getTranslations('events.kind')];
  const [event, upcoming] = await Promise.all([getPublicEvent(id), getUpcomingEvents(8)]);
  if (!event) notFound();

  const kind = (event.kind as 'dj' | 'concierto' | 'otro') || 'dj';
  const date = new Date(event.starts_at);
  const fecha = new Intl.DateTimeFormat(locale, {weekday: 'long', day: 'numeric', month: 'long'}).format(date);
  const time = new Intl.DateTimeFormat(locale, {hour: '2-digit', minute: '2-digit'}).format(date);
  const images = event.images?.length ? event.images : event.image ? [event.image] : [];
  const others = upcoming.filter((e) => e.id !== event.id).slice(0, 3);
  const title = tx(event.title, locale);

  return (
    <main className="flex-1">
      {/* hero con media */}
      <section className="relative flex min-h-[56vh] items-end overflow-hidden">
        {event.video ? (
          <video src={event.video} poster={images[0]} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
        ) : images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={images[0]} alt={title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0" style={{background: GRAD[kind] ?? GRAD.dj}} />
        )}
        <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(20,15,8,.78) 0%, rgba(20,15,8,.15) 55%, rgba(20,15,8,.35) 100%)'}} />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-10 pt-24 text-white">
          <Link href="/eventos" className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1.5 font-adam text-[0.72rem] uppercase tracking-[0.1em] backdrop-blur transition hover:bg-white/30">
            ← {t('title')}
          </Link>
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-brand px-3 py-1 text-sm font-semibold text-on-primary">{tk(kind)}</span>
            <span className="rounded-full bg-accent px-3 py-1 text-sm font-semibold capitalize text-white">{fecha} · {time}</span>
          </div>
          <h1 className="font-modern text-[clamp(2.4rem,6vw,4rem)] leading-none">{title}</h1>
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
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={url} alt="" className="aspect-square w-full rounded-[14px] border border-line object-cover" />
                  ))}
                </div>
              </>
            )}
          </div>

          <aside className="rounded-[20px] border border-line bg-surface p-6 shadow-sm lg:sticky lg:top-20">
            <div className="flex flex-col gap-4">
              <InfoRow Icon={Calendar} label="Fecha" value={fecha} />
              <InfoRow Icon={Clock} label="Hora" value={time} />
              {event.artist && <InfoRow Icon={Music} label="Artista" value={event.artist} />}
              <InfoRow Icon={MapPin} label="Lugar" value="La Calita · Salobreña" />
            </div>
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
