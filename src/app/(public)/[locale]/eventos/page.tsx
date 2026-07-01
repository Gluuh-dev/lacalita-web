import {setRequestLocale, getTranslations} from 'next-intl/server';
import Image from 'next/image';
import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {getUpcomingEvents, getPastEvents} from '@/lib/queries';
import {tx} from '@/lib/localize';
import {altLanguages} from '@/lib/site';
import EventCard from '@/components/event-card';
import EventsToggle from './events-toggle';
import type {EventRow} from '@/lib/queries';

export const revalidate = 300;

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'events'});
  return {title: `${t('title')} · La Calita`, alternates: altLanguages('/eventos')};
}

export default async function EventosPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('events');
  const [up, past] = await Promise.all([getUpcomingEvents(50), getPastEvents(30)]);

  const fmtDate = (iso: string) => new Intl.DateTimeFormat(locale, {weekday: 'long', day: 'numeric', month: 'long'}).format(new Date(iso));
  const fmtTime = (iso: string) => new Intl.DateTimeFormat(locale, {hour: '2-digit', minute: '2-digit'}).format(new Date(iso));
  const countdown = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const days = Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) / 86400000);
    return days === 0 ? '¡Hoy!' : days === 1 ? 'Mañana' : days > 1 ? `Faltan ${days} días` : null;
  };

  // Próximos: evento destacado + resto agrupado por mes.
  const feat = up[0];
  const groups: {key: string; label: string; items: EventRow[]}[] = [];
  for (const e of up.slice(1)) {
    const d = new Date(e.starts_at);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    let g = groups.find((x) => x.key === key);
    if (!g) {
      g = {key, label: new Intl.DateTimeFormat(locale, {month: 'long', year: 'numeric'}).format(d), items: []};
      groups.push(g);
    }
    g.items.push(e);
  }

  const upcomingView =
    up.length === 0 ? (
      <p className="py-16 text-center text-ink-3">{t('none')}</p>
    ) : (
      <div className="flex flex-col gap-12">
        {feat && (
          <Link
            href={`/eventos/${feat.id}`}
            className="lc-img-loading group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-[28px] text-white shadow-lg sm:min-h-[440px]"
          >
            {feat.image ? (
              <Image src={feat.image} alt={tx(feat.title, locale)} fill priority sizes="(min-width:1152px) 1120px, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-accent to-ink" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
            <div className="relative z-10 p-6 sm:p-10">
              <div className="mb-3 flex flex-wrap items-center gap-2.5">
                <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-on-primary">Próximo</span>
                {countdown(feat.starts_at) && (
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{countdown(feat.starts_at)}</span>
                )}
                <span className="font-adam text-[0.72rem] uppercase capitalize tracking-[0.12em] text-white/80">{fmtDate(feat.starts_at)} · {fmtTime(feat.starts_at)}</span>
              </div>
              <h2 className="font-serif text-3xl font-bold leading-none sm:text-5xl">{tx(feat.title, locale)}</h2>
              {feat.artist && <p className="mt-2 text-lg text-brand">con {feat.artist}</p>}
              <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink transition group-hover:bg-white/90">
                Ver evento <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>
        )}

        {groups.map((g) => (
          <div key={g.key}>
            <h3 className="mb-5 flex items-center gap-3 font-adam text-sm uppercase capitalize tracking-[0.16em] text-ink-3">
              {g.label}
              <span className="h-px flex-1 bg-line" />
            </h3>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((e) => (
                <EventCard key={e.id} event={e} locale={locale} layout="tile" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );

  const pastView =
    past.length === 0 ? (
      <p className="py-16 text-center text-ink-3">Aún no hay eventos pasados.</p>
    ) : (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {past.map((e) => (
          <EventCard key={e.id} event={e} locale={locale} layout="tile" />
        ))}
      </div>
    );

  return (
    <>
      <header className="relative overflow-hidden bg-gradient-to-br from-accent to-ink px-6 pb-16 pt-28 text-center text-white">
        <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-serif text-[36vw] font-bold leading-none text-white/[0.06]">
          Agenda
        </span>
        <div className="relative">
          <div className="eyebrow mb-3 !text-brand">Agenda</div>
          <h1 className="font-serif text-4xl font-bold sm:text-6xl">
            {t('title')}
            <span className="text-brand">.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-white/85">DJ sets, conciertos y noches de verano frente al mar.</p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
        <EventsToggle upcoming={upcomingView} past={pastView} />
      </main>
    </>
  );
}
