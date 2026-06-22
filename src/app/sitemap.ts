import type {MetadataRoute} from 'next';
import {SITE_URL, LOCALES} from '@/lib/site';
import {getMenus, getMenu, getUpcomingEvents} from '@/lib/queries';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const menus = await getMenus();
  const [menuDatas, events] = await Promise.all([
    Promise.all(menus.map((m) => getMenu(m.slug))),
    getUpcomingEvents(50)
  ]);

  // Rutas por idioma
  const paths: string[] = ['', '/carta', '/eventos'];
  for (const m of menus) paths.push(`/carta/${m.slug}`);
  for (const data of menuDatas) {
    if (!data) continue;
    for (const c of data.categories ?? []) {
      for (const p of c.products ?? []) paths.push(`/carta/${data.slug}/${p.slug}`);
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
