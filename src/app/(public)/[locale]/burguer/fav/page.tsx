import {setRequestLocale} from 'next-intl/server';
import BurgerFavoritos from '@/components/burger/burger-favoritos';

export const metadata = {title: 'Favoritos · La Calita Burger', robots: {index: false}};

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <BurgerFavoritos locale={locale} />;
}
