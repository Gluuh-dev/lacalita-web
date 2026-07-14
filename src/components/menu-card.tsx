import Image from 'next/image';
import {IconToolsKitchen2, IconGlassCocktail, IconBurger} from '@tabler/icons-react';
import IconCoffeeCup from '@/components/icons/coffee-cup';
import {Link} from '@/i18n/navigation';
import {tx} from '@/lib/localize';
import type {Menu} from '@/lib/queries';

type MenuHead = Pick<Menu, 'id' | 'slug' | 'name' | 'subtitle' | 'theme' | 'header_image'>;

// Texturas de la casa (café, arena, hielo, brasa). El admin puede pisarlas
// subiendo una imagen de cabecera a la carta.
export const FONDOS: Record<string, string> = {
  desayunos: '/fondos/desayunos-v2.webp',
  restaurante: '/fondos/restaurante-v2.webp',
  cocteles: '/fondos/cocteles-v2.webp',
  hamburgueseria: '/fondos/hamburgueseria-v2.webp'
};

// Los mismos iconos que el círculo del tab-bar.
const ICONS: Record<string, typeof IconToolsKitchen2 | typeof IconCoffeeCup> = {
  desayunos: IconCoffeeCup,
  restaurante: IconToolsKitchen2,
  cocteles: IconGlassCocktail,
  hamburgueseria: IconBurger
};

export default function MenuCard({menu: m, locale}: {menu: MenuHead; locale: string}) {
  const Icon = ICONS[m.slug] ?? IconToolsKitchen2;
  const bg = m.header_image || FONDOS[m.slug];
  return (
    <Link
      href={m.slug === 'hamburgueseria' ? '/burguer' : `/carta/${m.slug}`}
      data-theme={m.theme}
      // Mismo estilo en todas las pantallas: icono arriba, título abajo. Solo
      // cambia la forma — baja en móvil y tablet, casi cuadrada en PC.
      className="lc-img-loading ds-card--link group relative flex min-h-[190px] flex-col justify-end overflow-hidden rounded-[24px] p-5 text-white shadow-md sm:min-h-[230px] sm:p-6 lg:aspect-square lg:min-h-0"
    >
      {bg ? (
        <Image src={bg} alt={tx(m.name, locale)} fill sizes="(min-width:1024px) 22rem, (min-width:640px) 50vw, 90vw" className="object-cover transition duration-500 group-hover:scale-105" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand to-brand-deep" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />

      <span className="absolute left-5 top-5 z-10 flex size-11 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-md transition duration-500 group-hover:scale-110 group-hover:bg-white/20 sm:size-12">
        <Icon className="size-5 sm:size-6" stroke={1.6} />
      </span>

      <div className="relative z-10">
        {/* Dos líneas reservadas y el texto pegado abajo: los cuatro títulos
            arrancan a la misma altura aunque uno rompa en dos líneas. */}
        <h2 className="flex min-h-[2.5em] items-end font-serif text-2xl leading-tight sm:text-[1.7rem]">{tx(m.name, locale)}</h2>
        {/* Alto reservado para dos líneas: así el título queda a la misma altura
            en las cuatro tarjetas, tenga el subtítulo una línea o dos. */}
        <p className="mt-1.5 line-clamp-2 min-h-[2.75rem] text-sm leading-relaxed text-white/85">{m.subtitle ? tx(m.subtitle, locale) : ''}</p>
      </div>
    </Link>
  );
}
