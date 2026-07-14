import {setRequestLocale, getTranslations} from 'next-intl/server';
import {getMenus} from '@/lib/queries';
import {altLanguages} from '@/lib/site';
import MenuCard from '@/components/menu-card';

export const revalidate = 300;

export function generateMetadata() {
  return {alternates: altLanguages('/carta')};
}

export default async function CartaSelector({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('menu');
  const tCarta = await getTranslations('carta');
  const menus = await getMenus();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-32 pt-28 sm:pt-32">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <div className="eyebrow mb-3">{t('title')}</div>
        <h1 className="h-section font-serif">{tCarta('question')}</h1>
        <p className="mt-3 text-lg text-ink-2">{tCarta('intro')}</p>
      </div>

      {/* Mismas tarjetas que la portada: textura de cada carta e icono en cristal. */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {menus.map((m) => (
          <MenuCard key={m.id} menu={m} locale={locale} />
        ))}
      </div>
    </main>
  );
}
