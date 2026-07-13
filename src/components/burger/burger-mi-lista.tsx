'use client';

import {useTranslations} from 'next-intl';
import {useMenuStore} from '@/components/menu/store';
import {ListView} from '@/components/menu/menu-tabbar';

export default function BurgerMiLista({locale}: {locale: string}) {
  const s = useMenuStore();
  const t = useTranslations('carta');
  const items = Object.values(s.list).filter((x) => x.item.menuSlug === 'hamburgueseria');
  return (
    // Sin cabecera ni contador: la pestaña activa ya dice dónde estás.
    <main className="relative min-h-screen bg-[#fdfbf7] px-4 pb-40 pt-20 text-[#2a1713]">
      <div className="mx-auto max-w-md duration-500 animate-in fade-in slide-in-from-bottom-3 fill-mode-both">
        <ListView items={items} locale={locale} />
      </div>

      {/* Aviso al pie, como escrito en el propio fondo. */}
      <p className="pointer-events-none absolute inset-x-0 bottom-28 mx-auto max-w-xs px-6 text-center text-[0.72rem] leading-relaxed text-[#2a1713]/25">
        {t('listNotOrder')}
      </p>
    </main>
  );
}
