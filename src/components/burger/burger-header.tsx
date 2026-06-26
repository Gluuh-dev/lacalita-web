'use client';

import {useEffect, useState} from 'react';
import {Link} from '@/i18n/navigation';
import {Settings, Menu, X} from 'lucide-react';
import LangSwitcher from '@/components/lang-switcher';
import {useHideOnScroll} from '@/lib/use-hide-on-scroll';

const NAV = [
  {label: 'Carta', href: '/carta/hamburgueseria', internal: true},
  {label: 'Ofertas', href: '#ofertas', internal: false},
  {label: 'Local', href: '#local', internal: false}
];

const LOGO_MASK = {
  WebkitMaskImage: 'url(/brand/logo-solo.svg)',
  maskImage: 'url(/brand/logo-solo.svg)',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskPosition: 'center',
  maskPosition: 'center'
} as const;

export default function BurgerHeader({locale: _locale, navColor = ''}: {locale: string; navColor?: string}) {
  const [open, setOpen] = useState(false);
  const {hidden, scrolled} = useHideOnScroll();
  // El color del navbar lo marca la diapositiva visible del hero (variable --lc-nav).
  const navStyle = {color: `var(--lc-nav, ${navColor || 'rgba(42,23,19,.8)'})`};
  const logoColor = `var(--lc-nav, ${navColor || '#c94a3c'})`;

  // Bloquea el scroll del fondo cuando el menú está abierto.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 animate-in fade-in slide-in-from-top ${hidden && !open ? '-translate-y-full' : ''} ${scrolled ? 'border-b border-black/5 bg-[#fdfbf7]/90 backdrop-blur-md' : ''}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5">
          <Link href="/hamburgueseria" aria-label="La Calita Burger">
            <span aria-hidden style={{display: 'block', height: 32, aspectRatio: '1.15', backgroundColor: logoColor, ...LOGO_MASK}} />
          </Link>

          <button onClick={() => setOpen(true)} aria-label="Abrir menú" style={navStyle} className="flex items-center gap-2 font-adam text-[0.72rem] uppercase tracking-[0.18em] transition hover:opacity-70">
            <span className="hidden sm:inline">Menú</span>
            <Menu className="size-6" />
          </button>
        </div>
      </header>

      {/* Menú a pantalla completa (baja animado, estilo McDonald's) */}
      {open && (
        <div className="fixed inset-0 z-[70] flex flex-col overflow-hidden">
          <div className="flex h-full flex-col bg-[#fdfbf7] duration-500 ease-out animate-in slide-in-from-top">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-3.5">
              <span aria-hidden style={{display: 'block', height: 32, aspectRatio: '1.15', backgroundColor: '#c94a3c', ...LOGO_MASK}} />
              <button onClick={() => setOpen(false)} aria-label="Cerrar menú" className="flex items-center gap-2 font-adam text-[0.72rem] uppercase tracking-[0.18em] text-[#2a1713]/70 transition hover:text-[#c94a3c]">
                <span className="hidden sm:inline">Cerrar</span>
                <X className="size-6" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col items-center justify-center gap-5 px-6">
              {NAV.map((n, i) => {
                const cls = 'fill-mode-both font-adam text-4xl uppercase tracking-[0.04em] text-[#2a1713] transition hover:text-[#c94a3c] animate-in fade-in slide-in-from-top-6 md:text-6xl';
                const st = {animationDelay: `${120 + i * 80}ms`};
                return n.internal ? (
                  <Link key={n.label} href={n.href} onClick={() => setOpen(false)} className={cls} style={st}>{n.label}</Link>
                ) : (
                  <a key={n.label} href={n.href} onClick={() => setOpen(false)} className={cls} style={st}>{n.label}</a>
                );
              })}

              <a href="/admin" onClick={() => setOpen(false)} className="fill-mode-both mt-6 flex items-center gap-2 font-adam text-sm uppercase tracking-[0.16em] text-[#2a1713]/70 transition hover:text-[#c94a3c] animate-in fade-in slide-in-from-top-6" style={{animationDelay: `${120 + NAV.length * 80}ms`}}>
                <Settings className="size-4" /> Admin
              </a>
              <div className="fill-mode-both mt-2 scale-125 animate-in fade-in slide-in-from-top-6" style={{animationDelay: `${180 + NAV.length * 80}ms`}}>
                <LangSwitcher />
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
