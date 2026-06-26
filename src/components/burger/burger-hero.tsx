'use client';

import {useEffect, useRef, useState, type CSSProperties} from 'react';
import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {UtensilsCrossed, MapPin, ChevronLeft, ChevronRight} from 'lucide-react';
import {euro} from '@/lib/localize';
import {Sparks, Smoke, titleColorStyle, edgeBackgroundPts, autoPoints, type EdgePoint} from './burger-fx';
import {isVideoUrl} from '@/lib/utils';

export type HeroSlide = {
  image: string | null;
  name: string;
  price: number | null;
  eyebrow: string;
  font?: string;
  color?: string;
  behind?: boolean;
  bgEffect?: string;
  bgImage?: string | null;
  titleScale?: number;
  eyebrowScale?: number;
  priceScale?: number;
  showRings?: boolean;
  overlayFx?: string;
  gradient?: string;
  fxSparks?: boolean;
  fxSmoke?: boolean;
  priceFont?: string;
  priceColor?: string;
  priceGradient?: string;
  titleY?: number;
  priceY?: number;
  fxVideo?: string;
  fxVideoBehind?: boolean;
  fxVideoX?: number;
  fxVideoY?: number;
  fxVideoScale?: number;
  bgColor?: string;
  textShadow?: boolean;
  titleOutline?: boolean;
  priceOutline?: boolean;
  hideTitle?: boolean;
  hidePrice?: boolean;
  accentColor?: string;
  buttonColor?: string;
  textColor?: string;
  navColor?: string;
  edgeColors?: Record<string, string>;
  edgePoints?: EdgePoint[];
  mediaY?: number;
};

const GOLD = '#d67a63'; // terracota (acento)
const RED = '#c94a3c'; // rojo principal

const BURGER_FONT: Record<string, string> = {
  eight: "'Eight One', sans-serif",
  display: 'var(--font-playfair), serif',
  modern: "'Modern Romance', serif",
  adam: "'Adam', sans-serif",
  sans: 'var(--font-geist), sans-serif'
};

const BURGER_MEDIA_STYLE = {maxWidth: '116%', objectFit: 'contain' as const, zIndex: 2, WebkitMaskImage: 'radial-gradient(ellipse 64% 92% at 50% 50%, #000 40%, transparent 100%)', maskImage: 'radial-gradient(ellipse 64% 92% at 50% 50%, #000 40%, transparent 100%)'};
const BURGER_MEDIA_CLS = 'h-[56svh] md:h-[92svh]';

// Muestrea 8 colores de borde de la imagen (en cliente) para fundir el fondo.
function sampleEdgeColors(url: string): Promise<Record<string, string>> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const S = 100;
        const c = document.createElement('canvas');
        c.width = S;
        c.height = S;
        const ctx = c.getContext('2d');
        if (!ctx) return resolve({});
        ctx.drawImage(img, 0, 0, S, S);
        const hex = (x: number, y: number) => {
          const d = ctx.getImageData(Math.round(x * (S - 1)), Math.round(y * (S - 1)), 1, 1).data;
          return '#' + [d[0], d[1], d[2]].map((n) => n.toString(16).padStart(2, '0')).join('');
        };
        const i = 0.06;
        resolve({tl: hex(i, i), tr: hex(1 - i, i), bl: hex(i, 1 - i), br: hex(1 - i, 1 - i), tc: hex(0.5, i), bc: hex(0.5, 1 - i), lm: hex(i, 0.5), rm: hex(1 - i, 0.5)});
      } catch {
        resolve({});
      }
    };
    img.onerror = () => resolve({});
    img.src = url;
  });
}

