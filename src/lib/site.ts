// URL pública del sitio (para metadata, sitemap, OG). Define NEXT_PUBLIC_SITE_URL
// en producción (ej. https://lacalita.com); si no, cae a localhost.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export const LOCALES = ['es', 'en', 'fr'] as const;

// alternates (hreflang) para una ruta sin prefijo de idioma, ej. '' o '/carta'.
export function altLanguages(path: string) {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `${SITE_URL}/${l}${path}`;
  languages['x-default'] = `${SITE_URL}/es${path}`;
  return {canonical: `${SITE_URL}/es${path}`, languages};
}
