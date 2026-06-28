'use client';

import {Home, UtensilsCrossed, PlayCircle, Heart, ListChecks} from 'lucide-react';
import {useSearchParams} from 'next/navigation';
import {Link, usePathname} from '@/i18n/navigation';
import {useMenuStore} from '@/components/menu/store';

export default function BurgerTabBar() {
  const pathname = usePathname();
  const params = useSearchParams();
  const s = useMenuStore();
  const v = params.get('v');
  const onCarta = pathname.startsWith('/carta/hamburgueseria');
  const base = onCarta ? '/carta/hamburgueseria' : '/hamburgueseria';

  const favCount = Object.values(s.favs).filter((i) => i.menuSlug === 'hamburgueseria').length;
  const listCount = Object.values(s.list).filter((x) => x.item.menuSlug === 'hamburgueseria').reduce((n, x) => n + x.qty, 0);

  const tabs = [
    {label: 'Inicio', href: '/hamburgueseria', icon: Home, active: pathname === '/hamburgueseria', badge: 0},
    {label: 'Carta', href: '/carta/hamburgueseria', icon: UtensilsCrossed, active: onCarta && !v, badge: 0},
    {label: 'Vídeo', href: `${base}?v=video`, icon: PlayCircle, active: v === 'video', badge: 0},
    {label: 'Favoritos', href: `${base}?v=favs`, icon: Heart, active: v === 'favs', badge: favCount},
    {label: 'Mi lista', href: `${base}?v=list`, icon: ListChecks, active: v === 'list', badge: listCount}
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-black/5 bg-[#fdfbf7]/95 pb-[max(0.3rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-md md:hidden">
      {tabs.map((t) => {
        const Icon = t.icon;
        return (
          <Link key={t.label} href={t.href} className={`relative flex flex-1 flex-col items-center gap-0.5 py-1 text-[0.6rem] font-medium tracking-wide transition-colors ${t.active ? 'text-[#c94a3c]' : 'text-[#2a1713]/55'}`}>
            <Icon className="size-[21px]" strokeWidth={t.active ? 2.4 : 1.8} />
            {t.label}
            {t.badge > 0 && (
              <span className="absolute right-[18%] top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c94a3c] px-1 text-[0.58rem] font-bold text-[#fdfbf7]">{t.badge}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
