'use client';

import {useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {toast} from 'sonner';
import {Sandwich, Plus, Check} from 'lucide-react';
import {tx, euro} from '@/lib/localize';
import type {Category, Product} from '@/lib/queries';
import {useMenuStore, type MenuItem} from './store';

// Configurador "Arma tu tostada": pan + tamaño + varios rellenos que se suman.
// Compacto para que en móvil no ocupe media pantalla.
export default function ToastBuilder({base, topping, menuSlug}: {base: Category; topping: Category; menuSlug: string}) {
  const t = useTranslations('carta');
  const locale = useLocale();
  const {add} = useMenuStore();

  const breads = base.products;
  const toppings = topping.products;
  const [breadIdx, setBreadIdx] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(1); // Entera por defecto
  const [sel, setSel] = useState<Set<string>>(new Set());

  const bread = breads[breadIdx];
  if (!bread) return null;
  const sizes = bread.product_variants ?? [];
  const size = sizes[sizeIdx] ?? sizes[0];
  const breadPrice = size ? Number(size.price) : 0;
  const priceOf = (p: Product) => Number(p.product_variants?.[sizeIdx]?.price ?? 0);
  const total = breadPrice + toppings.filter((p) => sel.has(p.id)).reduce((s, p) => s + priceOf(p), 0);

  const toggle = (id: string) =>
    setSel((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  function addToast() {
    const names = toppings.filter((p) => sel.has(p.id)).map((p) => tx(p.name, locale));
    const sizeName = size ? tx(size.name, locale) : '';
    const item: MenuItem = {
      id: `tostada::${bread.id}:${sizeIdx}:${[...sel].sort().join(',')}`,
      name: names.length ? `${tx(bread.name, locale)}: ${names.join(', ')}` : tx(bread.name, locale),
      price: total,
      image: null,
      slug: 'tostada',
      menuSlug,
      variant: sizeName
    };
    add(item);
    toast.success(t('addedToList'));
  }

  const pill = (on: boolean) =>
    `rounded-full border px-3 py-1.5 text-xs font-semibold transition ${on ? 'border-brand bg-brand text-on-primary' : 'border-line bg-surface text-ink-2 hover:border-brand'}`;

  return (
    <div className="mx-auto mb-8 max-w-5xl px-4">
      <div className="overflow-hidden rounded-[20px] border border-line bg-surface shadow-sm">
        <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-2.5">
          <Sandwich className="size-4 text-brand-deep" />
          <h2 className="font-serif text-lg font-bold">{t('buildTitle')}</h2>
        </div>

        <div className="space-y-3.5 p-4">
          {/* Pan + tamaño en una línea que envuelve */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[0.7rem] font-bold uppercase tracking-wide text-brand-deep">{t('buildBread')}</span>
            {breads.map((b, i) => (
              <button key={b.id} type="button" onClick={() => setBreadIdx(i)} className={pill(i === breadIdx)}>
                {tx(b.name, locale)}
              </button>
            ))}
            <span className="ml-1 h-4 w-px bg-line" />
            {sizes.map((s, i) => (
              <button key={s.id} type="button" onClick={() => setSizeIdx(i)} className={pill(i === sizeIdx)}>
                {tx(s.name, locale)}
              </button>
            ))}
          </div>

          {/* Rellenos: multi-selección, cuadrícula densa */}
          <div>
            <div className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-wide text-brand-deep">{t('buildTopping')}</div>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {toppings.map((p) => {
                const on = sel.has(p.id);
                const ex = priceOf(p);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggle(p.id)}
                    className={`flex items-center justify-between gap-1 rounded-lg border px-2 py-1.5 text-left text-[0.8rem] transition ${on ? 'border-brand bg-brand/10' : 'border-line hover:border-brand/50'}`}
                  >
                    <span className="flex min-w-0 items-center gap-1.5">
                      <span className={`flex size-4 shrink-0 items-center justify-center rounded border ${on ? 'border-brand bg-brand text-on-primary' : 'border-line-strong'}`}>
                        {on && <Check className="size-2.5" strokeWidth={3} />}
                      </span>
                      <span className="truncate">{tx(p.name, locale)}</span>
                    </span>
                    <span className={`shrink-0 text-[0.7rem] font-semibold ${on ? 'text-brand-deep' : 'text-ink-3'}`}>
                      {ex > 0 ? `+${euro(ex, locale)}` : t('included')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Total + añadir */}
          <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[0.7rem] uppercase tracking-wide text-ink-3">{t('buildTotal')}</span>
              <span className="text-xl font-bold text-brand-deep">{euro(total, locale)}</span>
            </div>
            <button type="button" onClick={addToast} className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-brand-deep active:scale-95">
              <Plus className="size-4" /> {t('addToList')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
