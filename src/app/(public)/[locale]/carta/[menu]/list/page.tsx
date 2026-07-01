import {setRequestLocale} from 'next-intl/server';
import CartaMiLista from '@/components/menu/carta-mi-lista';

export const metadata = {title: 'Mi lista · La Calita', robots: {index: false}};

export default async function Page({params}: {params: Promise<{locale: string; menu: string}>}) {
  const {locale, menu} = await params;
  setRequestLocale(locale);
  return <CartaMiLista locale={locale} menuSlug={menu} />;
}
