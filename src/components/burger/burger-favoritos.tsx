'use client';

import {Heart} from 'lucide-react';
import {useMenuStore} from '@/components/menu/store';
import {FavsView} from '@/components/menu/menu-tabbar';

export default function BurgerFavoritos({locale}: {locale: string}) {
  const s = useMenuStore();
  const items = Object.values(s.favs).filter((i) => i.menuSlug === 'hamburgueseria');
  return (
    <main className="min-h-screen bg-[#fdfbf7] px-4 pb-28 pt-20 text-[#2a1713]">
      <div className="mx-auto max-w-md duration-500 animate-in fade-in slide-in-from-bottom-3 fill-mode-both">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-[#c94a3c]/12 text-[#c94a3c]">
            <Heart className="size-6" fill="currentColor" />
          </span>
          <div>
            <h1 className="font-eight text-3xl leading-none">Favoritos</h1>
            <p className="mt-1 text-sm text-[#2a1713]/55">{items.length} {items.length === 1 ? 'guardado' : 'guardados'}</p>
          </div>
        </div>
        <FavsView items={items} locale={locale} />
      </div>
    </main>
  );
}
