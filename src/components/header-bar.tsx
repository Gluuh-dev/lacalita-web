'use client';

import {useEffect, useState} from 'react';
import {Link, usePathname} from '@/i18n/navigation';
import {cn} from '@/lib/utils';
import {useHideOnScroll} from '@/lib/use-hide-on-scroll';
import {useScrollLock} from '@/lib/use-scroll-lock';

import LangSwitcher from './lang-switcher';
import {useHeaderMode} from './header-mode';
import {useIsAdmin} from '@/lib/use-is-admin';

// Origen del círculo del menú (donde está el botón, arriba a la derecha).
// El botón vive en un contenido max-w-7xl (80rem) centrado: por debajo de ese
// ancho min(50vw,40rem)=50vw y la fórmula equivale al borde del viewport.
const M_ORIGIN = 'calc(50vw + min(50vw, 40rem) - 2.05rem) 1.75rem';
const M_OPEN = `circle(150% at ${M_ORIGIN})`;
const M_CLOSED = `circle(0px at ${M_ORIGIN})`;

export default function HeaderBar({
  labels
}: {
  labels: {menu: string; events: string; location: string};
}) {
  const {mode} = useHeaderMode();
  const isAdmin = useIsAdmin();
  const pathname = usePathname();
  const cartaMatch = pathname.match(/^\/carta\/([^/]+)(?:\/([^/]+))?/);
  const currentCarta = cartaMatch ? cartaMatch[1] : null;

  const menuLinks = currentCarta
    ? [
        {href: '/', label: 'Inicio', active: false},
        {href: '/carta/desayunos', label: 'Desayunos', active: currentCarta === 'desayunos'},
        {href: '/carta/restaurante', label: 'Restaurante', active: currentCarta === 'restaurante'},
        {href: '/carta/cocteles', label: 'Cócteles', active: currentCarta === 'cocteles'},
        {href: '/burguer/carta', label: 'Hamburguesería', active: currentCarta === 'hamburgueseria'}
      ]
    : [
        {href: '/', label: 'Inicio', active: pathname === '/'},
        {href: '/carta', label: labels.menu, active: pathname === '/carta'},
        {href: '/eventos', label: labels.events, active: pathname.startsWith('/eventos')},
        {href: '/galeria', label: 'Galería', active: pathname === '/galeria'},
        {href: '/ubicacion', label: labels.location, active: pathname === '/ubicacion'}
      ];
  const overlayLinks = [
    ...menuLinks,
    ...(isAdmin && currentCarta ? [{href: '/admin/menus', label: 'Editar carta', active: false}] : []),
    ...(isAdmin ? [{href: '/admin', label: 'Admin', active: false}] : [])
  ];
  const {scrolled} = useHideOnScroll();
  const [open, setOpen] = useState(false);

  useScrollLock(open);

  // Marca en <body> que el menú está abierto: los elementos fijos ajenos al
  // header (p. ej. la cuenta atrás de eventos) se ocultan por CSS.
  useEffect(() => {
    document.body.toggleAttribute('data-menu-open', open);
    return () => document.body.removeAttribute('data-menu-open');
  }, [open]);

  // Páginas que empiezan con una cabecera oscura a sangre: el navbar va encima.
  const darkHeader = pathname === '/eventos' || pathname.startsWith('/eventos/');
  // En las cartas (como en la hamburguesería) el navbar es transparente mientras no hay scroll.
  const overlay = (mode.overHero || !!currentCarta || darkHeader) && !scrolled;
  const onMedia = overlay && (mode.hasMedia || darkHeader);
  const light = onMedia;
  // Sobre el hero ya se ve el logo grande: el de la barra estorba hasta el scroll.
  const hideLogo = mode.overHero && !scrolled && !open;

  return (
    <>
      <header
        className={cn(
          // Barra a todo el ancho; el contenido (logo + menú) se limita a xl y
          // se centra, para que en PC no queden pegados a las esquinas.
          'fixed inset-x-0 top-0 z-50 h-14 px-4 transition-[background-color,border-color] duration-300 animate-in fade-in slide-in-from-top duration-500',
          onMedia
            ? 'bg-gradient-to-b from-black/40 to-transparent'
            : overlay
              ? 'bg-transparent'
              : 'border-b border-black/5 bg-bg',
          open && 'border-transparent bg-transparent'
        )}
      >
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-3">
        {/* pl-1.5 = los mismos 6px que el icono del menú queda metido dentro de
            su botón (36px de botón, 24px de glifo). Así ambos tienen el mismo
            margen óptico respecto al borde y comparten centro vertical. */}
        <Link href="/" aria-label="La Calita" className={cn('flex items-center pl-1.5', hideLogo && 'pointer-events-none')}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-solo.svg"
            alt="La Calita"
            className={cn('h-[32px] w-auto transition duration-300', light && !open && 'brightness-0 invert', hideLogo && 'opacity-0')}
          />
        </Link>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Cerrar menú' : 'Menú'}
          className={cn('relative z-[46] flex size-9 items-center justify-center rounded-full', open ? 'text-ink' : light ? 'bg-black/25 text-white backdrop-blur' : 'text-ink')}
        >
          <span className="relative block h-4 w-6" aria-hidden>
            <span className={cn('absolute left-0 h-[2px] w-6 rounded-full bg-current transition-all duration-300', open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0')} />
            <span className={cn('absolute left-0 top-1/2 h-[2px] w-6 -translate-y-1/2 rounded-full bg-current transition-all duration-300', open ? 'opacity-0' : 'opacity-100')} />
            <span className={cn('absolute left-0 h-[2px] w-6 rounded-full bg-current transition-all duration-300', open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0')} />
          </span>
        </button>
        </div>
      </header>

      {/* Menú móvil: círculo que se expande desde el botón (como en hamburguesería). */}
      <div
        aria-hidden={open ? undefined : true}
        className="fixed inset-0 z-[45] bg-bg"
        style={{
          clipPath: open ? M_OPEN : M_CLOSED,
          WebkitClipPath: open ? M_OPEN : M_CLOSED,
          transition: 'clip-path 520ms cubic-bezier(.4,0,.2,1), -webkit-clip-path 520ms cubic-bezier(.4,0,.2,1)',
          pointerEvents: open ? 'auto' : 'none'
        }}
      >
        <nav className="flex h-full flex-col items-center justify-center gap-7 px-6">
          {overlayLinks.map((f, i) => {
            const cls = cn('font-adam text-4xl capitalize tracking-wide transition-colors', f.active ? 'text-brand-deep' : 'text-ink');
            const style = {
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0)' : 'translateY(18px)',
              transition: 'opacity 400ms ease, transform 400ms ease',
              transitionDelay: open ? `${200 + i * 70}ms` : '0ms'
            };
            return f.href.startsWith('/admin') ? (
              <a key={f.href} href={f.href} onClick={() => setOpen(false)} className={cls} style={style}>
                {f.label}
              </a>
            ) : (
              <Link key={f.href} href={f.href} onClick={() => setOpen(false)} className={cls} style={style}>
                {f.label}
              </Link>
            );
          })}
          <div
            className="mt-2 scale-125"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0)' : 'translateY(18px)',
              transition: 'opacity 400ms ease, transform 400ms ease',
              transitionDelay: open ? `${200 + overlayLinks.length * 70}ms` : '0ms'
            }}
          >
            <LangSwitcher />
          </div>
        </nav>
      </div>
    </>
  );
}
