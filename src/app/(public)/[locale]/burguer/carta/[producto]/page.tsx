import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {getProduct, getSauces, getMenu} from '@/lib/queries';
import type {Category} from '@/lib/queries';
import {tx} from '@/lib/localize';
import {altLanguages} from '@/lib/site';
import ProductDetail from '@/components/product-detail';

export const revalidate = 300;

export async function generateMetadata({params}: {params: Promise<{locale: string; producto: string}>}) {
  const {locale, producto} = await params;
  const data = await getProduct(producto);
  if (!data) return {};
  const title = `${tx(data.product.name, locale)} · La Calita Burger`;
  const description = data.product.description ? tx(data.product.description, locale) : undefined;
  return {
    title,
    description,
    alternates: altLanguages(`/burguer/carta/${producto}`),
    openGraph: {title, description, images: data.product.image ? [data.product.image] : undefined}
  };
}

export default async function Page({params}: {params: Promise<{locale: string; producto: string}>}) {
  const {locale, producto} = await params;
  setRequestLocale(locale);
  const [data, sauces, menu] = await Promise.all([getProduct(producto), getSauces('hamburgueseria'), getMenu('hamburgueseria')]);
  if (!data) notFound();
  const related = relatedCats(menu?.categories ?? [], data.product.category_id);
  return <ProductDetail product={data.product} menuSlug="hamburgueseria" theme={data.theme} sauces={sauces} related={related} />;
}

// Resto de la carta para los carruseles del pie: primero la categoría del
// propio plato ("más hamburguesas"), y sin las salsas (ya salen arriba).
function relatedCats(cats: Category[], catId: string): Category[] {
  const usable = cats.filter((c) => c.role !== 'carousel' && (c.products?.length ?? 0) > 0);
  const own = usable.filter((c) => c.id === catId);
  const rest = usable.filter((c) => c.id !== catId);
  return [...own, ...rest];
}
