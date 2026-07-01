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

// Forma de la barra: esquinas superiores redondeadas + muesca central con hombros
// redondeados (curvas Bézier con tangente horizontal → sin picos) que abraza el FAB.
const BAR_PATH =
  'M0,22 Q0,0 22,0 H156 C171,0 175,36 196,36 C217,36 221,0 236,0 H368 Q390,0 390,22 V64 H0 Z';

export default function SiteTabBar() {
  const pathname = usePathname();
  if (HIDE.test(pathname)) return null;

  const onCarta = pathname === '/carta';

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-end justify-around px-1 pb-[max(0.3rem,env(safe-area-inset-bottom))] pt-3 md:hidden">
      <svg aria-hidden viewBox="0 0 390 64" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={{filter: 'drop-shadow(0 -2px 7px rgba(0,0,0,.10))'}}>
        <path d={BAR_PATH} fill="var(--bg)" />
      </svg>

      <Item href="/" label="Inicio" Icon={IconHome} IconFilled={IconHomeFilled} active={pathname === '/'} />
      <Item href="/eventos" label="Eventos" Icon={IconTicket} IconFilled={IconTicketFilled} active={pathname.startsWith('/eventos')} />

      {/* Hueco central para el FAB */}
      <div className="flex-1" aria-hidden />

      <Item href="/galeria" label="Galería" Icon={IconPhoto} IconFilled={IconPhotoFilled} active={pathname === '/galeria'} />
      <Item href="/ubicacion" label="Ubicación" Icon={IconLocation} IconFilled={IconLocationFilled} active={pathname === '/ubicacion'} />

      {/* Carta: FAB central elevado que encaja en la muesca */}
      <Link href="/carta" aria-label="Carta" className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-[46%]">
        <span className={`flex size-14 items-center justify-center rounded-full ring-[3px] ring-bg transition active:scale-95 ${onCarta ? 'bg-brand text-on-primary shadow-[0_6px_16px_-4px_rgba(201,138,78,.55)]' : 'bg-line-strong text-ink'}`}>
          <IconToolsKitchen2 size={26} stroke={2} />
        </span>
      </Link>
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
