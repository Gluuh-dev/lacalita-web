'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {UtensilsCrossed, MapPin} from 'lucide-react';
import {euro} from '@/lib/localize';

export type HeroSlide = {image: string | null; name: string; price: number | null; eyebrow: string};

const GOLD = '#caa15a';

function Rings() {
  // Centro en la esquina superior derecha; se difuminan hacia el centro.
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute right-0 top-0 h-[150vh] w-[150vh] max-w-none translate-x-1/2 -translate-y-1/2"
      viewBox="0 0 1000 1000"
      fill="none"
      style={{maskImage: 'radial-gradient(circle at center, #000 0%, #000 35%, transparent 62%)', WebkitMaskImage: 'radial-gradient(circle at center, #000 0%, #000 35%, transparent 62%)'}}
    >
      {Array.from({length: 44}).map((_, i) => (
        <circle key={i} cx="500" cy="500" r={40 + i * 19} stroke={GOLD} strokeWidth="1" opacity="0.5" />
      ))}
    </svg>
  );
}

export default function BurgerHero({slides, locale}: {slides: HeroSlide[]; locale: string}) {
  const [i, setI] = useState(0);
  const n = slides.length;

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 5000);
    return () => clearInterval(t);
  }, [n]);

  const s = slides[i] ?? slides[0];

  return (
    <section
      className="relative flex min-h-[100svh] items-center overflow-hidden"
      style={{background: 'radial-gradient(95% 75% at 100% 0%, rgba(242,107,33,0.22), rgba(28,22,14,0) 55%), #14100a'}}
    >
      <Rings />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-5 md:grid-cols-2">
        {/* Izquierda (fija) */}
        <div className="order-2 md:order-1">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-solo.svg" alt="" className="h-16 w-auto md:h-20" style={{filter: `drop-shadow(0 0 1px ${GOLD})`}} />
            <span className="font-modern text-4xl tracking-wide text-[#f4ede2] md:text-5xl">LA CALITA</span>
          </div>
          <div className="mt-3 font-adam text-[0.72rem] uppercase tracking-[0.3em]" style={{color: GOLD}}>Smash Burgers · A pie de playa</div>
          <p className="mt-6 max-w-md text-base leading-relaxed text-[#f4ede2]/60 md:text-lg">
            Carne fresca, pan brioche y queso fundido, frente al mar. Hechas al momento, sin atajos.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/carta/hamburgueseria" className="inline-flex items-center gap-2 rounded-full bg-[#f26b21] px-6 py-3.5 font-semibold text-white transition hover:brightness-105">
              <UtensilsCrossed className="size-4" /> Ver la carta
            </Link>
            <a href="#local" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-[#1c160e] transition hover:bg-white/90">
              <MapPin className="size-4" /> Cómo llegar
            </a>
          </div>
        </div>

        {/* Derecha: hamburguesa (entra desde abajo en cada cambio) */}
        <div className="relative order-1 flex min-h-[60svh] items-center justify-center md:order-2 md:min-h-[88svh]">
          {s && (
            <div key={i} className="burger-rise flex w-full flex-col items-center text-center">
              <div className="font-adam text-[0.7rem] uppercase tracking-[0.34em]" style={{color: GOLD}}>— {s.eyebrow} —</div>
              <div className="mt-2 font-eight text-6xl leading-[0.9] text-white md:text-7xl">{s.name}</div>
              {s.image ? (
                <div className="burger-float relative mt-6 h-[42svh] w-full max-w-md md:h-[52svh]">
                  <Image src={s.image} alt={s.name} fill sizes="(min-width:768px) 28rem, 80vw" className="object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.6)]" priority />
                </div>
              ) : (
                <div className="mt-6 flex h-[42svh] w-full max-w-md items-center justify-center rounded-3xl border border-dashed border-white/15 text-white/25">
                  <UtensilsCrossed className="size-20" />
                </div>
              )}
              {s.price != null && <div className="mt-6 font-eight text-4xl md:text-5xl" style={{color: '#f4ede2'}}>{euro(s.price, locale)}</div>}
            </div>
          )}
        </div>
      </div>

      {/* Paginación de puntos (derecha) */}
      {n > 1 && (
        <div className="absolute right-5 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-2.5">
          {slides.map((_, k) => (
            <button
              key={k}
              onClick={() => setI(k)}
              aria-label={`Ir a ${k + 1}`}
              className="rounded-full transition-all"
              style={{width: 6, height: k === i ? 22 : 6, background: k === i ? '#f26b21' : 'rgba(244,237,226,.28)'}}
            />
          ))}
        </div>
      )}
    </section>
  );
}
