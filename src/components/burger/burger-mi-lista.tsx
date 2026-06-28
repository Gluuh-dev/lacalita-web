'use client';

import {ListChecks} from 'lucide-react';
import {useMenuStore} from '@/components/menu/store';
import {ListView} from '@/components/menu/menu-tabbar';

export default function BurgerMiLista({locale}: {locale: string}) {
  const s = useMenuStore();
  const items = Object.values(s.list).filter((x) => x.item.menuSlug === 'hamburgueseria');
  const count = items.reduce((n, x) => n + x.qty, 0);
  return (
    <main className="min-h-screen bg-[#fdfbf7] px-4 pb-28 pt-20 text-[#2a1713]">
      <div className="mx-auto max-w-md duration-500 animate-in fade-in slide-in-from-bottom-3 fill-mode-both">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-[#c94a3c]/12 text-[#c94a3c]">
            <ListChecks className="size-6" />
          </span>
          <div>
            <h1 className="font-eight text-3xl leading-none">Mi lista</h1>
            <p className="mt-1 text-sm text-[#2a1713]/55">{count} {count === 1 ? 'producto' : 'productos'}</p>
          </div>
        </div>
        <p className="mb-5 rounded-2xl bg-[#c94a3c]/8 px-4 py-3 text-sm text-[#2a1713]/70">
          Guarda lo que te apetece y enséñaselo al camarero. No es un pedido.
        </p>
        <ListView items={items} locale={locale} />
      </div>
    </main>
  );
}
