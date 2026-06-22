'use client';

import {useState, useEffect} from 'react';
import {Link} from '@/i18n/navigation';
import {Settings, Globe, Menu, X} from 'lucide-react';

const NAV = [
  {label: 'Carta', href: '/carta/hamburgueseria', internal: true},
  {label: 'Ofertas', href: '#ofertas', internal: false},
  {label: 'Local', href: '#local', internal: false}
];

export default function BurgerHeader({locale}: {locale: string}) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    window.addEventListener('scroll', on, {passive: true});
    on();
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solid ? 'border-b border-white/10 bg-[#14100a]/85 backdrop-blur-md' : ''}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5">
        <Link href="/hamburgueseria" aria-label="La Calita Burger">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-solo.svg" alt="" className="h-8 w-auto brightness-0 invert" />
        </Link>

        {/* Escritorio */}
        <nav className="hidden items-center gap-6 font-adam text-[0.7rem] uppercase tracking-[0.18em] md:flex">
          {NAV.map((n) =>
            n.internal ? (
              <Link key={n.label} href={n.href} className="text-white/75 transition hover:text-white">{n.label}</Link>
            ) : (
              <a key={n.label} href={n.href} className="text-white/75 transition hover:text-white">{n.label}</a>
            )
          )}
        </nav>
        <div className="hidden items-center gap-4 text-white/70 md:flex">
          <a href="/admin" className="flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.14em] transition hover:text-white">
            <Settings className="size-3.5" /> Admin
          </a>
          <span className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-[0.7rem] uppercase">
            <Globe className="size-3.5" /> {locale.toUpperCase()}
          </span>
        </div>

        {/* Móvil: botón */}
        <button onClick={() => setOpen(true)} aria-label="Menú" className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur md:hidden">
          <Menu className="size-5" />
        </button>
      </div>

      {/* Móvil: overlay */}
      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-[#14100a]/97 backdrop-blur-md md:hidden">
          <div className="flex items-center justify-between px-5 py-3.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-solo.svg" alt="" className="h-8 w-auto brightness-0 invert" />
            <button onClick={() => setOpen(false)} aria-label="Cerrar" className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white">
              <X className="size-5" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col items-center justify-center gap-7 font-adam text-lg uppercase tracking-[0.18em] text-white">
            {NAV.map((n) =>
              n.internal ? (
                <Link key={n.label} href={n.href} onClick={() => setOpen(false)} className="hover:text-[#e9ae74]">{n.label}</Link>
              ) : (
                <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="hover:text-[#e9ae74]">{n.label}</a>
              )
            )}
            <a href="/admin" onClick={() => setOpen(false)} className="mt-4 flex items-center gap-2 text-sm text-white/70">
              <Settings className="size-4" /> Admin
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
