'use client';

import {useMenuStore} from '@/components/menu/store';
import {FavsView} from '@/components/menu/menu-tabbar';

export default function CartaFavoritos({locale, menuSlug}: {locale: string; menuSlug: string}) {
  const s = useMenuStore();
  const items = Object.values(s.favs).filter((i) => i.menuSlug === menuSlug);
  return (
    // Sin cabecera: la pestaña activa ya dice dónde estás.
    <main className="min-h-screen bg-bg px-4 pb-28 pt-20 text-ink">
      <div className="mx-auto max-w-md duration-500 animate-in fade-in slide-in-from-bottom-3 fill-mode-both">
        <FavsView items={items} locale={locale} />
      </div>
    </main>
  );
}
