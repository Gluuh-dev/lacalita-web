'use client';

import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {UtensilsCrossed} from 'lucide-react';
import {tx} from '@/lib/localize';
import type {Category} from '@/lib/queries';
import SnapCarousel from './snap-carousel';

const ORANGE = '#c36148';

export default function BurgerCategoryCarousel({categories, locale}: {categories: Category[]; locale: string}) {
  if (!categories.length) return null;

  return (
    <section className="py-14">
      <div className="mx-auto mb-5 max-w-7xl px-5 text-center md:text-left">
        <div className="font-adam text-[0.7rem] uppercase tracking-[0.2em]" style={{color: ORANGE}}>Nuestra carta</div>
        <h2 className="font-eight text-4xl text-[#2a1713] md:text-5xl">elige tu antojo</h2>
      </div>

      <div className="mx-auto max-w-7xl md:px-5">
        <SnapCarousel itemClass="w-[72vw] max-w-[300px]" mdCols="md:grid-cols-4">
          {categories.map((c) => {
            const img = c.image ?? c.products?.find((p) => p.image)?.image ?? null;
            return (
              <Link
                key={c.id}
                href={`/burguer/carta?cat=${c.id}`}
                draggable={false}
                className="lc-img-loading group relative block aspect-[5/6] overflow-hidden rounded-[26px]"
              >
                {img ? (
                  <>
                    <Image src={img} alt={tx(c.name, locale)} fill sizes="(min-width:1024px) 22rem, 72vw" draggable={false} className="pointer-events-none object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(0,0,0,.62), transparent 52%)'}} />
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center text-[#2a1713]/15"><UtensilsCrossed className="size-14" /></div>
                )}
                <h3 className="absolute inset-x-5 bottom-5 font-eight text-3xl drop-shadow-lg" style={{color: img ? '#ffffff' : 'rgba(42,23,19,.65)'}}>{tx(c.name, locale)}</h3>
              </Link>
            );
          })}
        </SnapCarousel>
      </div>
    </section>
  );
}
