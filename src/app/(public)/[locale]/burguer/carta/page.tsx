import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {getMenu} from '@/lib/queries';
import {tx} from '@/lib/localize';
import {altLanguages} from '@/lib/site';
import MenuView from '@/components/menu-view';

export const revalidate = 300;

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const data = await getMenu('hamburgueseria');
  if (!data) return {};
  return {
    title: `Carta · ${tx(data.name, locale)} | La Calita Burger`,
    description: data.subtitle ? tx(data.subtitle, locale) : 'Todas nuestras hamburguesas, entrantes y bebidas. Smash burgers a pie de playa en Salobreña.',
    alternates: altLanguages('/burguer/carta')
  };
}

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const data = await getMenu('hamburgueseria');
  if (!data) notFound();
  return <MenuView menu={data} locale={locale} />;
}
