'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {UtensilsCrossed, MapPin} from 'lucide-react';
import {euro} from '@/lib/localize';

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
};

const GOLD = '#e9ae74';

const BURGER_FONT: Record<string, string> = {
  eight: "'Eight One', sans-serif",
  display: 'var(--font-playfair), serif',
  modern: "'Modern Romance', serif",
  adam: "'Adam', sans-serif",
  sans: 'var(--font-geist), sans-serif'
};

function Rings() {
  const tr = Array.from({length: 34}, (_, k) => 100 + k * 34);
  const bl = Array.from({length: 18}, (_, k) => 80 + k * 38);
  return (
    <svg aria-hidden viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full">
      <g fill="none" stroke={GOLD} strokeWidth="1">
        {tr.map((r, k) => (
          <circle key={`t${k}`} cx="1440" cy="0" r={r} strokeOpacity={Math.max(0.03, 0.22 - r / 6500)} />
        ))}
        {bl.map((r, k) => (
          <circle key={`b${k}`} cx="0" cy="900" r={r} strokeOpacity={Math.max(0.03, 0.16 - r / 6000)} />
        ))}
      </g>
    </svg>
  );
}

export default function BurgerHero({slides, locale}: {slides: HeroSlide[]; locale: string}) {
  const [i, setI] = useState(0);
  const n = slides.length;

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 3600);
    return () => clearInterval(t);
  }, [n]);

  const cur = slides[i] ?? slides[0];
  const fromTop = i % 2 === 0;

  return (
    <header
      className="relative flex min-h-[100svh] items-center overflow-hidden"
      style={{background: 'radial-gradient(90% 80% at 72% 42%, #2a1f18 0%, #16100d 70%)'}}
    >
      {/* Efecto de fondo configurable */}
      {cur?.bgEffect === 'image' && cur.bgImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cur.bgImage} alt="" className="absolute inset-0 h-full w-full object-cover" style={{filter: 'brightness(.42) saturate(1.05)'}} />
          <div className="absolute inset-0" style={{background: 'linear-gradient(90deg, rgba(20,16,10,.88) 0%, rgba(20,16,10,.4) 55%, rgba(20,16,10,.62) 100%)'}} />
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
      <Rings />
      {/* Destellos fríos (azulados) */}
      <div aria-hidden className="pointer-events-none absolute right-0 top-1/4 h-[60%] w-[32%]" style={{background: 'radial-gradient(circle at 100% 50%, rgba(86,140,205,.16), transparent 62%)'}} />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-[45%] w-[36%]" style={{background: 'radial-gradient(circle at 0% 100%, rgba(86,140,205,.13), transparent 60%)'}} />

      <div className="relative z-[2] mx-auto grid w-full max-w-7xl items-center gap-8 px-5 pt-[72px] md:grid-cols-2">
        {/* Izquierda */}
        <div className="min-w-0 text-center md:text-left">
          {/* Logo: solo símbolo en móvil, wordmark en escritorio */}
          <span
            className="mx-auto block md:hidden"
            aria-label="La Calita"
            role="img"
            style={{
              height: 72,
              aspectRatio: '1.15',
              backgroundColor: GOLD,
              WebkitMaskImage: 'url(/brand/logo-solo.svg)',
              maskImage: 'url(/brand/logo-solo.svg)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,.5))'
            }}
          />
          <span
            className="hidden w-[min(285px,80vw)] md:block"
            aria-label="La Calita"
            role="img"
            style={{
              height: 92,
              aspectRatio: '3.1',
              backgroundColor: GOLD,
              WebkitMaskImage: 'url(/brand/logo-texto-derecha.svg)',
              maskImage: 'url(/brand/logo-texto-derecha.svg)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,.5))'
            }}
          />
          <div className="mt-2.5 font-adam text-[0.78rem] uppercase tracking-[0.2em]" style={{color: GOLD}}>Smash burgers · a pie de playa</div>
          <p className="mx-auto mt-6 max-w-[36ch] text-lg leading-relaxed text-[#f4ede2]/60 md:mx-0">Carne fresca, pan brioche y queso fundido, frente al mar. Hechas al momento, sin atajos.</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <Link href="/carta/hamburgueseria" className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold transition hover:brightness-105" style={{background: GOLD, color: '#2a1c08'}}>
              <UtensilsCrossed className="size-4" /> Ver la carta
            </Link>
            <a href="#local" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-[#1c160e] transition hover:bg-white/90">
              <MapPin className="size-4" /> Cómo llegar
            </a>
          </div>
        </div>

        {/* Derecha: hamburguesa enorme con textos superpuestos */}
        <div className="relative flex min-h-[60svh] items-center justify-center md:min-h-[100svh]">
          {cur && (
            <>
              <div key={'e' + i} className="lc-bfade pointer-events-none absolute left-0 right-0 top-[6%] z-[3] text-center">
                <span className="inline-flex items-center gap-2 font-adam uppercase tracking-[0.28em]" style={{fontSize: 'clamp(0.7rem,1.4vw,0.92rem)', color: GOLD}}>
                  <span style={{width: 26, height: 1, background: GOLD, opacity: 0.6}} />
                  {cur.eyebrow}
                  <span style={{width: 26, height: 1, background: GOLD, opacity: 0.6}} />
                </span>
              </div>
              <h1
                key={'n' + i}
                className="lc-bfade pointer-events-none absolute left-0 right-0 top-[9%] m-0 text-center font-extrabold uppercase"
                style={{
                  fontFamily: BURGER_FONT[cur.font ?? 'eight'] ?? BURGER_FONT.eight,
                  color: cur.color || '#ffffff',
                  zIndex: cur.behind ? 1 : 3,
                  fontSize: 'clamp(3rem,9.5vw,7.2rem)',
                  lineHeight: 0.82,
                  letterSpacing: '0.01em',
                  textShadow: '0 10px 40px rgba(0,0,0,.7)',
                  animationDelay: '0.08s'
                }}
              >
                {cur.name}
              </h1>
              <div
                key={'g' + i}
                className="lc-bfade pointer-events-none absolute bottom-[13%] left-1/2 z-[1] h-[42px] w-[52%] -translate-x-1/2 rounded-[50%]"
                style={{background: 'radial-gradient(ellipse, rgba(0,0,0,.6), transparent 70%)', filter: 'blur(7px)'}}
              />
              {cur.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={'i' + i} src={cur.image} alt={cur.name} className={fromTop ? 'lc-slide-top' : 'lc-slide-bot'} style={{height: '92svh', maxWidth: '116%', objectFit: 'contain', zIndex: 2, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,.55))'}} />
              ) : (
                <div key={'i' + i} className={`${fromTop ? 'lc-slide-top' : 'lc-slide-bot'} flex h-[60svh] w-full max-w-md items-center justify-center rounded-3xl border border-dashed border-white/15 text-white/25`} style={{zIndex: 2}}>
                  <UtensilsCrossed className="size-24" />
                </div>
              )}
              {cur.price != null && (
                <div key={'p' + i} className="lc-bfade pointer-events-none absolute bottom-[14%] left-0 right-0 z-[4] flex justify-center" style={{animationDelay: '0.16s'}}>
                  <span className="font-eight font-extrabold" style={{fontSize: 'clamp(3.2rem,8vw,6.2rem)', lineHeight: 1, color: GOLD, textShadow: '0 8px 30px rgba(0,0,0,.7)'}}>{euro(cur.price, locale)}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Puntos (derecha) */}
      {n > 1 && (
        <div className="absolute right-[clamp(0.6rem,1.5vw,1.4rem)] top-1/2 z-[5] flex -translate-y-1/2 flex-col items-center gap-2">
          {slides.map((_, k) => (
            <button key={k} onClick={() => setI(k)} aria-label={`Burger ${k + 1}`} className="rounded-full transition-all" style={{width: 9, height: k === i ? 26 : 9, background: k === i ? GOLD : 'rgba(255,255,255,.35)'}} />
          ))}
        </div>
      )}
    </header>
  );
}
