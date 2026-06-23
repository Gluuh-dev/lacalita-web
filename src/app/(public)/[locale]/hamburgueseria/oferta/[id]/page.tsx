import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {ArrowLeft, MapPin, Star, UtensilsCrossed} from 'lucide-react';
import {getBurgerOffer} from '@/lib/queries';
import {tx, euro} from '@/lib/localize';
import BurgerHeader from '@/components/burger/burger-header';

export const revalidate = 300;

const PANELS: Record<string, string> = {
  orange: 'radial-gradient(120% 90% at 50% 20%, #ff7c33, #f26b21 45%, #b8470f 100%)',
  dark: 'radial-gradient(120% 90% at 50% 20%, #2a1d11, #15100a 80%)',
  gold: 'radial-gradient(120% 90% at 50% 20%, #e7c074, #c79545 55%, #9a6f2c 100%)'
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
  // Precio gigante: separa entero y decimales (1'50)
  const cents = o.price != null ? Math.round((o.price % 1) * 100) : null;
  const intPart = o.price != null ? Math.floor(o.price) : null;

  return (
    <main className="min-h-screen" style={{background: '#14100a', color: '#f4ede2'}}>
      <BurgerHeader locale={locale} />

      {/* Marquesina superior */}
      <div className="relative z-10 overflow-hidden pt-24" style={{background: '#f26b21', transform: 'rotate(-2.2deg)', width: '112%', marginLeft: '-6%'}}>
        <div className="lc-mq py-2" style={{animationDuration: '16s'}}>
          {[0, 1].map((k) => (
            <span key={k} className="whitespace-nowrap font-eight uppercase" style={{fontSize: '1.3rem', color: '#1c1611', letterSpacing: '0.06em', paddingRight: 14}}>
              {'oferta · oferta · oferta · '.repeat(8)}
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-2xl px-5 pb-20 pt-8">
        <Link href="/hamburgueseria" className="mb-5 inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white">
          <ArrowLeft className="size-4" /> Volver
        </Link>

        {/* Panel de la oferta */}
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

          {/* Precio gigante */}
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

          {/* Imagen del producto */}
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

        {/* CTA */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="https://maps.google.com/?q=La+Calita+Salobre%C3%B1a"
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold text-[#1a1209]"
            style={{background: '#f26b21', color: '#1a1209'}}
          >
            <MapPin className="size-4" /> Cómo llegar
          </a>
          <Link href="/carta/hamburgueseria" className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10">
            Ver la carta
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-white/45">Oferta disponible en La Calita Burger · Salobreña. Pídela en el local.</p>
      </section>
    </main>
  );
}
