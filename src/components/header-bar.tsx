'use client';

import {useState} from 'react';
import {ChevronLeft} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';
import {cn} from '@/lib/utils';
import {useHideOnScroll} from '@/lib/use-hide-on-scroll';
import {useScrollLock} from '@/lib/use-scroll-lock';

const CARTA_LABELS: Record<string, string> = {
  desayunos: 'Desayunos & Meriendas',
  restaurante: 'Restaurante',
  hamburgueseria: 'Hamburguesería'
};
import LangSwitcher from './lang-switcher';
import {useHeaderMode} from './header-mode';
import {useIsAdmin} from '@/lib/use-is-admin';

// Origen del círculo del menú (donde está el botón, arriba a la derecha).
const M_ORIGIN = 'calc(100% - 2.05rem) 1.75rem';
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
  const cartaMatch = pathname.match(/^\/carta\/([^/]+)/);
  const currentCarta = cartaMatch ? cartaMatch[1] : null;
  const cartaLabel = currentCarta ? CARTA_LABELS[currentCarta] ?? null : null;

  const menuLinks = cartaLabel
    ? [
        {href: '/', label: 'Inicio', active: false},
        {href: '/carta/desayunos', label: 'Desayunos', active: currentCarta === 'desayunos'},
        {href: '/carta/restaurante', label: 'Restaurante', active: currentCarta === 'restaurante'},
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
    ...(isAdmin && cartaLabel ? [{href: '/admin/menus', label: 'Editar carta', active: false}] : []),
    ...(isAdmin ? [{href: '/admin', label: 'Admin', active: false}] : [])
  ];
  const {scrolled} = useHideOnScroll();
  const [open, setOpen] = useState(false);
  const backHref = currentCarta === 'hamburgueseria' ? '/burguer' : '/';

  useScrollLock(open);

  const overlay = mode.overHero && !scrolled;
  const onMedia = overlay && mode.hasMedia;
  const light = onMedia;

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-3 px-4 transition-[background-color,border-color] duration-300 animate-in fade-in slide-in-from-top duration-500',
          onMedia
            ? 'bg-gradient-to-b from-black/40 to-transparent'
            : overlay
              ? 'bg-transparent'
              : 'border-b border-black/5 bg-bg/85 backdrop-blur',
          open && 'border-transparent bg-transparent'
        )}
      >
        <div className="flex items-center gap-1">
          {cartaLabel && (
            <Link
              href={backHref}
              aria-label="Volver"
              className={cn('-ml-1 flex size-9 items-center justify-center rounded-full transition', light ? 'text-white' : 'text-ink')}
            >
              <ChevronLeft className="size-6" />
            </Link>
          )}
          <Link href="/" aria-label="La Calita" className="flex items-center gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-solo.svg"
              alt="La Calita"
              style={{transform: 'translateY(-1px)'}}
              className={cn('h-[30px] w-auto transition', light && !open && 'brightness-0 invert')}
            />
            {!cartaLabel && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/brand/texto-lacalita-derecha.svg"
                alt=""
                aria-hidden
                className={cn('h-[15px] w-auto transition', light && !open && 'brightness-0 invert')}
              />
            )}
          </Link>
        </div>

        <nav className={cn('hidden items-center gap-5 text-sm transition-colors sm:flex', light ? 'text-white' : 'text-ink')}>
          {cartaLabel ? (
            <span className="font-adam text-[0.8rem] uppercase tracking-[0.13em]">{cartaLabel}</span>
          ) : (
            <>
              <Link href="/carta" className="ds-navlink font-adam text-[0.8rem] uppercase tracking-[0.13em]">{labels.menu}</Link>
              <Link href="/eventos" className="ds-navlink font-adam text-[0.8rem] uppercase tracking-[0.13em]">{labels.events}</Link>
              <Link href="/#info" className="ds-navlink font-adam text-[0.8rem] uppercase tracking-[0.13em]">{labels.location}</Link>
            </>
          )}
          {isAdmin && (
            <a href="/admin" className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-white hover:opacity-90">Admin</a>
          )}
          <LangSwitcher />
        </nav>

        {cartaLabel && (
          <span className={cn('pointer-events-none absolute left-1/2 -translate-x-1/2 font-adam text-xs uppercase tracking-[0.12em] sm:hidden', light ? 'text-white' : 'text-ink')}>
            {cartaLabel}
          </span>
        )}

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Cerrar menú' : 'Menú'}
          className={cn('relative z-[46] flex size-9 items-center justify-center rounded-full sm:hidden', open ? 'text-ink' : light ? 'bg-black/25 text-white backdrop-blur' : 'text-ink')}
        >
          <span className="relative block h-4 w-6" aria-hidden>
            <span className={cn('absolute left-0 h-[2px] w-6 rounded-full bg-current transition-all duration-300', open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0')} />
            <span className={cn('absolute left-0 top-1/2 h-[2px] w-6 -translate-y-1/2 rounded-full bg-current transition-all duration-300', open ? 'opacity-0' : 'opacity-100')} />
            <span className={cn('absolute left-0 h-[2px] w-6 rounded-full bg-current transition-all duration-300', open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0')} />
          </span>
        </button>
      </header>

      {/* Menú móvil: círculo que se expande desde el botón (como en hamburguesería). */}
      <div
        aria-hidden={!open}
        className="fixed inset-0 z-[45] bg-white sm:hidden"
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
