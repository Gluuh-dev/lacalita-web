'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {UtensilsCrossed, MapPin} from 'lucide-react';
import {euro} from '@/lib/localize';

export type HeroSlide = {image: string | null; name: string; price: number | null; eyebrow: string};

const GOLD = '#e9ae74';

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
      {/* Anillos: repeating-radial desde la esquina, difuminados con máscara */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[85%] w-[70%]"
        style={{
          backgroundImage: 'repeating-radial-gradient(circle at 100% 0%, transparent 0 34px, rgba(233,174,116,.16) 34px 37px)',
          WebkitMaskImage: 'radial-gradient(circle at 100% 0%, #000 0%, transparent 68%)',
          maskImage: 'radial-gradient(circle at 100% 0%, #000 0%, transparent 68%)'
        }}
      />

      <div className="relative z-[2] mx-auto grid w-full max-w-7xl items-center gap-8 px-5 pt-[72px] md:grid-cols-2">
        {/* Izquierda */}
        <div className="min-w-0">
          <span
            className="block w-[min(285px,80vw)]"
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
          <p className="mt-6 max-w-[36ch] text-lg leading-relaxed text-[#f4ede2]/60">Carne fresca, pan brioche y queso fundido, frente al mar. Hechas al momento, sin atajos.</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
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
                className="lc-bfade pointer-events-none absolute left-0 right-0 top-[10%] z-[3] m-0 text-center font-eight uppercase text-white"
                style={{fontSize: 'clamp(2.6rem,8vw,6rem)', lineHeight: 0.82, letterSpacing: '0.01em', textShadow: '0 10px 40px rgba(0,0,0,.7)'}}
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
                <div key={'p' + i} className="lc-bfade pointer-events-none absolute bottom-[7%] left-0 right-0 z-[4] flex justify-center">
                  <span className="font-eight text-white" style={{fontSize: 'clamp(2.6rem,6.5vw,5rem)', lineHeight: 1, color: GOLD, textShadow: '0 8px 30px rgba(0,0,0,.7)'}}>{euro(cur.price, locale)}</span>
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
