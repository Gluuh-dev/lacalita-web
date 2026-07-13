'use client';

import Image from 'next/image';
import {useLocale} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {tx, euro} from '@/lib/localize';
import type {Category} from '@/lib/queries';

// Categoría en carrusel lateral (salsas): tarro grande, nombre y precio.
// Al pulsar, al detalle de esa salsa.
export default function SauceCarousel({cat, menuSlug}: {cat: Category; menuSlug: string}) {
  const locale = useLocale();
  const base = menuSlug === 'hamburgueseria' ? '/burguer/carta' : `/carta/${menuSlug}`;

  return (
    <div className="mb-9">
      <h2 className="eyebrow mb-1 px-4">{tx(cat.name, locale)}</h2>
      {cat.description && <p className="mb-3 px-4 text-sm text-ink-3">{tx(cat.description, locale)}</p>}

      {/* Full-bleed: se sale del contenedor y ocupa el ancho de la pantalla, así
          los tarros asoman por los bordes e invitan a deslizar. */}
      <div className="relative left-1/2 w-screen -translate-x-1/2 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {cat.products.map((p) => (
          <Link
            key={p.id}
            href={`${base}/${p.slug}`}
            className="group flex w-[7.5rem] shrink-0 snap-start flex-col items-center gap-1.5 rounded-[20px] border border-line bg-surface p-3 transition hover:border-brand"
          >
            <span className="lc-img-loading relative flex size-20 items-center justify-center overflow-hidden rounded-full bg-surface-sunken">
              {p.image && (
                <Image
                  src={p.image}
                  alt={tx(p.name, locale)}
                  fill
                  sizes="80px"
                  className="object-contain transition duration-300 group-hover:scale-110"
                />
              )}
            </span>
            <span className="line-clamp-2 text-center text-[0.78rem] font-semibold leading-tight text-ink">
              {tx(p.name, locale)}
            </span>
            {p.price != null && (
              <span className="text-xs font-bold text-brand-deep">{euro(Number(p.price), locale)}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
