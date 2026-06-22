'use client';

import Image from 'next/image';
import {motion, useReducedMotion} from 'framer-motion';
import {useTranslations, useLocale} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {tx, euro} from '@/lib/localize';
import type {Product} from '@/lib/queries';
import AllergenIcon from './allergen-icon';
import {useIsAdmin} from '@/lib/use-is-admin';

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
      <div className="mx-auto max-w-3xl px-4 pb-8 pt-20">
        <div className="flex items-center justify-between gap-3">
          <Link
            href={`/carta/${menuSlug}`}
            className="text-sm text-brand-deep hover:underline"
          >
            ← {t('back')}
          </Link>
          {isAdmin && (
            <a
              href={`/admin/productos/${product.id}`}
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
          className="relative mt-4 aspect-video overflow-hidden rounded-3xl bg-brand/15"
        >
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
              alt=""
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
    </div>
  );
}
