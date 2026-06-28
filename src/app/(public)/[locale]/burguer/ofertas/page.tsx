import {setRequestLocale} from 'next-intl/server';
import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {Tag, UtensilsCrossed, ArrowRight, Star} from 'lucide-react';
import {getBurgerOffers} from '@/lib/queries';
import {tx, euro} from '@/lib/localize';
import {altLanguages} from '@/lib/site';

export const revalidate = 300;

const PANELS = [
  'radial-gradient(120% 120% at 80% 0%, #d67a63, #c36148 52%, #a8503a 100%)',
  'radial-gradient(120% 120% at 80% 0%, #e0a08a, #d67a63 50%, #c36148 100%)',
  'linear-gradient(135deg, #2a1713 0%, #5a2b22 55%, #a8503a 100%)'
];

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  await params;
  return {
    title: 'Ofertas · La Calita Burger',
    description: 'Las ofertas y combos de La Calita Burger en Salobreña.',
    alternates: altLanguages('/burguer/ofertas')
  };
}

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const offers = await getBurgerOffers();

  return (
    <main className="min-h-screen bg-[#fdfbf7] px-4 pb-28 pt-20 text-[#2a1713]">
      <h1 className="sr-only">Ofertas · La Calita Burger</h1>
      <div className="mx-auto max-w-2xl">
        {offers.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex size-20 items-center justify-center rounded-full bg-[#c36148]/10 text-[#c36148]"><Tag className="size-9" /></span>
            <p className="font-eight text-2xl">Aún no hay ofertas</p>
            <p className="max-w-[17rem] text-sm text-[#2a1713]/55">Vuelve pronto: preparamos combos a pie de playa.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {offers.map((o, i) => {
              const cents = o.price != null ? Math.round((o.price % 1) * 100) : null;
              const intPart = o.price != null ? Math.floor(o.price) : null;
              return (
                <Link
                  key={o.id}
                  href={`/burguer/oferta/${o.id}`}
                  style={{background: PANELS[i % PANELS.length], animationDelay: `${i * 70}ms`}}
                  className="group relative flex items-center gap-4 overflow-hidden rounded-[26px] p-5 text-white shadow-[0_18px_40px_-18px_rgba(168,80,58,.7)] duration-500 animate-in fade-in slide-in-from-bottom-3 fill-mode-both"
                >
                  {o.discount_label && (
                    <span className="absolute right-4 top-4 z-10 rounded-full bg-[#1a1209] px-3 py-1 text-xs font-bold text-[#e7b46a]">{o.discount_label}</span>
                  )}
                  <div className="relative z-10 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/80">
                      {o.code && <span className="rounded-md bg-black/25 px-2 py-0.5 font-mono tracking-[0.15em] text-white">{o.code}</span>}
                      {tx(o.eyebrow, locale) || 'Oferta'}
                      {o.rating != null && (
                        <span className="inline-flex items-center gap-0.5"><Star className="size-3 fill-current" /> {o.rating}</span>
                      )}
                    </div>
                    <h2 className="mt-1 font-eight text-2xl leading-tight">{tx(o.title, locale)}</h2>
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
                      <Image src={o.image} alt={tx(o.title, locale)} fill sizes="112px" className="object-cover transition duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-white/40"><UtensilsCrossed className="size-9" /></div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
