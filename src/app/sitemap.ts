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

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    for (const path of paths) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.7
      });
    }
  }
  return entries;
}
