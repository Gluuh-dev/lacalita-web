'use client';

import {useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {toast} from 'sonner';
import {Sandwich, Plus} from 'lucide-react';
import {tx, euro} from '@/lib/localize';
import type {Category, Product} from '@/lib/queries';
import {useMenuStore, type MenuItem} from './store';

// Configurador "Arma tu tostada": pan + tamaño + varios rellenos que se suman.
// Todo en píldoras que se encienden (nada de casillas de formulario).
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
  const chosen = toppings.filter((p) => sel.has(p.id));
  const total = breadPrice + chosen.reduce((s, p) => s + priceOf(p), 0);

  const toggle = (id: string) =>
    setSel((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  function addToast() {
    const names = chosen.map((p) => tx(p.name, locale));
    const item: MenuItem = {
      id: `tostada::${bread.id}:${sizeIdx}:${[...sel].sort((a, b) => a.localeCompare(b)).join(',')}`,
      name: names.length ? `${tx(bread.name, locale)}: ${names.join(', ')}` : tx(bread.name, locale),
      price: total,
      image: null,
      slug: 'tostada',
      menuSlug,
      variant: size ? tx(size.name, locale) : ''
    };
    add(item);
    toast.success(t('addedToList'));
  }

  // Resumen en vivo: "Blanco · Entera · Tomate, Aguacate"
  const summary = [tx(bread.name, locale), size ? tx(size.name, locale) : '', ...chosen.map((p) => tx(p.name, locale))]
    .filter(Boolean)
    .join(' · ');

  const eyebrow = 'mb-2.5 block font-montserrat text-[0.62rem] font-bold uppercase tracking-[0.16em] text-ink-3';

  return (
    <div className="mx-auto mb-9 max-w-5xl px-4">
      <div className="overflow-hidden rounded-[26px] border border-line bg-surface shadow-md">
        {/* Cabecera: icono en círculo + título con la serif de la marca */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-brand/15 to-transparent px-5 py-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-on-primary shadow-sm">
            <Sandwich className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-serif text-xl font-bold leading-tight text-ink">{t('buildTitle')}</h2>
            <p className="truncate text-xs text-ink-3">{t('buildSub')}</p>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5">
          {/* Pan */}
          <div>
            <span className={eyebrow}>{t('buildBread')}</span>
            <div className="flex flex-wrap gap-2">
              {breads.map((b, i) => {
                const on = i === breadIdx;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBreadIdx(i)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                      on ? 'bg-brand text-on-primary shadow-sm' : 'bg-surface-2 text-ink-2 hover:bg-surface-sunken'
                    }`}
                  >
                    {tx(b.name, locale)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tamaño: control segmentado */}
          {sizes.length > 0 && (
            <div>
              <span className={eyebrow}>{t('buildSize')}</span>
              <div className="inline-flex rounded-full bg-surface-sunken p-1">
                {sizes.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSizeIdx(i)}
                    className={`rounded-full px-5 py-1.5 text-sm font-semibold transition ${
                      i === sizeIdx ? 'bg-surface text-brand-deep shadow-sm' : 'text-ink-3'
                    }`}
                  >
                    {tx(s.name, locale)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rellenos: píldoras que se encienden (multi) */}
          <div>
            <div className="flex items-center gap-2">
              <span className={`${eyebrow} mb-0`}>{t('buildTopping')}</span>
              {chosen.length > 0 && (
                <span className="mb-2.5 flex size-5 items-center justify-center rounded-full bg-brand text-[0.65rem] font-bold text-on-primary">
                  {chosen.length}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {toppings.map((p) => {
                const on = sel.has(p.id);
                const ex = priceOf(p);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggle(p.id)}
                    className={`group flex items-center gap-1.5 rounded-full py-2 pl-3.5 pr-2.5 text-sm transition active:scale-95 ${
                      on ? 'bg-brand text-on-primary shadow-sm' : 'bg-surface-2 text-ink-2 hover:bg-surface-sunken'
                    }`}
                  >
                    <span className="font-medium">{tx(p.name, locale)}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[0.68rem] font-bold ${
                        on ? 'bg-white/25' : 'bg-surface text-brand-deep'
                      }`}
                    >
                      {ex > 0 ? `+${euro(ex, locale)}` : t('included')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Barra de total: resumen en vivo + precio + añadir */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface-2 px-5 py-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-ink-3">{summary}</p>
            <div className="flex items-baseline gap-1.5">
              <span className="font-montserrat text-[0.62rem] font-bold uppercase tracking-[0.16em] text-ink-3">{t('buildTotal')}</span>
              <span className="font-serif text-2xl font-bold text-brand-deep">{euro(total, locale)}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={addToast}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-brand-deep active:scale-95"
          >
            <Plus className="size-4" /> {t('addToList')}
          </button>
        </div>
      </div>
    </div>
  );
}
