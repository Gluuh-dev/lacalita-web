// Campo i18n jsonb {es,en,fr} → string del idioma activo (con fallback a es).
export function tx(field: unknown, locale: string): string {
  const v = field as Record<string, string> | null | undefined;
  if (!v) return '';
  return v[locale] || v.es || Object.values(v)[0] || '';
}

export function euro(n: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR'
  }).format(n);
}
