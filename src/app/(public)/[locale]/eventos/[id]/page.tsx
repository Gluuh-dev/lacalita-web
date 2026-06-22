import {setRequestLocale, getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Link} from '@/i18n/navigation';
import {getPublicEvent} from '@/lib/queries';
import {tx} from '@/lib/localize';

export const revalidate = 300;

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string; id: string}>;
}) {
  const {locale, id} = await params;
  const event = await getPublicEvent(id);
  if (!event) return {};
  return {title: `${tx(event.title, locale)} · La Calita`};
}

export default async function EventoDetalle({
  params
}: {
  params: Promise<{locale: string; id: string}>;
}) {
  const {locale, id} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('events');
  const event = await getPublicEvent(id);
  if (!event) notFound();

  const date = new Date(event.starts_at);
  const when = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
  const images = event.images?.length ? event.images : event.image ? [event.image] : [];

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-8 pt-20">
      <Link href="/eventos" className="text-sm text-brand-deep hover:underline">
        ← {t('title')}
      </Link>

      <div className="mt-4 overflow-hidden rounded-2xl bg-brand/10">
        {event.video ? (
          <video
            src={event.video}
            controls
            autoPlay
            muted
            loop
            playsInline
            className="aspect-video w-full object-cover"
          />
        ) : images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={images[0]} alt="" className="aspect-video w-full object-cover" />
        ) : null}
      </div>

      <span className="mt-5 inline-block rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-medium text-accent">
        {t(`kind.${event.kind}` as 'kind.dj')}
      </span>
      <h1 className="mt-2 font-serif text-4xl">{tx(event.title, locale)}</h1>
      <p className="mt-1 capitalize text-ink/70">
        {when}
        {event.artist ? ` · ${event.artist}` : ''}
      </p>

      {event.description && (
        <p className="mt-4 text-lg leading-relaxed text-ink/80">
          {tx(event.description, locale)}
        </p>
      )}

      {images.length > 1 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.slice(1).map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt=""
              className="aspect-square w-full rounded-xl object-cover"
            />
          ))}
        </div>
      )}
    </main>
  );
}
