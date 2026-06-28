'use client';

import {useEffect, useState, type CSSProperties} from 'react';
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

// Títulos del navbar como SVG (tipografía del logo). ar = ancho/alto del viewBox.
type SvgEntry = {f: string; ar: number};
const NAV_SVG: Record<string, Record<string, SvgEntry>> = {
  carta: {es: {f: 'carta-es', ar: 4.54}, en: {f: 'carta-en', ar: 4.13}, fr: {f: 'carta-fr', ar: 4.11}},
  ofertas: {es: {f: 'ofertas-es', ar: 6.22}, en: {f: 'ofertas-en', ar: 4.53}, fr: {f: 'ofertas-fr', ar: 9.38}},
  favoritos: {es: {f: 'favoritos-es', ar: 7.71}, en: {f: 'favoritos-en', ar: 7.65}, fr: {f: 'favoritos-fr', ar: 5.77}},
  'mi-lista': {es: {f: 'mi-lista-es', ar: 5.5}, en: {f: 'mi-lista-en', ar: 5.45}, fr: {f: 'mi-lista-fr', ar: 6.44}},
  local: {es: {f: 'local-es', ar: 4.68}, en: {f: 'local-en', ar: 4.69}, fr: {f: 'local-fr', ar: 4.69}},
  volver: {es: {f: 'volver-es', ar: 5.05}, en: {f: 'volver-en', ar: 3.54}, fr: {f: 'volver-fr', ar: 5.17}}
};
const labelMask = (e: SvgEntry, height: number, color: string): CSSProperties => ({
  display: 'block',
  height,
  aspectRatio: String(e.ar),
  backgroundColor: color,
  WebkitMaskImage: `url(/brand/navbar/${e.f}.svg)`,
  maskImage: `url(/brand/navbar/${e.f}.svg)`,
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'left center',
  maskPosition: 'left center'
});

export default function BurgerHeader({locale, navColor = ''}: {locale: string; navColor?: string}) {
  const [show, setShow] = useState(false);
  const {scrolled} = useHideOnScroll();
  const pathname = usePathname();
  const router = useRouter();
  const lang = locale === 'en' || locale === 'fr' ? locale : 'es';
  // En el detalle (carta u oferta) el logo se convierte en "volver".
  const onCartaDetail = /\/burguer\/carta\/[^/]+/.test(pathname);
  const onOfferDetail = /\/burguer\/oferta\/[^/]+/.test(pathname);
  const showBack = (onCartaDetail || onOfferDetail) && !show;
  // En Inicio se ve "LA CALITA"; en el resto, el título de la sección (SVG con la tipo del logo).
  const pageKey = pathname.startsWith('/burguer/carta')
    ? 'carta'
    : pathname.startsWith('/burguer/ofertas')
      ? 'ofertas'
      : pathname === '/burguer/fav'
        ? 'favoritos'
        : pathname === '/burguer/list'
          ? 'mi-lista'
          : pathname === '/burguer/local'
            ? 'local'
            : '';
  const labelEntry = pageKey ? NAV_SVG[pageKey][lang] : null;
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
            <button type="button" onClick={() => router.back()} aria-label="Volver" className="flex items-center gap-2" style={{color: show ? '#c36148' : logoColor}}>
              <ChevronLeft strokeWidth={2.4} style={{width: 30, height: 30}} />
              <span aria-hidden style={labelMask(NAV_SVG.volver[lang], 17, show ? '#c36148' : logoColor)} />
            </button>
          ) : (
            <Link href="/burguer" aria-label="La Calita Burger" className="flex items-center gap-2">
              <span aria-hidden style={{display: 'block', height: 30, aspectRatio: '1.15', transform: 'translateY(-1px)', backgroundColor: show ? '#c36148' : logoColor, ...LOGO_MASK}} />
              {pathname === '/burguer' ? (
                <span aria-hidden className="block" style={{height: 15, aspectRatio: '7', backgroundColor: show ? '#c36148' : logoColor, ...TEXT_MASK}} />
              ) : labelEntry ? (
                <span aria-hidden style={labelMask(labelEntry, 18, show ? '#c36148' : logoColor)} />
              ) : null}
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
