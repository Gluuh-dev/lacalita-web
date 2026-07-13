import {setRequestLocale} from 'next-intl/server';
import {notFound, redirect} from 'next/navigation';
import {getMenu} from '@/lib/queries';
import {tx} from '@/lib/localize';
import {altLanguages} from '@/lib/site';
import type {Product} from '@/lib/queries';
import ProductDetail from '@/components/product-detail';

export const revalidate = 300;

function findProduct(
  categories: {products: Product[]}[],
  slug: string
): Product | null {
  for (const c of categories ?? []) {
    const found = (c.products ?? []).find((p) => p.slug === slug);
    if (found) return found;
  }
  return null;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string; menu: string; producto: string}>;
}) {
  const {locale, menu, producto} = await params;
  const data = await getMenu(menu);
  const product = data ? findProduct(data.categories, producto) : null;
  if (!product) return {};
  const title = `${tx(product.name, locale)} · La Calita`;
  const description = product.description ? tx(product.description, locale) : undefined;
  return {
    title,
    description,
    alternates: altLanguages(`/carta/${menu}/${producto}`),
    openGraph: {title, description, images: product.image ? [product.image] : undefined}
  };
}

export default async function ProductPage({
  params
}: {
  params: Promise<{locale: string; menu: string; producto: string}>;
}) {
  const {locale, menu, producto} = await params;
  if (menu === 'hamburgueseria') redirect(`/${locale}/burguer/carta/${producto}`);
  setRequestLocale(locale);
  const data = await getMenu(menu);
  if (!data) notFound();
  const product = findProduct(data.categories, producto);
  if (!product) notFound();
  // Las salsas ya vienen en el menú cargado: sin consulta extra.
  const sauces = data.categories.find((c) => c.role === 'carousel')?.products ?? [];
  return <ProductDetail product={product} menuSlug={menu} theme={data.theme} sauces={sauces} />;
}
