'use client';

import {useState, useEffect, useRef} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import {useHeaderMode} from './header-mode';
import HeroStage from './hero-stage';
import type {HeroSlide} from '@/lib/queries';

export default function HeroCarousel({
  slides,
  tagline,
  intro,
  cta
}: {
  slides: HeroSlide[];
  tagline: string;
  intro: string;
  cta: string;
}) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const cur = slides[i];
  const has = slides.length > 0;
  const next = () => setI((p) => (p + 1) % slides.length);
  const {set} = useHeaderMode();

  const startX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 50 && slides.length > 1) {
      setI((p) => (dx < 0 ? (p + 1) % slides.length : (p - 1 + slides.length) % slides.length));
    }
  };

  useEffect(() => {
    if (slides.length < 2) return;
    if (cur?.type === 'video') return; // el vídeo controla el avance
    const t = setTimeout(() => setI((p) => (p + 1) % slides.length), 5500);
    return () => clearTimeout(t);
  }, [i, slides.length, cur]);

  useEffect(() => {
    set({overHero: true, hasMedia: has});
  }, [has, set]);
  useEffect(() => () => set({overHero: false, hasMedia: false}), [set]);

  const empty: HeroSlide = {type: 'image', url: '', overlay: 0, logoLight: false, loop: false};

  return (
    <section
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="relative min-h-screen overflow-hidden"
    >
      {has ? (
        <AnimatePresence>
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={reduce ? false : {opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 1}}
          >
            <HeroStage
              slide={cur}
              tagline={tagline}
              intro={intro}
              ctaLabel={cur.ctaLabel || cta}
              ctaHref={cur.ctaHref || '/carta'}
              onEnded={() => {
                if (!cur.loop && slides.length > 1) next();
              }}
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <HeroStage slide={empty} tagline={tagline} intro={intro} ctaLabel={cta} ctaHref="/carta" />
      )}

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2">
          {slides.map((_, j) => (
            <button
              key={j}
              onClick={() => setI(j)}
              aria-label={`Diapositiva ${j + 1}`}
              className={`h-2 w-2 rounded-full transition ${j === i ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
