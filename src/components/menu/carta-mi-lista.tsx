'use client';

import {ListChecks} from 'lucide-react';
import {useMenuStore} from '@/components/menu/store';
import {ListView} from '@/components/menu/menu-tabbar';

export default function CartaMiLista({locale, menuSlug}: {locale: string; menuSlug: string}) {
  const s = useMenuStore();
  const items = Object.values(s.list).filter((x) => x.item.menuSlug === menuSlug);
  const count = items.reduce((n, x) => n + x.qty, 0);
  return (
    <main className="min-h-screen bg-bg px-4 pb-28 pt-20 text-ink">
      <div className="mx-auto max-w-md duration-500 animate-in fade-in slide-in-from-bottom-3 fill-mode-both">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-brand/12 text-brand-deep">
            <ListChecks className="size-6" />
          </span>
          <div>
            <h1 className="font-serif text-3xl leading-none">Mi lista</h1>
            <p className="mt-1 text-sm text-ink-3">{count} {count === 1 ? 'plato' : 'platos'}</p>
          </div>
        </div>
        <ListView items={items} locale={locale} />
      </div>
    </main>
  );
}
