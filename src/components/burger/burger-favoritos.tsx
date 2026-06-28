'use client';

import {useMenuStore} from '@/components/menu/store';
import {FavsView} from '@/components/menu/menu-tabbar';

export default function BurgerFavoritos({locale}: {locale: string}) {
  const s = useMenuStore();
  const items = Object.values(s.favs).filter((i) => i.menuSlug === 'hamburgueseria');
  return (
    <main className="min-h-screen bg-bg px-4 pb-28 pt-24 text-ink">
      <div className="mx-auto max-w-md">
        <h1 className="mb-4 font-serif text-2xl">Favoritos</h1>
        <FavsView items={items} locale={locale} />
      </div>
    </main>
  );
}
