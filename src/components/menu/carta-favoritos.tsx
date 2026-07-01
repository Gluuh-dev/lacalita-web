'use client';

import {Heart} from 'lucide-react';
import {useMenuStore} from '@/components/menu/store';
import {FavsView} from '@/components/menu/menu-tabbar';

export default function CartaFavoritos({locale, menuSlug}: {locale: string; menuSlug: string}) {
  const s = useMenuStore();
  const items = Object.values(s.favs).filter((i) => i.menuSlug === menuSlug);
  return (
    <main className="min-h-screen bg-bg px-4 pb-28 pt-20 text-ink">
      <div className="mx-auto max-w-md duration-500 animate-in fade-in slide-in-from-bottom-3 fill-mode-both">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-brand/12 text-brand-deep">
            <Heart className="size-6" fill="currentColor" />
          </span>
          <div>
            <h1 className="font-serif text-3xl leading-none">Favoritos</h1>
            <p className="mt-1 text-sm text-ink-3">{items.length} {items.length === 1 ? 'guardado' : 'guardados'}</p>
          </div>
        </div>
        <FavsView items={items} locale={locale} />
      </div>
    </main>
  );
}
