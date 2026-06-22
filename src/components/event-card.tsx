import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import {Disc3, Music, Sparkles, ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {tx} from '@/lib/localize';
import type {EventRow} from '@/lib/queries';

const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
const GRADIENTS: Record<string, string> = {
  dj: 'linear-gradient(145deg, #2e6e8e, #1c3a4b 80%)',
  concierto: 'linear-gradient(145deg, #4a3a6e, #241a3b 80%)',
  otro: 'linear-gradient(145deg, #c98a4e, #6f4a22 80%)'
};
const KIND_ICON = {dj: Disc3, concierto: Music, otro: Sparkles} as const;

export default async function EventCard({
  event,
  locale,
  layout = 'row'
}: {
  event: EventRow;
  locale: string;
  layout?: 'row' | 'tile';
}) {
  const t = await getTranslations('events.kind');
  const d = new Date(event.starts_at);
  const ok = !isNaN(d.getTime());
  const day = ok ? String(d.getDate()).padStart(2, '0') : '--';
  const month = ok ? MONTHS[d.getMonth()] : '';
  const time = ok ? new Intl.DateTimeFormat(locale, {hour: '2-digit', minute: '2-digit'}).format(d) : '';
  const kind = (event.kind as 'dj' | 'concierto' | 'otro') || 'dj';
  const KindIcon = KIND_ICON[kind] ?? Disc3;
  const title = tx(event.title, locale);

  const Media = (
    <div className="ds-media-zoom absolute inset-0">
      {event.image ? (
        <Image src={event.image} alt={title} fill sizes="(max-width: 768px) 100vw, 420px" className="object-cover" />
      ) : (
        <div className="relative h-full w-full" style={{background: GRADIENTS[kind] ?? GRADIENTS.dj}}>
          <div className="absolute inset-0" style={{background: 'radial-gradient(120% 90% at 80% 10%, rgba(233,174,116,.28), transparent 60%)'}} />
          <KindIcon className="absolute -bottom-2 -right-2 size-14 text-white/15" strokeWidth={1.25} />
        </div>
      )}
    </div>
  );

  const DateChip = (
    <div className="absolute left-2.5 top-2.5 z-[2] flex min-w-[46px] flex-col items-center justify-center rounded-lg border border-white/20 bg-black/50 px-2 py-1 leading-none text-white backdrop-blur">
      <span className="font-serif text-xl font-bold">{day}</span>
      <span className="mt-0.5 font-adam text-[0.58rem] tracking-[0.12em]">{month}</span>
    </div>
  );

  if (layout === 'tile') {
    return (
      <Link href={`/eventos/${event.id}`} className="ds-card--link flex flex-col overflow-hidden rounded-[20px] border border-line bg-surface shadow-sm">
        <div className="relative aspect-[3/2] overflow-hidden">
          {Media}
          {DateChip}
          <span className="absolute bottom-2.5 left-2.5 z-[2] rounded-full bg-brand px-2.5 py-0.5 text-xs font-semibold text-on-primary">{t(kind)}</span>
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <span className="eyebrow">{time}</span>
          <h3 className="line-clamp-2 font-serif text-xl font-bold leading-snug">{title}</h3>
          {event.artist && <p className="text-sm font-semibold text-brand-deep">{event.artist}</p>}
          {event.description && (
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-2">{tx(event.description, locale)}</p>
          )}
        </div>
      </Link>
    );
  }

  // row (landing / listas)
  return (
    <Link
      href={`/eventos/${event.id}`}
      className="ds-card--link grid min-h-[128px] grid-cols-[112px_1fr] overflow-hidden rounded-[20px] border border-line bg-surface shadow-sm sm:grid-cols-[136px_1fr]"
    >
      <div className="relative overflow-hidden">
        {Media}
        {DateChip}
      </div>
      <div className="flex flex-col justify-center gap-1 p-4">
        <span className="eyebrow">{t(kind)} · {time}</span>
        <h3 className="line-clamp-2 font-serif text-lg font-bold leading-snug">{title}</h3>
        {event.artist && (
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-semibold text-brand-deep">{event.artist}</span>
            <ArrowRight className="size-4 shrink-0 text-brand-deep" />
          </div>
        )}
      </div>
    </Link>
  );
}
