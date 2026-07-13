'use client';

import Image from 'next/image';
import {useLocale, useTranslations} from 'next-intl';
import {Plus, Minus} from 'lucide-react';
import {toast} from 'sonner';
import {Link, useRouter} from '@/i18n/navigation';
import {tx, euro} from '@/lib/localize';
import type {Category, Product} from '@/lib/queries';
import {useMenuStore, type MenuItem} from './store';

// Carrusel de una categoría al pie del detalle: ver y añadir sin salir del plato.
export default function ProductRail({cat, menuSlug, excludeId}: {cat: Category; menuSlug: string; excludeId?: string}) {
  const locale = useLocale();
  const t = useTranslations('carta');
  const tMenu = useTranslations('menu');
  const {qty, add, dec} = useMenuStore();
  const router = useRouter();

  const items = (cat.products ?? []).filter((p) => p.id !== excludeId);
  if (!items.length) return null;
  const href = (slug: string) => (menuSlug === 'hamburgueseria' ? `/burguer/carta/${slug}` : `/carta/${menuSlug}/${slug}`);

  return (
    <div className="mt-8">
      <h2 className="eyebrow mb-3">{tx(cat.name, locale)}</h2>
      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((p) => (
          <RailCard key={p.id} p={p} menuSlug={menuSlug} href={href(p.slug)} locale={locale} t={t} tMenu={tMenu} qty={qty} add={add} dec={dec} push={router.push} />
        ))}
      </div>
    </div>
  );
}

function RailCard({
  p,
  menuSlug,
  href,
  locale,
  t,
  tMenu,
  qty,
  add,
  dec,
  push
}: {
  p: Product;
  menuSlug: string;
  href: string;
  locale: string;
  t: (k: string) => string;
  tMenu: (k: string) => string;
  qty: (id: string) => number;
  add: (i: MenuItem) => void;
  dec: (id: string) => void;
  push: (h: string) => void;
}) {
  const variants = p.product_variants ?? [];
  const hasVariants = variants.length > 0;
  const from = hasVariants ? Math.min(...variants.map((v) => Number(v.price))) : null;
  const n = qty(p.id);
  const item: MenuItem = {
    id: p.id,
    name: tx(p.name, locale),
    price: p.price != null ? Number(p.price) : null,
    image: p.image ?? null,
    slug: p.slug,
    menuSlug
  };

  return (
    <div className="flex w-[9.5rem] shrink-0 snap-start flex-col overflow-hidden rounded-[18px] border border-line bg-surface">
      <Link href={href} className="lc-img-loading relative block aspect-[4/3] overflow-hidden">
        {p.image && <Image src={p.image} alt={tx(p.name, locale)} fill sizes="152px" className="object-cover transition duration-300 hover:scale-105" />}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <Link href={href} className="line-clamp-2 text-[0.8rem] font-semibold leading-tight text-ink">
          {tx(p.name, locale)}
        </Link>
        <div className="mt-auto flex items-center justify-between gap-1 pt-1">
          {p.price != null ? (
            <span className="text-sm font-bold text-brand-deep">{euro(Number(p.price), locale)}</span>
          ) : from != null ? (
            <span className="text-[0.7rem] font-semibold text-brand-deep">{tMenu('from')} {euro(from, locale)}</span>
          ) : (
            <span />
          )}
          {/* Con variantes no hay precio único: se elige en el detalle. */}
          {hasVariants ? (
            <button type="button" onClick={() => push(href)} aria-label={t('choose')} className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-on-primary">
              <Plus className="size-4" />
            </button>
          ) : n === 0 ? (
            <button
              type="button"
              onClick={() => {
                add(item);
                toast.success(t('addedToList'));
              }}
              aria-label={t('add')}
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-on-primary transition active:scale-90"
            >
              <Plus className="size-4" />
            </button>
          ) : (
            <span className="flex items-center gap-1">
              <button type="button" onClick={() => dec(p.id)} aria-label="Quitar" className="flex size-7 items-center justify-center rounded-full bg-brand text-on-primary"><Minus className="size-3.5" /></button>
              <span className="w-3 text-center text-xs font-bold tabular-nums">{n}</span>
              <button type="button" onClick={() => add(item)} aria-label={t('add')} className="flex size-7 items-center justify-center rounded-full bg-brand text-on-primary"><Plus className="size-3.5" /></button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
