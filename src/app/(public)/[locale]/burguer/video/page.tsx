import {setRequestLocale} from 'next-intl/server';
import {getMenu} from '@/lib/queries';
import {tx} from '@/lib/localize';
import type {MenuItem} from '@/components/menu/store';
import BurgerVideo from '@/components/burger/burger-video';

export const revalidate = 300;
export const metadata = {title: 'Vídeos · La Calita Burger', robots: {index: false}};

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const menu = await getMenu('hamburgueseria');
  const videos: MenuItem[] = (menu?.categories ?? [])
    .flatMap((c) => c.products)
    .filter((p) => p.video)
    .map((p) => ({
      id: p.id,
      name: tx(p.name, locale),
      price: p.price != null ? Number(p.price) : null,
      image: p.image ?? null,
      slug: p.slug,
      menuSlug: 'hamburgueseria',
      video: p.video,
      desc: p.description ? tx(p.description, locale) : undefined,
      ingredients: p.ingredients ?? [],
      allergens: (p.product_allergens ?? [])
        .map((pa) => pa.allergens)
        .filter((a): a is NonNullable<typeof a> => !!a)
        .map((a) => ({code: a.code, icon: a.icon, name: a.name}))
    }));
  return <BurgerVideo videos={videos} locale={locale} />;
}
