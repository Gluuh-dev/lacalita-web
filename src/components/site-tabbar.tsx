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
import {Link, usePathname} from '@/i18n/navigation';

// Se oculta donde hay otra barra inferior (cartas de menú, burguer) y en admin.
const HIDE = /^\/(burguer|admin)(\/|$)|^\/carta\/[^/]+/;

// Barra con bolsillo circular central (hombros redondeados) que abraza el FAB (del prototipo).
const BAR_PATH =
  'M0,48 Q0,28 20,28 L144.8,28 C148.8,28 152,31.2 152,35.2 C152,62.8 173.9,84.4 200.8,84.8 C227.1,83.5 248,61.5 248,35.2 C248,31.2 251.2,28 255.2,28 L380,28 Q400,28 400,48 L400,92 L0,92 Z';
// Variante tablet: misma forma pero con la base también redondeada (va flotando).
const BAR_PATH_FLOAT =
  'M0,48 Q0,28 20,28 L144.8,28 C148.8,28 152,31.2 152,35.2 C152,62.8 173.9,84.4 200.8,84.8 C227.1,83.5 248,61.5 248,35.2 C248,31.2 251.2,28 255.2,28 L380,28 Q400,28 400,48 L400,70 Q400,92 378,92 L22,92 Q0,92 0,70 Z';

// Las 4 cartas que se despliegan en abanico desde el botón central.
const CARTAS: {href: string; label: string; Icon: TablerIcon; dx: number; dy: number}[] = [
  {href: '/carta/desayunos', label: 'Desayunos', Icon: IconCoffee, dx: -132, dy: -62},
  {href: '/carta/restaurante', label: 'Restaurante', Icon: IconToolsKitchen2, dx: -50, dy: -116},
  {href: '/carta/cocteles', label: 'Cócteles', Icon: IconGlassCocktail, dx: 50, dy: -116},
  {href: '/burguer/carta', label: 'Hamburguesería', Icon: IconBurger, dx: 132, dy: -62}
];

export default function SiteTabBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  if (HIDE.test(pathname)) return null;

  return (
    <>
      {/* Espaciador: fluye al final de la página para que el contenido no
          termine escondido debajo de la barra. Desaparece con ella en PC. */}
      <div aria-hidden className="h-[calc(env(safe-area-inset-bottom)+6.5rem)] xl:pointer-fine:hidden" />

      {open && <div className="fixed inset-0 z-30 bg-black/15 duration-200 animate-in fade-in xl:pointer-fine:hidden" onClick={() => setOpen(false)} />}

      {/* Móvil: pegada abajo a todo el ancho. Tablet: píldora flotante centrada.
          Solo propiedades físicas: left/right (inset-x es lógica) y el override
          de md dejaba de aplicarse según el orden del CSS. */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 overflow-visible md:bottom-8 xl:pointer-fine:hidden">
        {/* El centrado va por mx-auto (no left/translate): el circulo y su
            bolsillo quedan clavados al centro en cualquier ancho. */}
        <div className="relative md:mx-auto md:w-[460px]">
        <svg viewBox="0 0 400 92" preserveAspectRatio="none" className="block h-[82px] w-full" style={{filter: 'drop-shadow(0 4px 14px rgba(0,0,0,.16))'}}>
          <path d={BAR_PATH} fill="var(--bg)" className="md:hidden" />
          <path d={BAR_PATH_FLOAT} fill="var(--bg)" className="hidden md:block" />
        </svg>

        {/* Pestañas (izquierda / hueco central / derecha) */}
        <div className="absolute inset-x-0 bottom-0 flex h-[54px] items-center pb-[env(safe-area-inset-bottom)]">
          <div className="flex flex-1 justify-around">
            <Item href="/" label="Inicio" Icon={IconHome} IconFilled={IconHomeFilled} active={pathname === '/'} />
            <Item href="/eventos" label="Eventos" Icon={IconTicket} IconFilled={IconTicketFilled} active={pathname.startsWith('/eventos')} />
          </div>
          <div className="w-[74px] shrink-0" aria-hidden />
          <div className="flex flex-1 justify-around">
            <Item href="/galeria" label="Galería" Icon={IconPhoto} IconFilled={IconPhotoFilled} active={pathname === '/galeria'} />
            <Item href="/ubicacion" label="Ubicación" Icon={IconLocation} IconFilled={IconLocationFilled} active={pathname === '/ubicacion'} />
          </div>
        </div>

        {/* Abanico de cartas */}
        {CARTAS.map((c, i) => (
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
            <span className="flex size-14 items-center justify-center rounded-full bg-bg text-ink shadow-lg">
              <c.Icon size={22} stroke={1.9} />
            </span>
            <span className="whitespace-nowrap rounded-full bg-ink px-2 py-0.5 text-[0.55rem] font-semibold text-bg">{c.label}</span>
          </Link>
        ))}

        {/* FAB central: abre/cierra el abanico */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Cartas"
          aria-expanded={open}
          className="absolute left-1/2 top-[32px] z-50 flex size-[62px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bg text-ink shadow-[0_6px_16px_-4px_rgba(0,0,0,.3)] transition active:scale-95"
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
