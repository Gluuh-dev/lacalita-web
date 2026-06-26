'use client';

import {useEffect, useState} from 'react';
import {Link} from '@/i18n/navigation';
import {Settings} from 'lucide-react';
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

const TEXT_MASK = {
  WebkitMaskImage: 'url(/brand/texto-calita-burguer.svg)',
  maskImage: 'url(/brand/texto-calita-burguer.svg)',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskPosition: 'left center',
  maskPosition: 'left center'
} as const;

// Origen del círculo (donde está el botón, arriba a la derecha).
const ORIGIN = 'calc(100% - 2.6rem) 2.4rem';
const CLIP_OPEN = `circle(150% at ${ORIGIN})`;
const CLIP_CLOSED = `circle(0px at ${ORIGIN})`;

export default function BurgerHeader({locale: _locale, navColor = ''}: {locale: string; navColor?: string}) {
  const [show, setShow] = useState(false);
  const {hidden, scrolled} = useHideOnScroll();
  const navStyle = {color: `var(--lc-nav, ${navColor || 'rgba(42,23,19,.8)'})`};
  const logoColor = `var(--lc-nav, ${navColor || '#c94a3c'})`;

  useEffect(() => {
    document.body.style.overflow = show ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);

  return (
    <>
      {/* Fondo que se expande en círculo desde el botón (estilo McDonald's) */}
      <div
        aria-hidden={!show}
        className="fixed inset-0 z-[45] bg-[#fdfbf7]"
        style={{
          clipPath: show ? CLIP_OPEN : CLIP_CLOSED,
          WebkitClipPath: show ? CLIP_OPEN : CLIP_CLOSED,
          transition: 'clip-path 520ms cubic-bezier(.4,0,.2,1), -webkit-clip-path 520ms cubic-bezier(.4,0,.2,1)',
          pointerEvents: show ? 'auto' : 'none'
        }}
      >
        <nav className="flex h-full flex-col items-center justify-center gap-5 px-6">
          {NAV.map((n, i) => {
            const cls = 'font-adam text-4xl uppercase tracking-[0.04em] text-[#2a1713] transition-colors hover:text-[#c94a3c] md:text-6xl';
            const st = {
              opacity: show ? 1 : 0,
              transform: show ? 'translateY(0)' : 'translateY(18px)',
              transition: 'opacity 400ms ease, transform 400ms ease',
              transitionDelay: show ? `${300 + i * 80}ms` : '0ms'
            };
            return n.internal ? (
              <Link key={n.label} href={n.href} onClick={() => setShow(false)} className={cls} style={st}>{n.label}</Link>
            ) : (
              <a key={n.label} href={n.href} onClick={() => setShow(false)} className={cls} style={st}>{n.label}</a>
            );
          })}
          <a
            href="/admin"
            onClick={() => setShow(false)}
            className="mt-6 flex items-center gap-2 font-adam text-sm uppercase tracking-[0.16em] text-[#2a1713]/70 transition-colors hover:text-[#c94a3c]"
            style={{opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(18px)', transition: 'opacity 400ms ease, transform 400ms ease', transitionDelay: show ? `${300 + NAV.length * 80}ms` : '0ms'}}
          >
            <Settings className="size-4" /> Admin
          </a>
          <div className="mt-2 scale-125" style={{opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(18px)', transition: 'opacity 400ms ease, transform 400ms ease', transitionDelay: show ? `${360 + NAV.length * 80}ms` : '0ms'}}>
            <LangSwitcher />
          </div>
        </nav>
      </div>

      <header className={`fixed inset-x-0 top-0 z-50 transition-transform duration-300 animate-in fade-in slide-in-from-top ${hidden && !show ? '-translate-y-full' : ''}`}>
        <div className="pointer-events-none absolute inset-0 bg-[#fdfbf7]/85 backdrop-blur-md transition-opacity duration-500 ease-out" style={{opacity: !show && scrolled ? 1 : 0}} />
        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5">
          <Link href="/hamburgueseria" aria-label="La Calita Burger" className="flex items-center gap-2.5">
            <span aria-hidden style={{display: 'block', height: 32, aspectRatio: '1.15', backgroundColor: show ? '#c94a3c' : logoColor, ...LOGO_MASK}} />
            <span aria-hidden className="hidden sm:block" style={{height: 15, aspectRatio: '13.68', backgroundColor: show ? '#c94a3c' : logoColor, ...TEXT_MASK}} />
          </Link>

          {/* Botón que se transforma de hamburguesa a X */}
          <button onClick={() => setShow((s) => !s)} aria-label={show ? 'Cerrar menú' : 'Abrir menú'} className="flex items-center transition" style={show ? {color: '#2a1713'} : navStyle}>
            <span className="relative block h-4 w-6" aria-hidden>
              <span className={`absolute left-0 h-[2px] w-6 rounded-full bg-current transition-all duration-300 ${show ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-1/2 h-[2px] w-6 -translate-y-1/2 rounded-full bg-current transition-all duration-300 ${show ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute left-0 h-[2px] w-6 rounded-full bg-current transition-all duration-300 ${show ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0'}`} />
            </span>
          </button>
        </div>
      </header>
    </>
  );
}
