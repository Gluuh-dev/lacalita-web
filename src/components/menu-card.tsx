import Image from 'next/image';
import {ArrowRight} from 'lucide-react';
import {IconCoffee, IconToolsKitchen2, IconGlassCocktail, IconBurger} from '@tabler/icons-react';
import {Link} from '@/i18n/navigation';
import {tx} from '@/lib/localize';
import type {Menu} from '@/lib/queries';

type MenuHead = Pick<Menu, 'id' | 'slug' | 'name' | 'subtitle' | 'theme' | 'header_image'>;

// Texturas de la casa (café, arena, hielo, brasa). El admin puede pisarlas
// subiendo una imagen de cabecera a la carta.
const FONDOS: Record<string, string> = {
  desayunos: '/fondos/desayunos-v2.webp',
  restaurante: '/fondos/restaurante-v2.webp',
  cocteles: '/fondos/cocteles-v2.webp',
  hamburgueseria: '/fondos/hamburgueseria-v2.webp'
};

// Los mismos iconos que el círculo del tab-bar.
const ICONS: Record<string, typeof IconCoffee> = {
  desayunos: IconCoffee,
  restaurante: IconToolsKitchen2,
  cocteles: IconGlassCocktail,
  hamburgueseria: IconBurger
};

export default function MenuCard({menu: m, locale, cta}: {menu: MenuHead; locale: string; cta: string}) {
  const Icon = ICONS[m.slug] ?? IconToolsKitchen2;
  const bg = m.header_image || FONDOS[m.slug];
  return (
    <Link
      href={m.slug === 'hamburgueseria' ? '/burguer' : `/carta/${m.slug}`}
      data-theme={m.theme}
      className="lc-img-loading ds-card--link group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[24px] p-5 text-white shadow-md"
    >
      {bg ? (
        <Image src={bg} alt={tx(m.name, locale)} fill sizes="(min-width:1024px) 22rem, 90vw" className="object-cover transition duration-500 group-hover:scale-105" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand to-brand-deep" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />

      {/* Icono en cristal, algo por encima del centro: así respira sobre el título. */}
      <span className="absolute left-1/2 top-[34%] z-10 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white shadow-[0_8px_32px_rgba(0,0,0,.25)] backdrop-blur-md transition duration-500 group-hover:scale-110 group-hover:bg-white/20">
        <Icon className="size-9" stroke={1.6} />
      </span>

      <div className="relative z-10">
        <h2 className="font-serif text-3xl leading-tight">{tx(m.name, locale)}</h2>
        {m.subtitle && <p className="mt-1 text-sm text-white/85">{tx(m.subtitle, locale)}</p>}
        <span className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-white py-2.5 font-adam text-[0.72rem] uppercase tracking-[0.12em] text-ink transition group-hover:bg-white/90">
          {cta} <ArrowRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}
