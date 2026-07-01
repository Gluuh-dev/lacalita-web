'use client';

import type {LucideIcon} from 'lucide-react';
import {Home, CalendarDays, Images, UtensilsCrossed, MapPin} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';

// Se oculta donde hay otra barra inferior (cartas de menú, burguer) y en admin.
const HIDE = /^\/(burguer|admin)(\/|$)|^\/carta\/[^/]+/;
// Muesca cóncava en el centro (recorta un círculo del borde superior de la barra).
const NOTCH = 'radial-gradient(circle 34px at 50% 0, transparent 33px, #000 34px)';

export default function SiteTabBar() {
  const pathname = usePathname();
  if (HIDE.test(pathname)) return null;

  const onCarta = pathname === '/carta';

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-end justify-around px-1 pb-[max(0.3rem,env(safe-area-inset-bottom))] pt-2 md:hidden">
      {/* Fondo de la barra con la muesca + sombra que sigue la forma */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-t-[22px] bg-bg"
        style={{WebkitMaskImage: NOTCH, maskImage: NOTCH, filter: 'drop-shadow(0 -2px 7px rgba(0,0,0,.10))'}}
      />

      <Item href="/" label="Inicio" icon={Home} active={pathname === '/'} />
      <Item href="/eventos" label="Eventos" icon={CalendarDays} active={pathname.startsWith('/eventos')} />

      {/* Carta: FAB central que encaja en la muesca */}
      <Link href="/carta" aria-label="Carta" className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <span className="-mt-8 flex size-14 items-center justify-center rounded-full bg-brand text-on-primary shadow-[0_6px_16px_-4px_rgba(201,138,78,.55)] transition active:scale-95">
          <UtensilsCrossed className="size-6" strokeWidth={2.2} />
        </span>
      </Link>

      <Item href="/galeria" label="Galería" icon={Images} active={pathname === '/galeria'} />
      <Item href="/ubicacion" label="Ubicación" icon={MapPin} active={pathname === '/ubicacion'} />
    </nav>
  );
}

function Item({href, label, icon: Icon, active}: {href: string; label: string; icon: LucideIcon; active: boolean}) {
  return (
    <Link href={href} className={`relative z-10 flex flex-1 flex-col items-center gap-0.5 py-1 text-[0.6rem] font-medium tracking-wide transition-colors ${active ? 'text-brand-deep' : 'text-ink-3'}`}>
      <Icon className="size-[21px]" strokeWidth={active ? 2.2 : 1.8} fill={active ? 'currentColor' : 'none'} />
      {label}
    </Link>
  );
}
