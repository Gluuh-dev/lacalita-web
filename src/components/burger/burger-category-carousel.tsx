'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {ChevronLeft, ChevronRight, ArrowRight, UtensilsCrossed} from 'lucide-react';
import {tx} from '@/lib/localize';
import type {Category} from '@/lib/queries';

const ORANGE = '#f26b21';

type Metrics = {lefts: number[]; centers: number[]; w: number; track: number};

export default function BurgerCategoryCarousel({categories, locale}: {categories: Category[]; locale: string}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [m, setM] = useState<Metrics | null>(null);
  const last = categories.length - 1;

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    const kids = Array.from(track.children) as HTMLElement[];
    setM({
      lefts: kids.map((k) => k.offsetLeft),
      centers: kids.map((k) => k.offsetLeft + k.offsetWidth / 2),
      w: wrap.clientWidth,
      track: track.scrollWidth
    });
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [measure, categories.length]);

  const isMobile = m ? m.w < 768 : true;
  const gutter = m ? Math.max(20, (m.w - 1280) / 2 + 20) : 20;

  const baseOffset = (i: number) => {
    if (!m) return 0;
    const raw = isMobile ? m.w / 2 - m.centers[i] : gutter - m.lefts[i];
    const min = Math.min(0, m.w - m.track); // no dejar hueco tras la última
    const max = isMobile ? m.w / 2 - m.centers[0] : gutter; // primera centrada (móvil) / bajo el título (PC)
    return Math.max(min, Math.min(max, raw));
  };

  const overflow = m ? m.track > m.w + 4 : false;
  const offset = (m ? baseOffset(active) : 0) + drag;

  // Arrastre táctil propio (sin scroll nativo → sin saltos del snap).
  const startX = useRef(0);
  const onStart = (x: number) => {
    if (!overflow) return;
    setDragging(true);
    startX.current = x;
  };
  const onMove = (x: number) => {
    if (dragging) setDrag(x - startX.current);
  };
  const onEnd = () => {
    if (!dragging || !m) return;
    const cur = baseOffset(active) + drag;
    let best = active;
    let bd = Infinity;
    for (let i = 0; i <= last; i++) {
      const d = Math.abs(baseOffset(i) - cur);
      if (d < bd) {
        bd = d;
        best = i;
      }
    }
    setActive(best);
    setDrag(0);
    setDragging(false);
  };

  const go = (i: number) => setActive(Math.max(0, Math.min(last, i)));

  if (!categories.length) return null;

  return (
    <section className="py-14">
      <div className="mx-auto mb-6 flex max-w-7xl items-end justify-between gap-4 px-5">
        <div>
          <div className="font-adam text-[0.7rem] uppercase tracking-[0.2em]" style={{color: ORANGE}}>Nuestra carta</div>
          <h2 className="font-eight text-4xl text-white md:text-5xl">elige tu antojo</h2>
        </div>
        {overflow && (
          <div className="hidden shrink-0 gap-2 md:flex">
            <button onClick={() => go(active - 1)} disabled={active <= 0} aria-label="Anterior" className="flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent">
              <ChevronLeft className="size-5" />
            </button>
            <button onClick={() => go(active + 1)} disabled={active >= last} aria-label="Siguiente" className="flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent">
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={wrapRef}
        className="relative overflow-hidden"
        style={{touchAction: 'pan-y'}}
        onTouchStart={(e) => onStart(e.touches[0].clientX)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        onTouchEnd={onEnd}
      >
        {overflow && (
          <>
            <button onClick={() => go(active - 1)} disabled={active <= 0} aria-label="Anterior" className="absolute left-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition disabled:pointer-events-none disabled:opacity-0 md:hidden">
              <ChevronLeft className="size-5" />
            </button>
            <button onClick={() => go(active + 1)} disabled={active >= last} aria-label="Siguiente" className="absolute right-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition disabled:pointer-events-none disabled:opacity-0 md:hidden">
              <ChevronRight className="size-5" />
            </button>
          </>
        )}

        <div
          ref={trackRef}
          className="flex gap-4 will-change-transform"
          style={{transform: `translate3d(${offset}px,0,0)`, transition: dragging ? 'none' : 'transform .55s cubic-bezier(.22,1,.36,1)'}}
        >
          {categories.map((c, i) => {
            const img = c.products?.find((p) => p.image)?.image ?? null;
            const dim = isMobile && i !== active;
            return (
              <div
                key={c.id}
                className={`w-[64vw] shrink-0 transition-opacity duration-500 sm:w-[44%] md:w-[34%] lg:w-[26%] ${dim ? 'opacity-40' : 'opacity-100'}`}
              >
                <Link
                  href="/carta/hamburgueseria"
                  className="group relative flex aspect-[5/6] h-full w-full overflow-hidden rounded-[26px] border border-white/8"
                  style={{background: 'linear-gradient(180deg,#f4a72e,#df7a18)'}}
                  onClick={(e) => {
                    if (drag !== 0) e.preventDefault();
                  }}
                  draggable={false}
                >
                  {img ? (
                    <Image src={img} alt={tx(c.name, locale)} fill sizes="(min-width:1024px) 24rem, 64vw" className="pointer-events-none object-cover transition duration-500 group-hover:scale-105" draggable={false} />
                  ) : (
                    <div className="flex h-full items-center justify-center text-black/20"><UtensilsCrossed className="size-14" /></div>
                  )}
                  <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(0,0,0,.62), transparent 52%)'}} />
                  <h3 className={`absolute inset-x-5 bottom-5 font-eight text-3xl text-white drop-shadow-lg transition-opacity duration-200 ${dragging ? 'opacity-0' : 'opacity-100'}`}>
                    {tx(c.name, locale)}
                  </h3>
                </Link>
              </div>
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
