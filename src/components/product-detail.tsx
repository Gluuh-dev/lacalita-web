'use client';

import {useState} from 'react';
import Image from 'next/image';
import {motion, useReducedMotion} from 'framer-motion';
import {useTranslations, useLocale} from 'next-intl';
import {Heart, Plus, Minus, X, Maximize2} from 'lucide-react';
import {toast} from 'sonner';
import {Link} from '@/i18n/navigation';
import {tx, euro} from '@/lib/localize';
import type {Product} from '@/lib/queries';
import AllergenIcon from './allergen-icon';
import {useIsAdmin} from '@/lib/use-is-admin';
import {useFavGate} from '@/lib/use-fav-gate';
import {useMenuStore, type MenuItem} from '@/components/menu/store';

export default function ProductDetail({
  product,
  menuSlug,
  theme
}: {
  product: Product;
  menuSlug: string;
  theme: string;
}) {
  const isAdmin = useIsAdmin();
  const t = useTranslations('menu');
  const locale = useLocale();
  const reduce = useReducedMotion();
  const {isFav, qty, add, dec} = useMenuStore();
  const favGate = useFavGate();
  const item: MenuItem = {
    id: product.id,
    name: tx(product.name, locale),
    price: product.price != null ? Number(product.price) : null,
    image: product.image ?? null,
    slug: product.slug,
    menuSlug,
    video: product.video ?? null
  };
  const [zoom, setZoom] = useState(false);
  const n = qty(product.id);
  const fav = isFav(product.id);
  const hasMedia = !!(product.video || product.image);
  const variants = product.product_variants ?? [];
  const allergens = (product.product_allergens ?? [])
    .map((pa) => pa.allergens)
    .filter(Boolean);

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: {opacity: 0, y: 16},
          animate: {opacity: 1, y: 0},
          transition: {duration: 0.5, delay}
        };

  return (
    <div data-theme={theme} className="min-h-screen bg-bg text-ink">
      <div className="mx-auto max-w-3xl px-4 pb-32 pt-20">
        <div className="flex items-center justify-between gap-3">
          <Link
            href={menuSlug === 'hamburgueseria' ? '/burguer/carta' : `/carta/${menuSlug}`}
            className="inline-flex items-center gap-1.5 font-adam text-[0.72rem] uppercase tracking-[0.1em] text-ink-2 hover:text-ink"
          >
            ← {t('back')}
          </Link>
          {isAdmin && (
            <a
              href={`/admin/productos/${menuSlug}`}
              className="rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white hover:bg-black"
            >
              ✎ Editar producto
            </a>
          )}
        </div>

        <motion.div
          {...(reduce
            ? {}
            : {
                initial: {opacity: 0, scale: 0.96},
                animate: {opacity: 1, scale: 1},
                transition: {duration: 0.5}
              })}
          onClick={() => hasMedia && setZoom(true)}
          className={`relative mt-4 aspect-video overflow-hidden rounded-3xl bg-brand/15 ${hasMedia ? 'cursor-zoom-in' : ''}`}
        >
          {hasMedia && (
            <span className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur">
              <Maximize2 className="size-4" />
            </span>
          )}
          {product.video ? (
            <video
              src={product.video}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : product.image ? (
            <Image
              src={product.image}
              alt={tx(product.name, locale)}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-serif text-7xl text-brand-deep/30">
              {tx(product.name, locale).charAt(0)}
            </div>
          )}
        </motion.div>

        <motion.h1 {...fade(0.1)} className="mt-6 font-serif text-4xl">
          {tx(product.name, locale)}
        </motion.h1>

        {product.price != null && (
          <motion.p
            {...fade(0.15)}
            className="mt-2 text-2xl font-semibold text-brand-deep"
          >
            {euro(Number(product.price), locale)}
          </motion.p>
        )}

        {variants.length > 0 && (
          <motion.ul {...fade(0.15)} className="mt-3 space-y-1">
            {variants.map((v) => (
              <li key={v.id} className="flex justify-between border-b border-line py-1.5">
                <span>{tx(v.name, locale)}</span>
                <span className="font-semibold text-brand-deep">
                  {euro(Number(v.price), locale)}
                </span>
              </li>
            ))}
          </motion.ul>
        )}

        {product.description && (
          <motion.p {...fade(0.2)} className="mt-4 text-lg leading-relaxed text-ink-2">
            {tx(product.description, locale)}
          </motion.p>
        )}

        {allergens.length > 0 && (
          <motion.div {...fade(0.25)} className="mt-8">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-3">
              {t('allergens')}
            </h2>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink/70">
              {allergens.map((a) => (
                <li key={a.code} className="flex items-center gap-1.5">
                  <AllergenIcon src={a.icon} label={tx(a.name, locale)} size={24} />
                  {tx(a.name, locale)}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>

      {/* Barra de acciones: favorito + añadir a mi lista */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <button
            onClick={() => favGate(item)}
            aria-label="Favorito"
            className={`flex size-12 shrink-0 items-center justify-center rounded-full border transition active:scale-90 ${fav ? 'border-red-300 bg-red-50 text-red-500' : 'border-line text-ink-3 hover:border-brand'}`}
          >
            <Heart className="size-5" fill={fav ? 'currentColor' : 'none'} />
          </button>
          {n === 0 ? (
            <button
              onClick={() => {
                add(item);
                toast.success('Añadido a tu lista');
              }}
              className="flex-1 rounded-full bg-brand py-3.5 font-semibold text-on-primary transition hover:bg-brand-deep"
            >
              Añadir a mi lista
            </button>
          ) : (
            <div className="flex flex-1 items-center justify-between rounded-full bg-brand px-3 py-2 text-on-primary">
              <button onClick={() => dec(item.id)} aria-label="Quitar" className="flex size-9 items-center justify-center rounded-full bg-white/20"><Minus className="size-5" /></button>
              <span className="font-bold tabular-nums">{n} en tu lista</span>
              <button onClick={() => add(item)} aria-label="Añadir" className="flex size-9 items-center justify-center rounded-full bg-white/20"><Plus className="size-5" /></button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox: imagen/vídeo a pantalla grande */}
      {zoom && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 duration-200 animate-in fade-in" onClick={() => setZoom(false)}>
          <button aria-label="Cerrar" className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur">
            <X className="size-5" />
          </button>
          {product.video ? (
            <video src={product.video} autoPlay muted loop playsInline controls onClick={(e) => e.stopPropagation()} className="max-h-[88vh] max-w-full rounded-2xl" />
          ) : product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image} alt={tx(product.name, locale)} onClick={(e) => e.stopPropagation()} className="max-h-[88vh] max-w-full rounded-2xl object-contain" />
          ) : null}
        </div>
      )}
    </div>
  );
}
