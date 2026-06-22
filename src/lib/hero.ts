import {tx} from './localize';
import type {EventRow} from './queries';

const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

export type HeroEvent = {
  id: string;
  title: string;
  artist: string;
  time: string;
  day: string;
  month: string;
};

export function toHeroEvents(events: EventRow[], locale: string): HeroEvent[] {
  return events.map((e) => {
    const d = new Date(e.starts_at);
    const ok = !isNaN(d.getTime());
    return {
      id: e.id,
      title: tx(e.title, locale),
      artist: e.artist ?? '',
      time: ok ? d.toLocaleTimeString(locale, {hour: '2-digit', minute: '2-digit'}) : '',
      day: ok ? String(d.getDate()).padStart(2, '0') : '--',
      month: ok ? MONTHS[d.getMonth()] : ''
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
