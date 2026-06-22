// URL pública del sitio (para metadata, sitemap, OG). Define NEXT_PUBLIC_SITE_URL
// en producción (ej. https://lacalita.com); si no, cae a localhost.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export const LOCALES = ['es', 'en', 'fr'] as const;
