'use client';

import {Home, UtensilsCrossed, PlayCircle, Heart, ListChecks} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';
import {useMenuStore} from '@/components/menu/store';

export default function BurgerTabBar() {
  const pathname = usePathname();
  const s = useMenuStore();

  const favCount = Object.values(s.favs).filter((i) => i.menuSlug === 'hamburgueseria').length;
  const listCount = Object.values(s.list).filter((x) => x.item.menuSlug === 'hamburgueseria').reduce((n, x) => n + x.qty, 0);

  const items = [
    {label: 'Inicio', icon: Home, href: '/hamburgueseria', active: pathname === '/hamburgueseria', badge: 0},
    {label: 'Carta', icon: UtensilsCrossed, href: '/carta/hamburgueseria', active: pathname.startsWith('/carta/hamburgueseria'), badge: 0},
    {label: 'Vídeo', icon: PlayCircle, onClick: s.openVideo, active: s.videoOpen, badge: 0},
    {label: 'Favoritos', icon: Heart, href: '/hamburgueseria/favoritos', active: pathname === '/hamburgueseria/favoritos', badge: favCount},
    {label: 'Mi lista', icon: ListChecks, href: '/hamburgueseria/mi-lista', active: pathname === '/hamburgueseria/mi-lista', badge: listCount}
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-black/5 bg-[#fdfbf7]/95 pb-[max(0.3rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-md md:hidden">
      {items.map((t) => {
        const Icon = t.icon;
        const cls = `relative flex flex-1 flex-col items-center gap-0.5 py-1 text-[0.6rem] font-medium tracking-wide transition-colors ${t.active ? 'text-[#c94a3c]' : 'text-[#2a1713]/55'}`;
        const inner = (
          <>
            <Icon className="size-[21px]" strokeWidth={t.active ? 2.4 : 1.8} />
            {t.label}
            {t.badge > 0 && (
              <span className="absolute right-[18%] top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c94a3c] px-1 text-[0.58rem] font-bold text-[#fdfbf7]">{t.badge}</span>
            )}
          </>
        );
        return t.href ? (
          <Link key={t.label} href={t.href} className={cls}>{inner}</Link>
        ) : (
          <button key={t.label} type="button" onClick={t.onClick} className={cls}>{inner}</button>
        );
      })}
    </nav>
  );
}
