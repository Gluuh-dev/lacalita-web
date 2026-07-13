'use client';

import {useMenuStore} from '@/components/menu/store';
import {FavsView} from '@/components/menu/menu-tabbar';

export default function BurgerFavoritos({locale}: {locale: string}) {
  const s = useMenuStore();
  const items = Object.values(s.favs).filter((i) => i.menuSlug === 'hamburgueseria');
  return (
    <main className="min-h-screen bg-[#fdfbf7] px-4 pb-28 pt-20 text-[#2a1713]">
      {/* Sin cabecera ni contador: la pestaña activa ya dice dónde estás. */}
      <div className="mx-auto max-w-md duration-500 animate-in fade-in slide-in-from-bottom-3 fill-mode-both">
        <FavsView items={items} locale={locale} />
      </div>
    </main>
  );
}
