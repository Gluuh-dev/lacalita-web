'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Link, usePathname} from '@/i18n/navigation';
import {Settings, ChevronLeft} from 'lucide-react';
import LangSwitcher from '@/components/lang-switcher';
import {useHideOnScroll} from '@/lib/use-hide-on-scroll';

const NAV = [
  {label: 'Carta', href: '/burguer/carta'},
  {label: 'Ofertas', href: '/burguer/ofertas'},
  {label: 'Local', href: '/burguer/local'},
  {label: 'Restaurante', href: '/carta/restaurante'},
  {label: 'Desayunos', href: '/carta/desayunos'},
  {label: 'Eventos', href: '/eventos'}
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
  WebkitMaskImage: 'url(/brand/texto-lacalita-derecha.svg)',
  maskImage: 'url(/brand/texto-lacalita-derecha.svg)',
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
  const {scrolled} = useHideOnScroll();
  const pathname = usePathname();
  const router = useRouter();
  // En el detalle (carta u oferta) el logo se convierte en "volver".
  const onCartaDetail = /\/burguer\/carta\/[^/]+/.test(pathname);
  const onOfferDetail = /\/burguer\/oferta\/[^/]+/.test(pathname);
  const showBack = (onCartaDetail || onOfferDetail) && !show;
  // En Inicio se ve "LA CALITA"; en el resto, el nombre de la sección junto al logo.
  const pageLabel = pathname.startsWith('/burguer/carta')
    ? 'Carta'
    : pathname.startsWith('/burguer/ofertas')
      ? 'Ofertas'
      : pathname === '/burguer/fav'
        ? 'Favoritos'
        : pathname === '/burguer/list'
          ? 'Mi lista'
          : pathname === '/burguer/local'
            ? 'Local'
            : '';
  // En el hero (sin scroll) usa el color del slide (--lc-nav). Al hacer scroll aparece el
  // fondo claro del navbar → vuelve al color por defecto de marca para que se lea bien.
  const navStyle = {color: scrolled ? 'rgba(42,23,19,.85)' : `var(--lc-nav, ${navColor || 'rgba(42,23,19,.8)'})`};
  const logoColor = scrolled ? '#c36148' : `var(--lc-nav, ${navColor || '#c36148'})`;

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
          {NAV.map((n, i) => (
            <Link
              key={n.label}
              href={n.href}
              onClick={() => setShow(false)}
              className="font-adam text-3xl uppercase tracking-[0.04em] text-[#2a1713] transition-colors hover:text-[#c36148] md:text-5xl"
              style={{
                opacity: show ? 1 : 0,
                transform: show ? 'translateY(0)' : 'translateY(18px)',
                transition: 'opacity 400ms ease, transform 400ms ease',
                transitionDelay: show ? `${240 + i * 70}ms` : '0ms'
              }}
            >
              {n.label}
            </Link>
          ))}
          <a
            href="/admin"
            onClick={() => setShow(false)}
            className="mt-6 flex items-center gap-2 font-adam text-sm uppercase tracking-[0.16em] text-[#2a1713]/70 transition-colors hover:text-[#c36148]"
            style={{opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(18px)', transition: 'opacity 400ms ease, transform 400ms ease', transitionDelay: show ? `${240 + NAV.length * 70}ms` : '0ms'}}
          >
            <Settings className="size-4" /> Admin
          </a>
          <div className="mt-2 scale-125" style={{opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(18px)', transition: 'opacity 400ms ease, transform 400ms ease', transitionDelay: show ? `${300 + NAV.length * 70}ms` : '0ms'}}>
            <LangSwitcher />
          </div>
        </nav>
      </div>

      <header className="fixed inset-x-0 top-0 z-50 animate-in fade-in slide-in-from-top">
        <div className="pointer-events-none absolute inset-0 bg-[#fdfbf7]/85 backdrop-blur-md transition-opacity duration-500 ease-out" style={{opacity: !show && scrolled ? 1 : 0}} />
        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5">
          {showBack ? (
            <button type="button" onClick={() => router.back()} aria-label="Volver" className="flex items-center gap-1.5" style={{color: show ? '#c36148' : logoColor}}>
              <ChevronLeft strokeWidth={2.4} style={{width: 30, height: 30}} />
              <span className="font-eight text-2xl leading-none">Volver</span>
            </button>
          ) : (
            <Link href="/burguer" aria-label="La Calita Burger" className="flex items-center gap-1.5">
              <span aria-hidden style={{display: 'block', height: 30, aspectRatio: '1.15', transform: 'translateY(-1px)', backgroundColor: show ? '#c36148' : logoColor, ...LOGO_MASK}} />
              {pathname === '/burguer' ? (
                <span aria-hidden className="block" style={{height: 15, aspectRatio: '7', backgroundColor: show ? '#c36148' : logoColor, ...TEXT_MASK}} />
              ) : (
                <span className="font-eight text-2xl leading-none" style={{color: show ? '#c36148' : logoColor}}>{pageLabel}</span>
              )}
            </Link>
          )}

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
