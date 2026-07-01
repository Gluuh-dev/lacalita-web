'use client';

import type {LucideIcon} from 'lucide-react';
import {UtensilsCrossed, PlayCircle, Heart, ListChecks, Home} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';
import {useMenuStore} from '@/components/menu/store';

// Tabbar de las cartas del beach club (desayunos/restaurante/cócteles), con el mismo
// funcionamiento que la de la hamburguesería: navega a páginas (favoritos, lista, vídeo).
export default function CartaTabBar() {
  const pathname = usePathname(); // sin prefijo de idioma, p. ej. /carta/desayunos/fav
  const s = useMenuStore();
  const parts = pathname.split('/'); // ['', 'carta', menu, sub?]
  const menu = parts[2] || '';
  const sub = parts[3] || '';
  const onDetail = parts.length >= 4 && !['fav', 'list', 'video'].includes(sub);

  const favCount = Object.values(s.favs).filter((i) => i.menuSlug === menu).length;
  const listCount = Object.values(s.list)
    .filter((x) => x.item.menuSlug === menu)
    .reduce((n, x) => n + x.qty, 0);

  if (!menu || onDetail) return null;

  const base = `/carta/${menu}`;
  const left: Tab[] = [
    {key: 'inicio', label: 'Inicio', icon: Home, href: '/', active: false, badge: 0},
    {key: 'video', label: 'Vídeo', icon: PlayCircle, href: `${base}/video`, active: sub === 'video', badge: 0}
  ];
  const right: Tab[] = [
    {key: 'fav', label: 'Favoritos', icon: Heart, href: `${base}/fav`, active: sub === 'fav', badge: favCount},
    {key: 'list', label: 'Mi lista', icon: ListChecks, href: `${base}/list`, active: sub === 'list', badge: listCount}
  ];
  const onCarta = sub === '';

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-end justify-around border-t border-line bg-bg px-1 pb-[max(0.3rem,env(safe-area-inset-bottom))] pt-1.5 md:hidden">
      {left.map((t) => (
        <Item key={t.key} tab={t} />
      ))}
      <Link href={base} className="relative flex flex-1 flex-col items-center gap-1">
        <span
          className={`-mt-6 flex size-14 items-center justify-center rounded-full text-on-primary ring-4 ring-bg transition active:scale-95 ${onCarta ? 'bg-brand shadow-[0_8px_24px_-6px_rgba(201,138,78,.6)]' : 'bg-line-strong'}`}
        >
          <UtensilsCrossed className="size-6" strokeWidth={2.1} />
        </span>
        <span className={`text-[0.62rem] font-bold transition-colors ${onCarta ? 'text-brand-deep' : 'text-ink-3'}`}>Carta</span>
      </Link>
      {right.map((t) => (
        <Item key={t.key} tab={t} />
      ))}
    </nav>
  );
}

type Tab = {key: string; label: string; icon: LucideIcon; href: string; active: boolean; badge: number};

function Item({tab}: {tab: Tab}) {
  const {label, icon: Icon, href, active, badge} = tab;
  return (
    <Link href={href} className={`relative flex flex-1 flex-col items-center gap-0.5 py-1 text-[0.6rem] font-medium tracking-wide transition-colors ${active ? 'text-brand-deep' : 'text-ink-3'}`}>
      <span className="relative">
        <Icon className="size-[21px]" strokeWidth={active ? 2.4 : 1.8} />
        {badge > 0 && (
          <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[0.58rem] font-bold text-on-primary">{badge}</span>
        )}
      </span>
      {label}
    </Link>
  );
}
