'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {CalendarPlus, Share2, Check} from 'lucide-react';

function pad(n: number) {
  return String(n).padStart(2, '0');
}
// Fecha local → formato ICS en hora local flotante (sin Z): respeta la hora del evento.
function icsLocal(d: Date) {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
}

export default function EventActions({id, title, startsAt, description}: {id: string; title: string; startsAt: string; description?: string}) {
  const t = useTranslations('events');
  const [copied, setCopied] = useState(false);

  const addToCalendar = () => {
    const start = new Date(startsAt);
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
    const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//La Calita//Eventos//ES',
      'BEGIN:VEVENT',
      `UID:${id}@lacalita`,
      `DTSTART:${icsLocal(start)}`,
      `DTEND:${icsLocal(end)}`,
      `SUMMARY:${esc(title)}`,
      description ? `DESCRIPTION:${esc(description)}` : '',
      'LOCATION:La Calita Beach Club, Salobreña',
      'END:VEVENT',
      'END:VCALENDAR'
    ]
      .filter(Boolean)
      .join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], {type: 'text/calendar'}));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^\w]+/g, '-').toLowerCase()}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({title, url});
      } catch {
        /* cancelado */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* no-op */
    }
  };

  const btn = 'flex items-center justify-center gap-1.5 rounded-full border border-line bg-bg py-2.5 font-montserrat text-sm font-medium text-ink transition hover:border-brand';

  return (
    <div className="mt-5 grid grid-cols-2 gap-2 border-t border-line pt-5">
      <button onClick={addToCalendar} className={btn}>
        <CalendarPlus className="size-4" /> {t('calendar')}
      </button>
      <button onClick={share} className={btn}>
        {copied ? <Check className="size-4 text-green-600" /> : <Share2 className="size-4" />} {copied ? t('copied') : t('share')}
      </button>
    </div>
  );
}
