import {setRequestLocale} from 'next-intl/server';
import CartaFavoritos from '@/components/menu/carta-favoritos';

export const metadata = {title: 'Favoritos · La Calita', robots: {index: false}};

export default async function Page({params}: {params: Promise<{locale: string; menu: string}>}) {
  const {locale, menu} = await params;
  setRequestLocale(locale);
  return <CartaFavoritos locale={locale} menuSlug={menu} />;
}
