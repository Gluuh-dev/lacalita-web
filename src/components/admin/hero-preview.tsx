'use client';

import {useRef, useState, useEffect} from 'react';
import HeroStage from '@/components/hero-stage';
import type {HeroSlide} from '@/lib/queries';

const SIZES = {pc: {w: 1280, h: 720}, mobile: {w: 390, h: 780}};

// Renderiza el HeroStage a tamaño "diseño" y lo escala para caber → preview
// fiel (proporción y animación reales). device controla PC/Móvil.
export default function HeroPreview({
  slide,
  device = 'pc'
}: {
  slide: HeroSlide;
  device?: 'pc' | 'mobile';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [cw, setCw] = useState(0);
  const {w, h} = SIZES[device];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setCw(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = cw ? cw / w : 0;
  const height = cw ? cw * (h / w) : 0;

  return (
    <div
      ref={ref}
      className={`overflow-hidden rounded-lg bg-neutral-200 ring-1 ring-black/10 ${
        device === 'mobile' ? 'mx-auto w-2/3 max-w-[300px]' : 'w-full'
      }`}
      style={{height}}
    >
      <div
        className="relative"
        style={{width: w, height: h, transform: `scale(${scale})`, transformOrigin: 'top left'}}
      >
        <HeroStage
          slide={slide}
          preview
          tagline="Beach Club · Restaurante · Cafetería"
          intro="Cocina mediterránea con los pies en la arena, en Salobreña."
          ctaLabel={slide.ctaLabel || 'Ver la carta'}
          ctaHref={slide.ctaHref || '/carta'}
        />
      </div>
    </div>
  );
}
