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
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-10 pt-20">
      <h1 className="mb-6 font-serif text-4xl">{t('title')}</h1>
      {events.length === 0 ? (
        <p className="text-ink/60">{t('none')}</p>
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <EventCard key={e.id} event={e} locale={locale} />
          ))}
        </div>
      )}
    </main>
  );
}
