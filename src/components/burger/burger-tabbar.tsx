'use client';

import {useEffect, useRef, useState} from 'react';
import type {LucideIcon} from 'lucide-react';
import {Home, UtensilsCrossed, PlayCircle, Heart, ListChecks, Percent, MapPin} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';
import {useMenuStore} from '@/components/menu/store';

type Tab = {
  key: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  active: boolean;
  badge: number;
  pop?: boolean;
  animated?: boolean;
};

export default function BurgerTabBar() {
  const pathname = usePathname();
  const s = useMenuStore();
  // En el detalle hay barra de acciones propia (favorito + añadir).
  const onDetail = pathname.startsWith('/burguer/carta/');
  const onCarta = pathname.startsWith('/burguer/carta');
  // Inicio, Ofertas y Local comparten el mismo set de tabbar: al entrar no cambia.
  const landingCtx = pathname === '/burguer' || pathname === '/burguer/ofertas' || pathname === '/burguer/local';

  const favCount = Object.values(s.favs).filter((i) => i.menuSlug === 'hamburgueseria').length;
  const listCount = Object.values(s.list).filter((x) => x.item.menuSlug === 'hamburgueseria').reduce((n, x) => n + x.qty, 0);

  // "Pop" del botón Mi lista al añadir.
  const [pop, setPop] = useState(false);
  const prevList = useRef(listCount);
  useEffect(() => {
    if (listCount > prevList.current) {
      setPop(true);
      const t = setTimeout(() => setPop(false), 520);
      prevList.current = listCount;
      return () => clearTimeout(t);
    }
    prevList.current = listCount;
  }, [listCount]);

  if (onDetail) return null;

  const left: Tab[] = [
    {key: 'inicio', label: 'Inicio', icon: Home, href: '/burguer', active: pathname === '/burguer', badge: 0},
    {key: 'video', label: 'Vídeo', icon: PlayCircle, onClick: s.openVideo, active: s.videoOpen, badge: 0}
  ];
  // Estos dos cambian según el contexto (con animación suave).
  const dyn1: Tab = landingCtx
    ? {key: 'ofertas', label: 'Ofertas', icon: Percent, href: '/burguer/ofertas', active: pathname === '/burguer/ofertas', badge: 0, animated: true}
    : {key: 'fav', label: 'Favoritos', icon: Heart, href: '/burguer/fav', active: pathname === '/burguer/fav', badge: favCount, animated: true};
  const dyn2: Tab = landingCtx
    ? {key: 'local', label: 'Local', icon: MapPin, href: '/burguer/local', active: pathname === '/burguer/local', badge: 0, animated: true}
    : {key: 'list', label: 'Mi lista', icon: ListChecks, href: '/burguer/list', active: pathname === '/burguer/list', badge: listCount, pop, animated: true};

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-end justify-around border-t border-black/5 bg-[#fdfbf7]/95 px-1 pb-[max(0.3rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-md md:hidden">
      {left.map((t) => (
        <Item key={t.key} tab={t} />
      ))}

      {/* Carta: botón central destacado (gris por defecto, rojo al entrar) */}
      <Link href="/burguer/carta" className="relative flex flex-1 flex-col items-center gap-1">
        <span
          className={`-mt-6 flex size-14 items-center justify-center rounded-full text-[#fdfbf7] ring-4 ring-[#fdfbf7] transition active:scale-95 ${onCarta ? 'bg-[#c94a3c] shadow-[0_8px_24px_-6px_rgba(201,74,60,.7)]' : 'bg-[#b3aaa0] shadow-[0_8px_20px_-8px_rgba(0,0,0,.35)]'}`}
        >
          <UtensilsCrossed className="size-6" strokeWidth={2.1} />
        </span>
        <span className={`text-[0.62rem] font-bold transition-colors ${onCarta ? 'text-[#c94a3c]' : 'text-[#2a1713]/55'}`}>Carta</span>
      </Link>

      <Item key={dyn1.key} tab={dyn1} />
      <Item key={dyn2.key} tab={dyn2} />
    </nav>
  );
}

function Item({tab}: {tab: Tab}) {
  const {label, icon: Icon, href, onClick, active, badge, pop, animated} = tab;
  const cls = `relative flex flex-1 flex-col items-center gap-0.5 py-1 text-[0.6rem] font-medium tracking-wide transition-colors ${active || pop ? 'text-[#c94a3c]' : 'text-[#2a1713]/55'} ${animated ? 'duration-300 animate-in fade-in slide-in-from-bottom-1 fill-mode-both' : ''}`;
  const inner = (
    <>
      <span className="relative">
        {pop && <span className="lc-drop absolute left-1/2 top-[-9px] size-2.5 rounded-full bg-[#c94a3c]" />}
        <Icon className={`size-[21px] ${pop ? 'lc-pop' : ''}`} strokeWidth={active ? 2.4 : 1.8} />
      </span>
      {label}
      {badge > 0 && (
        <span className={`absolute right-[18%] top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c94a3c] px-1 text-[0.58rem] font-bold text-[#fdfbf7] ${pop ? 'lc-flash' : ''}`}>{badge}</span>
      )}
    </>
  );
  return href ? (
    <Link href={href} className={cls}>{inner}</Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>{inner}</button>
  );
}
