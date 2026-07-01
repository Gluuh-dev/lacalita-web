import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {getMenu} from '@/lib/queries';
import {tx} from '@/lib/localize';
import CartaVideo from '@/components/menu/carta-video';
import type {MenuItem} from '@/components/menu/store';

export const metadata = {title: 'Vídeos · La Calita', robots: {index: false}};

export default async function Page({params}: {params: Promise<{locale: string; menu: string}>}) {
  const {locale, menu} = await params;
  setRequestLocale(locale);
  const data = await getMenu(menu);
  if (!data) notFound();
  const videos: MenuItem[] = (data.categories ?? [])
    .flatMap((c) => c.products ?? [])
    .filter((p) => p.video)
    .map((p) => ({
      id: p.id,
      name: tx(p.name, locale),
      price: p.price != null ? Number(p.price) : null,
      image: p.image ?? null,
      slug: p.slug,
      menuSlug: data.slug,
      video: p.video,
      desc: p.description ? tx(p.description, locale) : undefined,
      ingredients: p.ingredients ?? [],
      allergens: (p.product_allergens ?? [])
        .map((pa) => pa.allergens)
        .filter((a): a is NonNullable<typeof a> => !!a)
        .map((a) => ({code: a.code, icon: a.icon, name: a.name}))
    }));
  return <CartaVideo videos={videos} locale={locale} />;
}
