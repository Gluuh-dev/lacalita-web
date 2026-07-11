'use client';

import {useEffect, useState} from 'react';
import {ChevronLeft} from 'lucide-react';
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
  labels: {
    home: string;
    menu: string;
    events: string;
    gallery: string;
    location: string;
    breakfast: string;
    restaurant: string;
    cocktails: string;
    burger: string;
    editMenu: string;
    admin: string;
    openMenu: string;
    closeMenu: string;
  };
}) {
  const {mode} = useHeaderMode();
  const isAdmin = useIsAdmin();
  const pathname = usePathname();
  const cartaMatch = pathname.match(/^\/carta\/([^/]+)(?:\/([^/]+))?/);
  const currentCarta = cartaMatch ? cartaMatch[1] : null;
  // Detalle de producto: el logo cede el sitio a un chevron de vuelta a la carta.
  const cartaSub = cartaMatch?.[2];
  const onProductDetail = !!currentCarta && !!cartaSub && !['fav', 'list', 'video'].includes(cartaSub);

  const menuLinks = currentCarta
    ? [
        {href: '/', label: labels.home, active: false},
        {href: '/carta/desayunos', label: labels.breakfast, active: currentCarta === 'desayunos'},
        {href: '/carta/restaurante', label: labels.restaurant, active: currentCarta === 'restaurante'},
        {href: '/carta/cocteles', label: labels.cocktails, active: currentCarta === 'cocteles'},
        {href: '/burguer/carta', label: labels.burger, active: currentCarta === 'hamburgueseria'}
      ]
    : [
        {href: '/', label: labels.home, active: pathname === '/'},
        {href: '/carta', label: labels.menu, active: pathname === '/carta'},
        {href: '/eventos', label: labels.events, active: pathname.startsWith('/eventos')},
        {href: '/galeria', label: labels.gallery, active: pathname === '/galeria'},
        {href: '/ubicacion', label: labels.location, active: pathname === '/ubicacion'}
      ];
  const overlayLinks = [
    ...menuLinks,
    ...(isAdmin && currentCarta ? [{href: '/admin/menus', label: labels.editMenu, active: false}] : []),
    ...(isAdmin ? [{href: '/admin', label: labels.admin, active: false}] : [])
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
    // El slug de la carta coincide con su tema (desayunos/restaurante/cocteles):
    // navbar, logo y menú desplegable se tiñen con el color de la carta activa.
    <div data-theme={currentCarta ?? undefined} className="contents">
      <header
        className={cn(
          // Barra a todo el ancho; el contenido (logo + menú) se limita a xl y
          // se centra, para que en PC no queden pegados a las esquinas.
          'fixed inset-x-0 top-0 z-50 h-14 px-4 transition-[background-color,border-color] duration-300 animate-in fade-in slide-in-from-top duration-500',
          onMedia
            ? 'bg-gradient-to-b from-black/40 to-transparent'
            : overlay
              ? 'bg-transparent'
              : 'bg-bg',
          open && 'border-transparent bg-transparent'
        )}
      >
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-3">
        {/* pl-1.5 = los mismos 6px que el icono del menú queda metido dentro de
            su botón (36px de botón, 24px de glifo). Así ambos tienen el mismo
            margen óptico respecto al borde y comparten centro vertical. */}
        {onProductDetail ? (
          <Link href={`/carta/${currentCarta}`} aria-label={labels.menu} className="flex items-center pl-0.5">
            <ChevronLeft className={cn('size-7 transition', light && !open ? 'text-white' : 'text-ink')} />
          </Link>
        ) : (
        <Link href="/" aria-label="La Calita" className={cn('flex items-center pl-1.5', hideLogo && 'pointer-events-none')}>
          {/* Máscara en vez de <img>: el logo toma el color del tema de la carta. */}
          <span
            aria-hidden
            className={cn('block h-8 w-[37px] transition duration-300', hideLogo && 'opacity-0')}
            style={{
              backgroundColor: light && !open ? '#ffffff' : 'var(--brand-deep)',
              WebkitMaskImage: 'url(/brand/logo-solo.svg)',
              maskImage: 'url(/brand/logo-solo.svg)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskPosition: 'center',
              maskPosition: 'center'
            }}
          />
        </Link>
        )}

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? labels.closeMenu : labels.openMenu}
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
    </div>
  );
}
