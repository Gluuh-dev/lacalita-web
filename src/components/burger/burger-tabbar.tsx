'use client';

import {Home, UtensilsCrossed, Percent, MapPin} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';

const TABS = [
  {label: 'Inicio', href: '/hamburgueseria', match: '/hamburgueseria', icon: Home},
  {label: 'Carta', href: '/carta/hamburgueseria', match: '/carta/hamburgueseria', icon: UtensilsCrossed},
  {label: 'Ofertas', href: '/hamburgueseria#ofertas', match: '', icon: Percent},
  {label: 'Local', href: '/hamburgueseria#local', match: '', icon: MapPin}
];

export default function BurgerTabBar() {
  const pathname = usePathname();
  const isActive = (m: string) => (m === '/hamburgueseria' ? pathname === '/hamburgueseria' : !!m && pathname.startsWith(m));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-black/5 bg-[#fdfbf7]/95 pb-[max(0.3rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-md md:hidden">
      {TABS.map((t) => {
        const active = isActive(t.match);
        const cls = `flex flex-1 flex-col items-center gap-0.5 py-1 text-[0.62rem] font-medium tracking-wide transition-colors ${active ? 'text-[#c94a3c]' : 'text-[#2a1713]/55'}`;
        const Icon = t.icon;
        return (
          <Link key={t.label} href={t.href} className={cls}>
            <Icon className="size-[22px]" strokeWidth={active ? 2.4 : 1.8} />
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
