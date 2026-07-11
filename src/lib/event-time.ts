// Cuenta atrás de eventos. Estaba copiada en tres sitios y en uno de ellos
// concordaba mal ("Faltan 1 día"). Devuelve tokens sin idioma: el texto lo
// pone cada consumidor con el namespace `time` de next-intl.

// Días de calendario hasta el evento (0 = hoy). Ignora la hora, para que un
// evento esta noche a las 23:30 diga "hoy" y no "faltan 0 días".
export function daysUntil(iso: string, now: Date = new Date()): number {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return -1;
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.round((target - today) / 86400000);
}

export type CountdownToken = {kind: 'today'} | {kind: 'tomorrow'} | {kind: 'days'; days: number};

// null = ya pasó.
export function countdownToken(iso: string, now?: Date): CountdownToken | null {
  const days = daysUntil(iso, now);
  if (days < 0) return null;
  if (days === 0) return {kind: 'today'};
  if (days === 1) return {kind: 'tomorrow'};
  return {kind: 'days', days};
}
