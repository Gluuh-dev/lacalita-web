import type {MetadataRoute} from 'next';
import {SITE_URL, LOCALES} from '@/lib/site';
import {getMenus, getMenu, getUpcomingEvents} from '@/lib/queries';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const menus = await getMenus();
  const [menuDatas, events] = await Promise.all([Promise.all(menus.map((m) => getMenu(m.slug))), getUpcomingEvents(50)]);

  // Rutas por idioma (URLs canónicas).
  const paths: string[] = ['', '/carta', '/eventos', '/galeria', '/ubicacion', '/burguer', '/burguer/carta', '/burguer/ofertas', '/burguer/local'];
  for (const m of menus) if (m.slug !== 'hamburgueseria') paths.push(`/carta/${m.slug}`);
  for (const data of menuDatas) {
    if (!data) continue;
    const base = data.slug === 'hamburgueseria' ? '/burguer/carta' : `/carta/${data.slug}`;
    for (const c of data.categories ?? []) {
      for (const p of c.products ?? []) paths.push(`${base}/${p.slug}`);
    }
  }
  for (const e of events) paths.push(`/eventos/${e.id}`);

  // Prioridad por tipo de página: la portada manda, luego las cartas y la
  // agenda, y al final cada ficha suelta.
  const prioridad = (path: string) => {
    if (path === '') return 1;
    if (path === '/carta' || path === '/eventos' || path === '/burguer') return 0.9;
    if (path.split('/').length <= 2) return 0.8;
    return 0.6;
  };
  const frecuencia = (path: string): 'daily' | 'weekly' | 'monthly' =>
    path === '' || path === '/eventos' ? 'daily' : path.startsWith('/eventos/') ? 'weekly' : 'monthly';

  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    for (const path of paths) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified,
        changeFrequency: frecuencia(path),
        priority: prioridad(path),
        // hreflang también en el sitemap: es la señal que Google cruza con la
        // del <head>. Si solo va en uno de los dos, la ignora.
        alternates: {
          languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`]))
        }
      });
    }
  }
  return entries;
}
