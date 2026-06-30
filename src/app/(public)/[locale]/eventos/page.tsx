import {setRequestLocale, getTranslations} from 'next-intl/server';
import {getUpcomingEvents, getPastEvents} from '@/lib/queries';
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

  const grid = (list: EventRow[], empty: string) =>
    list.length === 0 ? (
      <p className="py-12 text-center text-ink-3">{empty}</p>
    ) : (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((e) => (
          <EventCard key={e.id} event={e} locale={locale} layout="tile" />
        ))}
      </div>
    );

  return (
    <>
      <header className="relative overflow-hidden bg-gradient-to-br from-accent to-ink px-6 pb-14 pt-28 text-center text-white">
        <div className="eyebrow mb-3 !text-brand">Agenda</div>
        <h1 className="font-serif text-4xl sm:text-5xl">{t('title')}</h1>
        <p className="mx-auto mt-3 max-w-md text-white/85">DJ sets, conciertos y noches de verano frente al mar.</p>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <EventsToggle upcoming={grid(up, t('none'))} past={grid(past, 'Aún no hay eventos pasados.')} />
      </main>
    </>
  );
}