export default function BurgerHero({slides, locale}: {slides: HeroSlide[]; locale: string}) {
  const [i, setI] = useState(0);
  const n = slides.length;

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 10000);
    return () => clearInterval(t);
  }, [n]);

  const cur = slides[i] ?? slides[0];
  const go = (dir: number) => n > 1 && setI((x) => (x + dir + n) % n);
  const touchX = useRef<number | null>(null);

  // Colores de borde muestreados en vivo (8 puntos) + medición de la posición real de la imagen.
  const headerRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [edgeColorsMap, setEdgeColorsMap] = useState<Record<string, Record<string, string>>>({});
  const [box, setBox] = useState<{l: number; t: number; w: number; h: number} | null>(null);
  useEffect(() => {
    const url = cur?.image;
    if (!url || isVideoUrl(url) || edgeColorsMap[url]) return;
    let cancelled = false;
    sampleEdgeColors(url).then((ec) => {
      if (!cancelled) setEdgeColorsMap((m) => ({...m, [url]: ec}));
    });
    return () => {
      cancelled = true;
    };
  }, [cur?.image, edgeColorsMap]);
  useEffect(() => {
    const measure = () => {
      const h = headerRef.current, m = mediaRef.current;
      if (!h || !m) return;
      const hr = h.getBoundingClientRect(), mr = m.getBoundingClientRect();
      if (!hr.width || !hr.height || !mr.width) return;
      setBox({l: ((mr.left - hr.left) / hr.width) * 100, t: ((mr.top - hr.top) / hr.height) * 100, w: (mr.width / hr.width) * 100, h: (mr.height / hr.height) * 100});
    };
    const a = setTimeout(measure, 60);
    const b = setTimeout(measure, 750);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
      window.removeEventListener('resize', measure);
    };
  }, [i, cur?.image]);
  useEffect(() => {
    const v = cur?.navColor || cur?.accentColor || '';
    const root = document.documentElement;
    if (v) root.style.setProperty('--lc-nav', v);
    else root.style.removeProperty('--lc-nav');
    return () => {
      root.style.removeProperty('--lc-nav');
    };
  }, [cur?.navColor, cur?.accentColor]);

  const liveEc = cur?.image ? edgeColorsMap[cur.image] || cur.edgeColors : null;
  const pts = cur?.edgePoints?.length ? cur.edgePoints : autoPoints(liveEc);
  const edgeBg = box && pts.length && (!cur?.bgEffect || cur.bgEffect === 'none') ? edgeBackgroundPts(pts, box) : null;

  return (
    <header
      ref={headerRef}
      className="relative flex min-h-[100svh] items-start overflow-hidden md:items-center"
      style={{background: cur?.bgColor || 'radial-gradient(90% 80% at 72% 42%, #fff4ef 0%, #fdfbf7 70%)'}}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      {/* Efecto de fondo configurable */}
      {cur?.bgEffect === 'image' && cur.bgImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cur.bgImage} alt="" className="absolute inset-0 h-full w-full object-cover" style={{filter: 'saturate(1.05)'}} />
          <div className="absolute inset-0" style={{background: 'linear-gradient(90deg, rgba(253,251,247,.8) 0%, rgba(253,251,247,.28) 40%, transparent 68%)'}} />
        </>
      )}
      {cur?.bgEffect === 'smoke' && (
        <div className="lc-smoke pointer-events-none absolute inset-0" style={{background: 'radial-gradient(45% 55% at 62% 42%, rgba(225,225,225,.10), transparent 70%), radial-gradient(40% 50% at 45% 62%, rgba(200,200,200,.07), transparent 72%)', filter: 'blur(6px)'}} />
      )}
      {cur?.bgEffect === 'embers' && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3" style={{background: 'radial-gradient(60% 80% at 62% 100%, rgba(242,107,33,.28), transparent 68%)'}} />
          {Array.from({length: 14}).map((_, k) => (
            <span key={k} className="lc-ember-dot pointer-events-none absolute bottom-0 size-1 rounded-full" style={{left: `${(k * 67) % 100}%`, background: k % 3 ? '#f6a04a' : '#f26b21', animation: `lc-ember ${5 + (k % 4)}s linear ${(k % 5) * 0.7}s infinite`}} />
          ))}
        </>
      )}
      {edgeBg && <div className="pointer-events-none absolute inset-0" style={{background: edgeBg}} />}
      <div className="relative z-[2] mx-auto grid w-full max-w-7xl items-center gap-1 px-5 pt-[72px] md:grid-cols-2 md:gap-8">
        {/* Izquierda */}
        <div className="relative min-w-0 text-center md:text-left">
          {/* Marca de agua del logo justo debajo de los textos (absoluto, no ocupa espacio) */}
          <span aria-hidden className="pointer-events-none absolute left-1/2 top-full z-0 mt-3 -translate-x-1/2 md:hidden" style={{height: 110, aspectRatio: '1.15', backgroundColor: cur?.accentColor || GOLD, opacity: 0.12, WebkitMaskImage: 'url(/brand/logo-solo.svg)', maskImage: 'url(/brand/logo-solo.svg)', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskPosition: 'center', maskPosition: 'center'}} />
          {/* Logo wordmark solo en escritorio (en móvil va en el navbar) */}
          <span
            className="hidden w-[min(285px,80vw)] md:block"
            aria-label="La Calita"
            role="img"
            style={{
              height: 92,
              aspectRatio: '3.1',
              backgroundColor: cur?.accentColor || GOLD,
              WebkitMaskImage: 'url(/brand/logo-texto-derecha.svg)',
              maskImage: 'url(/brand/logo-texto-derecha.svg)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              filter: 'drop-shadow(0 6px 16px rgba(0,0,0,.12))'
            }}
          />
          <div className="mt-2.5 font-adam text-[0.78rem] uppercase tracking-[0.2em]" style={{color: cur?.accentColor || GOLD}}>Smash burgers · a pie de playa</div>
          <p className="mx-auto mt-6 max-w-[36ch] text-lg leading-relaxed md:mx-0" style={{color: cur?.textColor || 'rgba(42,23,19,.65)'}}>Carne fresca, pan brioche y queso fundido, frente al mar. Hechas al momento, sin atajos.</p>
          <div className="mt-7 hidden flex-wrap items-center justify-center gap-3 md:flex md:justify-start">
            <Link href="/carta/hamburgueseria" className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold transition hover:brightness-105" style={{background: cur?.buttonColor || RED, color: '#fdfbf7'}}>
              <UtensilsCrossed className="size-4" /> Ver la carta
            </Link>
            <a href="#local" className="inline-flex items-center gap-2 rounded-full border px-6 py-3.5 font-semibold transition hover:brightness-95" style={{borderColor: cur?.buttonColor || RED, color: cur?.buttonColor || RED}}>
              <MapPin className="size-4" /> Cómo llegar
            </a>
          </div>
        </div>

        {/* Derecha: hamburguesa enorme con textos superpuestos */}
        <div className="relative flex min-h-[56svh] items-center justify-center md:min-h-[100svh]">
          {cur && (
            <>
              <h1
                key={'n' + i}
                className="lc-bfade pointer-events-none absolute left-0 right-0 m-0 text-center font-extrabold uppercase"
                style={{
                  top: `${cur.titleY ?? 10}%`,
                  fontFamily: BURGER_FONT[cur.font ?? 'eight'] ?? BURGER_FONT.eight,
                  ...titleColorStyle(cur.color || RED, cur.gradient, cur.titleOutline),
                  zIndex: cur.behind ? 1 : 3,
                  fontSize: `calc(clamp(3rem,9.5vw,7.2rem) * ${cur.titleScale ?? 1})`,
                  lineHeight: 0.82,
                  letterSpacing: '0.01em',
                  textShadow: cur.textShadow ? '0 6px 20px rgba(0,0,0,.28)' : 'none',
                  display: cur.hideTitle ? 'none' : undefined,
                  animationDelay: '0.08s'
                }}
              >
                {cur.name}
              </h1>
              {cur.image && isVideoUrl(cur.image) ? (
                <div key={'i' + i} ref={mediaRef} className="flex justify-center" style={{zIndex: 2}}>
                  <video src={cur.image} autoPlay muted playsInline className={`lc-bfade ${BURGER_MEDIA_CLS}`} style={BURGER_MEDIA_STYLE} />
                </div>
              ) : cur.image ? (
                <div key={'i' + i} ref={mediaRef} className="flex justify-center" style={{zIndex: 2}}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cur.image} alt={cur.name} className={`lc-bfade ${BURGER_MEDIA_CLS}`} style={BURGER_MEDIA_STYLE} />
                </div>
              ) : (
                <div key={'i' + i} className="lc-bfade flex h-[60svh] w-full max-w-md items-center justify-center rounded-3xl border border-dashed border-white/15 text-white/25" style={{zIndex: 2}}>
                  <UtensilsCrossed className="size-24" />
                </div>
              )}
              {cur.price != null && !cur.hidePrice && (
                <div key={'p' + i} className="lc-bfade pointer-events-none absolute left-0 right-0 z-[4] flex justify-center bottom-[8rem] md:bottom-[var(--py)]" style={{['--py' as string]: `${cur.priceY ?? 14}%`, animationDelay: '0.16s'} as CSSProperties}>
                  <span className="font-extrabold" style={{fontFamily: BURGER_FONT[cur.priceFont ?? 'eight'] ?? BURGER_FONT.eight, ...titleColorStyle(cur.priceColor || GOLD, cur.priceGradient, cur.priceOutline), fontSize: `calc(clamp(3.6rem,9.2vw,7.8rem) * ${cur.priceScale ?? 1})`, lineHeight: 1, textShadow: cur.textShadow ? '0 6px 20px rgba(0,0,0,.28)' : 'none'}}>{euro(cur.price, locale)}</span>
                </div>
              )}
              {(cur.fxSparks || cur.overlayFx === 'sparks') && <Sparks />}
              {(cur.fxSmoke || cur.overlayFx === 'smoke') && <Smoke />}
            </>
          )}
        </div>
      </div>

      {/* Escritorio: puntos verticales a la derecha */}
      {n > 1 && (
        <div className="absolute right-[clamp(0.6rem,1.5vw,1.4rem)] top-1/2 z-[5] hidden -translate-y-1/2 flex-col items-center gap-2 md:flex">
          {slides.map((_, k) => (
            <button key={k} onClick={() => setI(k)} aria-label={`Burger ${k + 1}`} className="rounded-full transition-all" style={{width: 9, height: k === i ? 26 : 9, background: k === i ? (cur?.buttonColor || cur?.accentColor || RED) : 'rgba(128,128,128,.6)', boxShadow: k === i ? 'none' : '0 0 0 1px rgba(255,255,255,.4)'}} />
          ))}
        </div>
      )}
      {/* Móvil: flechas + puntos debajo */}
      {n > 1 && (
        <div className="absolute inset-x-0 bottom-[5rem] z-[5] flex items-center justify-center gap-4 md:hidden">
          <button type="button" onClick={() => go(-1)} aria-label="Anterior" className="flex size-9 items-center justify-center rounded-full border border-black/10 bg-white/70 text-[#2a1713] backdrop-blur">
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex items-center gap-2">
            {slides.map((_, k) => (
              <button key={k} onClick={() => setI(k)} aria-label={`Burger ${k + 1}`} className="rounded-full transition-all" style={{height: 8, width: k === i ? 24 : 8, background: k === i ? (cur?.buttonColor || cur?.accentColor || RED) : 'rgba(128,128,128,.55)'}} />
            ))}
          </div>
          <button type="button" onClick={() => go(1)} aria-label="Siguiente" className="flex size-9 items-center justify-center rounded-full border border-black/10 bg-white/70 text-[#2a1713] backdrop-blur">
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}
    </header>
  );
}
