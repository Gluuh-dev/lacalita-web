'use client';

import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {motion, useReducedMotion, type Variants} from 'framer-motion';
import {Link} from '@/i18n/navigation';
import {ChevronLeft, ChevronRight, ArrowRight, UtensilsCrossed} from 'lucide-react';
import {tx} from '@/lib/localize';
import type {Category} from '@/lib/queries';

const ORANGE = '#f26b21';
const EASE = [0.22, 1, 0.36, 1] as const; // suave (easeOutQuint-ish)

const container: Variants = {hidden: {}, show: {transition: {staggerChildren: 0.09}}};
const item: Variants = {hidden: {opacity: 0, y: 28}, show: {opacity: 1, y: 0, transition: {duration: 0.6, ease: EASE}}};

export default function BurgerCategoryCarousel({categories, locale}: {categories: Category[]; locale: string}) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const last = categories.length - 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setOverflow(el.scrollWidth > el.clientWidth + 4);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [categories.length]);

  // Centra exactamente la card `idx`. Usamos offsetLeft/offsetWidth (layout real,
  // sin verse afectado por el `scale` visual de las cards) para que el centrado sea exacto.
  const goTo = (idx: number) => {
    const el = ref.current;
    if (!el) return;
    const i = Math.max(0, Math.min(last, idx));
    const card = el.children[i] as HTMLElement | undefined;
    if (!card) return;
    const left = card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2;
    el.scrollTo({left: Math.max(0, left), behavior: 'smooth'});
    setActive(i);
  };

  // Mientras se arrastra: esconde títulos y detecta la card centrada.
  const tRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onScroll = () => {
    setScrolling(true);
    if (tRef.current) clearTimeout(tRef.current);
    tRef.current = setTimeout(() => setScrolling(false), 160);
    const el = ref.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestD = Infinity;
    Array.from(el.children).forEach((ch, i) => {
      const c = ch as HTMLElement;
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setActive(best);
  };

  if (!categories.length) return null;

  return (
    <section className="py-14">
      <div className="mx-auto mb-6 flex max-w-7xl items-end justify-between gap-4 px-5">
        <div>
          <div className="font-adam text-[0.7rem] uppercase tracking-[0.2em]" style={{color: ORANGE}}>Nuestra carta</div>
          <h2 className="font-eight text-4xl text-white md:text-5xl">elige tu antojo</h2>
        </div>
        {/* PC: flechas a la derecha (solo si no caben todas) */}
        {overflow && (
          <div className="hidden shrink-0 gap-2 md:flex">
            <button onClick={() => goTo(active - 1)} disabled={active <= 0} aria-label="Anterior" className="flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent">
              <ChevronLeft className="size-5" />
            </button>
            <button onClick={() => goTo(active + 1)} disabled={active >= last} aria-label="Siguiente" className="flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent">
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        {/* Móvil: flechas a los lados, centradas en las tarjetas */}
        {overflow && (
          <>
            <button onClick={() => goTo(active - 1)} disabled={active <= 0} aria-label="Anterior" className="absolute left-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition disabled:pointer-events-none disabled:opacity-0 md:hidden">
              <ChevronLeft className="size-5" />
            </button>
            <button onClick={() => goTo(active + 1)} disabled={active >= last} aria-label="Siguiente" className="absolute right-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition disabled:pointer-events-none disabled:opacity-0 md:hidden">
              <ChevronRight className="size-5" />
            </button>
          </>
        )}

        <motion.div
          ref={ref}
          onScroll={onScroll}
          variants={container}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={{once: true, margin: '-60px'}}
          className="lc-carousel-pad flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((c, i) => {
            const img = c.products?.find((p) => p.image)?.image ?? null;
            const isActive = i === active;
            return (
              <motion.div
                key={c.id}
                variants={item}
                style={{transition: 'opacity .55s cubic-bezier(.22,1,.36,1), transform .55s cubic-bezier(.22,1,.36,1)'}}
                className={`w-[64vw] shrink-0 snap-center sm:w-[48%] md:w-[36%] md:!scale-100 md:!opacity-100 md:snap-start lg:w-[28%] ${isActive ? 'scale-100 opacity-100' : 'scale-[0.88] opacity-[0.35]'}`}
              >
                <Link
                  href="/carta/hamburgueseria"
                  className="group relative flex aspect-[5/6] h-full w-full overflow-hidden rounded-[26px] border border-white/8"
                  style={{background: 'linear-gradient(180deg,#f4a72e,#df7a18)'}}
                >
                  {img ? (
                    <Image src={img} alt={tx(c.name, locale)} fill sizes="(min-width:1024px) 24rem, 64vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-black/20"><UtensilsCrossed className="size-14" /></div>
                  )}
                  <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(0,0,0,.62), transparent 52%)'}} />
                  <h3 className={`absolute inset-x-5 bottom-5 font-eight text-3xl text-white drop-shadow-lg transition-opacity duration-200 ${scrolling ? 'opacity-0' : 'opacity-100'}`}>
                    {tx(c.name, locale)}
                  </h3>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-7 flex justify-center">
        <Link href="/carta/hamburgueseria" className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-semibold uppercase tracking-[0.08em]" style={{background: ORANGE, color: '#1a1209'}}>
          Ver toda la carta <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
