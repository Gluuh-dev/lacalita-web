import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {getProduct, getSauces} from '@/lib/queries';
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
  const [data, sauces] = await Promise.all([getProduct(producto), getSauces('hamburgueseria')]);
  if (!data) notFound();
  return <ProductDetail product={data.product} menuSlug="hamburgueseria" theme={data.theme} sauces={sauces} />;
}
