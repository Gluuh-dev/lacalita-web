import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {getMenu} from '@/lib/queries';
import {tx} from '@/lib/localize';
import MenuView from '@/components/menu-view';

export const revalidate = 300;

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string; menu: string}>;
}) {
  const {locale, menu} = await params;
  const data = await getMenu(menu);
  if (!data) return {};
  const title = `${tx(data.name, locale)} · La Calita`;
  const description = data.subtitle ? tx(data.subtitle, locale) : undefined;
  return {
    title,
    description,
    openGraph: {title, description, images: data.header_image ? [data.header_image] : undefined}
  };
}

export default async function MenuPage({
  params
}: {
  params: Promise<{locale: string; menu: string}>;
}) {
  const {locale, menu} = await params;
  setRequestLocale(locale);
  const data = await getMenu(menu);
  if (!data) notFound();
  return <MenuView menu={data} locale={locale} />;
}
