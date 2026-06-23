'use client';

import {useRef} from 'react';
import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {ChevronLeft, ChevronRight, ArrowRight, UtensilsCrossed} from 'lucide-react';
import {tx} from '@/lib/localize';
import type {Category} from '@/lib/queries';

const ORANGE = '#f26b21';

export default function BurgerCategoryCarousel({categories, locale}: {categories: Category[]; locale: string}) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({left: dir * Math.min(ref.current.clientWidth * 0.85, 560), behavior: 'smooth'});
  if (!categories.length) return null;

  return (
    <section className="py-14">
      <div className="mx-auto mb-6 flex max-w-7xl items-end justify-between gap-4 px-5">
        <div>
          <div className="font-adam text-[0.7rem] uppercase tracking-[0.2em]" style={{color: ORANGE}}>Nuestra carta</div>
          <h2 className="font-eight text-4xl text-white md:text-5xl">elige tu antojo</h2>
        </div>
        {/* PC: flechas a la derecha, a la altura del título */}
        <div className="hidden shrink-0 gap-2 md:flex">
          <button onClick={() => scroll(-1)} aria-label="Anterior" className="flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10">
            <ChevronLeft className="size-5" />
          </button>
          <button onClick={() => scroll(1)} aria-label="Siguiente" className="flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10">
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Móvil: flechas a los lados, centradas verticalmente en las tarjetas */}
        <button onClick={() => scroll(-1)} aria-label="Anterior" className="absolute left-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur md:hidden">
          <ChevronLeft className="size-5" />
        </button>
        <button onClick={() => scroll(1)} aria-label="Siguiente" className="absolute right-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur md:hidden">
          <ChevronRight className="size-5" />
        </button>

        <div
          ref={ref}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{paddingLeft: 'max(1.25rem, calc((100vw - 80rem) / 2 + 1.25rem))', paddingRight: '1.25rem'}}
        >
          {categories.map((c) => {
            const img = c.products?.find((p) => p.image)?.image ?? null;
            return (
              <Link
                key={c.id}
                href="/carta/hamburgueseria"
                className="group relative flex aspect-[3/4] w-[64%] shrink-0 snap-start overflow-hidden rounded-[22px] border border-white/8 sm:w-[42%] md:w-[30%] lg:w-[22%]"
                style={{background: 'linear-gradient(180deg,#f4a72e,#df7a18)'}}
              >
                {img ? (
                  <Image src={img} alt={tx(c.name, locale)} fill sizes="(min-width:1024px) 20rem, 64vw" className="object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center text-black/20"><UtensilsCrossed className="size-12" /></div>
                )}
                <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(0,0,0,.6), transparent 55%)'}} />
                <h3 className="absolute inset-x-4 bottom-4 font-eight text-2xl text-white drop-shadow-lg">{tx(c.name, locale)}</h3>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-7 flex justify-center">
        <Link href="/carta/hamburgueseria" className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-semibold uppercase tracking-[0.08em]" style={{background: ORANGE, color: '#1a1209'}}>
          Ver toda la carta <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
