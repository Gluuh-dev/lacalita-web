import {setRequestLocale, getTranslations} from 'next-intl/server';
import {getUpcomingEvents, getPastEvents} from '@/lib/queries';
import {altLanguages} from '@/lib/site';
import {Link} from '@/i18n/navigation';
import EventCard from '@/components/event-card';

export const revalidate = 300;

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'events'});
  return {title: `${t('title')} · La Calita`, alternates: altLanguages('/eventos')};
}

export default async function EventosPage({
  params,
  searchParams
}: {
  params: Promise<{locale: string}>;
  searchParams: Promise<{ver?: string}>;
}) {
  const {locale} = await params;
  const {ver} = await searchParams;
  const past = ver === 'pasados';
  setRequestLocale(locale);
  const t = await getTranslations('events');
  const events = past ? await getPastEvents(30) : await getUpcomingEvents(50);

  const tab = (active: boolean) =>
    `rounded-full border px-5 py-2 font-adam text-[0.78rem] uppercase tracking-[0.08em] transition ${active ? 'border-brand bg-brand text-on-primary' : 'border-line bg-surface text-ink-2 hover:border-brand'}`;

  return (
    <>
      <header className="relative overflow-hidden bg-gradient-to-br from-accent to-ink px-6 pb-14 pt-28 text-center text-white">
        <div className="eyebrow mb-3 !text-brand">Agenda</div>
        <h1 className="font-serif text-4xl sm:text-5xl">{t('title')}</h1>
        <p className="mx-auto mt-3 max-w-md text-white/85">DJ sets, conciertos y noches de verano frente al mar.</p>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <div className="mb-7 flex justify-center gap-2">
          <Link href="/eventos" className={tab(!past)}>Próximos</Link>
          <Link href="/eventos?ver=pasados" className={tab(past)}>Pasados</Link>
        </div>
        {events.length === 0 ? (
          <p className="py-12 text-center text-ink-3">{past ? 'Aún no hay eventos pasados.' : t('none')}</p>
        ) : (
          <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${past ? 'opacity-90' : ''}`}>
            {events.map((e) => (
              <EventCard key={e.id} event={e} locale={locale} layout="tile" />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
