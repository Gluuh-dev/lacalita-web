import {tx} from './localize';
import type {EventRow} from './queries';

export type HeroEvent = {
  id: string;
  title: string;
  artist: string;
  time: string;
  day: string;
  month: string;
  image: string | null; // cartel: lo usa el importador de eventos del editor
};

export function toHeroEvents(events: EventRow[], locale: string): HeroEvent[] {
  const mes = new Intl.DateTimeFormat(locale, {month: 'short'});
  return events.map((e) => {
    const d = new Date(e.starts_at);
    const ok = !isNaN(d.getTime());
    return {
      id: e.id,
      title: tx(e.title, locale),
      artist: e.artist ?? '',
      time: ok ? d.toLocaleTimeString(locale, {hour: '2-digit', minute: '2-digit'}) : '',
      day: ok ? String(d.getDate()).padStart(2, '0') : '--',
      // Según el idioma ("jul." → "JUL"), no un array fijo en español.
      month: ok ? mes.format(d).replace(/\.$/, '').toUpperCase().slice(0, 4) : '',
      image: e.images?.[0] ?? e.image ?? null
    };
  });
}

// Color de texto legible sobre un fondo dado (para botones).
export function inkOn(hex: string): string {
  if (!hex) return '#fff';
  const c = hex.replace('#', '');
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 155 ? '#3a2606' : '#fff';
}
