'use client';

import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {ChevronLeft, ChevronRight, ArrowRight, UtensilsCrossed} from 'lucide-react';
import {tx} from '@/lib/localize';
import type {Category} from '@/lib/queries';

const ORANGE = '#c36148';

export default function BurgerCategoryCarousel({categories, locale}: {categories: Category[]; locale: string}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [ready, setReady] = useState(false);
  const n = categories.length;

  useEffect(() => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track || n === 0) return;
    const cards = Array.from(track.children) as HTMLElement[];
    const dots = dotsRef.current ? (Array.from(dotsRef.current.children) as HTMLElement[]) : [];

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const TRANS = reduce ? 'none' : 'transform .55s cubic-bezier(.22,.61,.36,1)';

    let active = 0;
    let cardW = 0;
    let step = 0;
    let center = 0;

    const layout = () => {
      const r0 = cards[0].getBoundingClientRect();
      cardW = r0.width;
      step = cards.length > 1 ? cards[1].getBoundingClientRect().left - r0.left : cardW;
      center = vp.getBoundingClientRect().width / 2;
    };

    const setTransform = (animate: boolean) => {
      track.style.transition = animate ? TRANS : 'none';
      const txp = center - cardW / 2 - active * step;
      track.style.transform = `translate3d(${txp}px,0,0)`;
      if (!animate) {
        void track.offsetWidth;
        track.style.transition = TRANS;
      }
    };

    const updateUI = (emph?: number) => {
      const idx = emph == null ? active : Math.max(0, Math.min(n - 1, emph));
      cards.forEach((el, k) => el.classList.toggle('is-active', k === idx));
      dots.forEach((el, j) => el.classList.toggle('is-active', j === idx));
      if (prevRef.current) prevRef.current.disabled = active <= 0;
      if (nextRef.current) nextRef.current.disabled = active >= n - 1;
    };

    const go = (t: number, animate = true) => {
      active = Math.max(0, Math.min(n - 1, t));
      setTransform(animate);
      updateUI();
    };

    const nearest = (txp: number) => Math.round((center - cardW / 2 - txp) / step);

    // ---- Drag (pointer = ratón + táctil) ----
    let dragging = false;
    let startX = 0;
    let startTx = 0;
    let moved = 0;
    let didDrag = false;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      didDrag = false;
      moved = 0;
      startX = e.clientX;
      const t = getComputedStyle(track).transform;
      startTx = t && t !== 'none' ? new DOMMatrixReadOnly(t).m41 : 0;
      track.style.transition = 'none';
      try {
        track.setPointerCapture(e.pointerId);
      } catch {}
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      moved = e.clientX - startX;
      if (Math.abs(moved) > 5) didDrag = true;
      const txp = startTx + moved;
      track.style.transform = `translate3d(${txp}px,0,0)`;
      updateUI(nearest(txp));
    };
    const endDrag = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      try {
        track.releasePointerCapture(e.pointerId);
      } catch {}
      go(Math.max(0, Math.min(n - 1, nearest(startTx + moved))), true);
    };
    // Evita que el arrastre dispare la navegación del enlace.
    const onClickCapture = (e: MouseEvent) => {
      if (didDrag) {
        e.preventDefault();
        e.stopPropagation();
        didDrag = false;
      }
    };

    track.addEventListener('pointerdown', onDown);
    track.addEventListener('pointermove', onMove);
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('click', onClickCapture, true);

    const prevH = () => go(active - 1);
    const nextH = () => go(active + 1);
    prevRef.current?.addEventListener('click', prevH);
    nextRef.current?.addEventListener('click', nextH);
    const dotsH = (e: Event) => {
      const t = (e.target as HTMLElement).closest('[data-d]') as HTMLElement | null;
      if (t) go(parseInt(t.dataset.d!, 10));
    };
    dotsRef.current?.addEventListener('click', dotsH);

    const relayout = () => {
      if (dragging) return;
      layout();
      setTransform(false);
    };
    let rt: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(relayout, 80);
    };
    window.addEventListener('resize', onResize);
    if (document.fonts?.ready) document.fonts.ready.then(relayout).catch(() => {});
    const safety = [120, 400, 900].map((t) => setTimeout(relayout, t));

    layout();
    setTransform(false);
    updateUI();
    setReady(true);
    const raf = requestAnimationFrame(() => requestAnimationFrame(relayout));

    return () => {
      track.removeEventListener('pointerdown', onDown);
      track.removeEventListener('pointermove', onMove);
      track.removeEventListener('pointerup', endDrag);
      track.removeEventListener('pointercancel', endDrag);
      track.removeEventListener('click', onClickCapture, true);
      prevRef.current?.removeEventListener('click', prevH);
      nextRef.current?.removeEventListener('click', nextH);
      dotsRef.current?.removeEventListener('click', dotsH);
      window.removeEventListener('resize', onResize);
      clearTimeout(rt);
      safety.forEach(clearTimeout);
      cancelAnimationFrame(raf);
    };
  }, [n, locale]);

  if (!n) return null;

  return (
    <section className="py-14">
      <div className="mx-auto mb-4 max-w-7xl px-5 text-center md:text-left">
        <div className="font-adam text-[0.7rem] uppercase tracking-[0.2em]" style={{color: ORANGE}}>Nuestra carta</div>
        <h2 className="font-eight text-4xl text-[#2a1713] md:text-5xl">elige tu antojo</h2>
      </div>

      <div ref={viewportRef} className="w-full overflow-hidden [touch-action:pan-y]">
        <div ref={trackRef} className={`flex gap-[18px] py-6 will-change-transform transition-opacity duration-300 lg:gap-6 ${ready ? 'opacity-100' : 'opacity-0'}`}>
          {categories.map((c) => {
            const img = c.products?.find((p) => p.image)?.image ?? null;
            return (
              <div key={c.id} className="lc-cat-card w-[70vw] max-w-[300px] shrink-0 sm:w-[300px] lg:w-[330px]">
                <Link
                  href={`/burguer/carta?cat=${c.id}`}
                  draggable={false}
                  className="group relative block aspect-[5/6] overflow-hidden rounded-[26px] bg-[#ece0cd]"
                >
                  {img ? (
                    <>
                      <Image src={img} alt={tx(c.name, locale)} fill sizes="(min-width:1024px) 22rem, 70vw" draggable={false} className="pointer-events-none object-cover transition duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(0,0,0,.62), transparent 52%)'}} />
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#2a1713]/15"><UtensilsCrossed className="size-14" /></div>
                  )}
                  <h3 className="absolute inset-x-5 bottom-5 font-eight text-3xl drop-shadow-lg" style={{color: img ? '#ffffff' : 'rgba(42,23,19,.65)'}}>{tx(c.name, locale)}</h3>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-7">
        <div className="flex items-center gap-4">
          <button ref={prevRef} aria-label="Anterior" className="flex size-11 items-center justify-center rounded-full border border-[#2a1713]/20 text-[#2a1713] transition hover:bg-[#2a1713]/5 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent">
            <ChevronLeft className="size-5" />
          </button>
          <div ref={dotsRef} className="flex items-center gap-2">
            {categories.map((c, i) => (
              <button key={c.id} data-d={i} aria-label={`Categoría ${i + 1}`} className="lc-cat-dot" />
            ))}
          </div>
          <button ref={nextRef} aria-label="Siguiente" className="flex size-11 items-center justify-center rounded-full border border-[#2a1713]/20 text-[#2a1713] transition hover:bg-[#2a1713]/5 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent">
            <ChevronRight className="size-5" />
          </button>
        </div>
        <Link href="/burguer/carta" className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-semibold uppercase tracking-[0.08em] transition hover:brightness-105" style={{background: ORANGE, color: '#fdfbf7'}}>
          Ver toda la carta <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
