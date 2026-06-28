import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {ArrowLeft, MapPin, Star, UtensilsCrossed} from 'lucide-react';
import {getBurgerOffer} from '@/lib/queries';
import {tx, euro} from '@/lib/localize';

export const revalidate = 300;

const PANELS: Record<string, string> = {
  orange: 'radial-gradient(120% 90% at 50% 20%, #d67a63, #c94a3c 50%, #ad3d31 100%)',
  dark: 'radial-gradient(120% 90% at 50% 20%, #d67a63, #ad3d31 90%)',
  gold: 'radial-gradient(120% 90% at 50% 20%, #e0a08a, #d67a63 55%, #c94a3c 100%)'
};

export async function generateMetadata({params}: {params: Promise<{locale: string; id: string}>}) {
  const {locale, id} = await params;
  const o = await getBurgerOffer(id);
  return {title: o ? `${tx(o.title, locale)} · La Calita Burger` : 'Oferta · La Calita Burger'};
}

export default async function OfertaPage({params}: {params: Promise<{locale: string; id: string}>}) {
  const {locale, id} = await params;
  setRequestLocale(locale);
  const o = await getBurgerOffer(id);
  if (!o) notFound();

  const title = tx(o.title, locale);
  const eyebrow = tx(o.eyebrow, locale);
  const desc = tx(o.description, locale);
  const panel = PANELS[o.color_style] ?? PANELS.orange;
  const cents = o.price != null ? Math.round((o.price % 1) * 100) : null;
  const intPart = o.price != null ? Math.floor(o.price) : null;

  return (
    <main className="min-h-screen" style={{background: '#fdfbf7', color: '#2a1713'}}>
      <div className="relative z-10 overflow-hidden pt-24" style={{background: '#c94a3c', transform: 'rotate(-2.2deg)', width: '112%', marginLeft: '-6%'}}>
        <div className="lc-mq py-2" style={{animationDuration: '16s'}}>
          {[0, 1].map((k) => (
            <span key={k} className="whitespace-nowrap font-eight uppercase" style={{fontSize: '1.3rem', color: '#fdfbf7', letterSpacing: '0.06em', paddingRight: 14}}>
              {'oferta · oferta · oferta · '.repeat(8)}
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-2xl px-5 pb-24 pt-8">
        <Link href="/burguer" className="mb-5 inline-flex items-center gap-2 text-sm text-[#2a1713]/70 transition hover:text-[#2a1713]">
          <ArrowLeft className="size-4" /> Volver
        </Link>

        <div className="relative overflow-hidden rounded-[28px] p-7 text-center shadow-2xl" style={{background: panel}}>
          {o.discount_label && (
            <span className="absolute right-5 top-5 rounded-full bg-[#1a1209] px-3 py-1 text-xs font-bold text-[#e7b46a]">{o.discount_label}</span>
          )}

          <div className="flex items-center justify-center gap-2 text-[0.66rem] font-bold uppercase tracking-[0.18em] text-white/85">
            {eyebrow || 'Oferta'}
            {o.rating != null && (
              <span className="inline-flex items-center gap-0.5 text-white">
                <Star className="size-3.5 fill-current" /> {o.rating}
              </span>
            )}
          </div>

          {o.price != null && (
            <div className="mt-2 flex items-start justify-center font-eight leading-none text-white" style={{textShadow: '0 6px 20px rgba(0,0,0,.35)'}}>
              <span className="text-[5.5rem] sm:text-[7rem]">{intPart}</span>
              <div className="mt-3 flex flex-col items-start">
                <span className="text-4xl sm:text-5xl">&apos;{String(cents).padStart(2, '0')}</span>
                <span className="text-3xl sm:text-4xl">€</span>
              </div>
            </div>
          )}
          {o.old_price != null && <div className="-mt-1 text-lg font-bold text-white/70 line-through">{euro(o.old_price, locale)}</div>}

          <div className="relative mx-auto mt-4 aspect-square w-full max-w-sm">
            {o.image ? (
              <Image src={o.image} alt={title} fill sizes="(min-width:640px) 24rem, 90vw" className="object-contain drop-shadow-2xl" priority />
            ) : (
              <div className="flex h-full items-center justify-center text-white/30"><UtensilsCrossed className="size-16" /></div>
            )}
          </div>

          <h1 className="mt-2 font-eight text-4xl text-white sm:text-5xl">{title}</h1>
          {desc && <p className="mx-auto mt-3 max-w-md text-sm text-white/85">{desc}</p>}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="https://maps.google.com/?q=La+Calita+Salobre%C3%B1a" target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold" style={{background: '#c94a3c', color: '#fdfbf7'}}>
            <MapPin className="size-4" /> Cómo llegar
          </a>
          <Link href="/burguer/carta" className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#c94a3c] px-6 py-3.5 font-semibold text-[#c94a3c] transition hover:bg-[#c94a3c]/10">
            Ver la carta
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-[#2a1713]/55">Oferta disponible en La Calita Burger · Salobreña. Pídela en el local.</p>
      </section>
    </main>
  );
}
