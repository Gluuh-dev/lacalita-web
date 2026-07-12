'use client';

import {useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {toast} from 'sonner';
import {Sandwich, Plus, Check} from 'lucide-react';
import {tx, euro} from '@/lib/localize';
import type {Category} from '@/lib/queries';
import {useMenuStore, type MenuItem} from './store';

// Configurador "Arma tu tostada": pan (base) arriba, relleno (topping) abajo,
// tamaño compartido y total en vivo. Convive con las listas normales.
export default function ToastBuilder({base, topping, menuSlug}: {base: Category; topping: Category; menuSlug: string}) {
  const t = useTranslations('carta');
  const locale = useLocale();
  const {add} = useMenuStore();

  const breads = base.products;
  const toppings = topping.products;
  const [breadIdx, setBreadIdx] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(1); // Entera por defecto (la más pedida)
  const [topIdx, setTopIdx] = useState(0);

  const bread = breads[breadIdx];
  const top = toppings[topIdx];
  if (!bread || !top) return null;

  const sizes = bread.product_variants ?? [];
  const size = sizes[sizeIdx] ?? sizes[0];
  const breadPrice = size ? Number(size.price) : 0;
  const topPrice = Number(top.product_variants?.[sizeIdx]?.price ?? 0);
  const total = breadPrice + topPrice;

  const priceOf = (p: (typeof toppings)[number]) => Number(p.product_variants?.[sizeIdx]?.price ?? 0);

  function addToast() {
    const sizeName = size ? tx(size.name, locale) : '';
    const item: MenuItem = {
      id: `tostada::${bread.id}:${top.id}:${sizeIdx}`,
      name: `${tx(bread.name, locale)} · ${tx(top.name, locale)}`,
      price: total,
      image: null,
      slug: 'tostada',
      menuSlug,
      variant: sizeName
    };
    add(item);
    toast.success(t('addedToList'));
  }

  const chip = (on: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-medium transition ${on ? 'border-brand bg-brand text-on-primary' : 'border-line bg-surface text-ink-2 hover:border-brand'}`;

  return (
    <div className="mx-auto mb-9 max-w-5xl px-4">
      <div className="overflow-hidden rounded-[24px] border border-line bg-surface shadow-sm">
        <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-5 py-3">
          <Sandwich className="size-5 text-brand-deep" />
          <h2 className="font-serif text-xl font-bold">{t('buildTitle')}</h2>
        </div>

        <div className="space-y-5 p-5">
          {/* 1 · Pan + tamaño */}
          <div>
            <div className="mb-2 flex items-baseline gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-brand text-[0.7rem] font-bold text-on-primary">1</span>
              <span className="text-sm font-semibold uppercase tracking-wide text-ink-2">{t('buildBread')}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {breads.map((b, i) => (
                <button key={b.id} type="button" onClick={() => setBreadIdx(i)} className={chip(i === breadIdx)}>
                  {tx(b.name, locale)}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-3">{t('buildSize')}</span>
              {sizes.map((s, i) => (
                <button key={s.id} type="button" onClick={() => setSizeIdx(i)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${i === sizeIdx ? 'border-brand bg-brand text-on-primary' : 'border-line text-ink-2 hover:border-brand'}`}>
                  {tx(s.name, locale)}
                </button>
              ))}
            </div>
          </div>

          {/* 2 · Relleno */}
          <div>
            <div className="mb-2 flex items-baseline gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-brand text-[0.7rem] font-bold text-on-primary">2</span>
              <span className="text-sm font-semibold uppercase tracking-wide text-ink-2">{t('buildTopping')}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {toppings.map((p, i) => {
                const on = i === topIdx;
                const extra = priceOf(p);
                return (
                  <button key={p.id} type="button" onClick={() => setTopIdx(i)} className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm transition ${on ? 'border-brand bg-brand text-on-primary' : 'border-line bg-surface text-ink-2 hover:border-brand'}`}>
                    {on && <Check className="size-3.5" />}
                    <span className="font-medium">{tx(p.name, locale)}</span>
                    <span className={`text-xs font-semibold ${on ? 'opacity-90' : 'text-brand-deep'}`}>{extra > 0 ? `+${euro(extra, locale)}` : t('included')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Total + añadir */}
          <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-ink-3">{t('buildTotal')}</div>
              <div className="text-2xl font-bold text-brand-deep">{euro(total, locale)}</div>
            </div>
            <button type="button" onClick={addToast} className="flex items-center gap-2 rounded-full bg-brand px-5 py-3 font-semibold text-on-primary transition hover:bg-brand-deep active:scale-95">
              <Plus className="size-4" /> {t('addToList')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
