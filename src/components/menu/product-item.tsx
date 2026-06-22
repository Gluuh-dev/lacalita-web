'use client';

import Image from 'next/image';
import {Heart, Info, Plus, Minus} from 'lucide-react';
import {tx, euro} from '@/lib/localize';
import {useMenuStore, type MenuItem} from './store';
import type {Product} from '@/lib/queries';

export default function ProductItem({
  product,
  menuSlug,
  locale
}: {
  product: Product;
  menuSlug: string;
  locale: string;
}) {
  const {isFav, toggleFav, qty, add, dec, setOpen} = useMenuStore();
  const item: MenuItem = {
    id: product.id,
    name: tx(product.name, locale),
    price: product.price != null ? Number(product.price) : null,
    image: product.image ?? null,
    slug: product.slug,
    menuSlug,
    video: product.video ?? null,
    desc: product.description ? tx(product.description, locale) : undefined,
    allergens: (product.product_allergens ?? [])
      .map((pa) => pa.allergens)
      .filter((a): a is NonNullable<typeof a> => !!a)
      .map((a) => ({code: a.code, icon: a.icon, name: a.name}))
  };
  const n = qty(item.id);
  const fav = isFav(item.id);

  return (
    <article className="ds-card--link group flex gap-3 overflow-hidden rounded-[18px] border border-line bg-surface p-3 shadow-sm sm:flex-col sm:gap-0 sm:p-0">
      <button onClick={() => setOpen(item)} className="ds-media-zoom relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-surface-sunken sm:aspect-[4/3] sm:w-full sm:rounded-none">
        {item.image && <Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 96px, 360px" className="object-cover" />}
        {item.video && <span className="absolute right-1.5 top-1.5 rounded-full bg-black/55 px-1.5 py-0.5 text-[0.6rem] text-white">▶</span>}
        <span className="absolute left-1.5 top-1.5 flex gap-1">
          {product.is_new && <span className="rounded-full bg-accent px-2 py-0.5 text-[0.6rem] font-semibold text-white shadow-sm">Nuevo</span>}
          {product.featured && <span className="rounded-full bg-brand px-2 py-0.5 text-[0.6rem] font-semibold text-on-primary shadow-sm">★</span>}
        </span>
      </button>
      <div className="flex min-w-0 flex-1 flex-col sm:p-4">
        <button onClick={() => setOpen(item)} className="min-w-0 text-left">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="truncate font-serif text-base font-semibold sm:whitespace-normal sm:text-lg">{item.name}</h3>
            {item.price != null && <span className="shrink-0 font-bold tabular-nums text-brand-deep">{euro(item.price, locale)}</span>}
          </div>
          {item.desc && <p className="mt-0.5 line-clamp-2 text-sm leading-relaxed text-ink-2">{item.desc}</p>}
        </button>
        <div className="mt-2 flex items-center gap-2 sm:mt-3">
          <button
            onClick={() => toggleFav(item)}
            aria-label="Favorito"
            className={`flex size-9 items-center justify-center rounded-full border transition ${fav ? 'border-brand bg-brand/10 text-brand-deep' : 'border-line text-ink-3 hover:border-brand'}`}
          >
            <Heart className="size-4" fill={fav ? 'currentColor' : 'none'} />
          </button>
          <button onClick={() => setOpen(item)} aria-label="Más información" className="flex size-9 items-center justify-center rounded-full border border-line text-ink-3 transition hover:border-brand">
            <Info className="size-4" />
          </button>
          <div className="ml-auto">
            {n === 0 ? (
              <button onClick={() => add(item)} className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-brand-deep">
                Añadir
              </button>
            ) : (
              <div className="flex items-center gap-2.5">
                <button onClick={() => dec(item.id)} aria-label="Quitar" className="flex size-9 items-center justify-center rounded-full bg-brand text-on-primary"><Minus className="size-4" /></button>
                <span className="w-4 text-center font-bold tabular-nums">{n}</span>
                <button onClick={() => add(item)} aria-label="Añadir" className="flex size-9 items-center justify-center rounded-full bg-brand text-on-primary"><Plus className="size-4" /></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
