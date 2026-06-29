'use client';

import {Home, UtensilsCrossed, CalendarDays, Images, MapPin} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';

// Se oculta donde hay otra barra inferior (cartas de menú con MenuTabBar, burguer) y en admin.
const HIDE = /^\/(burguer|admin)(\/|$)|^\/carta\/[^/]+/;

export default function SiteTabBar() {
  const pathname = usePathname();
  if (HIDE.test(pathname)) return null;

  const items = [
    {label: 'Inicio', icon: Home, href: '/', active: pathname === '/'},
    {label: 'Carta', icon: UtensilsCrossed, href: '/carta', active: pathname === '/carta'},
    {label: 'Eventos', icon: CalendarDays, href: '/eventos', active: pathname.startsWith('/eventos')},
    {label: 'Galería', icon: Images, href: '/galeria', active: pathname === '/galeria'},
    {label: 'Ubicación', icon: MapPin, href: '/ubicacion', active: pathname === '/ubicacion'}
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-line bg-bg/95 pb-[max(0.3rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-md md:hidden">
      {items.map((t) => {
        const Icon = t.icon;
        return (
          <Link
            key={t.label}
            href={t.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-1 text-[0.6rem] font-medium tracking-wide transition-colors ${t.active ? 'text-brand-deep' : 'text-ink-3'}`}
          >
            <Icon className="size-[21px]" strokeWidth={t.active ? 2.4 : 1.8} />
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
