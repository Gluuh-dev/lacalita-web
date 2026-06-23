'use client';

import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {motion, useReducedMotion, type Variants} from 'framer-motion';
import {Link} from '@/i18n/navigation';
import {ChevronLeft, ChevronRight, ArrowRight, UtensilsCrossed} from 'lucide-react';
import {tx} from '@/lib/localize';
import type {Category} from '@/lib/queries';

const ORANGE = '#f26b21';

const container: Variants = {hidden: {}, show: {transition: {staggerChildren: 0.08}}};
const item: Variants = {hidden: {opacity: 0, y: 30}, show: {opacity: 1, y: 0, transition: {duration: 0.5, ease: 'easeOut'}}};

export default function BurgerCategoryCarousel({categories, locale}: {categories: Category[]; locale: string}) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [active, setActive] = useState(0);
  const [edges, setEdges] = useState({start: true, end: false});
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      setOverflow(el.scrollWidth > el.clientWidth + 4);
      setEdges({start: el.scrollLeft <= 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2});
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [categories.length]);

  const scroll = (dir: number) => ref.current?.scrollBy({left: dir * Math.min(ref.current.clientWidth * 0.85, 560), behavior: 'smooth'});

  // Mientras se desplaza: esconde títulos y calcula la card centrada (para atenuar las demás).
  const tRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onScroll = () => {
    setScrolling(true);
    if (tRef.current) clearTimeout(tRef.current);
    tRef.current = setTimeout(() => setScrolling(false), 180);
    const el = ref.current;
    if (!el) return;
    setEdges({start: el.scrollLeft <= 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2});
    const cc = el.getBoundingClientRect().left + el.clientWidth / 2;
    let best = 0;
    let bestD = Infinity;
    Array.from(el.children).forEach((ch, i) => {
      const r = (ch as HTMLElement).getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - cc);
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
            <button onClick={() => scroll(-1)} disabled={edges.start} aria-label="Anterior" className="flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent">
              <ChevronLeft className="size-5" />
            </button>
            <button onClick={() => scroll(1)} disabled={edges.end} aria-label="Siguiente" className="flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent">
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        {/* Móvil: flechas a los lados, centradas en las tarjetas */}
        {overflow && (
          <>
            <button onClick={() => scroll(-1)} disabled={edges.start} aria-label="Anterior" className="absolute left-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition disabled:pointer-events-none disabled:opacity-0 md:hidden">
              <ChevronLeft className="size-5" />
            </button>
            <button onClick={() => scroll(1)} disabled={edges.end} aria-label="Siguiente" className="absolute right-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition disabled:pointer-events-none disabled:opacity-0 md:hidden">
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
            return (
              <motion.div
                key={c.id}
                variants={item}
                className={`w-[74vw] shrink-0 snap-center transition-[opacity,transform] duration-300 sm:w-[48%] md:w-[36%] md:!scale-100 md:!opacity-100 md:snap-start lg:w-[28%] ${i === active ? 'scale-100 opacity-100' : 'scale-[0.9] opacity-35'}`}
              >
                <Link
                  href="/carta/hamburgueseria"
                  className="group relative flex aspect-[4/5] h-full w-full overflow-hidden rounded-[26px] border border-white/8"
                  style={{background: 'linear-gradient(180deg,#f4a72e,#df7a18)'}}
                >
                  {img ? (
                    <Image src={img} alt={tx(c.name, locale)} fill sizes="(min-width:1024px) 24rem, 80vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-black/20"><UtensilsCrossed className="size-14" /></div>
                  )}
                  <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(0,0,0,.62), transparent 52%)'}} />
                  <h3 className={`absolute inset-x-5 bottom-5 font-eight text-3xl text-white drop-shadow-lg transition-opacity duration-150 ${scrolling ? 'opacity-0' : 'opacity-100'}`}>
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
