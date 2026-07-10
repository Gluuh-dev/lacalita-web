// Cuenta atrás de eventos. Estaba copiada en tres sitios y en uno de ellos
// concordaba mal ("Faltan 1 día").

// 'Falta 1 día' / 'Faltan 3 días': concuerdan el verbo y el sustantivo.
export const faltan = (n: number) => (n === 1 ? 'Falta 1 día' : `Faltan ${n} días`);

// Días de calendario hasta el evento (0 = hoy). Ignora la hora, para que un
// evento esta noche a las 23:30 diga "¡Hoy!" y no "Faltan 0 días".
export function daysUntil(iso: string, now: Date = new Date()): number {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return -1;
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.round((target - today) / 86400000);
}

// null = ya pasó.
export function countdownLabel(iso: string, now?: Date): string | null {
  const days = daysUntil(iso, now);
  if (days < 0) return null;
  if (days === 0) return '¡Hoy!';
  if (days === 1) return 'Mañana';
  return faltan(days);
}
