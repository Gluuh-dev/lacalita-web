'use client';

import {useState} from 'react';
import Image from 'next/image';
import {motion, useReducedMotion} from 'framer-motion';
import {useTranslations, useLocale} from 'next-intl';
import {Plus, Minus, X, Maximize2, Share2, UtensilsCrossed, Check} from 'lucide-react';
import {toast} from 'sonner';
import {Link} from '@/i18n/navigation';
import {tx, euro} from '@/lib/localize';
import type {Product, Category} from '@/lib/queries';
import ProductRail from '@/components/menu/product-rail';
import AllergenIcon from './allergen-icon';
import {useIsAdmin} from '@/lib/use-is-admin';
import {useBackClose} from '@/lib/use-back-close';
import VoteButton from '@/components/burger/vote-button';
import {useMenuStore, type MenuItem} from '@/components/menu/store';

export default function ProductDetail({
  product,
  menuSlug,
  theme,
  sauces = [],
  related = []
}: {
  product: Product;
  menuSlug: string;
  theme: string;
  sauces?: Product[];
  related?: Category[];
}) {
  // Las salsas viven en la misma carta: enlace a su detalle.
  const sauceHref = (slug: string) => (menuSlug === 'hamburgueseria' ? `/burguer/carta/${slug}` : `/carta/${menuSlug}/${slug}`);
  const isAdmin = useIsAdmin();
  const t = useTranslations('menu');
  const tc = useTranslations('carta');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const reduce = useReducedMotion();
  const {qty, add, dec} = useMenuStore();
  const variants = product.product_variants ?? [];
  // Variante elegida (Media/Entera, 3/6 uds). El precio y "Añadir" la siguen.
  const [vi, setVi] = useState(0);
  const sel = variants[vi];
  // "Hazlo menú": patatas + bebida. Se suma al precio y viaja a la lista.
  const combo = product.combo_price != null ? Number(product.combo_price) : null;
  const [asCombo, setAsCombo] = useState(false);
  const name = tx(product.name, locale);
  const basePrice = sel ? Number(sel.price) : product.price != null ? Number(product.price) : null;
  const shownPrice = basePrice != null && asCombo && combo ? basePrice + combo : basePrice;
  const favItem: MenuItem = {
    id: product.id,
    name,
    price: product.price != null ? Number(product.price) : null,
    image: product.image ?? null,
    slug: product.slug,
    menuSlug,
    video: product.video ?? null
  };
  // Lo que va a "Mi lista": variante y menú dan línea propia (id y precio propios).
  const withVariant: MenuItem = sel
    ? {...favItem, id: `${product.id}::${sel.id}`, name: `${name} · ${tx(sel.name, locale)}`, price: Number(sel.price), variant: tx(sel.name, locale)}
    : favItem;
  const listItem: MenuItem =
    asCombo && combo && withVariant.price != null
      ? {
          ...withVariant,
          id: `${withVariant.id}::menu`,
          name: `${withVariant.name} · ${tc('comboTitle')}`,
          price: withVariant.price + combo
        }
      : withVariant;
  const [zoom, setZoom] = useState(false);
  // Atrás (Android) cierra la imagen ampliada en vez de salir de la página.
  useBackClose(zoom, () => setZoom(false));
  const n = qty(listItem.id);

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

        {/* "Hazlo menú": patatas + bebida. Al activarlo suma su precio arriba y
            en el botón de añadir. Solo si la categoría lo ofrece. */}
        {combo != null && basePrice != null && (
          <motion.button
            {...fade(0.18)}
            type="button"
            onClick={() => setAsCombo((v) => !v)}
            aria-pressed={asCombo}
            className={`mt-5 flex w-full items-center gap-3 rounded-[20px] border-2 border-dashed p-4 text-left transition ${
              asCombo ? 'border-brand bg-brand/10' : 'border-line-strong hover:border-brand'
            }`}
          >
            <span className={`flex size-11 shrink-0 items-center justify-center rounded-full transition ${asCombo ? 'bg-brand text-on-primary' : 'bg-surface-sunken text-brand-deep'}`}>
              <UtensilsCrossed className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-serif text-lg font-bold leading-tight text-ink">{tc('comboTitle')}</span>
              <span className="block text-xs text-ink-3">{tc('comboSub')}</span>
            </span>
            <span className="flex shrink-0 items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-sm font-bold ${asCombo ? 'bg-brand text-on-primary' : 'bg-surface-sunken text-brand-deep'}`}>
                +{euro(combo, locale)}
              </span>
              {asCombo && <Check className="size-5 text-brand-deep" />}
            </span>
          </motion.button>
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

        {/* Salsas con su tarro, en scroll lateral (como en la carta). Si no hay
            fotos cargadas, cae a la lista de texto de los extras. */}
        {sauces.length > 0 ? (
          <motion.div {...fade(0.24)} className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-3">{tc('sauces')}</h2>
            <div className="-mx-4 snap-x snap-mandatory overflow-x-auto scroll-px-4 px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="mx-auto flex w-max gap-3">
              {sauces.map((s) => (
                <Link
                  key={s.id}
                  href={sauceHref(s.slug)}
                  className="group flex w-[7.5rem] shrink-0 snap-start flex-col items-center gap-1.5 rounded-[20px] border border-line bg-surface p-3 transition hover:border-brand"
                >
                  <span className="lc-img-loading relative flex size-20 items-center justify-center overflow-hidden rounded-full bg-surface-sunken">
                    {s.image && (
                      <Image src={s.image} alt={tx(s.name, locale)} fill sizes="80px" className="object-contain transition duration-300 group-hover:scale-110" />
                    )}
                  </span>
                  <span className="line-clamp-2 text-center text-[0.78rem] font-semibold leading-tight text-ink">{tx(s.name, locale)}</span>
                  {s.price != null && <span className="text-xs font-bold text-brand-deep">{euro(Number(s.price), locale)}</span>}
                </Link>
              ))}
              </div>
            </div>
          </motion.div>
        ) : (product.extras?.length ?? 0) > 0 ? (
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
        ) : null}

        {/* Venta cruzada: el resto de la carta, para añadir sin volver atrás. */}
        {related.map((c) => (
          <ProductRail key={c.id} cat={c} menuSlug={menuSlug} excludeId={product.id} />
        ))}

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
          {/* Corazón único: favorito + voto, con el número de votos del plato. */}
          <VoteButton item={favItem} votes={product.votes ?? 0} className="h-12 shrink-0 px-4 text-base" />
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
