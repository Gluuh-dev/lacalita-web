'use client';

import {useTranslations} from 'next-intl';
import {useMenuStore} from '@/components/menu/store';
import {ListView} from '@/components/menu/menu-tabbar';

export default function CartaMiLista({locale, menuSlug}: {locale: string; menuSlug: string}) {
  const s = useMenuStore();
  const t = useTranslations('carta');
  const items = Object.values(s.list).filter((x) => x.item.menuSlug === menuSlug);
  return (
    // Sin cabecera: la pestaña activa ya dice dónde estás.
    <main className="relative min-h-screen bg-bg px-4 pb-40 pt-20 text-ink">
      <div className="mx-auto max-w-md duration-500 animate-in fade-in slide-in-from-bottom-3 fill-mode-both">
        <ListView items={items} locale={locale} />
      </div>

      {/* Aviso al pie, como escrito en el propio fondo. */}
      <p className="pointer-events-none absolute inset-x-0 bottom-28 mx-auto max-w-xs px-6 text-center text-[0.72rem] leading-relaxed text-ink/25">
        {t('listNotOrder')}
      </p>
    </main>
  );
}
