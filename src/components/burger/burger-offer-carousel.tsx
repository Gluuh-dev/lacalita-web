'use client';

import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {ArrowRight, Star, UtensilsCrossed} from 'lucide-react';
import {tx, euro} from '@/lib/localize';
import type {BurgerOffer} from '@/lib/queries';
import {offerPanel} from '@/lib/offer-panel';
import SnapCarousel from './snap-carousel';

export default function BurgerOfferCarousel({offers, locale}: {offers: BurgerOffer[]; locale: string}) {
  if (!offers.length) return null;

  return (
    <section id="ofertas" className="scroll-mt-20 py-14">
      <div className="mx-auto mb-5 max-w-7xl px-5 text-center md:text-left">
        <div className="font-adam text-[0.7rem] uppercase tracking-[0.2em] text-[#c36148]">Solo en La Calita Burger</div>
        <h2 className="font-eight text-4xl text-[#2a1713] md:text-5xl">ofertas</h2>
      </div>

      <div className="mx-auto max-w-7xl md:px-5">
        <SnapCarousel itemClass="w-[85vw] max-w-[420px]" mdItemClass="md:w-[420px]">
          {offers.map((o) => {
            const cents = o.price != null ? Math.round((o.price % 1) * 100) : null;
            const intPart = o.price != null ? Math.floor(o.price) : null;
            return (
              <Link
                key={o.id}
                href={`/burguer/oferta/${o.id}`}
                draggable={false}
                style={{background: offerPanel(o.color_style)}}
                className="group relative flex h-full items-center gap-4 overflow-hidden rounded-[26px] p-5 text-white"
              >
                {o.discount_label && (
                  <span className="absolute right-4 top-4 z-10 rounded-full bg-[#1a1209] px-3 py-1 text-xs font-bold text-[#e7b46a]">{o.discount_label}</span>
                )}
                <div className="relative z-10 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/80">
                    {o.code && <span className="rounded-md bg-black/25 px-2 py-0.5 font-mono tracking-[0.15em] text-white">{o.code}</span>}
                    {tx(o.eyebrow, locale) || 'Oferta'}
                    {o.rating != null && <span className="inline-flex items-center gap-0.5"><Star className="size-3 fill-current" /> {o.rating}</span>}
                  </div>
                  <h3 className="mt-1 font-eight text-2xl leading-tight">{tx(o.title, locale)}</h3>
                  {o.price != null && (
                    <div className="mt-1 flex items-end gap-2">
                      <span className="font-eight text-4xl leading-none">{intPart}<span className="text-2xl">&apos;{String(cents).padStart(2, '0')}€</span></span>
                      {o.old_price != null && <span className="pb-1 text-sm text-white/60 line-through">{euro(o.old_price, locale)}</span>}
                    </div>
                  )}
                  <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90">
                    Ver oferta <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
                <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15">
                  {o.image ? (
                    <Image src={o.image} alt={tx(o.title, locale)} fill sizes="112px" draggable={false} className="pointer-events-none object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/40"><UtensilsCrossed className="size-9" /></div>
                  )}
                </div>
              </Link>
            );
          })}
        </SnapCarousel>
      </div>
    </section>
  );
}
