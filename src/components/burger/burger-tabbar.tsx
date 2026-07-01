'use client';

import {useState} from 'react';
import type {Icon as TablerIcon} from '@tabler/icons-react';
import {
  IconHome,
  IconHomeFilled,
  IconVideo,
  IconVideoFilled,
  IconHeart,
  IconHeartFilled,
  IconClipboardList,
  IconClipboardListFilled,
  IconToolsKitchen2,
  IconCoffee,
  IconGlassCocktail,
  IconBurger
} from '@tabler/icons-react';
import {Link, usePathname} from '@/i18n/navigation';
import {useMenuStore} from '@/components/menu/store';

const BAR_PATH =
  'M0,48 Q0,28 20,28 L144.8,28 C148.8,28 152,31.2 152,35.2 C152,62.8 173.9,84.4 200.8,84.8 C227.1,83.5 248,61.5 248,35.2 C248,31.2 251.2,28 255.2,28 L380,28 Q400,28 400,48 L400,92 L0,92 Z';

const CARTAS: {href: string; label: string; Icon: TablerIcon; dx: number; dy: number}[] = [
  {href: '/carta/desayunos', label: 'Desayunos', Icon: IconCoffee, dx: -95, dy: -56},
  {href: '/carta/restaurante', label: 'Restaurante', Icon: IconToolsKitchen2, dx: -36, dy: -104},
  {href: '/carta/cocteles', label: 'Cócteles', Icon: IconGlassCocktail, dx: 36, dy: -104},
  {href: '/burguer/carta', label: 'Hamburguesería', Icon: IconBurger, dx: 95, dy: -56}
];

// Colores de la hamburguesería.
const C = {bg: '#fdfbf7', brand: '#c36148', neutral: '#b3aaa0', ink: '#2a1713', dim: 'rgba(42,23,19,.55)'};

export default function BurgerTabBar() {
  const pathname = usePathname();
  const s = useMenuStore();
  const [open, setOpen] = useState(false);

  // El detalle de producto tiene su propia barra de acciones.
  if (pathname.startsWith('/burguer/carta/')) return null;

  const favCount = Object.values(s.favs).filter((i) => i.menuSlug === 'hamburgueseria').length;
  const listCount = Object.values(s.list)
    .filter((x) => x.item.menuSlug === 'hamburgueseria')
    .reduce((n, x) => n + x.qty, 0);

  const onCarta = pathname === '/burguer/carta';

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/15 duration-200 animate-in fade-in md:hidden" onClick={() => setOpen(false)} />}

      <nav className="fixed inset-x-0 bottom-0 z-40 overflow-visible md:hidden">
        <svg viewBox="0 0 400 92" preserveAspectRatio="none" className="block h-[82px] w-full" style={{filter: 'drop-shadow(0 -2px 8px rgba(0,0,0,.10))'}}>
          <path d={BAR_PATH} fill={C.bg} />
        </svg>

        <div className="absolute inset-x-0 bottom-0 flex h-[54px] items-center pb-[env(safe-area-inset-bottom)]">
          <div className="flex flex-1 justify-around">
            <Item href="/burguer" label="Inicio" Icon={IconHome} IconFilled={IconHomeFilled} active={pathname === '/burguer'} />
            <Item href="/burguer/video" label="Vídeo" Icon={IconVideo} IconFilled={IconVideoFilled} active={pathname === '/burguer/video'} />
          </div>
          <div className="w-[74px] shrink-0" aria-hidden />
          <div className="flex flex-1 justify-around">
            <Item href="/burguer/fav" label="Favoritos" Icon={IconHeart} IconFilled={IconHeartFilled} active={pathname === '/burguer/fav'} badge={favCount} />
            <Item href="/burguer/list" label="Mi lista" Icon={IconClipboardList} IconFilled={IconClipboardListFilled} active={pathname === '/burguer/list'} badge={listCount} />
          </div>
        </div>

        {/* Abanico de cartas (solo en la carta) */}
        {onCarta &&
          CARTAS.map((c, i) => (
            <Link
              key={c.href}
              href={c.href}
              aria-label={c.label}
              onClick={() => setOpen(false)}
              className="absolute left-1/2 top-[32px] z-40 flex flex-col items-center gap-1.5"
              style={{
                transform: open ? `translate(-50%,-50%) translate(${c.dx}px,${c.dy}px) scale(1)` : 'translate(-50%,-50%) scale(.3)',
                opacity: open ? 1 : 0,
                pointerEvents: open ? 'auto' : 'none',
                transition: 'transform .32s cubic-bezier(.34,1.56,.64,1), opacity .22s',
                transitionDelay: open ? `${i * 0.05}s` : `${(3 - i) * 0.04}s`
              }}
            >
              <span
                className="flex size-14 items-center justify-center rounded-full shadow-lg"
                style={{
                  border: `2px solid ${C.brand}`,
                  background: c.href === '/burguer/carta' ? C.brand : C.bg,
                  color: c.href === '/burguer/carta' ? C.bg : C.ink
                }}
              >
                <c.Icon size={22} stroke={1.9} />
              </span>
              <span className="whitespace-nowrap rounded-full px-2 py-0.5 text-[0.55rem] font-semibold" style={{background: C.ink, color: C.bg}}>{c.label}</span>
            </Link>
          ))}

        {/* Centro: en la carta abre el abanico; en el resto lleva a /burguer/carta */}
        {onCarta ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Elegir carta"
            aria-expanded={open}
            className="absolute left-1/2 top-[32px] z-50 flex size-[62px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition active:scale-95"
            style={{background: C.brand, color: C.bg, boxShadow: '0 6px 16px -4px rgba(0,0,0,.3)'}}
          >
            <IconToolsKitchen2 size={26} stroke={2} style={{transform: open ? 'rotate(45deg)' : 'none', transition: 'transform .25s'}} />
          </button>
        ) : (
          <Link
            href="/burguer/carta"
            aria-label="Carta"
            className="absolute left-1/2 top-[32px] z-50 flex size-[62px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition active:scale-95"
            style={{background: C.neutral, color: C.bg, boxShadow: '0 6px 16px -4px rgba(0,0,0,.3)'}}
          >
            <IconToolsKitchen2 size={26} stroke={2} />
          </Link>
        )}
      </nav>
    </>
  );
}

function Item({href, label, Icon, IconFilled, active, badge = 0}: {href: string; label: string; Icon: TablerIcon; IconFilled: TablerIcon; active: boolean; badge?: number}) {
  const I = active ? IconFilled : Icon;
  return (
    <Link href={href} className="flex flex-col items-center gap-0.5 text-[0.6rem] font-medium tracking-wide" style={{color: active ? C.brand : C.dim}}>
      <span className="relative">
        <I size={22} stroke={1.8} />
        {badge > 0 && (
          <span className="absolute -right-2.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[0.55rem] font-bold" style={{background: C.brand, color: C.bg}}>{badge}</span>
        )}
      </span>
      {label}
    </Link>
  );
}
