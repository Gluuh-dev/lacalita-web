import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import {Disc3, Music, Sparkles, ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {tx} from '@/lib/localize';
import type {EventRow} from '@/lib/queries';

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
  const tt = await getTranslations('time');
  const d = new Date(event.starts_at);
  const ok = !isNaN(d.getTime());
  const day = ok ? String(d.getDate()).padStart(2, '0') : '--';
  // "jul." → "JUL": sin punto final, en mayúsculas y máximo 4 caracteres.
  const month = ok ? new Intl.DateTimeFormat(locale, {month: 'short'}).format(d).replace(/\.$/, '').toUpperCase().slice(0, 4) : '';
  const time = ok ? new Intl.DateTimeFormat(locale, {hour: '2-digit', minute: '2-digit'}).format(d) : '';
  const kind = (event.kind as 'dj' | 'concierto' | 'otro') || 'dj';
  const KindIcon = KIND_ICON[kind] ?? Disc3;
  const title = tx(event.title, locale);

  // Badge de relevancia: HOY / MAÑANA / ESTE FINDE.
  const now = new Date();
  const startDay = ok ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : null;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = startDay ? Math.round((startDay.getTime() - today.getTime()) / 86400000) : -1;
  const dow = ok ? d.getDay() : -1;
  const flag = days === 0 ? 'today' : days === 1 ? 'tomorrow' : days >= 0 && days <= 6 && (dow === 5 || dow === 6 || dow === 0) ? 'weekend' : null;
  const Flag = flag ? (
    <span className="absolute right-2.5 top-2.5 z-[2] rounded-full bg-brand px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-on-primary shadow">{tt(flag)}</span>
  ) : null;

  const Media = (
    <div className="lc-img-loading ds-media-zoom absolute inset-0">
      {event.image ? (
        // La miniatura vive en una columna de 112-136px: pedir 100vw descargaba 4-6x de más.
        <Image src={event.image} alt={title} fill sizes="(max-width: 640px) 112px, 136px" className="object-cover" />
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
      <Link
        href={`/eventos/${event.id}`}
        className="lc-img-loading ds-card--link group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[20px] bg-ink text-white shadow-md"
      >
        {/* Ajustada a lo ancho y anclada arriba: el recorte se lo lleva la parte
            baja del cartel, no la cabecera. */}
        {event.image ? (
          <Image src={event.image} alt={title} fill sizes="(max-width: 640px) 50vw, 300px" className="object-cover object-top transition duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="absolute inset-0" style={{background: GRADIENTS[kind] ?? GRADIENTS.dj}}>
            <div className="absolute inset-0" style={{background: 'radial-gradient(120% 90% at 80% 10%, rgba(233,174,116,.28), transparent 60%)'}} />
            <KindIcon className="absolute -bottom-2 -right-2 size-14 text-white/15" strokeWidth={1.25} />
          </div>
        )}
        {DateChip}
        {Flag}
        {/* Panel de cristal oscuro: legible aunque el cartel lleve su propio texto. */}
        <div className="relative z-[2] m-2 flex flex-col gap-0.5 rounded-[14px] border border-white/12 bg-black/55 px-3 py-2.5 text-center backdrop-blur-md sm:m-2.5 sm:px-3.5 sm:py-3">
          <span className="truncate font-montserrat text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-brand sm:text-[0.66rem]">
            {t(kind)} · {time}
          </span>
          <h3 className="line-clamp-2 font-serif text-base font-bold leading-tight sm:text-lg">{title}</h3>
          {event.artist && <p className="truncate text-xs font-medium text-white/75 sm:text-sm">{event.artist}</p>}
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
        {Flag}
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
