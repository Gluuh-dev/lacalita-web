import {setRequestLocale, getTranslations} from 'next-intl/server';
import {getUpcomingEvents} from '@/lib/queries';
import {altLanguages} from '@/lib/site';
import EventCard from '@/components/event-card';

export const revalidate = 300;

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'events'});
  return {title: `${t('title')} · La Calita`, alternates: altLanguages('/eventos')};
}

export default async function EventosPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('events');
  const events = await getUpcomingEvents(50);

  return (
    <>
      <header className="relative overflow-hidden bg-gradient-to-br from-accent to-ink px-6 pb-14 pt-28 text-center text-white">
        <div className="eyebrow mb-3 !text-brand">Agenda</div>
        <h1 className="font-serif text-4xl sm:text-5xl">{t('title')}</h1>
        <p className="mx-auto mt-3 max-w-md text-white/85">
          DJ sets, conciertos y noches de verano frente al mar.
        </p>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <div className="eyebrow mb-5">Próximamente</div>
        {events.length === 0 ? (
          <p className="text-ink-3">{t('none')}</p>
        ) : (
          <div className="space-y-3">
            {events.map((e) => (
              <EventCard key={e.id} event={e} locale={locale} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
