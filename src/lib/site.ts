// URL pública del sitio (para metadata, sitemap, OG). Define NEXT_PUBLIC_SITE_URL
// en producción (ej. https://lacalita.com); si no, cae a localhost.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export const LOCALES = ['es', 'en', 'fr'] as const;

// alternates (hreflang) para una ruta sin prefijo de idioma, ej. '' o '/carta'.
// El canonical apunta al propio idioma: si /en/carta se declara canónica de
// /es/carta, Google desindexa las versiones en inglés y francés.
export function altLanguages(path: string, locale: string = 'es') {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `${SITE_URL}/${l}${path}`;
  languages['x-default'] = `${SITE_URL}/es${path}`;
  return {canonical: `${SITE_URL}/${locale}${path}`, languages};
}

// Metadata de una página: título, descripción, hreflang/canonical y Open Graph,
// todo en el idioma que se está sirviendo. Evita repetir el bloque en cada page.
export function pageMeta({
  title,
  description,
  path,
  locale,
  images
}: {
  title: string;
  description: string;
  path: string;
  locale: string;
  images?: string[];
}) {
  return {
    title,
    description,
    alternates: altLanguages(path, locale),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}${path}`,
      locale,
      type: 'website' as const,
      ...(images ? {images} : {})
    }
  };
}
