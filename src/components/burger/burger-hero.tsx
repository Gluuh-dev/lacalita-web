'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {UtensilsCrossed, MapPin} from 'lucide-react';
import {euro} from '@/lib/localize';

export type HeroSlide = {image: string | null; name: string; price: number | null; eyebrow: string};

const GOLD = '#dcb069';

export default function BurgerHero({slides, locale}: {slides: HeroSlide[]; locale: string}) {
  const [i, setI] = useState(0);
  const n = slides.length;

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 4500);
    return () => clearInterval(t);
  }, [n]);

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-1/2 size-[820px] -translate-y-1/2 rounded-full" style={{border: '1px solid rgba(231,180,106,.08)', boxShadow: '0 0 0 90px rgba(231,180,106,.04), 0 0 0 200px rgba(231,180,106,.03)'}} />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
        {/* Izquierda (fija) */}
        <div>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-solo.svg" alt="" className="h-14 w-auto" style={{filter: `drop-shadow(0 0 1px ${GOLD})`}} />
            <span className="font-modern text-4xl tracking-wide text-[#f4ede2]">LA CALITA</span>
          </div>
          <div className="mt-2 font-adam text-[0.72rem] uppercase tracking-[0.28em]" style={{color: GOLD}}>Smash Burgers · A pie de playa</div>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-[#f4ede2]/62">
            Carne fresca, pan brioche y queso fundido, frente al mar. Hechas al momento, sin atajos.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/carta/hamburgueseria" className="inline-flex items-center gap-2 rounded-full bg-[#f26b21] px-6 py-3.5 font-semibold text-white transition hover:brightness-105">
              <UtensilsCrossed className="size-4" /> Ver la carta
            </Link>
            <a href="#local" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10">
              <MapPin className="size-4" /> Cómo llegar
            </a>
          </div>
        </div>

        {/* Derecha: slider de hamburguesas nuevas */}
        <div className="relative min-h-[420px]">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-700 ease-out" style={{transform: `translateX(-${i * 100}%)`}}>
              {slides.map((s, k) => (
                <div key={k} className="flex w-full shrink-0 flex-col items-center text-center">
                  <div className="font-adam text-[0.7rem] uppercase tracking-[0.32em]" style={{color: GOLD}}>{s.eyebrow}</div>
                  <div className="mt-1 font-eight text-5xl leading-none text-white md:text-6xl">{s.name}</div>
                  {s.image ? (
                    <div className="relative mt-6 aspect-square w-full max-w-sm">
                      <Image src={s.image} alt={s.name} fill sizes="(min-width:768px) 24rem, 90vw" className="object-contain drop-shadow-2xl" priority={k === 0} />
                    </div>
                  ) : (
                    <div className="mt-6 flex aspect-square w-full max-w-sm items-center justify-center rounded-3xl border border-dashed border-white/15 text-white/30">
                      <UtensilsCrossed className="size-16" />
                    </div>
                  )}
                  {s.price != null && <div className="mt-4 font-eight text-4xl text-[#f4ede2]">{euro(s.price, locale)}</div>}
                </div>
              ))}
            </div>
          </div>

          {n > 1 && (
            <div className="absolute -right-1 top-1/2 flex -translate-y-1/2 flex-col gap-2 md:right-2">
              {slides.map((_, k) => (
                <button key={k} onClick={() => setI(k)} aria-label={`Ir a ${k + 1}`} className="size-2 rounded-full transition-all" style={{background: k === i ? '#f26b21' : 'rgba(244,237,226,.3)', height: k === i ? 18 : 8}} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
