import {setRequestLocale, getTranslations} from 'next-intl/server';
import Image from 'next/image';
import {History} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {getUpcomingEvents, getPastEvents} from '@/lib/queries';
import {countdownLabel} from '@/lib/event-time';
import {tx} from '@/lib/localize';
import {altLanguages} from '@/lib/site';
import EventCard from '@/components/event-card';
import Watermark from '@/components/watermark';
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
          // El cartel llena la card a lo ancho (recorta arriba/abajo) y los datos
          // van en un panel de cristal oscuro.
          <Link
            href={`/eventos/${feat.id}`}
            // En móvil ocupa el 90% de la altura de pantalla; a partir de sm manda la proporción.
            className="group relative flex h-[90svh] flex-col justify-end overflow-hidden rounded-[28px] bg-ink text-white shadow-lg sm:h-auto sm:aspect-[4/3] lg:aspect-[16/9]"
          >
            {feat.image ? (
              <Image src={feat.image} alt={tx(feat.title, locale)} fill priority sizes="100vw" className="object-cover object-top transition duration-700 group-hover:scale-[1.02]" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-accent to-ink" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />

            <div className="relative z-10 m-3 rounded-[20px] border border-white/12 bg-black/55 p-5 text-center backdrop-blur-md sm:m-5 sm:p-6">
              <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
                <span className="rounded-full bg-brand px-3 py-1 font-montserrat text-[0.62rem] font-bold uppercase tracking-[0.16em] text-on-primary">Próximo</span>
                {countdownLabel(feat.starts_at) && (
                  <span className="rounded-full bg-white/20 px-3 py-1 font-montserrat text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-white">
                    {countdownLabel(feat.starts_at)}
                  </span>
                )}
              </div>
              <span className="block font-montserrat text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/70 sm:text-[0.76rem]">
                {fmtDate(feat.starts_at)} · {fmtTime(feat.starts_at)}
              </span>
              <h2 className="mt-2 font-serif text-[1.65rem] font-bold leading-[1.06] tracking-tight sm:text-[2.6rem]">{tx(feat.title, locale)}</h2>
              {feat.artist && <p className="mt-1 font-vibes text-[3rem] leading-tight text-brand sm:text-[4.25rem]">{feat.artist}</p>}
            </div>
          </Link>
        )}

        {groups.map((g) => (
          <div key={g.key}>
            <h3 className="mb-5 flex items-center gap-4 font-cinzel text-lg font-semibold uppercase tracking-[0.14em] text-ink-2">
              <span className="size-1.5 shrink-0 rounded-full bg-brand" />
              {g.label}
              <span className="h-px flex-1 bg-line" />
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
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
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-brand/10 text-brand-deep">
          <History className="size-7" strokeWidth={1.6} />
        </span>
        <p className="font-serif text-2xl font-bold text-ink">Todavía no hay recuerdos</p>
        <p className="max-w-xs font-montserrat text-sm leading-relaxed text-ink-3">
          Cuando celebremos los primeros eventos, aquí quedará el álbum de lo vivido.
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-2 gap-4 opacity-80 transition-opacity hover:opacity-100 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {past.map((e) => (
          <EventCard key={e.id} event={e} locale={locale} layout="tile" />
        ))}
      </div>
    );

  return (
    <>
      {/* Atardecer de marca, no el azul marino de `accent`. */}
      <header
        className="relative overflow-hidden px-6 pb-16 pt-28 text-center text-white"
        style={{background: 'radial-gradient(125% 135% at 78% 0%, #e8ab6f 0%, #c67c46 30%, #8a5230 62%, #2f1d12 100%)'}}
      >
        {/* Misma marca de agua que en la portada. */}
        <Watermark word="Agenda" className="text-white/[0.07]" />
        {/* Palmeras de marca, como en el hero. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/palmeras/palm-sup-iz.svg" alt="" className="absolute left-0 top-0 w-[clamp(90px,13vw,190px)] opacity-25" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/palmeras/palm-inf-der.svg" alt="" className="absolute bottom-0 right-0 w-[clamp(90px,13vw,190px)] opacity-25" />
        </div>
        <div className="relative">
          <div className="mb-2 font-montserrat text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/70">No te lo pierdas</div>
          <h1 className="font-serif text-5xl font-bold leading-[0.95] drop-shadow-sm sm:text-6xl">
            {t('title')}
            <span className="text-brand">.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md font-montserrat text-[0.95rem] leading-relaxed text-white/80">
            DJ sets, conciertos y noches de verano frente al mar.
          </p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
        <EventsToggle upcoming={upcomingView} past={pastView} />
      </main>
    </>
  );
}
