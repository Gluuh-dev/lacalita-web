'use client';

import {useState} from 'react';
import Image from 'next/image';
import {motion, useReducedMotion} from 'framer-motion';
import {useTranslations, useLocale} from 'next-intl';
import {Heart, Plus, Minus, X, Maximize2, Share2} from 'lucide-react';
import {toast} from 'sonner';
import {tx, euro} from '@/lib/localize';
import type {Product} from '@/lib/queries';
import AllergenIcon from './allergen-icon';
import {useIsAdmin} from '@/lib/use-is-admin';
import {useFavGate} from '@/lib/use-fav-gate';
import {useBackClose} from '@/lib/use-back-close';
import VoteButton from '@/components/burger/vote-button';
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
  const tc = useTranslations('carta');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const reduce = useReducedMotion();
  const {isFav, qty, add, dec} = useMenuStore();
  const favGate = useFavGate();
  const variants = product.product_variants ?? [];
  // Variante elegida (Media/Entera, 3/6 uds). El precio y "Añadir" la siguen.
  const [vi, setVi] = useState(0);
  const sel = variants[vi];
  const name = tx(product.name, locale);
  const shownPrice = sel ? Number(sel.price) : product.price != null ? Number(product.price) : null;
  const favItem: MenuItem = {
    id: product.id,
    name,
    price: product.price != null ? Number(product.price) : null,
    image: product.image ?? null,
    slug: product.slug,
    menuSlug,
    video: product.video ?? null
  };
  // Lo que va a "Mi lista": con variante, id e importe propios (líneas separadas).
  const listItem: MenuItem = sel
    ? {...favItem, id: `${product.id}::${sel.id}`, name: `${name} · ${tx(sel.name, locale)}`, price: Number(sel.price), variant: tx(sel.name, locale)}
    : favItem;
  const [zoom, setZoom] = useState(false);
  // Atrás (Android) cierra la imagen ampliada en vez de salir de la página.
  useBackClose(zoom, () => setZoom(false));
  const n = qty(listItem.id);
  const fav = isFav(product.id);

  async function share() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) await navigator.share({title: name, url});
      else {
        await navigator.clipboard.writeText(url);
        toast.success(tc('linkCopied'));
      }
    } catch {
      /* cancelado */
    }
  }
  const hasMedia = !!(product.video || product.image);
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
      <div className="mx-auto max-w-3xl px-4 pb-32 pt-14">
        <motion.div
          {...(reduce
            ? {}
            : {
                initial: {opacity: 0, scale: 0.96},
                animate: {opacity: 1, scale: 1},
                transition: {duration: 0.5}
              })}
          onClick={() => product.image && !product.video && setZoom(true)}
          className={`lc-img-loading relative aspect-[4/5] max-h-[68svh] overflow-hidden rounded-3xl ${product.image && !product.video ? 'cursor-zoom-in' : ''}`}
        >
          {hasMedia && (
            <button
              type="button"
              aria-label="Ampliar"
              onClick={(e) => {
                e.stopPropagation();
                setZoom(true);
              }}
              className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition active:scale-90"
            >
              <Maximize2 className="size-4" />
            </button>
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
          ) : null}
        </motion.div>

        <motion.h1 {...fade(0.1)} className="mt-6 font-serif text-4xl">
          {tx(product.name, locale)}
        </motion.h1>

        {shownPrice != null && (
          <motion.p
            {...fade(0.15)}
            className="mt-2 text-2xl font-semibold text-brand-deep"
          >
            {euro(shownPrice, locale)}
          </motion.p>
        )}

        {menuSlug === 'hamburgueseria' && (
          <div className="mt-4 flex items-center gap-2">
            <VoteButton id={product.id} votes={product.votes ?? 0} />
            <span className="text-sm text-ink-3">{tc('vote')}</span>
          </div>
        )}

        {/* Selector de tamaño/unidades: el precio de arriba y "Añadir" lo siguen. */}
        {variants.length > 0 && (
          <motion.div {...fade(0.16)} className="mt-4 flex flex-wrap gap-2">
            {variants.map((v, i) => {
              const on = i === vi;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVi(i)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${on ? 'border-brand bg-brand text-on-primary' : 'border-line bg-surface text-ink-2 hover:border-brand'}`}
                >
                  <span className="font-medium">{tx(v.name, locale)}</span>
                  <span className={`font-semibold ${on ? '' : 'text-brand-deep'}`}>{euro(Number(v.price), locale)}</span>
                </button>
              );
            })}
          </motion.div>
        )}

        {product.description && (
          <motion.p {...fade(0.2)} className="mt-4 text-lg leading-relaxed text-ink-2">
            {tx(product.description, locale)}
          </motion.p>
        )}

        {product.ingredients && product.ingredients.length > 0 && (
          <motion.div {...fade(0.22)} className="mt-5">
            <div className="mb-2 font-adam text-[0.66rem] uppercase tracking-[0.12em] text-ink-3">{tc('carries')}</div>
            <div className="flex flex-wrap gap-1.5">
              {product.ingredients.map((ing, i) => (
                <span key={i} className="rounded-full bg-surface-2 px-3 py-1 text-sm text-ink-2">{ing}</span>
              ))}
            </div>
          </motion.div>
        )}

        {(product.extras?.length ?? 0) > 0 && (
          <motion.div {...fade(0.24)} className="mt-8">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-3">
              {tc('sauces')}
            </h2>
            <ul className="divide-y divide-line rounded-2xl border border-line">
              {product.extras!.map((s, i) => (
                <li key={i} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-ink-2">{tx(s.name, locale)}</span>
                  <span className="font-semibold text-brand-deep">{euro(Number(s.price), locale)}</span>
                </li>
              ))}
            </ul>
          </motion.div>
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

        {isAdmin && (
          <a
            href={`/admin/productos/${menuSlug}`}
            className="mt-12 block text-center font-adam text-[0.72rem] uppercase tracking-[0.12em] text-ink-3 underline decoration-ink-3/40 underline-offset-4 hover:text-ink"
          >
            ✎ Editar producto
          </a>
        )}
      </div>

      {/* Barra de acciones: favorito + añadir a mi lista */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <button
            onClick={() => favGate(favItem)}
            aria-label="Favorito"
            className={`flex size-12 shrink-0 items-center justify-center rounded-full border transition active:scale-90 ${fav ? 'border-red-300 bg-red-50 text-red-500' : 'border-line text-ink-3 hover:border-brand'}`}
          >
            <Heart className="size-5" fill={fav ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={share}
            aria-label="Compartir"
            className="flex size-12 shrink-0 items-center justify-center rounded-full border border-line text-ink-3 transition hover:border-brand active:scale-90"
          >
            <Share2 className="size-5" />
          </button>
          {n === 0 ? (
            <button
              onClick={() => {
                add(listItem);
                toast.success(tc('addedToList'));
              }}
              className="flex-1 rounded-full bg-brand py-3.5 font-semibold text-on-primary transition hover:bg-brand-deep"
            >
              {tc('addToList')}
            </button>
          ) : (
            <div className="flex flex-1 items-center justify-between rounded-full bg-brand px-3 py-2 text-on-primary">
              <button onClick={() => dec(listItem.id)} aria-label="Quitar" className="flex size-9 items-center justify-center rounded-full bg-white/20"><Minus className="size-5" /></button>
              <span className="font-bold tabular-nums">{tc('inList', {count: n})}</span>
              <button onClick={() => add(listItem)} aria-label={tc('add')} className="flex size-9 items-center justify-center rounded-full bg-white/20"><Plus className="size-5" /></button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox: imagen/vídeo a pantalla grande */}
      {zoom && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 duration-200 animate-in fade-in" onClick={() => setZoom(false)}>
          <button aria-label={tCommon('close')} className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur">
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
