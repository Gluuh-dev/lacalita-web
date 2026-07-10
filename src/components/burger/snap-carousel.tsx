'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';

// Carrusel de tarjetas con scroll-snap, en móvil y en PC. Debajo: flechas y
// puntos. Sin autoavance: aquí las tarjetas se pasan a mano.
export default function SnapCarousel({
  children,
  itemClass = 'w-[80vw] max-w-[340px]',
  mdItemClass = 'md:w-[320px]',
  accent = '#c36148',
  ink = '#2a1713'
}: {
  children: React.ReactNode[];
  itemClass?: string;
  mdItemClass?: string;
  accent?: string;
  ink?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  // ¿La pista desborda? Si todo cabe (PC ancho), se centra y sobran los controles.
  const [overflow, setOverflow] = useState(true);
  const items = Array.isArray(children) ? children : [children];
  const n = items.length;

  // La tarjeta activa es la más pegada al borde izquierdo de la pista. Sirve
  // igual en móvil (una visible) que en PC (varias a la vez), cosa que el
  // IntersectionObserver por umbral no resolvía.
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    let raf = 0;
    const measure = () => {
      setOverflow(root.scrollWidth > root.clientWidth + 1);
      const left = root.getBoundingClientRect().left;
      let best = 0;
      let bestD = Infinity;
      itemsRef.current.forEach((el, i) => {
        if (!el) return;
        const d = Math.abs(el.getBoundingClientRect().left - left);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    root.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [n]);

  // Envuelve por los extremos: así el autoavance no se atasca en la última.
  const go = useCallback(
    (i: number) => {
      if (n < 1) return;
      const t = ((i % n) + n) % n;
      itemsRef.current[t]?.scrollIntoView({behavior: 'smooth', inline: 'start', block: 'nearest'});
    },
    [n]
  );

  const btn = 'flex size-11 items-center justify-center rounded-full border transition hover:brightness-110 active:scale-95';
  const btnStyle = {borderColor: `${ink}33`, color: ink};

  return (
    <>
      <div
        ref={scrollRef}
        className={`flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-[10vw] px-[10vw] pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:scroll-px-1 md:gap-5 md:px-1 ${overflow ? '' : 'justify-center'}`}
      >
        {items.map((c, i) => (
          <div
            key={i}
            ref={(el) => {
              itemsRef.current[i] = el;
            }}
            className={`shrink-0 snap-start ${itemClass} ${mdItemClass} md:max-w-none`}
          >
            {c}
          </div>
        ))}
      </div>

      {/* Controles solo si de verdad hay algo que desplazar. */}
      {overflow && n > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <button onClick={() => go(active - 1)} aria-label="Anterior" style={btnStyle} className={btn}>
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex items-center">
            {items.map((_, i) => (
              // El punto mide 8px; el área pulsable, 44px (h-11 + padding).
              <button key={i} type="button" onClick={() => go(i)} aria-label={`Ir a ${i + 1}`} className="flex h-11 items-center px-1">
                <span style={{background: i === active ? accent : `${ink}40`}} className={`h-2 rounded-full transition-all ${i === active ? 'w-6' : 'w-2'}`} />
              </button>
            ))}
          </div>
          <button onClick={() => go(active + 1)} aria-label="Siguiente" style={btnStyle} className={btn}>
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}
    </>
  );
}
