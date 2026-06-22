'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {UtensilsCrossed, MapPin} from 'lucide-react';
import {euro} from '@/lib/localize';

export type HeroSlide = {image: string | null; name: string; price: number | null; eyebrow: string};

const GOLD = '#caa15a';

function Rings() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute right-0 top-0 h-[150vh] w-[150vh] max-w-none -translate-y-[28%] translate-x-[34%]"
      viewBox="0 0 800 800"
      fill="none"
    >
      {Array.from({length: 16}).map((_, i) => (
        <circle key={i} cx="400" cy="400" r={70 + i * 30} stroke={GOLD} strokeWidth="1" opacity={0.16 - i * 0.006} />
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

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <Rings />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-5 md:grid-cols-2">
        {/* Izquierda (fija) */}
        <div className="order-2 md:order-1">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-solo.svg" alt="" className="h-12 w-auto md:h-14" style={{filter: `drop-shadow(0 0 1px ${GOLD})`}} />
            <span className="font-modern text-3xl tracking-wide text-[#f4ede2] md:text-4xl">LA CALITA</span>
          </div>
          <div className="mt-2 font-adam text-[0.7rem] uppercase tracking-[0.28em]" style={{color: GOLD}}>Smash Burgers · A pie de playa</div>
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

        {/* Derecha: slider de hamburguesas */}
        <div className="relative order-1 flex min-h-[60svh] items-center md:order-2 md:min-h-[88svh]">
          <div className="w-full overflow-hidden">
            <div className="flex transition-transform duration-700 ease-out" style={{transform: `translateX(-${i * 100}%)`}}>
              {slides.map((s, k) => (
                <div key={k} className="flex w-full shrink-0 flex-col items-center text-center">
                  <div className="font-adam text-[0.7rem] uppercase tracking-[0.34em]" style={{color: GOLD}}>— {s.eyebrow} —</div>
                  <div className="mt-2 font-eight text-6xl leading-[0.9] text-white md:text-7xl">{s.name}</div>
                  {s.image ? (
                    <div className="burger-float relative mt-6 h-[42svh] w-full max-w-md md:h-[52svh]">
                      <Image src={s.image} alt={s.name} fill sizes="(min-width:768px) 28rem, 80vw" className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]" priority={k === 0} />
                    </div>
                  ) : (
                    <div className="mt-6 flex h-[42svh] w-full max-w-md items-center justify-center rounded-3xl border border-dashed border-white/15 text-white/25">
                      <UtensilsCrossed className="size-20" />
                    </div>
                  )}
                  {s.price != null && <div className="mt-6 font-eight text-4xl md:text-5xl" style={{color: '#f4ede2'}}>{euro(s.price, locale)}</div>}
                </div>
              ))}
            </div>
          </div>
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
              style={{
                width: 6,
                height: k === i ? 22 : 6,
                background: k === i ? '#f26b21' : 'rgba(244,237,226,.28)'
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
