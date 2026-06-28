import {setRequestLocale} from 'next-intl/server';
import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {Tag, UtensilsCrossed, ArrowRight} from 'lucide-react';
import {getBurgerOffers} from '@/lib/queries';
import {tx, euro} from '@/lib/localize';
import {altLanguages} from '@/lib/site';

export const revalidate = 300;

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
      <div className="mx-auto max-w-2xl duration-500 animate-in fade-in slide-in-from-bottom-3 fill-mode-both">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-[#c94a3c]/12 text-[#c94a3c]">
            <Tag className="size-6" />
          </span>
          <div>
            <h1 className="font-eight text-3xl leading-none">Ofertas</h1>
            <p className="mt-1 text-sm text-[#2a1713]/55">{offers.length} {offers.length === 1 ? 'oferta' : 'ofertas'} disponibles</p>
          </div>
        </div>

        {offers.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex size-20 items-center justify-center rounded-full bg-[#c94a3c]/10 text-[#c94a3c]"><Tag className="size-9" /></span>
            <p className="font-eight text-2xl">Aún no hay ofertas</p>
            <p className="max-w-[17rem] text-sm text-[#2a1713]/55">Vuelve pronto: preparamos combos a pie de playa.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {offers.map((o) => (
              <Link
                key={o.id}
                href={`/burguer/oferta/${o.id}`}
                className="group relative flex flex-col overflow-hidden rounded-[22px] border border-black/5 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f3e7da]">
                  {o.image ? (
                    <Image src={o.image} alt={tx(o.title, locale)} fill sizes="(min-width:640px) 20rem, 90vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#2a1713]/15"><UtensilsCrossed className="size-12" /></div>
                  )}
                  {o.discount_label && (
                    <span className="absolute left-3 top-3 rounded-full bg-[#c94a3c] px-3 py-1 text-xs font-bold text-white shadow">{o.discount_label}</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h2 className="font-eight text-xl leading-tight">{tx(o.title, locale)}</h2>
                  {tx(o.description, locale) && <p className="mt-1 line-clamp-2 text-sm text-[#2a1713]/60">{tx(o.description, locale)}</p>}
                  <div className="mt-3 flex items-end gap-2">
                    {o.price != null && <span className="font-eight text-2xl text-[#c94a3c]">{euro(o.price, locale)}</span>}
                    {o.old_price != null && <span className="pb-1 text-sm text-[#2a1713]/40 line-through">{euro(o.old_price, locale)}</span>}
                    <ArrowRight className="mb-1 ml-auto size-5 text-[#c94a3c] transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
