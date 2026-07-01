'use client';

import type {LucideIcon} from 'lucide-react';
import {Home, CalendarDays, Images, UtensilsCrossed, MapPin} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';

// Se oculta donde hay otra barra inferior (cartas de menú, burguer) y en admin.
const HIDE = /^\/(burguer|admin)(\/|$)|^\/carta\/[^/]+/;

export default function SiteTabBar() {
  const pathname = usePathname();
  if (HIDE.test(pathname)) return null;

  const onCarta = pathname === '/carta';

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-end justify-around border-t border-line bg-bg px-1 pb-[max(0.3rem,env(safe-area-inset-bottom))] pt-1.5 md:hidden">
      <Item href="/" label="Inicio" icon={Home} active={pathname === '/'} />
      <Item href="/eventos" label="Eventos" icon={CalendarDays} active={pathname.startsWith('/eventos')} />

      {/* Carta: botón central destacado (sin sombra ni texto) que lleva a la selección de cartas */}
      <Link href="/carta" aria-label="Carta" className="relative flex flex-1 flex-col items-center justify-center pb-1">
        <span
          className={`-mt-7 flex size-14 items-center justify-center rounded-full text-on-primary ring-[5px] ring-bg transition active:scale-95 ${onCarta ? 'bg-brand' : 'bg-line-strong'}`}
        >
          <UtensilsCrossed className="size-6" strokeWidth={2.1} />
        </span>
      </Link>

      <Item href="/galeria" label="Galería" icon={Images} active={pathname === '/galeria'} />
      <Item href="/ubicacion" label="Ubicación" icon={MapPin} active={pathname === '/ubicacion'} />
    </nav>
  );
}

function Item({href, label, icon: Icon, active}: {href: string; label: string; icon: LucideIcon; active: boolean}) {
  return (
    <Link href={href} className={`flex flex-1 flex-col items-center gap-0.5 py-1 text-[0.6rem] font-medium tracking-wide transition-colors ${active ? 'text-brand-deep' : 'text-ink-3'}`}>
      <Icon className="size-[21px]" strokeWidth={active ? 2.4 : 1.8} />
      {label}
    </Link>
  );
}
