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
import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {useMenuStore} from '@/components/menu/store';

const BAR_PATH =
  'M0,48 Q0,28 20,28 L144.8,28 C148.8,28 152,31.2 152,35.2 C152,62.8 173.9,84.4 200.8,84.8 C227.1,83.5 248,61.5 248,35.2 C248,31.2 251.2,28 255.2,28 L380,28 Q400,28 400,48 L400,92 L0,92 Z';

const CARTAS: {href: string; key: 'breakfast' | 'restaurant' | 'cocktails' | 'burger'; Icon: TablerIcon; dx: number; dy: number}[] = [
  {href: '/carta/desayunos', key: 'breakfast', Icon: IconCoffee, dx: -132, dy: -62},
  {href: '/carta/restaurante', key: 'restaurant', Icon: IconToolsKitchen2, dx: -50, dy: -116},
  {href: '/carta/cocteles', key: 'cocktails', Icon: IconGlassCocktail, dx: 50, dy: -116},
  {href: '/burguer/carta', key: 'burger', Icon: IconBurger, dx: 132, dy: -62}
];

// Icono + color del botón central según la carta actual.
const MENU_STYLE: Record<string, {Icon: TablerIcon; color: string}> = {
  desayunos: {Icon: IconCoffee, color: '#c9922f'},
  restaurante: {Icon: IconToolsKitchen2, color: '#b5651d'},
  cocteles: {Icon: IconGlassCocktail, color: '#2e6e8e'}
};

export default function CartaTabBar() {
  const tNav = useTranslations('nav');
  const tTabs = useTranslations('tabs');
  const pathname = usePathname();
  const s = useMenuStore();
  const [open, setOpen] = useState(false);

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
  const onCartaIndex = sub === ''; // estamos en la carta → el centro abre el abanico
  const cur = MENU_STYLE[menu] ?? {Icon: IconToolsKitchen2, color: '#c98a4e'};
  const CurIcon = cur.Icon;

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/15 duration-200 animate-in fade-in md:hidden" onClick={() => setOpen(false)} />}

      <nav className="fixed inset-x-0 bottom-0 z-40 overflow-visible md:hidden">
        <svg viewBox="0 0 400 92" preserveAspectRatio="none" className="block h-[82px] w-full" style={{filter: 'drop-shadow(0 -2px 8px rgba(0,0,0,.10))'}}>
          <path d={BAR_PATH} fill="var(--bg)" />
        </svg>

        <div className="absolute inset-x-0 bottom-0 flex h-[54px] items-center pb-[env(safe-area-inset-bottom)]">
          <div className="flex flex-1 justify-around">
            <Item href="/" label={tNav('home')} Icon={IconHome} IconFilled={IconHomeFilled} active={false} />
            <Item href={`${base}/video`} label={tTabs('video')} Icon={IconVideo} IconFilled={IconVideoFilled} active={sub === 'video'} />
          </div>
          <div className="w-[74px] shrink-0" aria-hidden />
          <div className="flex flex-1 justify-around">
            <Item href={`${base}/fav`} label={tTabs('favorites')} Icon={IconHeart} IconFilled={IconHeartFilled} active={sub === 'fav'} badge={favCount} />
            <Item href={`${base}/list`} label={tTabs('list')} Icon={IconClipboardList} IconFilled={IconClipboardListFilled} active={sub === 'list'} badge={listCount} />
          </div>
        </div>

        {/* Abanico de cartas (solo cuando estamos en la carta) */}
        {onCartaIndex &&
          CARTAS.map((c, i) => (
            <Link
              key={c.href}
              href={c.href}
              aria-label={tNav(c.key)}
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
              <span className={`flex size-14 items-center justify-center rounded-full shadow-lg ${c.href === base ? 'bg-brand text-on-primary' : 'bg-bg text-ink'}`}>
                <c.Icon size={22} stroke={1.9} />
              </span>
              <span className="whitespace-nowrap rounded-full bg-ink px-2 py-0.5 text-[0.55rem] font-semibold text-bg">{tNav(c.key)}</span>
            </Link>
          ))}

        {/* Centro: en la carta abre el abanico; en fav/list/video vuelve a la carta */}
        {onCartaIndex ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={tNav('cartas')}
            aria-expanded={open}
            className="absolute left-1/2 top-[32px] z-50 flex size-[62px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-[0_6px_16px_-4px_rgba(0,0,0,.3)] active:scale-95"
            style={{backgroundColor: cur.color, transition: 'background-color .45s ease, transform .12s'}}
          >
            <CurIcon key={menu} size={26} stroke={2} className="duration-300 animate-in fade-in zoom-in-90" style={{transform: open ? 'rotate(45deg)' : 'none', transition: 'transform .25s'}} />
          </button>
        ) : (
          <Link
            href={base}
            aria-label={tNav('menu')}
            className="absolute left-1/2 top-[32px] z-50 flex size-[62px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-[0_6px_16px_-4px_rgba(0,0,0,.3)] active:scale-95"
            style={{backgroundColor: `color-mix(in srgb, ${cur.color} 52%, #fff)`, transition: 'background-color .45s ease, transform .12s'}}
          >
            <CurIcon key={menu} size={26} stroke={2} className="duration-300 animate-in fade-in zoom-in-90" />
          </Link>
        )}
      </nav>
    </>
  );
}

function Item({href, label, Icon, IconFilled, active, badge = 0}: {href: string; label: string; Icon: TablerIcon; IconFilled: TablerIcon; active: boolean; badge?: number}) {
  const I = active ? IconFilled : Icon;
  return (
    <Link href={href} className={`flex flex-col items-center gap-0.5 text-[0.6rem] font-medium tracking-wide transition-colors ${active ? 'text-brand-deep' : 'text-ink-3'}`}>
      <span className="relative">
        <I size={22} stroke={1.8} />
        {badge > 0 && (
          <span className="absolute -right-2.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[0.55rem] font-bold text-on-primary">{badge}</span>
        )}
      </span>
      {label}
    </Link>
  );
}
