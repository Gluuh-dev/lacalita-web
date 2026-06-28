import {setRequestLocale} from 'next-intl/server';
import BurgerMiLista from '@/components/burger/burger-mi-lista';

export const metadata = {title: 'Mi lista · La Calita Burger', robots: {index: false}};

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <BurgerMiLista locale={locale} />;
}
