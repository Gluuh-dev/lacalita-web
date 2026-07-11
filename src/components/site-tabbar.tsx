'use client';

import {useState} from 'react';
import type {Icon as TablerIcon} from '@tabler/icons-react';
import {
  IconHome,
  IconHomeFilled,
  IconTicket,
  IconTicketFilled,
  IconPhoto,
  IconPhotoFilled,
  IconLocation,
  IconLocationFilled,
  IconToolsKitchen2,
  IconCoffee,
  IconGlassCocktail,
  IconBurger
} from '@tabler/icons-react';
import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';

// Se oculta donde hay otra barra inferior (cartas de menú, burguer) y en admin.
const HIDE = /^\/(burguer|admin)(\/|$)|^\/carta\/[^/]+/;

// Barra con bolsillo circular central (hombros redondeados) que abraza el FAB (del prototipo).
const BAR_PATH =
  'M0,48 Q0,28 20,28 L144.8,28 C148.8,28 152,31.2 152,35.2 C152,62.8 173.9,84.4 200.8,84.8 C227.1,83.5 248,61.5 248,35.2 C248,31.2 251.2,28 255.2,28 L380,28 Q400,28 400,48 L400,92 L0,92 Z';
// Variante flotante (md+): la barra entera con un recorte circular perforado
// alrededor del boton central (como el bolsillo del movil, pero centrado).
// El agujero es una elipse en el viewBox que en pantalla queda circular.
const BAR_PATH_FLOAT =
  'M0,48 Q0,28 20,28 L380,28 Q400,28 400,48 L400,70 Q400,92 378,92 L22,92 Q0,92 0,70 Z ' +
  'M170,60 a30,30 0 1 0 60,0 a30,30 0 1 0 -60,0 Z';

// Las 4 cartas que se despliegan en abanico desde el botón central (labels = claves de `nav`).
const CARTAS: {href: string; key: 'breakfast' | 'restaurant' | 'cocktails' | 'burger'; Icon: TablerIcon; dx: number; dy: number}[] = [
  {href: '/carta/desayunos', key: 'breakfast', Icon: IconCoffee, dx: -132, dy: -62},
  {href: '/carta/restaurante', key: 'restaurant', Icon: IconToolsKitchen2, dx: -50, dy: -116},
  {href: '/carta/cocteles', key: 'cocktails', Icon: IconGlassCocktail, dx: 50, dy: -116},
  {href: '/burguer/carta', key: 'burger', Icon: IconBurger, dx: 132, dy: -62}
];


// Escudo breve: evita que el toque que eligio carta caiga en la pagina nueva.
function navShield() {
  document.body.setAttribute('data-nav-shield', '1');
  setTimeout(() => document.body.removeAttribute('data-nav-shield'), 450);
}
export default function SiteTabBar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  if (HIDE.test(pathname)) return null;

  return (
    <>
      {/* Espaciador: fluye al final de la página para que el contenido no
          termine escondido debajo de la barra. Desaparece con ella en PC. */}
      <div aria-hidden className="h-[calc(env(safe-area-inset-bottom)+6.5rem)]" />

      {open && <div className="fixed inset-0 z-30 bg-black/15 duration-200 animate-in fade-in" onClick={() => { setOpen(false); navShield(); }} />}

      {/* Móvil: pegada abajo a todo el ancho. Tablet: píldora flotante centrada.
          Solo propiedades físicas: left/right (inset-x es lógica) y el override
          de md dejaba de aplicarse según el orden del CSS. */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 overflow-visible md:bottom-8">
        {/* El centrado va por mx-auto (no left/translate): el circulo y su
            bolsillo quedan clavados al centro en cualquier ancho. */}
        <div className="relative md:mx-auto md:w-[460px]">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[57px] rounded-t-[20px] backdrop-blur-md md:h-[74px] md:rounded-[22px]" />
        <svg viewBox="0 0 400 92" preserveAspectRatio="none" className="block h-[82px] w-full md:h-[106px]" style={{filter: 'drop-shadow(0 4px 14px rgba(0,0,0,.16))'}}>
          <path d={BAR_PATH} fill="rgba(255,255,255,.9)" className="md:hidden" />
          <path d={BAR_PATH_FLOAT} fillRule="evenodd" fill="rgba(255,255,255,.9)" className="hidden md:block" />
        </svg>

        {/* Pestañas (izquierda / hueco central / derecha) */}
        <div className="absolute inset-x-0 bottom-0 flex h-[54px] items-center md:h-[74px] pb-[env(safe-area-inset-bottom)]">
          <div className="flex flex-1 justify-around">
            <Item href="/" label={t('home')} Icon={IconHome} IconFilled={IconHomeFilled} active={pathname === '/'} />
            <Item href="/eventos" label={t('events')} Icon={IconTicket} IconFilled={IconTicketFilled} active={pathname.startsWith('/eventos')} />
          </div>
          <div className="w-[74px] shrink-0" aria-hidden />
          <div className="flex flex-1 justify-around">
            <Item href="/galeria" label={t('gallery')} Icon={IconPhoto} IconFilled={IconPhotoFilled} active={pathname === '/galeria'} />
            <Item href="/ubicacion" label={t('location')} Icon={IconLocation} IconFilled={IconLocationFilled} active={pathname === '/ubicacion'} />
          </div>
        </div>

        {/* Abanico de cartas */}
        {CARTAS.map((c, i) => (
          <Link
            key={c.href}
            href={c.href}
            aria-label={t(c.key)}
            onClick={() => { setOpen(false); navShield(); }}
            className="absolute left-1/2 top-[32px] md:top-[13px] z-40 flex flex-col items-center gap-1.5"
            style={{
              transform: open ? `translate(-50%,-50%) translate(${c.dx}px,${c.dy}px) scale(1)` : 'translate(-50%,-50%) scale(.3)',
              opacity: open ? 1 : 0,
              pointerEvents: open ? 'auto' : 'none',
              transition: 'transform .32s cubic-bezier(.34,1.56,.64,1), opacity .22s',
              transitionDelay: open ? `${i * 0.05}s` : `${(3 - i) * 0.04}s`
            }}
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-white text-ink shadow-lg">
              <c.Icon size={22} stroke={1.9} />
            </span>
            <span className="whitespace-nowrap rounded-full bg-ink px-2 py-0.5 text-[0.55rem] font-semibold text-bg">{t(c.key)}</span>
          </Link>
        ))}

        {/* FAB central: abre/cierra el abanico */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={t('cartas')}
          aria-expanded={open}
          className="absolute left-1/2 top-[32px] md:top-[69px] z-50 flex size-[62px] md:size-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-[0_6px_16px_-4px_rgba(0,0,0,.3)] transition active:scale-95"
        >
          <IconToolsKitchen2 size={26} stroke={2} style={{transform: open ? 'rotate(45deg)' : 'none', transition: 'transform .25s'}} />
        </button>
        </div>
      </nav>
    </>
  );
}

function Item({href, label, Icon, IconFilled, active}: {href: string; label: string; Icon: TablerIcon; IconFilled: TablerIcon; active: boolean}) {
  const I = active ? IconFilled : Icon;
  return (
    <Link href={href} className={`flex flex-col items-center gap-0.5 text-[0.6rem] font-medium tracking-wide transition-colors ${active ? 'text-brand-deep' : 'text-ink-3'}`}>
      <I size={22} stroke={1.8} />
      {label}
    </Link>
  );
}
