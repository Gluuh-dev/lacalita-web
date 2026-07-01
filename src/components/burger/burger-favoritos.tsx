'use client';

import {useMenuStore} from '@/components/menu/store';
import {FavsView} from '@/components/menu/menu-tabbar';

export default function BurgerFavoritos({locale}: {locale: string}) {
  const s = useMenuStore();
  const items = Object.values(s.favs).filter((i) => i.menuSlug === 'hamburgueseria');
  return (
    <main className="min-h-screen bg-[#fdfbf7] px-4 pb-28 pt-20 text-[#2a1713]">
      <div className="mx-auto max-w-md duration-500 animate-in fade-in slide-in-from-bottom-3 fill-mode-both">
        <div className="mb-6">
          <h1 className="font-eight text-3xl leading-none">Favoritos</h1>
          <p className="mt-1 text-sm text-[#2a1713]/55">{items.length} {items.length === 1 ? 'guardado' : 'guardados'}</p>
        </div>
        <FavsView items={items} locale={locale} />
      </div>
    </main>
  );
}
