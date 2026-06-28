'use client';

import {useMenuStore} from '@/components/menu/store';
import {ListView} from '@/components/menu/menu-tabbar';

export default function BurgerMiLista({locale}: {locale: string}) {
  const s = useMenuStore();
  const items = Object.values(s.list).filter((x) => x.item.menuSlug === 'hamburgueseria');
  return (
    <main className="min-h-screen bg-bg px-4 pb-28 pt-24 text-ink">
      <div className="mx-auto max-w-md">
        <h1 className="mb-1 font-serif text-2xl">Mi lista</h1>
        <p className="mb-4 text-sm text-ink-3">Guarda lo que quieres y enséñaselo al camarero. No es un pedido.</p>
        <ListView items={items} locale={locale} />
      </div>
    </main>
  );
}
