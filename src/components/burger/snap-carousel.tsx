'use client';

import {useEffect, useRef, useState} from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';

// Carrusel: en móvil scroll-snap con la card centrada en pantalla (+ flechas y puntos);
// en PC rejilla que muestra todas las que caben.
export default function SnapCarousel({
  children,
  itemClass = 'w-[80vw] max-w-[340px]',
  mdCols = 'md:grid-cols-3'
}: {
  children: React.ReactNode[];
  itemClass?: string;
  mdCols?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const items = Array.isArray(children) ? children : [children];
  const n = items.length;

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.55) {
            const i = itemsRef.current.indexOf(e.target as HTMLElement);
            if (i >= 0) setActive(i);
          }
        }
      },
      {root, threshold: [0.55]}
    );
    itemsRef.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [n]);

  const go = (i: number) => {
    itemsRef.current[Math.max(0, Math.min(n - 1, i))]?.scrollIntoView({behavior: 'smooth', inline: 'center', block: 'nearest'});
  };

  return (
    <>
      <div
        ref={scrollRef}
        className={`flex snap-x snap-mandatory gap-4 overflow-x-auto px-[10vw] pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid ${mdCols} md:snap-none md:gap-5 md:overflow-visible md:px-0`}
      >
        {items.map((c, i) => (
          <div
            key={i}
            ref={(el) => {
              itemsRef.current[i] = el;
            }}
            className={`shrink-0 snap-center ${itemClass} md:w-auto md:max-w-none`}
          >
            {c}
          </div>
        ))}
      </div>

      {n > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4 md:hidden">
          <button onClick={() => go(active - 1)} disabled={active <= 0} aria-label="Anterior" className="flex size-11 items-center justify-center rounded-full border border-[#2a1713]/20 text-[#2a1713] transition disabled:opacity-30">
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex items-center gap-2">
            {items.map((_, i) => (
              <button key={i} onClick={() => go(i)} aria-label={`Ir a ${i + 1}`} className={`h-2 rounded-full transition-all ${i === active ? 'w-6 bg-[#c36148]' : 'w-2 bg-[#2a1713]/25'}`} />
            ))}
          </div>
          <button onClick={() => go(active + 1)} disabled={active >= n - 1} aria-label="Siguiente" className="flex size-11 items-center justify-center rounded-full border border-[#2a1713]/20 text-[#2a1713] transition disabled:opacity-30">
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}
    </>
  );
}
