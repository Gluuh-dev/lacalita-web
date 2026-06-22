import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {tx} from '@/lib/localize';
import type {EventRow} from '@/lib/queries';

export default async function EventCard({
  event,
  locale
}: {
  event: EventRow;
  locale: string;
}) {
  const t = await getTranslations('events.kind');
  const date = new Date(event.starts_at);
  const day = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  }).format(date);
  const time = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);

  return (
    <Link
      href={`/eventos/${event.id}`}
      className="ds-card--link flex gap-4 overflow-hidden rounded-[20px] border border-line bg-surface p-4 shadow-sm"
    >
      <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-brand/15 py-2 text-center">
        <span className="text-xs font-medium uppercase text-brand-deep">{day}</span>
        <span className="text-sm font-bold">{time}</span>
      </div>
      <div className="min-w-0 flex-1">
        <span className="inline-block rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
          {t(event.kind as 'dj' | 'concierto' | 'otro')}
        </span>
        <h3 className="mt-1 font-serif text-lg leading-tight">
          {tx(event.title, locale)}
        </h3>
        {event.artist && (
          <p className="text-sm font-medium text-brand-deep">{event.artist}</p>
        )}
        {event.description && (
          <p className="mt-1 line-clamp-2 text-sm text-ink-2">
            {tx(event.description, locale)}
          </p>
        )}
      </div>
      {event.image && (
        <Image
          src={event.image}
          alt={tx(event.title, locale)}
          width={80}
          height={80}
          className="h-20 w-20 shrink-0 rounded-xl object-cover ring-1 ring-black/5"
        />
      )}
    </Link>
  );
}
