'use client';

import type {Icon as TablerIcon} from '@tabler/icons-react';
import {
  IconHome,
  IconHomeFilled,
  IconTicket,
  IconTicketFilled,
  IconToolsKitchen2,
  IconPhoto,
  IconPhotoFilled,
  IconLocation,
  IconLocationFilled
} from '@tabler/icons-react';
import {Link, usePathname} from '@/i18n/navigation';

// Se oculta donde hay otra barra inferior (cartas de menú, burguer) y en admin.
const HIDE = /^\/(burguer|admin)(\/|$)|^\/carta\/[^/]+/;
// Muesca cóncava suave en el centro (círculo grande centrado por encima del borde
// → los extremos entran tangentes y quedan redondeados, no en pico).
const NOTCH = 'radial-gradient(circle 42px at 50% -14px, transparent 41px, #000 42px)';

export default function SiteTabBar() {
  const pathname = usePathname();
  if (HIDE.test(pathname)) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-end justify-around px-1 pb-[max(0.3rem,env(safe-area-inset-bottom))] pt-2 md:hidden">
      <div
        aria-hidden
        className="absolute inset-0 rounded-t-[22px] bg-bg"
        style={{WebkitMaskImage: NOTCH, maskImage: NOTCH, filter: 'drop-shadow(0 -2px 7px rgba(0,0,0,.10))'}}
      />

      <Item href="/" label="Inicio" Icon={IconHome} IconFilled={IconHomeFilled} active={pathname === '/'} />
      <Item href="/eventos" label="Eventos" Icon={IconTicket} IconFilled={IconTicketFilled} active={pathname.startsWith('/eventos')} />

      {/* Carta: FAB central que encaja en la muesca */}
      <Link href="/carta" aria-label="Carta" className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <span className="-mt-10 flex size-14 items-center justify-center rounded-full bg-brand text-on-primary shadow-[0_6px_16px_-4px_rgba(201,138,78,.55)] transition active:scale-95">
          <IconToolsKitchen2 size={26} stroke={2} />
        </span>
      </Link>

      <Item href="/galeria" label="Galería" Icon={IconPhoto} IconFilled={IconPhotoFilled} active={pathname === '/galeria'} />
      <Item href="/ubicacion" label="Ubicación" Icon={IconLocation} IconFilled={IconLocationFilled} active={pathname === '/ubicacion'} />
    </nav>
  );
}

function Item({href, label, Icon, IconFilled, active}: {href: string; label: string; Icon: TablerIcon; IconFilled: TablerIcon; active: boolean}) {
  const I = active ? IconFilled : Icon;
  return (
    <Link href={href} className={`relative z-10 flex flex-1 flex-col items-center gap-0.5 py-1 text-[0.6rem] font-medium tracking-wide transition-colors ${active ? 'text-brand-deep' : 'text-ink-3'}`}>
      <I size={22} stroke={1.8} />
      {label}
    </Link>
  );
}
