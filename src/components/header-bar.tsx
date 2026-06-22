'use client';

import {useEffect, useState} from 'react';
import {Menu, X} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';
import {cn} from '@/lib/utils';

const CARTA_LABELS: Record<string, string> = {
  desayunos: 'Desayunos & Meriendas',
  restaurante: 'Restaurante',
  hamburgueseria: 'Hamburguesería'
};
import LangSwitcher from './lang-switcher';
import {useHeaderMode} from './header-mode';
import {useIsAdmin} from '@/lib/use-is-admin';

export default function HeaderBar({
  labels
}: {
  labels: {menu: string; events: string; location: string};
}) {
  const {mode} = useHeaderMode();
  const isAdmin = useIsAdmin();
  const pathname = usePathname();
  const cartaMatch = pathname.match(/^\/carta\/([^/]+)/);
  const cartaLabel = cartaMatch ? CARTA_LABELS[cartaMatch[1]] ?? null : null;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const overlay = mode.overHero && !scrolled;
  const onMedia = overlay && mode.hasMedia;
  const light = onMedia;

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-3 px-4 transition-colors duration-300',
          onMedia
            ? 'bg-gradient-to-b from-black/40 to-transparent'
            : overlay
              ? 'bg-transparent'
              : 'border-b border-black/5 bg-bg/85 backdrop-blur'
        )}
      >
        <Link href="/" aria-label="La Calita" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-texto-derecha.svg"
            alt="La Calita"
            className={cn('h-8 w-auto transition sm:h-9', light && 'brightness-0 invert')}
          />
        </Link>

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
          onClick={() => setOpen(true)}
          aria-label="Menú"
          className={cn(
            'flex size-9 items-center justify-center rounded-full sm:hidden',
            light ? 'bg-black/25 text-white backdrop-blur' : 'text-ink'
          )}
        >
          <Menu className="size-6" />
        </button>
      </header>

      {/* Menú móvil: hero borroso de fondo + capa blanca con mix-blend-difference
          encima que invierte todo según el color de detrás (auto-contraste). */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/45 text-white backdrop-blur-2xl sm:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-texto-derecha.svg" alt="La Calita" className="h-8 w-auto brightness-0 invert" />
            <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar" className="rounded-md p-1">
              <X className="size-7" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col items-center justify-center gap-8">
            {[
              {href: '/carta', label: labels.menu},
              {href: '/eventos', label: labels.events},
              {href: '/#info', label: labels.location},
              ...(isAdmin ? [{href: '/admin', label: 'Admin'}] : [])
            ].map((f) => (
              <Link
                key={f.href}
                href={f.href}
                onClick={() => setOpen(false)}
                className="font-adam text-5xl capitalize tracking-wide"
              >
                {f.label}
              </Link>
            ))}
          </nav>
          <div className="flex scale-125 justify-center pb-14">
            <LangSwitcher />
          </div>
        </div>
      )}
    </>
  );
}
