import {setRequestLocale} from 'next-intl/server';
import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {Tag, UtensilsCrossed, ArrowRight, Star} from 'lucide-react';
import {getBurgerOffers} from '@/lib/queries';
import {tx, euro} from '@/lib/localize';
import {altLanguages} from '@/lib/site';

export const revalidate = 300;

const PANELS = [
  'radial-gradient(120% 120% at 80% 0%, #d67a63, #c94a3c 52%, #ad3d31 100%)',
  'radial-gradient(120% 120% at 80% 0%, #e0a08a, #d67a63 50%, #c94a3c 100%)',
  'linear-gradient(135deg, #2a1713 0%, #5a2b22 55%, #ad3d31 100%)'
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
    <main className="min-h-screen bg-[#fdfbf7] pb-28 pt-16 text-[#2a1713]">
      {/* Marquesina diagonal */}
      <div className="relative z-10 overflow-hidden" style={{background: '#c94a3c', transform: 'rotate(-2.2deg)', width: '112%', marginLeft: '-6%'}}>
        <div className="lc-mq py-2" style={{animationDuration: '18s'}}>
          {[0, 1].map((k) => (
            <span key={k} className="whitespace-nowrap font-eight uppercase" style={{fontSize: '1.25rem', color: '#fdfbf7', letterSpacing: '0.06em', paddingRight: 14}}>
              {'ofertas · combos · a pie de playa · '.repeat(6)}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 pt-8">
        <div className="mb-6 flex items-center gap-3 duration-500 animate-in fade-in slide-in-from-bottom-2 fill-mode-both">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-[#c94a3c]/12 text-[#c94a3c]">
            <Tag className="size-6" />
          </span>
          <div>
            <h1 className="font-eight text-4xl leading-none">Ofertas</h1>
            <p className="mt-1 text-sm text-[#2a1713]/55">{offers.length} {offers.length === 1 ? 'oferta activa' : 'ofertas activas'}</p>
          </div>
        </div>

        {offers.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex size-20 items-center justify-center rounded-full bg-[#c94a3c]/10 text-[#c94a3c]"><Tag className="size-9" /></span>
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
                  className="group relative flex items-center gap-4 overflow-hidden rounded-[26px] p-5 text-white shadow-[0_18px_40px_-18px_rgba(173,61,49,.7)] duration-500 animate-in fade-in slide-in-from-bottom-3 fill-mode-both"
                >
                  {o.discount_label && (
                    <span className="absolute right-4 top-4 z-10 rounded-full bg-[#1a1209] px-3 py-1 text-xs font-bold text-[#e7b46a]">{o.discount_label}</span>
                  )}
                  <div className="relative z-10 min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/80">
                      {tx(o.eyebrow, locale) || 'Oferta'}
                      {o.rating != null && (
                        <span className="inline-flex items-center gap-0.5"><Star className="size-3 fill-current" /> {o.rating}</span>
                      )}
                    </div>
                    <h2 className="mt-0.5 font-eight text-2xl leading-tight">{tx(o.title, locale)}</h2>
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
