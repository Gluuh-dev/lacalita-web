'use client';

import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';
import {Link} from '@/i18n/navigation';
import {tx, euro} from '@/lib/localize';
import type {Product} from '@/lib/queries';
import AllergenIcon from './allergen-icon';
import {useIsAdmin} from '@/lib/use-is-admin';

export default function ProductCard({
  product,
  menuSlug,
  locale
}: {
  product: Product;
  menuSlug: string;
  locale: string;
}) {
  const t = useTranslations('menu');
  const router = useRouter();
  const isAdmin = useIsAdmin();
  const variants = product.product_variants ?? [];
  const allergens = (product.product_allergens ?? [])
    .map((pa) => pa.allergens)
    .filter(Boolean);

  const priceLabel =
    product.price != null
      ? euro(Number(product.price), locale)
      : variants.length
        ? `${t('from')} ${euro(Math.min(...variants.map((v) => Number(v.price))), locale)}`
        : '';

  return (
    <Link
      href={`/carta/${menuSlug}/${product.slug}`}
      className="group ds-card--link relative flex h-full flex-col overflow-hidden rounded-[20px] border border-line bg-surface shadow-sm"
    >
      <div className="ds-media-zoom relative aspect-[4/3] overflow-hidden bg-surface-sunken">
        {product.image ? (
          <Image
            src={product.image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : product.video ? (
          <video
            src={product.video}
            muted
            loop
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-serif text-4xl text-brand-deep/40">
            {tx(product.name, locale).charAt(0)}
          </div>
        )}
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-brand px-2.5 py-0.5 text-xs font-medium text-on-primary shadow-sm">
            ★ Destacado
          </span>
        )}
        {isAdmin && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/admin/productos/${product.id}`);
            }}
            className="absolute right-2 top-2 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur hover:bg-black"
          >
            ✎ Editar
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-[1.1rem]">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-serif text-lg font-semibold leading-tight">{tx(product.name, locale)}</h3>
          {priceLabel && (
            <span className="shrink-0 font-bold tabular-nums text-brand-deep">{priceLabel}</span>
          )}
        </div>
        {product.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-ink-2">
            {tx(product.description, locale)}
          </p>
        )}
        {allergens.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {allergens.map((a) => (
              <AllergenIcon key={a.code} src={a.icon} label={tx(a.name, locale)} size={22} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
