'use client';

import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {ChevronLeft, ChevronRight, ArrowRight, Star, UtensilsCrossed} from 'lucide-react';
import {tx, euro} from '@/lib/localize';
import type {BurgerOffer} from '@/lib/queries';

const ORANGE = '#c36148';
const PANELS = [
  'radial-gradient(120% 120% at 80% 0%, #d67a63, #c36148 52%, #a8503a 100%)',
  'radial-gradient(120% 120% at 80% 0%, #e0a08a, #d67a63 50%, #c36148 100%)',
  'linear-gradient(135deg, #2a1713 0%, #5a2b22 55%, #a8503a 100%)'
];

export default function BurgerOfferCarousel({offers, locale}: {offers: BurgerOffer[]; locale: string}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [ready, setReady] = useState(false);
  const n = offers.length;

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
    <section id="ofertas" className="scroll-mt-20 py-14">
      <div className="mx-auto mb-2 max-w-7xl px-5 text-center md:text-left">
        <h2 className="font-eight text-4xl text-[#2a1713] md:text-5xl">ofertas</h2>
        <div className="font-adam text-[0.7rem] uppercase tracking-[0.2em]" style={{color: ORANGE}}>Solo en La Calita Burger</div>
      </div>

      <div ref={viewportRef} className="w-full overflow-hidden [touch-action:pan-y]">
        <div ref={trackRef} className={`flex gap-[18px] py-6 will-change-transform transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`}>
          {offers.map((o, i) => {
            const cents = o.price != null ? Math.round((o.price % 1) * 100) : null;
            const intPart = o.price != null ? Math.floor(o.price) : null;
            return (
              <div key={o.id} className="lc-cat-card w-[85vw] max-w-[400px] shrink-0">
                <Link
                  href={`/burguer/oferta/${o.id}`}
                  draggable={false}
                  style={{background: PANELS[i % PANELS.length]}}
                  className="group relative flex items-center gap-4 overflow-hidden rounded-[26px] p-5 text-white shadow-[0_18px_40px_-18px_rgba(168,80,58,.7)]"
                >
                  {o.discount_label && (
                    <span className="absolute right-4 top-4 z-10 rounded-full bg-[#1a1209] px-3 py-1 text-xs font-bold text-[#e7b46a]">{o.discount_label}</span>
                  )}
                  <div className="relative z-10 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/80">
                      {o.code && <span className="rounded-md bg-black/25 px-2 py-0.5 font-mono tracking-[0.15em] text-white">{o.code}</span>}
                      {tx(o.eyebrow, locale) || 'Oferta'}
                      {o.rating != null && <span className="inline-flex items-center gap-0.5"><Star className="size-3 fill-current" /> {o.rating}</span>}
                    </div>
                    <h3 className="mt-1 font-eight text-2xl leading-tight">{tx(o.title, locale)}</h3>
                    {o.price != null && (
                      <div className="mt-1 flex items-end gap-2">
                        <span className="font-eight text-4xl leading-none">{intPart}<span className="text-2xl">&apos;{String(cents).padStart(2, '0')}€</span></span>
                        {o.old_price != null && <span className="pb-1 text-sm text-white/60 line-through">{euro(o.old_price, locale)}</span>}
                      </div>
                    )}
                    <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90">
                      Ver oferta <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                  <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15">
                    {o.image ? (
                      <Image src={o.image} alt={tx(o.title, locale)} fill sizes="112px" draggable={false} className="pointer-events-none object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-white/40"><UtensilsCrossed className="size-9" /></div>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <button ref={prevRef} aria-label="Anterior" className="flex size-11 items-center justify-center rounded-full border border-[#2a1713]/20 text-[#2a1713] transition hover:bg-[#2a1713]/5 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent">
          <ChevronLeft className="size-5" />
        </button>
        <div ref={dotsRef} className="flex items-center gap-2">
          {offers.map((o, i) => (
            <button key={o.id} data-d={i} aria-label={`Oferta ${i + 1}`} className="lc-cat-dot" />
          ))}
        </div>
        <button ref={nextRef} aria-label="Siguiente" className="flex size-11 items-center justify-center rounded-full border border-[#2a1713]/20 text-[#2a1713] transition hover:bg-[#2a1713]/5 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent">
          <ChevronRight className="size-5" />
        </button>
      </div>
    </section>
  );
}
